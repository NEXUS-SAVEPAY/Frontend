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
  infoLink,       // 외부 정보 링크 (보존용; 여기서는 사용 X)
  onClickDetail,  // 부모 콜백 우선
  source,         // 'card' | 'brand' | 'telco' ... (선택; 카드 목록이면 'card')
}) {
  const navigate = useNavigate();

  // 렌더 직전에 안전 변환 (UI 동일)
  const t = (v) =>
    typeof v === 'string' || typeof v === 'number' ? String(v) : '';
  const s = (v) => (typeof v === 'string' ? v : '');

  const safeId = t(id);
  const safeBrand = t(brand);
  const safeDesc = t(description);
  const safeDetail = t(detail);
  const safeImg = s(imageSrc) || brandIcons[safeBrand] || '';

  const handleGoDetail = () => {
    if (!safeBrand || !safeId) return; // 가드
    const url = `/benefit/${encodeURIComponent(safeBrand.trim())}/${safeId}${
      source === 'card' ? '?source=card' : ''
    }`;

    navigate(
      url,
      source === 'card' ? { state: { source: 'card' } } : undefined
    );
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

  return (
    <div
      className={styles.selectedBrandBenefit}
      data-id={safeId}
      data-brand={safeBrand}
      onClick={handleDetailClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.benefitTextBlock}>
        <h4 className={styles.brandTitle}>{safeBrand}</h4>
        <h3 className={styles.brandDescription}>{safeDesc}</h3>
        <p className={styles.brandSubText}>{safeDetail}</p>

        <button
          className={styles.detailButton}
          type="button"
          onClick={handleDetailClick}
        >
          자세히 보기 〉
        </button>
      </div>

      <img
        src={safeImg}
        alt={safeBrand}
        className={styles.brandImage}
        onError={(e) => {
          const fallback = brandIcons?.[safeBrand];
          if (fallback && e.currentTarget.src !== fallback) {
            e.currentTarget.src = fallback;
          }
        }}
      />
    </div>
  );
}

export default BenefitListItem;
