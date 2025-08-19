// src/services/api/interestbrandApi.js
import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const withBase = (path) =>
  new URL(
    `${BASE_URL}${path}`,
    typeof window !== 'undefined' ? window.location.origin : undefined
  );

// ---------- 공통 GET ----------
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

// ---------- 공통 POST(JSON) ----------
async function postJson(url, body) {
  const token = typeof getAccessToken === 'function' ? getAccessToken() : null;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: '*/*',                // Swagger: */*
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

// ---------- 공통 DELETE(JSON Body) ----------
async function deleteJson(url, body) {
  const token = typeof getAccessToken === 'function' ? getAccessToken() : null;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: '*/*',
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

// ====== 경로 상수 (스웨거에 맞춤) ======
export const SEARCH_PATH = '/api/interest/brand/search';
export const FAVORITES_BASE = '/api/interest/brand/'; // 리스트/등록/삭제 공통

/**
 * 최근 검색 브랜드 조회
 * GET /api/interest/brand/search?limit=10
 */
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
 * 검색한 브랜드 저장 (브랜드명 기반)
 * POST /api/interest/brand/search
 * body: { brandName: string }
 */
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

/**
 * 등록된 관심 브랜드 리스트 조회
 * GET /api/interest/brand/
 */
export async function getUserFavoriteBrands() {
  const url = withBase(FAVORITES_BASE);
  const data = await getJson(url);
  const ok = data?.isSuccess ?? data?.success ?? false;
  if (!ok) throw new Error(data?.message || '관심 브랜드 조회 실패');

  const list = Array.isArray(data?.result) ? data.result : [];
  return list.map((b) => ({
    id: b.id,
    name: b.name,
    image: b.brandImage,
    category: b.category,
  }));
}

/**
 * 관심 브랜드 등록 (브랜드명 기반)
 * POST /api/interest/brand/
 * body: { brandName: string }
 */
export async function addFavoriteBrandByName(brandName) {
  if (!brandName || typeof brandName !== 'string') {
    throw new Error('brandName이 올바르지 않습니다.');
  }
  const url = withBase(FAVORITES_BASE);
  const data = await postJson(url, { brandName });
  const ok = data?.isSuccess ?? data?.success ?? false;
  if (!ok) throw new Error(data?.message || '관심 브랜드 등록 실패');
  return {
    message: data?.message ?? 'OK',
    result: data?.result ?? 'OK',
  };
}

/**
 * 관심 브랜드 삭제 (id 기반)
 * DELETE /api/interest/brand/
 * body: { interestBrandId: number }
 */
export async function removeFavoriteBrandById(interestBrandId) {
  if (typeof interestBrandId !== 'number') {
    throw new Error('interestBrandId가 올바르지 않습니다.');
  }
  const url = withBase(FAVORITES_BASE);
  const data = await deleteJson(url, { interestBrandId });
  const ok = data?.isSuccess ?? data?.success ?? false;
  if (!ok) throw new Error(data?.message || '관심 브랜드 삭제 실패');
  return data?.result ?? 'OK';
}
