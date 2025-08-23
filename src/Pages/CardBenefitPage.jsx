// src/pages/CardBenefitPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './RecommendedBenefitPage.module.css';
import BenefitListItem from '../components/Benefit/BenefitListItem';

import {
  fetchCardRelatedBrandBenefits,
  mapCardBenefitToUI,
} from '../services/api/cardBenefitApi';

const isAbortError = (err) =>
  err?.name === 'AbortError' ||
  /aborted|abort/i.test(String(err?.message || '')) ||
  /aborted|abort/i.test(String(err?.cause || ''));

function CardBenefitPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;

    (async () => {
      try {
        if (!mounted) return;
        setLoading(true);
        setErrorMsg('');

        // 서비스가 { signal } 옵션 지원
        const raw = await fetchCardRelatedBrandBenefits({ signal: ac.signal });
        if (!mounted) return;

        // ⚠️ map에 index가 넘어가므로 mapCardBenefitToUI의 fallback id가 동작
        const mapped = raw.map(mapCardBenefitToUI).filter(Boolean);
        setItems(mapped);
      } catch (err) {
        if (isAbortError(err)) return;
        if (!mounted) return;
        setErrorMsg(err?.message || '혜택을 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      ac.abort('route-change');
    };
  }, []);

  // 상세 이동
  const openDetail = (benefit) => {
    const discountId = benefit?.id;
    const brand = benefit?.brand ?? 'brand';

    if (!discountId) {
      console.error('[openDetail] invalid discountId', { benefit });
      alert('이 혜택의 ID가 없어 상세로 이동할 수 없습니다.');
      return;
    }

    // ❗ 임시 id(tmp-*)인 경우: 서버 상세 페이지가 없을 수 있으니 infoLink가 있으면 외부 링크로 대체
    if (String(discountId).startsWith('tmp-')) {
      if (benefit?.infoLink) {
        window.open(benefit.infoLink, '_blank', 'noopener,noreferrer');
        return;
      }
      // infoLink도 없으면 안내
      alert('상세 ID가 없어 외부 상세 페이지로 이동할 수 없습니다.');
      return;
    }

    // 정상 id면 내부 상세 페이지로 이동
    navigate(`/benefit/${encodeURIComponent(brand)}/${discountId}?source=card`, {
      state: { source: 'card' },
    });
  };

  return (
    <div className={styles.container}>
      {/* 고정 헤더 */}
      <div className={styles.fixedHeader}>
        <div className={styles.header}>
          <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
          <h2 className={styles.title}>카드 혜택</h2>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className={styles.content}>
        {loading && null}

        {!loading && errorMsg && <div className={styles.errorState}>{errorMsg}</div>}

        {!loading && !errorMsg && items.length === 0 && (
          <div className={styles.emptyState}>표시할 혜택이 없습니다.</div>
        )}

        {!loading && !errorMsg && items.length > 0 && (
          <div className={styles.benefitListColumn}>
            {items.map((benefit) => (
              <BenefitListItem
                key={benefit.id}
                id={benefit.id}
                brand={benefit.brand}
                description={benefit.description}
                detail={benefit.detail}
                imageSrc={benefit.imageSrc}
                source="card"
                onClickDetail={() => openDetail(benefit)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CardBenefitPage;
