import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BenefitCard.module.css';
import brandIcons from '../../data/brandIcons';

function BenefitCard({ id, brand, description, imageSrc, source }) {
  const navigate = useNavigate();

  const handleDetailClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!brand || id == null) return; // 가드

    const safeBrand = encodeURIComponent(String(brand).trim());
    const isCard = source === 'card';
    const url = `/benefit/${safeBrand}/${String(id)}${isCard ? '?source=card' : ''}`;

    navigate(url, {
      state: isCard ? { source: 'card' } : undefined,
    });
  };

  return (
    <div className={styles.card} onClick={handleDetailClick} role="button" tabIndex={0}>
      <img
        src={imageSrc || brandIcons[brand] || ''}
        alt={brand}
        className={styles.image}
        onError={(e) => {
          const fallback = brandIcons?.[brand];
          if (fallback && e.currentTarget.src !== fallback) {
            e.currentTarget.src = fallback;
          }
        }}
      />
      <div className={styles.info}>
        <h4 className={styles.brand}>{brand}</h4>
        <h3 className={styles.description}>{description}</h3>
        <button className={styles.detailButton} type="button" onClick={handleDetailClick}>
          자세히 보기 &gt;
        </button>
      </div>
    </div>
  );
}

export default BenefitCard;
