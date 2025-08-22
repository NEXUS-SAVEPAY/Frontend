// src/services/api/payBenefitApi.js
import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const withBase = (path) =>
  new URL(`${BASE_URL}${path}`, typeof window !== 'undefined' ? window.location.origin : undefined);

// 공통 JSON fetch
async function fetchJson(url) {
  const token = getAccessToken?.();

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
    throw new Error('인증이 필요합니다. 먼저 로그인해주세요.');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`서버 오류 (${res.status}): ${text}`);
  }
  return res.json();
}

// 간편결제(페이) 혜택 조회
export async function fetchPayBenefits() {
  // ✅ 스웨거 실제 경로 확인 후 필요하면 수정 (예: '/api/discount/simplepay')
  const url = withBase('/api/discount/pay');
  const data = await fetchJson(url);

  // 응답 result 배열 → 프론트에서 쓰기 좋은 형태로 매핑
  const list = Array.isArray(data?.result) ? data.result : [];
  return list.map((item) => ({
    id: item.id,
    brand: item.brandName,
    imageSrc: item.brandImage,
    description: `${item.discountPercent}% ${item.discountType}`.trim(), // 예: "10% 할인"
    detail: item.details,
    infoLink: item.infoLink,
    pointInfo: item.pointInfo,
    createdAt: item.createdAt,
  }));
}
