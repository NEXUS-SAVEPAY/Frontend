// src/components/Common/BrandCard.jsx
import React from 'react';
import styles from './BrandCard.module.css';

function BrandCard({ imageSrc, brandName, isFavorite, onToggle }) {
    return (
        <div className={styles.card}>
            <div className={styles.brandInfo}>
                <img src={imageSrc} alt={brandName} className={styles.brandImage} />
                <span className={styles.brandName}>{brandName}</span>
            </div>

            <button className={styles.starButton} onClick={onToggle}>
                {isFavorite ? '★' : '☆'}
            </button>
        </div>
    );
}

export default BrandCard;