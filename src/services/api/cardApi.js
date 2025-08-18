// src/services/api/cardApi.js
import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const withBase = (path) =>
  new URL(`${BASE_URL}${path}`, typeof window !== 'undefined' ? window.location.origin : undefined);

// 공통: 인증/리다이렉트/JSON 체크
async function fetchJson(url) {
  const token = typeof getAccessToken === 'function' ? getAccessToken() : null;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: token ? 'omit' : 'include', // 토큰 없으면 쿠키 전송
    redirect: 'follow',
  });

  if (res.redirected && /\/login/i.test(res.url)) {
    throw new Error('인증이 필요합니다. 먼저 로그인해주세요.');
  }
  if (res.status === 401 || res.status === 403) {
    throw new Error('인증이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`요청 실패: ${res.status}${text ? ` - ${text}` : ''}`);
  }

  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await res.text().catch(() => '');
    throw new Error('JSON 응답이 아닙니다.');
  }

  return res.json();
}

/** 검색: /api/cards/search?company=&cardName= */
export async function fetchCardImage({ company, cardName }) {
  const url = withBase('/api/cards/search');
  url.searchParams.set('company', company);
  url.searchParams.set('cardName', cardName);

  const data = await fetchJson(url.toString());

  if (!data?.isSuccess || !data?.result) {
    throw new Error(data?.message || '카드 정보를 가져오지 못했습니다.');
  }

  const { cardId, image, company: resCompany, cardName: resCardName } = data.result;

  return {
    id: cardId ?? Date.now(),
    company: resCompany ?? company,
    name: resCardName ?? cardName,
    image: image ?? '',
  };
}

/** 목록: /api/cards/list */
export async function fetchRegisteredCards() {
  const url = withBase('/api/cards/list');
  const data = await fetchJson(url.toString());

  if (!data?.isSuccess || !Array.isArray(data?.result)) {
    throw new Error(data?.message || '카드 목록을 가져오지 못했습니다.');
    }

  return data.result.map((item) => ({
    id: item.cardId,
    image: item.image || '',
    company: item.company || '',
    name: item.cardName || '',
  }));
}
