// src/services/api/interestbrandApi.js
import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const withBase = (path) =>
  new URL(
    `${BASE_URL}${path}`,
    typeof window !== 'undefined' ? window.location.origin : undefined
  );

// 공통 GET
async function getJson(url) {
  const token = typeof getAccessToken === 'function' ? getAccessToken() : null;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: '*/*',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: token ? 'omit' : 'include',
    redirect: 'follow',
  });

  if (res.redirected && /\/login/i.test(res.url)) {
    throw new Error('인증이 필요합니다. 먼저 로그인해주세요.');
  }
  if (res.status === 401 || res.status === 403) {
    throw new Error('인증이 만료되었거나 권한이 없습니다.');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || '요청에 실패했습니다.');
  }
  return res.json();
}

// 공통 POST(JSON)
async function postJson(url, body) {
  const token = typeof getAccessToken === 'function' ? getAccessToken() : null;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: '*/*',                // Swagger: */* (Controls Accept header)
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: token ? 'omit' : 'include',
    redirect: 'follow',
    body: JSON.stringify(body ?? {}),
  });

  if (res.redirected && /\/login/i.test(res.url)) {
    throw new Error('인증이 필요합니다. 먼저 로그인해주세요.');
  }
  if (res.status === 401 || res.status === 403) {
    throw new Error('인증이 만료되었거나 권한이 없습니다.');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || '요청에 실패했습니다.');
  }
  return res.json();
}

/**
 * 최근 검색 브랜드 조회 (최대 10개)
 * GET api/interest/brand/search?limit=10
 * 응답 스키마:
 * {
 *   isSuccess: true,
 *   code: "string",
 *   message: "string",
 *   result: [{ id, name, brandImage, category }],
 *   success: true
 * }
 */
const SEARCH_PATH = '/api/interest/brand/search';

export async function getRecentSearchedBrands(limit = 10) {
  const url = withBase(`${SEARCH_PATH}?limit=${encodeURIComponent(limit)}`);
  const data = await getJson(url);
  const ok = data?.isSuccess ?? data?.success ?? false;
  if (!ok) throw new Error(data?.message || '최근 검색 브랜드 조회 실패');

  const list = Array.isArray(data?.result) ? data.result : [];
  return list.map((b) => ({
    id: b.id,
    name: b.name,
    image: b.brandImage,
    category: b.category,
  }));
}

/**
 * 검색한 브랜드 저장
 * POST api/interest/brand/search
 * 요청 바디: { brandId: number }
 * 응답 스키마:
 * {
 *   isSuccess: true,
 *   code: "string",
 *   message: "string",
 *   result: "string",
 *   success: true
 * }
 */
/** (신) 이름 기반 저장 */
export async function saveSearchedBrandByName(brandName) {
  if (!brandName || typeof brandName !== 'string') {
    throw new Error('brandName이 올바르지 않습니다.');
  }
  const url = withBase(SEARCH_PATH);
  const data = await postJson(url, { brandName });
  const ok = data?.isSuccess ?? data?.success ?? false;
  if (!ok) throw new Error(data?.message || '검색 기록 저장 실패');
  return data?.result ?? 'OK';
}