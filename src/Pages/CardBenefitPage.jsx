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

        const raw = await fetchCardRelatedBrandBenefits({ signal: ac.signal });
        if (!mounted) return;

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

  // ✅ 상세 이동
  const openDetail = (benefit) => {
    const discountId = benefit?.id;                  // map에서 보장
    const brand = benefit?.brand ?? 'brand';

    if (!discountId) {
      console.error('[openDetail] invalid discountId', { benefit });
      alert('이 혜택의 ID가 없어 상세로 이동할 수 없습니다.');
      return;
    }

    navigate(`/benefit/${encodeURIComponent(brand)}/${discountId}`);
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
        {loading && <div className={styles.emptyState}>불러오는 중…</div>}

        {!loading && errorMsg && <div className={styles.errorState}>{errorMsg}</div>}

        {!loading && !errorMsg && items.length === 0 && (
          <div className={styles.emptyState}>표시할 혜택이 없습니다.</div>
        )}

        {!loading && !errorMsg && items.length > 0 && (
          <div className={styles.benefitListColumn}>
            {items.map((benefit) => (
              <BenefitListItem
                key={benefit.id}                         
                brand={benefit.brand}
                description={benefit.description}
                detail={benefit.detail}
                imageSrc={benefit.imageSrc}
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
