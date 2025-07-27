import React from 'react';
import './BenefitCard.css';

function BenefitCard({ benefit }) {
    const { brand, description, imageUrl } = benefit;

    return (
        <div className="benefit-card">
            <img src={imageUrl} alt={`${brand} 혜택`} className="benefit-image" />
            <div className="benefit-info">
                <p className="benefit-title">{description.split('\n')[0]}</p>
                <p className="benefit-sub">{description.split('\n')[1]}</p>
                <button className="detail-button">자세히 보기</button>
            </div>
        </div>
    );
}

export default BenefitCard;
