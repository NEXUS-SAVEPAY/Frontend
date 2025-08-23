// src/services/api/registeredBenefitApi.js
import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const withBase = (path) =>
  new URL(`${BASE_URL}${path}`, typeof window !== 'undefined' ? window.location.origin : undefined);

/**
 * 통합 TOP(평면) 엔드포인트:
 * - 환경변수(VITE_API_REGISTERED_TOP2_PATH)가 설정된 경우에만 사용
 * - 미설정이면 '/api/discount/payment'만 시도 (404 없애기)
 */
const REGISTERED_TOP2_ENV = import.meta.env.VITE_API_REGISTERED_TOP2_PATH;
const REGISTERED_TOP2_FALLBACK = '/api/discount/payment';

// 카테고리 "전체 목록" (id 집합 만들 용도) — 스웨거 실제 경로로 확정
const CARD_LIST_PATH  = '/api/discount/card';
const PAY_LIST_PATH   = '/api/discount/pay';   // ✅ pay는 payment로 확정
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

const TYPE_LABELS = {
  DISCOUNT: '할인',
  POINT: '포인트',
  COUPON: '쿠폰',
  CASHBACK: '캐시백',
};

function mapBenefit(item) {
  const n = Number(item?.discountPercent);
  const pct = Number.isFinite(n) && n > 0 ? `${n}%` : '';
  const rawType = (item?.discountType ?? '').toString().trim();
  const typeText = TYPE_LABELS[rawType?.toUpperCase?.()] || rawType;
  const description = [pct, typeText].filter(Boolean).join(' ').trim() || (item?.details ?? '');
  return {
    id: item?.id,
    brand: item?.brandName,
    imageSrc: item?.brandImage,
    description,
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
    : [REGISTERED_TOP2_FALLBACK]; // ❌ 미설정이면 /registered/top2 호출 안 함

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

// ---- 카테고리 전체 목록 ----
async function fetchCardList()  { return pickArray(await fetchJson(withBase(CARD_LIST_PATH))); }
async function fetchPayList()   { return pickArray(await fetchJson(withBase(PAY_LIST_PATH))); }
async function fetchTelcoList() { return pickArray(await fetchJson(withBase(TELCO_LIST_PATH))); }

/**
 * 통합 TOP(flat)을 받아오고, 카테고리 전체 목록의 ID 집합으로 교차검증하여
 * { card:[..2], pay:[..2], telco:[..2], unknown:[...] }로 확정 분류
 * - 섞임 없음, 순서는 flat 응답의 우선순위를 그대로 따름
 */
export async function fetchRegisteredPaymentTop2() {
  // 1) 통합 TOP(평면)
  const flat = await fetchRegisteredTop2FlatInternal();
  if (flat.length === 0) return { card: [], pay: [], telco: [], unknown: [] };

  // 2) 카테고리 전체 목록 → id 집합
  const [cardAll, payAll, telcoAll] = await Promise.allSettled([
    fetchCardList(),
    fetchPayList(),
    fetchTelcoList(),
  ]);

  const toSet = (res) => new Set((res.status === 'fulfilled' ? res.value : []).map(x => x.id));
  const cardIds  = toSet(cardAll);
  const payIds   = toSet(payAll);
  const telcoIds = toSet(telcoAll);

  // 3) 교차검증 분류 (동일 id가 다수 집합에 있으면 card > pay > telco 우선)
  const buckets = { card: [], pay: [], telco: [], unknown: [] };
  for (const raw of flat) {
    const id = raw?.id;
    if (id == null) { buckets.unknown.push(raw); continue; }

    if (cardIds.has(id)  && buckets.card.length  < 2) { buckets.card.push(raw);  continue; }
    if (payIds.has(id)   && buckets.pay.length   < 2) { buckets.pay.push(raw);   continue; }
    if (telcoIds.has(id) && buckets.telco.length < 2) { buckets.telco.push(raw); continue; }
    buckets.unknown.push(raw);
  }

  // 4) UI 맵핑
  return {
    card:   buckets.card.slice(0, 2).map(mapBenefit),
    pay:    buckets.pay.slice(0, 2).map(mapBenefit),
    telco:  buckets.telco.slice(0, 2).map(mapBenefit),
    unknown: buckets.unknown.map(mapBenefit), // 필요 없으면 페이지에서 무시
  };
}
