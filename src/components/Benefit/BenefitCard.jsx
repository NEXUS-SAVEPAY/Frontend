import React from 'react';
import styles from './BenefitCard.module.css';

function BenefitCard({ brand, description, imageSrc }) {
    return (
        <div className={styles.card}>
            <img src={imageSrc} alt={brand} className={styles.image} />
            <div className={styles.info}>
                <h4 className={styles.brand}>{brand}</h4>
                <h3 className={styles.description}>{description}</h3>
                <button className={styles.detailButton}>자세히 보기 &gt;</button>
            </div>
        </div>
    );
}

export default BenefitCard;
