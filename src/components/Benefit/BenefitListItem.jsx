// src/components/Benefit/BenefitListItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BenefitListItem.module.css';

function BenefitListItem({ id, brand, description, detail, imageSrc, onClick }) {
        const navigate = useNavigate();
    
        const handleDetailClick = () => {
            navigate(`/benefit/${id}`);
        };

    return (
        <div className={styles.selectedBrandBenefit}>
            <div className={styles.benefitTextBlock}>
                <h4 className={styles.brandTitle}>{brand}</h4>
                <h3 className={styles.brandDescription}>{description}</h3>
                <p className={styles.brandSubText}>{detail}</p>
                <button className={styles.detailButton} onClick={handleDetailClick}>자세히 보기 〉</button>
            </div>
            <img src={imageSrc} alt={brand} className={styles.brandImage} />
        </div>
    );
}

export default BenefitListItem;
