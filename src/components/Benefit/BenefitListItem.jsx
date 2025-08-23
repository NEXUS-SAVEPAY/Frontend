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
  onClickDetail,  // 부모 콜백 우선
  source,         // ✅ 'card' | 'brand' | 'telco' ... (선택; 카드 리스트면 'card')
}) {
  const navigate = useNavigate();

  const handleGoDetail = () => {
    if (!brand || id == null) return; // 가드
    const safeBrand = encodeURIComponent(String(brand).trim());

    // ✅ 카드 리스트에서 온 경우: state + 쿼리 모두 부착 (둘 중 하나만으로도 동작하지만 안전하게)
    const isCard = source === 'card';
    const url = `/benefit/${safeBrand}/${String(id)}${isCard ? '?source=card' : ''}`;

    navigate(url, {
      state: isCard ? { source: 'card' } : undefined,
      replace: false,
    });
  };

  const handleDetailClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onClickDetail === 'function') {
      onClickDetail();
      return;
    }
    handleGoDetail();
  };

  const handleKeyDown = (e) => {
    // 접근성: Enter/Space로도 이동
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleGoDetail();
    }
  };

  const imgSrc = imageSrc || brandIcons[brand] || '';

  return (
    <div
      className={styles.selectedBrandBenefit}
      data-id={id}
      data-brand={brand}
      data-source={source || ''}   // ✅ 디버깅/스타일링용
      onClick={handleDetailClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className={styles.benefitTextBlock}>
        <h4 className={styles.brandTitle}>{brand}</h4>
        <h3 className={styles.brandDescription}>{description}</h3>
        {detail && <p className={styles.brandSubText}>{detail}</p>}

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
