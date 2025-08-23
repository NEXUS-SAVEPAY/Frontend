import { getJson } from './https'; // 기존 fetch 유틸 함수

export async function fetchInterestOrPaymentBenefits() {
    return await getJson('/api/discount/interest-or-payment');
}
