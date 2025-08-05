import brandIcons from './brandIcons';

const registeredBenefits = [
    // 카드 혜택
    {
        id: 1,
        type: 'card',
        brand: '올리브영',
        description: '10% 캐시백',
        detail: '등록하신 카드로 매장에서 결제해주세요.',
        imageSrc: brandIcons['올리브영'],
    },
    {
        id: 2,
        type: 'card',
        brand: '스타벅스',
        description: '5% 할인',
        detail: '모바일 카드로 결제 시 적용됩니다.',
        imageSrc: brandIcons['스타벅스'],
    },
    {
        id: 3,
        type: 'card',
        brand: '배달의민족',
        description: '3천원 할인',
        detail: '5만원 이상 결제 시',
        imageSrc: brandIcons['배달의민족'],
    },

    // 간편결제 혜택
    {
        id: 4,
        type: 'simplepay',
        brand: '메가박스',
        description: '1천원 할인',
        detail: '간편결제로 예매 시 적용됩니다.',
        imageSrc: brandIcons['메가박스'],
    },
    {
        id: 5,
        type: 'simplepay',
        brand: '배달의민족',
        description: '5% 캐시백',
        detail: '삼성페이 결제 시 적용',
        imageSrc: brandIcons['배달의민족'],
    },
    {
        id: 6,
        type: 'simplepay',
        brand: '쿠팡',
        description: '로켓배송 2천원 할인',
        detail: '네이버페이 결제 시',
        imageSrc: brandIcons['쿠팡'],
    },

    // 통신사 혜택
    {
        id: 7,
        type: 'telco',
        brand: 'SKT',
        description: 'VVIP 영화 2천원 할인',
        detail: '멤버십 등급 확인 필요',
        imageSrc: brandIcons['SKT'],
    },
    {
        id: 8,
        type: 'telco',
        brand: 'KT',
        description: '스타벅스 음료 1+1',
        detail: '멤버십 앱 바코드 제시',
        imageSrc: brandIcons['KT'],
    },
    {
        id: 9,
        type: 'telco',
        brand: 'LGU+',
        description: '배달앱 10% 할인',
        detail: 'VIP 멤버십 전용 혜택',
        imageSrc: brandIcons['LGU+'],
    },
];

export default registeredBenefits;
