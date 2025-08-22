import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BenefitListItem.module.css';
import brandIcons from '../../data/brandIcons';

function BenefitListItem({
  id,             // number | string
  brand,          // string (예: '스타벅스')
  description,    // 예: '20% 할인'
  detail,         // 상세 문구
  imageSrc,       // 백엔드 brandImage
  // infoLink,    // ⛔️ 더이상 사용하지 않음: 항상 상세로 이동
  onClickDetail,  // 부모 콜백 우선
}) {
  const navigate = useNavigate();

  const handleDetailClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof onClickDetail === 'function') {
      onClickDetail();
      return;
    }
    if (!brand || id == null) return; // 가드

    const safeBrand = encodeURIComponent(String(brand).trim());
    navigate(`/benefit/${safeBrand}/${String(id)}`);
  };

  const imgSrc = imageSrc || brandIcons[brand] || '';

  return (
    <div className={styles.selectedBrandBenefit} data-id={id} data-brand={brand} onClick={handleDetailClick} role="button" tabIndex={0}>
      <div className={styles.benefitTextBlock}>
        <h4 className={styles.brandTitle}>{brand}</h4>
        <h3 className={styles.brandDescription}>{description}</h3>
        <p className={styles.brandSubText}>{detail}</p>

        <button
          className={styles.detailButton}
          type="button"
          onClick={handleDetailClick}
        >
          자세히 보기 〉
        </button>
      </div>

      <img
        src={imgSrc}
        alt={brand}
        className={styles.brandImage}
        onError={(e) => {
          const fallback = brandIcons?.[brand];
          if (fallback && e.currentTarget.src !== fallback) {
            e.currentTarget.src = fallback;
          }
        }}
      />
    </div>
  );
}

export default BenefitListItem;
