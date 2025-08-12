// src/mocks/favoriteBrandBenefits.js
import brandIcons from './brandIcons';

const favoriteBrandBenefits = [
    {
        brand: '올리브영',
        benefits: [
            {
                id: 1,
                type: 'card',
                provider: '삼성카드', // 추가
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['올리브영'],
            },
            {
                id: 2,
                type: 'card',
                provider: '신한카드', // 추가
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['올리브영'],
            },
            {
                id: 3,
                type: 'simplepay',
                provider: '카카오페이', // 추가
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['올리브영'],
            },
            {
                id: 4,
                type: 'telco',
                provider: 'SKT', // 추가
                description: '3천원 할인',
                detail: '5만원 이상 결제 시',
                imageSrc: brandIcons['올리브영'],
            }
        ]
    },
    {
        brand: '스타벅스',
        benefits: [
            {
                id: 5,
                type: 'card',
                provider: '현대카드',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['스타벅스']
            },
            {
                id: 6,
                type: 'simplepay',
                provider: '네이버페이',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['스타벅스']
            },
            {
                id: 7,
                type: 'telco',
                provider: 'KT',
                description: '5% 할인',
                detail: '모바일 카드로 결제 시 적용됩니다.',
                imageSrc: brandIcons['스타벅스']
            }
        ]
    },
    {
        brand: '맥도날드',
        benefits: [
            {
                id: 8,
                type: 'card',
                provider: '국민카드',
                description: '버거세트 할인',
                detail: '등록한 카드로 결제 시 적용',
                imageSrc: brandIcons['맥도날드']
            },
            {
                id: 9,
                type: 'card',
                provider: '우리카드',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['맥도날드']
            },
            {
                id: 10,
                type: 'simplepay',
                provider: '토스페이',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['맥도날드']
            },
            {
                id: 11,
                type: 'telco',
                provider: 'LG U+',
                description: '5% 할인',
                detail: '모바일 카드로 결제 시 적용됩니다.',
                imageSrc: brandIcons['맥도날드']
            }
        ]
    },
    {
        brand: '메가박스',
        benefits: [
            {
                id: 12,
                type: 'card',
                provider: '하나카드',
                description: '영화 예매 2천원 할인',
                detail: '온라인 예매 시 자동 적용',
                imageSrc: brandIcons['메가박스']
            },
            {
                id: 13,
                type: 'card',
                provider: 'BC카드',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['메가박스']
            },
            {
                id: 14,
                type: 'simplepay',
                provider: '페이코',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['메가박스']
            },
            {
                id: 15,
                type: 'telco',
                provider: 'SKT',
                description: '5% 할인',
                detail: '모바일 카드로 결제 시 적용됩니다.',
                imageSrc: brandIcons['메가박스']
            }
        ]
    },
    {
        brand: 'cgv',
        benefits: [
            {
                id: 16,
                type: 'card',
                provider: '롯데카드',
                description: '영화 예매 2천원 할인',
                detail: '온라인 예매 시 자동 적용',
                imageSrc: brandIcons['cgv']
            },
            {
                id: 17,
                type: 'card',
                provider: 'NH농협카드',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['cgv']
            },
            {
                id: 18,
                type: 'simplepay',
                provider: '카카오페이',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['cgv']
            },
            {
                id: 19,
                type: 'telco',
                provider: 'KT',
                description: '5% 할인',
                detail: '모바일 카드로 결제 시 적용됩니다.',
                imageSrc: brandIcons['cgv']
            }
        ]
    }
];

export default favoriteBrandBenefits;
