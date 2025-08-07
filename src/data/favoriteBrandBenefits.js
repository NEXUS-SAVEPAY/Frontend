// src/mocks/favoriteBrandBenefits.js
//관심 브랜드 가로로 뜨는 내용
import brandIcons from './brandIcons';

const favoriteBrandBenefits = [
    {
        brand: '올리브영',
        benefits: [
            {
                id: 1,
                type: 'card',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['올리브영'],
            },
            {
                id: 2,
                type: 'card',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['올리브영'],
            },
            {
                id: 3,
                type: 'simplepay',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['올리브영'],
            },
            {
                id: 4,
                type: 'telco',
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
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['스타벅스']
            },
            {
                id: 6,
                type: 'simplepay',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['스타벅스']
            },
            {
                id: 7,
                type: 'telco',
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
                description: '버거세트 할인',
                detail: '등록한 카드로 결제 시 적용',
                imageSrc: brandIcons['맥도날드']
            },
            {
                id: 9,
                type: 'card',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['맥도날드']
            },
            {
                id: 10,
                type: 'simplepay',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['맥도날드']
            },
            {
                id: 11,
                type: 'telco',
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
                description: '영화 예매 2천원 할인',
                detail: '온라인 예매 시 자동 적용',
                imageSrc: brandIcons['메가박스']
            },
            {
                id: 13,
                type: 'card',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['메가박스']
            },
            {
                id: 14,
                type: 'simplepay',
                description: '10% 캐시백',
                detail: '등록하신 카드로 매장에서 결제해주세요.',
                imageSrc: brandIcons['메가박스']
            },
            {
                id: 15,
                type: 'telco',
                description: '5% 할인',
                detail: '모바일 카드로 결제 시 적용됩니다.',
                imageSrc: brandIcons['메가박스']
            }
        ]
    }
    
];

export default favoriteBrandBenefits;
