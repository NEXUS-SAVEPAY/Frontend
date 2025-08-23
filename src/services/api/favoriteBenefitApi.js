// src/services/api/favoriteBenefitApi.js
import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const withBase = (path) =>
  // BASE_URL이 절대경로면 그대로, 아니면 현재 origin 기준으로
  new URL(`${BASE_URL}${path}`, typeof window !== 'undefined' ? window.location.origin : undefined);

const FAVORITE_BENEFITS_PATH = '/api/discount/interest';

// ---------- 공통 유틸 ----------
async function parseJsonSafely(res) {
  if (res.status === 204) return {};
  const text = await res.text().catch(() => '');
  if (!text) return {};
  try { return JSON.parse(text); } catch { return { result: text }; }
}

function authHeaders() {
  const token = typeof getAccessToken === 'function' ? getAccessToken() : null;
  return {
    headers: {
      // 스웨거가 */* 로 되어 있음
      Accept: '*/*',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // 토큰이 없을 때만 쿠키 인증 시도
    credentials: token ? 'omit' : 'include',
  };
}

async function getJson(url, { timeoutMs = 15000 } = {}) {
  const { headers, credentials } = authHeaders();
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort('timeout'), timeoutMs);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      credentials,
      redirect: 'follow',
      // 브라우저에선 기본이 cors지만 명시해도 무방
      mode: 'cors',
      signal: controller.signal,
      cache: 'no-store',
    });

    if (res.redirected && /\/login/i.test(res.url)) {
      throw new Error('인증이 필요합니다. 먼저 로그인해주세요.');
    }
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      // CORS 차단 시 브라우저가 네트워크 에러로만 떨어질 수 있어 메시지 보강
      throw new Error(t || `요청 실패: ${res.status}`);
    }
    return parseJsonSafely(res);
  } catch (e) {
    if (e?.name === 'AbortError' || e?.message === 'timeout') {
      throw new Error('요청이 시간 초과되었습니다. 네트워크 연결을 확인해주세요.');
    }
    // 브라우저 CORS/네트워크 에러 메시지 보강
    if (e?.message?.includes('Failed to fetch')) {
      throw new Error('네트워크 또는 CORS 문제로 데이터를 불러오지 못했습니다.');
    }
    throw e;
  } finally {
    clearTimeout(id);
  }
}

const pick = (obj, keys) => keys.find((k) => obj?.[k] !== undefined);
const isOk = (d) =>
  typeof d?.isSuccess === 'boolean' ? d.isSuccess :
  typeof d?.success   === 'boolean' ? d.success   : true;

// 서버가 배열 대신 객체(map)로 보내는 경우까지 전부 풀어냄
function unwrapList(d) {
  const candidates = [
    d?.result, d?.data, d?.list, d?.items, d,
    // result가 객체이고 내부에 list/items/content/rows 등으로 들어있는 경우
    d?.result && typeof d.result === 'object' ? d.result.list    : undefined,
    d?.result && typeof d.result === 'object' ? d.result.items   : undefined,
    d?.result && typeof d.result === 'object' ? d.result.content : undefined,
    d?.result && typeof d.result === 'object' ? d.result.rows    : undefined,
  ].filter(Boolean);

  for (const c of candidates) {
    if (Array.isArray(c)) return c;
    // 객체(map) 형태: { "올리브영":[...], "파리바게트":[...] }
    if (c && typeof c === 'object') {
      const vals = Object.values(c).filter(Array.isArray);
      if (vals.length) return vals.flat();
    }
  }
  return [];
}

// ---------- 노멀라이저 ----------
function normalizeBenefit(item) {
  const idKey    = pick(item, ['id', 'benefitId', 'discountId']);
  const brandKey = pick(item, ['brandName', 'brand', 'name']);
  const imgKey   = pick(item, ['brandImage', 'image', 'logo', 'imageUrl']);
  const pctKey   = pick(item, ['discountPercent', 'percent', 'rate']);
  const typeKey  = pick(item, ['discountType', 'type']);
  const detailKey= pick(item, ['details', 'detail', 'description']);
  const pointKey = pick(item, ['pointInfo', 'point', 'pointText']);
  const linkKey  = pick(item, ['infoLink', 'link', 'url']);

  const id = item[idKey] ?? undefined;
  const brandName = item[brandKey] ?? '기타';
  const brandImage = item[imgKey] ?? '';
  const discountPercent = Number(item[pctKey] ?? 0) || 0;
  const discountType = item[typeKey] ?? '';
  const details = item[detailKey] ?? '';
  const pointInfo = item[pointKey] ?? '';
  const infoLink = item[linkKey] ?? '';
  const createdAt = item.createdAt ?? '';

  const discountLabel =
    discountPercent && discountType
      ? `${discountPercent}% ${discountType}`
      : discountType || '';

  return {
    id,
    brandName,
    brandImage,
    discountPercent,
    discountType,
    infoLink,
    details,
    pointInfo,
    createdAt,
    _ui: {
      description: discountLabel || details || '',
      detail: details || pointInfo || '',
      imageSrc: brandImage || '',
    },
  };
}

/**
 * 관심사 기반 혜택 리스트 조회 (서버 진실)
 * 반환: [{ brand, brandImage, benefits: [{id, description, detail, imageSrc, ...}] }]
 */
export async function fetchFavoriteBenefits() {
  const url = withBase(FAVORITE_BENEFITS_PATH);
  const data = await getJson(url);
  if (!isOk(data)) throw new Error(data?.message || '관심사 혜택 조회 실패');

  const rawList = unwrapList(data);
  console.debug('[favoriteBenefitApi] raw length:', Array.isArray(rawList) ? rawList.length : 'N/A', rawList);

  const list = rawList.map(normalizeBenefit);

  // 브랜드 단위로 그룹화
  const map = new Map();
  for (const it of list) {
    const key = it.brandName || '기타';
    if (!map.has(key)) {
      map.set(key, {
        brand: key,
        brandImage: it.brandImage || '',
        benefits: [],
      });
    }
    map.get(key).benefits.push({
      id: it.id,
      description: it._ui.description,
      detail: it._ui.detail,
      imageSrc: it._ui.imageSrc,
      infoLink: it.infoLink,
      pointInfo: it.pointInfo,
      createdAt: it.createdAt,
    });
  }

  const groups = Array.from(map.values());
  console.debug('[favoriteBenefitApi] grouped count:', groups.length, groups);
  return groups;
}
