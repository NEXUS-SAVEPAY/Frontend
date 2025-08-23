// src/services/api/cardApi.js
import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const withBase = (path) =>
  new URL(`${BASE_URL}${path}`, typeof window !== 'undefined' ? window.location.origin : undefined);

/** 공통: 메서드/헤더/바디까지 지원하도록 확장 */
async function fetchJson(
  url,
  { method = 'GET', headers = {}, body, credentials, redirect = 'follow' } = {}
) {
  const token = typeof getAccessToken === 'function' ? getAccessToken() : null;

  const res = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body,
    credentials: credentials ?? (token ? 'omit' : 'include'), // 토큰 없으면 쿠키 전송
    redirect,
  });

  // 인증 관련 처리
  if (res.redirected && /\/login/i.test(res.url)) {
    throw new Error('인증이 필요합니다. 먼저 로그인해주세요.');
  }
  if (res.status === 401 || res.status === 403) {
    throw new Error('인증이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.');
  }

  // 본문 파싱 (가능하면 JSON으로)
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const text = await res.text().catch(() => '');
  const json = isJson && text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err = new Error(`요청 실패: ${res.status}${json?.message ? ` - ${json.message}` : text ? ` - ${text}` : ''}`);
    if (json?.code) err.code = json.code; // 서버 에러코드(예: CARD400)
    throw err;
  }

  if (!isJson) throw new Error('JSON 응답이 아닙니다.');
  return json;
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

/** 등록: /api/cards/user?cardId=  (POST) */
export async function registerCardToUser(cardId) {
  if (cardId === undefined || cardId === null) {
    throw new Error('cardId가 필요합니다.');
  }
  const url = withBase('/api/cards/user');
  url.searchParams.set('cardId', String(cardId));

  try {
    const data = await fetchJson(url.toString(), { method: 'POST' });
    if (!data?.isSuccess) {
      throw new Error(data?.message || '카드 등록에 실패했습니다.');
    }
    return true;
  } catch (err) {
    // 서버 중복 코드 매핑
    if (err.code === 'CARD400' || /중복/.test(err.message)) {
      const dup = new Error('이미 등록된 카드입니다.');
      dup.code = 'CARD400';
      throw dup;
    }
    throw err;
  }
}
/** 삭제: /api/cards/user?cardId= (DELETE) */
export async function deleteCardFromUser(cardId) {
  if (cardId === undefined || cardId === null) {
    throw new Error('cardId가 필요합니다.');
  }
  const url = withBase('/api/cards/user');
  url.searchParams.set('cardId', String(cardId));

  try {
    const data = await fetchJson(url.toString(), { method: 'DELETE' });
    if (!data?.isSuccess) {
      throw new Error(data?.message || '카드 삭제에 실패했습니다.');
    }
    return true;
  } catch (err) {
    // 서버 표준 코드 매핑
    // 404: USER_PAYMENT404 ("사용자 결제수단을 찾을 수 없습니다.")
    if (err.code === 'USER_PAYMENT404') {
      const notFound = new Error('사용자 결제수단을 찾을 수 없습니다.');
      notFound.code = 'USER_PAYMENT404';
      throw notFound;
    }
    throw err;
  }
}
