import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const withBase = (path) =>
  new URL(`${BASE_URL}${path}`, typeof window !== 'undefined' ? window.location.origin : undefined);

const REGISTERED_TOP2_ENV = import.meta.env.VITE_API_REGISTERED_TOP2_PATH;
const REGISTERED_TOP2_FALLBACK = '/api/discount/payment';

const CARD_LIST_PATH  = '/api/discount/card';
const PAY_LIST_PATH   = '/api/discount/pay';
const TELCO_LIST_PATH = '/api/discount/telecom';

async function fetchJson(url) {
  const token = getAccessToken?.();
  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    credentials: token ? 'omit' : 'include',
    redirect: 'follow',
  });
  if (res.redirected && /\/login/i.test(res.url)) throw new Error('인증이 필요합니다. 먼저 로그인해주세요.');
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`서버 오류 (${res.status}): ${text}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }
  return res.json();
}

function pickArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}

// 공통 description 포맷 
function mapBenefit(item) {
  const discountPercent = Number(item?.discountPercent ?? 0) || 0;
  const discountType = (item?.discountType ?? '').toString().trim();

  // Telco/FavoriteBenefitPage와 같은 방식: 퍼센트 + 타입
  const discountLabel =
    discountPercent && discountType
      ? `${discountPercent}% ${discountType}`
      : discountType || '';

  const description = discountLabel || item?.details || '';

  return {
    id: item?.id,
    brand: item?.brandName,
    imageSrc: item?.brandImage,
    description,          // 다른 페이지와 동일한 형식
    detail: item?.details ?? '',
    infoLink: item?.infoLink ?? '',
    pointInfo: item?.pointInfo ?? '',
    createdAt: item?.createdAt ?? '',
  };
}

// ---- 통합 TOP(flat) 호출 ----
async function fetchRegisteredTop2FlatInternal() {
  const candidates = REGISTERED_TOP2_ENV
    ? [REGISTERED_TOP2_ENV, REGISTERED_TOP2_FALLBACK]
    : [REGISTERED_TOP2_FALLBACK];

  for (const p of candidates) {
    try {
      const data = await fetchJson(withBase(p));
      const list = pickArray(data);
      if (list.length > 0) return list.slice(0, 6); // top2×3 = 최대 6
    } catch (_) {
      /* 다음 후보 시도 */
    }
  }
  return [];
}

async function fetchCardList()  { return pickArray(await fetchJson(withBase(CARD_LIST_PATH))); }
async function fetchPayList()   { return pickArray(await fetchJson(withBase(PAY_LIST_PATH))); }
async function fetchTelcoList() { return pickArray(await fetchJson(withBase(TELCO_LIST_PATH))); }

export async function fetchRegisteredPaymentTop2() {
  const flat = await fetchRegisteredTop2FlatInternal();
  if (flat.length === 0) return { card: [], pay: [], telco: [], unknown: [] };

  const [cardAll, payAll, telcoAll] = await Promise.allSettled([
    fetchCardList(),
    fetchPayList(),
    fetchTelcoList(),
  ]);

  const toSet = (res) => new Set((res.status === 'fulfilled' ? res.value : []).map(x => x.id));
  const cardIds  = toSet(cardAll);
  const payIds   = toSet(payAll);
  const telcoIds = toSet(telcoAll);

  const buckets = { card: [], pay: [], telco: [], unknown: [] };
  for (const raw of flat) {
    const id = raw?.id;
    if (id == null) { buckets.unknown.push(raw); continue; }

    if (cardIds.has(id)  && buckets.card.length  < 2) { buckets.card.push(raw);  continue; }
    if (payIds.has(id)   && buckets.pay.length   < 2) { buckets.pay.push(raw);   continue; }
    if (telcoIds.has(id) && buckets.telco.length < 2) { buckets.telco.push(raw); continue; }
    buckets.unknown.push(raw);
  }

  return {
    card:   buckets.card.slice(0, 2).map(mapBenefit),
    pay:    buckets.pay.slice(0, 2).map(mapBenefit),
    telco:  buckets.telco.slice(0, 2).map(mapBenefit),
    unknown: buckets.unknown.map(mapBenefit),
  };
}
