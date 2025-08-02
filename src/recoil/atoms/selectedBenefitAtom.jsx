import { atom } from 'recoil';

const oliveYoungBenefit = {
    brand: '올리브영',
    title: '10% 캐시백',
    description: '카드사앱에서 쿠폰을 받으시고\n등록하신 카드로 매장에서 결제해주세요.',
    image: '/assets/images/oliveyoung.svg',
    cashback: '10%',
    point: '결제 금액의 5% 적립',
    steps: [
        '카드사 사이트나 앱 접속 후 쿠폰 받기 클릭.',
        '쿠폰 받은 내역 확인.',
        '해당 카드사 카드로 오프라인 결제.',
        '전화 번호 입력 후 포인트 적립.'
    ],
    externalUrl: 'https://event.cardcompany.com/oliveyoung-benefit'
};

// ✅ 이 부분이 꼭 필요함!
export const selectedBenefitAtom = atom({
    key: 'selectedBenefitAtom',
    default: oliveYoungBenefit, // 또는 null
});
