// services/api/benefitDetailApi.js
//벡엔드 연동 완료
import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const withBase = (path) =>
  new URL(`${BASE_URL}${path}`, typeof window !== 'undefined' ? window.location.origin : undefined);

async function getJson(url) {
  const token = typeof getAccessToken === 'function' ? getAccessToken() : null;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: token ? 'omit' : 'include',
    redirect: 'follow',
  });

  if (res.redirected && /\/login/i.test(res.url)) {
    throw new Error('401(리다이렉트): 인증이 필요합니다. 먼저 로그인해주세요.');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || '요청 실패'}`);
  }

  const json = await res.json();
  if (json?.isSuccess !== true) throw new Error('API isSuccess=false (서버에서 실패 반환)');
  if (!json?.result) throw new Error('API result가 비어 있습니다.');
  return json;
}

export async function fetchBenefitDetail(discountIdRaw) {
  // ✅ 문자열 'undefined' / 'null' / 공백 전부 차단
  const discountId = String(discountIdRaw ?? '').trim();
  if (!discountId || discountId.toLowerCase() === 'undefined' || discountId.toLowerCase() === 'null') {
    throw new Error('유효하지 않은 discountId 입니다.');
  }
  const url = withBase(`/api/discount/${encodeURIComponent(discountId)}`);
  return getJson(url);
}
