// src/pages/BenefitDetailPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate, useParams } from 'react-router-dom';
import { selectedBenefitAtom } from '../recoil/atoms/selectedBenefitAtom';
import ExternalLinkModal from '../components/Modal/ExternalLinkModal';
import styles from './BenefitDetailPage.module.css';
import owlImage from '../assets/images/character.svg';
import { fetchBenefitDetail } from '../services/api/benefitDetailApi';

export default function BenefitDetailPage() {
  const navigate = useNavigate();
  const { brand, discountId: idParam, id: legacyIdParam } = useParams();
  const selected = useRecoilValue(selectedBenefitAtom);

  const discountId = String(
    idParam ?? legacyIdParam ?? selected?.id ?? selected?.discountId ?? ''
  ).trim();
  const isIdValid =
    discountId &&
    discountId.toLowerCase() !== 'undefined' &&
    discountId.toLowerCase() !== 'null';

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isIdValid && selected?.id) {
      const brandForUrl = selected.brand ?? selected.brandName ?? 'brand';
      navigate(`/benefit/${encodeURIComponent(brandForUrl)}/${selected.id}`, { replace: true });
    }
  }, [isIdValid, selected?.id, selected?.brand, selected?.brandName, navigate]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!isIdValid) {
        setDetail(null);
        setLoading(false);
        setError('URL에 유효한 discountId가 없습니다.');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const data = await fetchBenefitDetail(discountId);
        if (!cancelled) setDetail(data.result ?? null);
      } catch (e) {
        if (!cancelled) setError(e.message || '상세 정보를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [isIdValid, discountId, idParam, legacyIdParam, selected?.id]);

  const src = detail ?? (isIdValid ? null : selected);

  // ✅ 카드 혜택 여부
  const isCardBenefit = useMemo(() => {
    const hint = [
      src?.type,
      src?.paymentType,
      src?.category,
      src?.registeredType,
      src?.benefitType,
    ]
      .filter(Boolean)
      .map(String)
      .join('|')
      .toLowerCase();

    return /card|카드/.test(hint);
  }, [src]);

  const view = useMemo(() => {
    if (!src) return null;
    const title =
      src.title ||
      (src.brandName && src.discountPercent != null
        ? `${src.brandName} ${src.discountType ?? ''} ${src.discountPercent}%`
        : (src.brandName ?? '혜택 상세'));
    const description = src.description || src.details || '';
    const point = src.point ?? src.pointInfo ?? '';
    const cashback =
      src.cashback ??
      (src.discountPercent != null
        ? `${src.discountPercent}% ${src.discountType ?? ''}`.trim()
        : '');
    const steps =
      Array.isArray(src.instructions)
        ? src.instructions
        : Array.isArray(src.steps)
        ? src.steps
        : typeof src.details === 'string'
        ? src.details.split(/\r?\n|•/g).map(s => s.trim()).filter(Boolean)
        : [];
    const externalUrl = src.externalUrl || src.infoLink || '';

    return {
      brand: src.brand || src.brandName || '',
      brandImage: src.brandImage || '',
      title,
      description,
      point,
      cashback,
      steps,
      externalUrl,
    };
  }, [src]);

  const handleConfirm = () => {
    setShowModal(false);
    if (view?.externalUrl) window.open(view.externalUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) return <div className={styles.pageWrapper}>불러오는 중…</div>;
  if (error) return <div className={styles.pageWrapper}>🚨 {error}</div>;
  if (!view) return <div className={styles.pageWrapper}>혜택 정보가 없습니다.</div>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.fixedHeader}>
        <div className={styles.header}>
          <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
          <h2 className={styles.title}>혜택 상세 보기</h2>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.summaryBox}>
          {view.brand && <span className={styles.brandTag}>{view.brand}</span>}
          <h2 className={styles.benefitTitle}>{view.title}</h2>

          <div className={styles.subTextRow}>
            {view.description && <p className={styles.subText}>{view.description}</p>}
            {/* 🦉 카드 혜택일 땐 부엉이/버튼 자체를 DOM에 넣지 않음 */}
            {!isCardBenefit && (
              <div className={styles.owlButtonWrapper}>
                <img src={owlImage} alt="혜택 부엉이" className={styles.owlIcon} />
                <button onClick={() => setShowModal(true)} className={styles.inlineButton}>
                  혜택 받기 &gt;
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>혜택 내역</div>
          <div className={styles.benefitGrid}>
            {view.cashback && (
              <div className={styles.benefitBox}>
                <div className={styles.label}>캐시백</div>
                <div className={styles.value}>{view.cashback}</div>
              </div>
            )}
            {view.point && (
              <div className={styles.benefitBox}>
                <div className={styles.label}>포인트</div>
                <div className={styles.value}>{view.point}</div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>혜택 받는 방법</div>
          <div className={styles.instructionContainer}>
            <ol className={styles.instructionList}>
              {(view.steps ?? []).map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* 카드 혜택이면 CTA 버튼도 DOM에 없음 */}
        {!isCardBenefit && (
          <button onClick={() => setShowModal(true)} className={styles.bottomButton}>
            혜택 받으러 이동하기
          </button>
        )}

        {!isCardBenefit && (
          <ExternalLinkModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    </div>
  );
}
