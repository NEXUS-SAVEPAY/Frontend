// 여러 API 케이스 커버 (id, discountId, benefitId, discount_id 등)
export function getDiscountId(item) {
  return item?.id ?? item?.discountId ?? item?.benefitId ?? item?.discount_id ?? null;
}
