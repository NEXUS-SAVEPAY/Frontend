import React from 'react';
import './BenefitCarousel.css';
import BenefitCard from './BenefitCard';

const sampleBenefits = [
    {
        id: 1,
        brand: '올리브영',
        description: '올리브영 10% 캐시백\n등록하신 카드로 매장에서 결제하면 됩니다.',
        imageUrl: '/assets/images/oliveyoung.png',
    },
    {
        id: 2,
        brand: '스타벅스',
        description: '아메리카노 무료\n등록하신 간편결제로 주문하시면 됩니다.',
        imageUrl: '/assets/images/starbucks.png',
    },
];

function BenefitCarousel({ benefits = sampleBenefits }) {
    return (
        <div className="benefit-carousel-container">
            <div className="carousel-header">
                <h2>추천혜택</h2>
                <button className="more-button">＋</button>
            </div>
            <div className="carousel-scroll">
                {benefits.map((benefit) => (
                    <BenefitCard key={benefit.id} benefit={benefit} />
                ))}
            </div>
        </div>
    );
}

export default BenefitCarousel;
