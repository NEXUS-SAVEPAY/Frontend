// src/components/Benefit/BenefitListItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BenefitListItem.module.css';
import brandIcons from '../../data/brandIcons';

function BenefitListItem({ id, brand, description, detail, imageSrc, onClick }) {
        const navigate = useNavigate();
    
        const handleDetailClick = () => {
            navigate(`/benefit/${brand}/${id}`);
        };

        console.log('BenefitListItem - brand:', brand);

    return (
        <div className={styles.selectedBrandBenefit}>
            <div className={styles.benefitTextBlock}>
                <h4 className={styles.brandTitle}>{brand}</h4>
                <h3 className={styles.brandDescription}>{description}</h3>
                <p className={styles.brandSubText}>{detail}</p>
                <button className={styles.detailButton} onClick={handleDetailClick}>자세히 보기 〉</button>
            </div>
            <img src={imageSrc || brandIcons[brand]} alt={brand} className={styles.brandImage} />
        </div>
    );
}

export default BenefitListItem;
