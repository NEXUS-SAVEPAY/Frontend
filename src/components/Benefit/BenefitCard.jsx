import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BenefitCard.module.css';
import brandIcons from '../../data/brandIcons';

function BenefitCard({id, brand, description, imageSrc }) {
    const navigate = useNavigate();

    const handleDetailClick = () => {
        navigate(`/benefit/${id}`);
    };

    return (
        <div className={styles.card}>
            <img src={brandIcons[brand]} alt={brand} className={styles.image} />
            <div className={styles.info}>
                <h4 className={styles.brand}>{brand}</h4>
                <h3 className={styles.description}>{description}</h3>
                <button className={styles.detailButton} onClick={handleDetailClick}>자세히 보기 &gt;</button>
            </div>
        </div>
    );
}

export default BenefitCard;
