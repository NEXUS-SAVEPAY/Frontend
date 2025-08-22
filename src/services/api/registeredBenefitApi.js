// src/services/api/registeredBenefitApi.js
import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const withBase = (path) =>
  new URL(`${BASE_URL}${path}`, typeof window !== 'undefined' ? window.location.origin : undefined);

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

function mapBenefit(item) {
  const pct = (item?.discountPercent ?? '') === '' ? '' : `${item.discountPercent}%`;
  const desc = [pct, item?.discountType].filter(Boolean).join(' ').trim(); // "10% 할인"
  return {
    id: item.id,
    brand: item.brandName,
    imageSrc: item.brandImage,
    description: desc,
    detail: item.details,
    infoLink: item.infoLink,
    pointInfo: item.pointInfo,
    createdAt: item.createdAt,
  };
}

// ---- 타입 추론 (힌트가 없을 때 대비) ----
const CARD_KEYWORDS = [
  '카드','신한','국민','kb','삼성','현대','롯데','하나','우리','농협','nh','bc','ibk','씨티','수협','전북','제주'
];
const PAY_KEYWORDS = [
  '페이','pay','카카오페이','kakaopay','네이버페이','naver pay','토스','toss','페이코','payco','삼성페이','apple pay','애플페이','네이버'
];
const TELCO_KEYWORDS = [
  '통신','telco','teleco','skt','kt','lg u','lgu','lg u+','u+','엘지유플러스','에스케이','케이티'
];

function includesAny(haystack, keywords) {
  const s = (haystack ?? '').toString().toLowerCase();
  return keywords.some(k => s.includes(k.toLowerCase()));
}

function extractType(raw) {
  // 1) 명시적 필드 우선
  const hint = [
    raw?.type, raw?.paymentType, raw?.payment, raw?.category, raw?.categoryType,
    raw?.methodType, raw?.registeredType, raw?.benefitType
  ].filter(Boolean).map(String).join('|').toLowerCase();

  if (/card|카드/.test(hint)) return 'card';
  if (/pay|simple|간편|페이/.test(hint)) return 'pay';
  if (/telco|tele?co|carrier|통신/.test(hint)) return 'telco';

  // 2) 브랜드명 등으로 휴리스틱 추론
  const brand = `${raw?.brandName ?? ''} ${raw?.details ?? ''} ${raw?.discountType ?? ''}`;

  if (includesAny(brand, CARD_KEYWORDS)) return 'card';
  if (includesAny(brand, PAY_KEYWORDS)) return 'pay';
  if (includesAny(brand, TELCO_KEYWORDS)) return 'telco';

  // 3) 못 맞추면 null
  return null;
}

// ---- 응답 정규화: /api/discount/payment -> {card:[..2], pay:[..2], telco:[..2]} ----
function normalizeToBuckets(data) {
  // 그룹형 응답(객체): { result: { card:[...], pay:[...], telco:[...] } }
  if (data?.result && typeof data.result === 'object' && !Array.isArray(data.result)) {
    const { card = [], pay = [], telco = [] } = data.result;
    return {
      card: (Array.isArray(card) ? card : []).map(mapBenefit).slice(0, 2),
      pay: (Array.isArray(pay) ? pay : []).map(mapBenefit).slice(0, 2),
      telco: (Array.isArray(telco) ? telco : []).map(mapBenefit).slice(0, 2),
    };
  }

  // 평면 배열 응답: { result: [ ... ] }
  const list = Array.isArray(data?.result) ? data.result : [];

  // 1차: 타입 추론으로 버킷 분류
  const buckets = { card: [], pay: [], telco: [] };
  const unknown = [];

  for (const raw of list) {
    const t = extractType(raw);
    if (t && buckets[t].length < 2) {
      buckets[t].push(mapBenefit(raw));
    } else {
      unknown.push(raw);
    }
  }

  // 2차: 남은 항목으로 부족한 버킷 채우기
  const order = ['card', 'pay', 'telco'];
  for (const raw of unknown) {
    const benefit = mapBenefit(raw);
    const need = order.find(k => buckets[k].length < 2);
    if (!need) break;
    buckets[need].push(benefit);
  }

  return {
    card: buckets.card.slice(0, 2),
    pay: buckets.pay.slice(0, 2),
    telco: buckets.telco.slice(0, 2),
  };
}

// ✅ 한 번에 가져오기: /api/discount/payment
export async function fetchRegisteredPaymentTop2() {
  const url = withBase('/api/discount/payment');
  const data = await fetchJson(url);
  return normalizeToBuckets(data);
}
