// src/services/api/cardBenefitApi.js
import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const CARD_BENEFITS_PATH =
  import.meta.env.VITE_CARD_BENEFITS_PATH ?? '/api/discount/card';

const withBase = (path) =>
  new URL(
    `${BASE_URL}${path}`,
    typeof window !== 'undefined' ? window.location.origin : undefined
  );

// 공통 GET
async function getJson(url, { signal } = {}) {
  const token = typeof getAccessToken === 'function' ? getAccessToken() : null;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: token ? 'omit' : 'include',
    redirect: 'follow',
    signal,
  });

  if (res.redirected && /\/login/i.test(res.url)) {
    throw new Error('인증이 필요합니다. 먼저 로그인해주세요.');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `요청 실패 (${res.status})`);
  }
  return res.json();
}

/**
 * 사용자의 카드와 관련된 브랜드 혜택 목록을 조회
 * Swagger 응답:
 * {
 *   isSuccess, code, message, result: [
 *     { id, brandName, brandImage, discountPercent, discountType, infoLink, details, pointInfo, createdAt }
 *   ], success
 * }
 */
export async function fetchCardRelatedBrandBenefits({ signal } = {}) {
  const url = withBase(CARD_BENEFITS_PATH);
  const data = await getJson(url, { signal });
  return Array.isArray(data?.result) ? data.result : [];
}

/**
 * UI 변환기 (✅ id 포함)
 * BenefitListItem props: { id, brand, description, detail, imageSrc }
 */
export function mapCardBenefitToUI(item) {
  if (!item) return null;

  const {
    id,                    // ✅ 상세 이동에 필수
    brandName,
    brandImage,
    discountPercent,
    discountType,
    details,
    pointInfo,
  } = item;

  // description: "할인유형 + 퍼센트"
  const hasPercent = typeof discountPercent === 'number' && discountPercent > 0;
  const typeLabel = discountType ? String(discountType) : '';
  const description =
    typeLabel && hasPercent
      ? `${typeLabel} ${discountPercent}%`
      : (typeLabel || (hasPercent ? `${discountPercent}%` : ''));

  const detail = details?.trim?.() || pointInfo?.trim?.() || '';

  // ❗ id 또는 brand가 없으면 상세로 못 가니 필터에서 제거
  if (!id || !brandName) return null;

  return {
    id,                           // ✅ 꼭 포함
    brand: brandName,
    imageSrc: brandImage || '',
    description,
    detail,
  };
}
