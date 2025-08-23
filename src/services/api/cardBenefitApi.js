// src/services/api/cardBenefitApi.js
import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const withBase = (path) =>
  new URL(
    `${BASE_URL}${path}`,
    typeof window !== 'undefined' ? window.location.origin : undefined
  ).toString();

// 안전한 배열화
const toArray = (x) => {
  if (Array.isArray(x)) return x;
  if (x && typeof x === 'object') {
    // { items: [...] } 같은 케이스 처리
    if (Array.isArray(x.items)) return x.items;
    return Object.values(x);
  }
  return [];
};

// 캐시 키
const ID_SET_CACHE_KEY = 'CARD_BENEFIT_ID_SET_V1';

/**
 * /api/discount/card 목록을 가져옵니다.
 * 서버 포맷이 { result: [...] } 라고 가정하고, 방어적으로 result/data/items를 모두 탐색합니다.
 */
export async function fetchCardBenefits() {
  const token = typeof getAccessToken === 'function' ? getAccessToken() : null;

  const res = await fetch(withBase('/api/discount/card'), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: token ? 'omit' : 'include',
    redirect: 'follow',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `카드 혜택 목록 조회 실패 (${res.status})`);
  }

  const json = await res.json().catch(() => ({}));
  // 다양한 응답 래핑 방어
  const raw =
    json?.result ??
    json?.data ??
    json?.results ??
    json?.list ??
    json;

  return toArray(raw);
}

/**
 * 현재 discountId가 카드 혜택 목록에 포함되는지 확인.
 * - 세션 캐시에 Set<string>으로 저장하여 재호출 가속
 * - 캐시에 없으면 API 호출
 */
export async function isCardDiscountId(discountId) {
  const key = String(discountId ?? '').trim();
  if (!key) return false;

  // 1) 세션 캐시 확인
  try {
    const cached = sessionStorage.getItem(ID_SET_CACHE_KEY);
    if (cached) {
      const ids = new Set(JSON.parse(cached)); // 배열 형태로 저장
      return ids.has(key);
    }
  } catch {
    // 캐시 파싱 실패는 무시
  }

  // 2) API 호출해서 새로 구성
  try {
    const list = await fetchCardBenefits();

    // id / discountId 다양한 필드 방어
    const ids = new Set(
      list
        .map((it) =>
          String(
            it?.id ?? it?.discountId ?? it?.discountID ?? it?.discount_id ?? ''
          ).trim()
        )
        .filter(Boolean)
    );

    // 세션 캐시 저장 (배열로)
    try {
      sessionStorage.setItem(ID_SET_CACHE_KEY, JSON.stringify([...ids]));
    } catch {
      /* ignore */
    }

    return ids.has(key);
  } catch (e) {
    // API 실패 시 카드 여부를 결정 못하므로 false 반환
    // 필요하면 여기서 로깅만 하고, 상세 페이지에서 다른 힌트(쿼리/state)에 fallback 가능
    return false;
  }
}

/** (선택) 캐시 무효화가 필요할 때 호출 */
export function invalidateCardBenefitIdCache() {
  try {
    sessionStorage.removeItem(ID_SET_CACHE_KEY);
  } catch {
    /* ignore */
  }
}
