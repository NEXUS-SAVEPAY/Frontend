// src/services/api/benefitApi.js
import { getAccessToken } from './token';

const RAW_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

/**
 * BASE_URL이 절대(https://api.example.com)든 상대(/api)든 안전하게 합쳐서 URL 생성
 * - 절대 BASE_URL: new URL(path, BASE_URL)
 * - 상대 BASE_URL 또는 빈 값: new URL(BASE_URL + path, window.location.origin)
 */
function withBase(path) {
  if (!path) path = '/';
  const isAbsBase = /^https?:\/\//i.test(RAW_BASE);
  if (isAbsBase) {
    return new URL(path, RAW_BASE).toString();
  }
  // 상대 BASE_URL이면 현재 오리진 기준으로
  const base = (RAW_BASE || '').replace(/\/+$/, ''); // 끝 슬래시 제거
  const p = path.startsWith('/') ? path : `/${path}`;
  return new URL(`${base}${p}`, window.location.origin).toString();
}

// 공통 GET
async function fetchJson(url) {
  const token = typeof getAccessToken === 'function' ? getAccessToken() : null;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      // 일부 백엔드가 */* 선호
      Accept: 'application/json, */*;q=0.8',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // 토큰이 있으면 쿠키 인증이 필요 없다는 가정. (쿠키 병행 필요하면 항상 'include'로 바꾸세요)
    credentials: token ? 'omit' : 'include',
    redirect: 'follow',
  });

  if (res.redirected && /\/login/i.test(res.url)) {
    throw new Error('인증이 필요합니다. 먼저 로그인해주세요.');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API 호출 실패: ${res.status} ${text}`);
  }
  return res.json();
}

/**
 * ✅ 추천 혜택 조회
 * 스웨거 응답 예:
 * {
 *   isSuccess: true,
 *   result: [{ id, brandName, brandImage, discountPercent, discountType, infoLink, details, pointInfo, createdAt }],
 *   success: true
 * }
 *
 * 백엔드 경로가 다르면 아래 경로만 바꿔주세요.
 */
export async function fetchRecommendedBenefits() {
  // 예시 엔드포인트: /api/discount/recommend
  return fetchJson(withBase('/api/discount/recommend'));
}
