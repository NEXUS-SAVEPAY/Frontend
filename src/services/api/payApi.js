// src/services/api/payApi.js
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
    throw new Error(text || `요청 실패 (${res.status})`);
  }
  return await res.json().catch(() => ({}));
}

// ---------- 공통 POST ----------
async function postJson(url, body) {
  const token = typeof getAccessToken === 'function' ? getAccessToken() : null;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: token ? 'omit' : 'include',
    redirect: 'follow',
    body: JSON.stringify(body),
  });

  if (res.redirected && /\/login/i.test(res.url)) {
    throw new Error('인증이 필요합니다. 먼저 로그인해주세요.');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `요청 실패 (${res.status})`);
  }
  return await res.json().catch(() => ({}));
}

// ---------- 공통 PUT ----------
async function putJson(url, body) {
  const token = typeof getAccessToken === 'function' ? getAccessToken() : null;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: token ? 'omit' : 'include',
    redirect: 'follow',
    body: JSON.stringify(body),
  });

  if (res.redirected && /\/login/i.test(res.url)) {
    throw new Error('인증이 필요합니다. 먼저 로그인해주세요.');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `요청 실패 (${res.status})`);
  }
  return await res.json().catch(() => ({}));
}

// ---------- 간편결제 등록(POST) ----------
export async function registerSimplePays(payRequestOneDtoList) {
  // 실제 엔드포인트 확인: 예) '/api/pays/user'
  const url = withBase('/api/pays/user').toString();
  const data = await postJson(url, { payRequestOneDtoList });

  const ok = data?.isSuccess ?? data?.success ?? false;
  if (!ok) {
    const msg = data?.message || '간편결제 등록에 실패했습니다.';
    const code = data?.code ? ` [${data.code}]` : '';
    throw new Error(`${msg}${code}`);
  }
  return data;
}

// ---------- 간편결제 수정(PUT) ----------
export async function updateSimplePays(payRequestOneDtoList) {
  // 보통 등록과 동일 리소스에 PUT
  const url = withBase('/api/pays/user').toString();
  const data = await putJson(url, { payRequestOneDtoList });

  const ok = data?.isSuccess ?? data?.success ?? false;
  if (!ok) {
    const msg = data?.message || '간편결제 수정에 실패했습니다.';
    const code = data?.code ? ` [${data.code}]` : '';
    throw new Error(`${msg}${code}`);
  }
  return data;
}

// ---------- 간편결제 조회(GET) ----------
// src/services/api/payApi.js
export async function fetchSimplePays() {
  const url = withBase('/api/pays/user').toString();
  const data = await getJson(url);

  const ok = data?.isSuccess ?? data?.success ?? false;
  if (!ok) {
    const msg = data?.message || '간편결제 조회에 실패했습니다.';
    const code = data?.code ? ` [${data.code}]` : '';
    throw new Error(`${msg}${code}`);
  }

  const list = data?.result?.payResponseOneDtoList ?? [];

  // 서버 데이터 그대로 normalize
  return list.map((item) => ({
    provider: item.payProvider,   // "KAKAO", "TOSS", ...
    company: item.company,        // 소문자 "kakao", "toss", ...
    image: item.image,            // DB 이미지 URL
    isMembership: item.isMembership === true,
  }));
}
