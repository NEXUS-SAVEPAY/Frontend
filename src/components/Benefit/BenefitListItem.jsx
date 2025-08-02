// src/components/Benefit/BenefitListItem.jsx
import React from 'react';
import styles from './BenefitListItem.module.css';

function BenefitListItem({ brand, description, detail, imageSrc, onClick }) {
    return (
        <div className={styles.selectedBrandBenefit}>
            <div className={styles.benefitTextBlock}>
                <h4 className={styles.brandTitle}>{brand}</h4>
                <h3 className={styles.brandDescription}>{description}</h3>
                <p className={styles.brandSubText}>{detail}</p>
                <button className={styles.detailButton}>자세히 보기 〉</button>
            </div>
            <img src={imageSrc} alt={brand} className={styles.brandImage} />
        </div>
    );
}

export default BenefitListItem;
