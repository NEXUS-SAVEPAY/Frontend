// src/services/api/cardBenefitApi.js
import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const withBase = (path) =>
  new URL(
    `${BASE_URL}${path}`,
    typeof window !== 'undefined' ? window.location.origin : undefined
  ).toString();

// -------- 유틸 --------
const toArray = (x) => {
  if (Array.isArray(x)) return x;
  if (x && typeof x === 'object') {
    if (Array.isArray(x.items)) return x.items;
    if (Array.isArray(x.data)) return x.data;
    if (Array.isArray(x.result)) return x.result;
    return Object.values(x);
  }
  return [];
};

const norm = (s) => (s ?? '').toString().trim();
const lower = (s) => norm(s).toLowerCase();

// 중복 제거하면서 보기 좋게 이어붙이기
const joinParts = (...parts) =>
  parts
    .map((s) => (s ?? '').toString().trim())
    .filter(Boolean)
    .filter((val, idx, arr) => {
      const n = (x) => x.replace(/\s+/g, ' ').toLowerCase();
      return arr.findIndex((y) => n(y) === n(val)) === idx;
    })
    .join(' · ');

const ID_SET_CACHE_KEY = 'CARD_BENEFIT_ID_SET_V1';

// -------- API --------

/**
 * /api/discount/card 목록 조회
 * @param {{signal?: AbortSignal}=} opts
 */
export async function fetchCardBenefits(opts = {}) {
  const token = typeof getAccessToken === 'function' ? getAccessToken() : null;

  const res = await fetch(withBase('/api/discount/card'), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: token ? 'omit' : 'include',
    redirect: 'follow',
    signal: opts.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `카드 혜택 목록 조회 실패 (${res.status})`);
  }

  const json = await res.json().catch(() => ({}));
  const raw =
    json?.result ??
    json?.data ??
    json?.results ??
    json?.list ??
    json;

  return toArray(raw);
}

/**
 * 현재 discountId가 카드 혜택 목록에 포함되는지 확인
 */
export async function isCardDiscountId(discountId) {
  const key = norm(discountId);
  if (!key) return false;

  // 세션 캐시 먼저 확인
  try {
    const cached = sessionStorage.getItem(ID_SET_CACHE_KEY);
    if (cached) {
      const ids = new Set(JSON.parse(cached));
      return ids.has(key);
    }
  } catch {}

  // API 호출로 실 id 수집
  try {
    const list = await fetchCardBenefits();
    const ids = new Set(
      list
        .map((it) =>
          norm(
            it?.id ?? it?.discountId ?? it?.discountID ?? it?.discount_id ?? ''
          )
        )
        .filter(Boolean) // 진짜 id만 저장 (tmp-* 같은 건 여기 없음)
    );
    try {
      sessionStorage.setItem(ID_SET_CACHE_KEY, JSON.stringify([...ids]));
    } catch {}
    return ids.has(key);
  } catch {
    return false; // 판단 불가 시 보수적으로 false
  }
}

export function invalidateCardBenefitIdCache() {
  try {
    sessionStorage.removeItem(ID_SET_CACHE_KEY);
  } catch {}
}

/**
 *  호환용 별칭
 *  - 인자로 문자열(브랜드명) 또는 객체 { brandName, signal } 모두 허용
 *  - 인자 없으면 전체 반환
 */
export async function fetchCardRelatedBrandBenefits(arg) {
  let brandName, signal;
  if (typeof arg === 'string') {
    brandName = arg;
  } else if (arg && typeof arg === 'object') {
    brandName = arg.brandName;
    signal = arg.signal;
  }

  const list = await fetchCardBenefits({ signal });
  if (!brandName) return list;

  const target = lower(brandName);
  return list.filter((it) => {
    const b1 = lower(it?.brand);
    const b2 = lower(it?.brandName);
    return b1 === target || b2 === target;
  });
}

/**
 * UI 매핑 함수 export (CardBenefitPage에서 사용)
 *  - id가 없으면 tmp-<index>로 fallback 생성하여 리스트에 반드시 노출
 *  - detail은 details + pointInfo를 결합해서 항상 표시
 *  - description도 (할인타입 + 퍼센트) → details → pointInfo 순으로 보강
 *
 *  ⚠️ 주의: Array.prototype.map이 (value, index)를 넘기므로 idx를 두번째 인자로 받는다.
 */
export function mapCardBenefitToUI(it, idx) {
  if (!it) return null;

  // id 우선 탐색, 없으면 임시 id 부여
  let id = norm(it?.id ?? it?.discountId ?? it?.discountID ?? it?.discount_id ?? '');
  if (!id) id = `tmp-${idx}`;

  const brand = norm(it?.brand ?? it?.brandName);
  const discountPercent = Number(it?.discountPercent ?? 0) || 0;
  const discountType = norm(it?.discountType);

  // 0%일 때는 퍼센트 없이 타입만
  const discountLabel =
    discountPercent && discountType
      ? `${discountPercent}% ${discountType}`
      : discountType || '';

  const details = norm(it?.details);
  const pointInfo = norm(it?.pointInfo);
  const brandImage = norm(it?.brandImage);
  const infoLink = norm(it?.infoLink ?? it?.externalUrl ?? '');

  const detail = joinParts(details, pointInfo) || '상세 내용을 확인해 주세요';

  // description 로직만 변경
  const description = discountLabel || details || pointInfo || '혜택 상세';

  return {
    id,
    brand,
    description, // h3에 노출
    detail,      // p에 노출
    imageSrc: brandImage,
    infoLink,    // 외부 상세 링크(있으면)
  };
}
