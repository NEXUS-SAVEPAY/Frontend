// src/pages/BenefitDetailPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { selectedBenefitAtom } from '../recoil/atoms/selectedBenefitAtom';
import ExternalLinkModal from '../components/Modal/ExternalLinkModal';
import styles from './BenefitDetailPage.module.css';
import owlImage from '../assets/images/character.svg';
import { fetchBenefitDetail } from '../services/api/benefitDetailApi';
import { isCardDiscountId } from '../services/api/cardBenefitApi';

export default function BenefitDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const [isCardListId, setIsCardListId] = useState(false);

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
        if (!cancelled) setDetail(data?.result ?? null);
      } catch (e) {
        if (!cancelled) setError(e?.message || '상세 정보를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [isIdValid, discountId, idParam, legacyIdParam, selected?.id]);

  // /api/discount/card 포함 여부 (실패 시 false로 안전 처리)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isIdValid) {
        if (mounted) setIsCardListId(false);
        return;
      }
      try {
        const maybeNum = /^\d+$/.test(String(discountId)) ? Number(discountId) : discountId;
        const ok = await isCardDiscountId(maybeNum);
        if (mounted) setIsCardListId(!!ok);
      } catch {
        if (mounted) setIsCardListId(false);
      }
    })();
    return () => { mounted = false; };
  }, [isIdValid, discountId]);

  // API 응답(우선) 또는 selected fallback
  const src = detail ?? (isIdValid ? null : selected);

  // 진입 경로 기반 카드 판정
  const isFromCardList = useMemo(() => {
    const byState =
      location?.state?.source === 'card' ||
      location?.state?.sourceType === 'card';
    const byQuery =
      new URLSearchParams(location?.search || '').get('source') === 'card';
    const byPath = /\/benefit\/cards/i.test(location?.pathname || '');
    const bySelected =
      selected?.__from === 'card' || selected?.source === 'card';
    return !!(byState || byQuery || byPath || bySelected);
  }, [location?.state, location?.search, location?.pathname, selected]);

  // 🔸 외부 링크가 없으면 카드 혜택 간주
  const noExternalLink = useMemo(() => {
    const link =
      (src?.externalUrl ?? '') || (src?.infoLink ?? '');
    return !String(link).trim();
  }, [src]);

  // 최종 카드 여부
  const isCardBenefit = isCardListId || isFromCardList || noExternalLink;

  // -------- View 모델 --------
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

    // 카드 혜택이면 외부 이동 비활성화
    const externalUrlRaw = src.externalUrl || src.infoLink || '';
    const externalUrl = isCardBenefit ? '' : externalUrlRaw;

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
  }, [src, isCardBenefit]);

  // CTA 라벨 및 동작
  const ctaLabelTop = isCardBenefit ? '해당 카드로 결제해주세요' : '혜택 받기 >';
  const ctaLabelBottom = isCardBenefit ? '해당 카드로 결제해주세요' : '혜택 받으러 이동하기';

  const handleCtaClick = () => {
    if (isCardBenefit) return;
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    if (view?.externalUrl) {
      window.open(view.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) return null;
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
            <div className={styles.owlButtonWrapper}>
              <img src={owlImage} alt="혜택 부엉이" className={styles.owlIcon} />
              <button
                onClick={handleCtaClick}
                className={styles.inlineButton}
                disabled={isCardBenefit}
                aria-disabled={isCardBenefit}
              >
                {ctaLabelTop}
              </button>
            </div>
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

        <button
          onClick={handleCtaClick}
          className={styles.bottomButton}
          disabled={isCardBenefit}
          aria-disabled={isCardBenefit}
        >
          {ctaLabelBottom}
        </button>

        <ExternalLinkModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}
