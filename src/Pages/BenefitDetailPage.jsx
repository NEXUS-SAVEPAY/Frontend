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

  // 🔎 라우트 파라미터 수신 즉시 확인
  useEffect(() => {
    console.log('[BenefitDetail] useParams', { brand, idParam, legacyIdParam });
  }, [brand, idParam, legacyIdParam]);

  // ✅ 모든 소스(idParam / legacy / recoil)에서 모아 정규화
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

  // URL에 id가 없고 recoil에 선택값이 있으면 URL 자동 보정(선택)
  useEffect(() => {
    if (!isIdValid && selected?.id) {
      const brandForUrl = selected.brand ?? selected.brandName ?? 'brand';
      console.debug('[BenefitDetail] 보정 리다이렉트', { brandForUrl, id: selected.id });
      navigate(`/benefit/${encodeURIComponent(brandForUrl)}/${selected.id}`, { replace: true });
    }
  }, [isIdValid, selected?.id, selected?.brand, selected?.brandName, navigate]);

  // 서버 조회
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!isIdValid) {
        setDetail(null);
        setLoading(false);
        setError('URL에 유효한 discountId가 없습니다. (예: /benefit/{brand}/{id})');
        console.error('[BenefitDetail] invalid id param', {
          idParam,
          legacyIdParam,
          selectedId: selected?.id,
        });
        return;
      }
      setLoading(true);
      setError('');
      try {
        console.debug('[BenefitDetail] 요청 시작', { discountId });
        const data = await fetchBenefitDetail(discountId);
        if (!cancelled) {
          console.debug('[BenefitDetail] 응답', data);
          setDetail(data.result ?? null);
        }
      } catch (e) {
        if (!cancelled) {
          console.error('[BenefitDetail] 오류', e);
          setError(e.message || '상세 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [isIdValid, discountId, idParam, legacyIdParam, selected?.id]);

  const src = detail ?? (isIdValid ? null : selected);

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

  if (loading) return <div className={styles.pageWrapper}>불러오는 중… (id: {discountId})</div>;

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.fixedHeader}>
          <div className={styles.header}>
            <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
            <h2 className={styles.title}>혜택 상세 보기</h2>
          </div>
        </div>
        <div className={styles.content}>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            🚨 혜택 정보를 불러올 수 없습니다.
            {'\n'}사유: {error}
            {'\n'}brand: {String(brand ?? '')}
            {'\n'}idParam: {String(idParam ?? '')}
            {'\n'}legacyIdParam: {String(legacyIdParam ?? '')}
            {'\n'}normalized discountId: {String(discountId)}
          </div>
        </div>
      </div>
    );
  }

  if (!view) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.content}>
          혜택 정보가 없습니다. (id: {discountId})
        </div>
      </div>
    );
  }

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
              <button onClick={() => setShowModal(true)} className={styles.inlineButton}>
                혜택 받기 &gt;
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

        <button onClick={() => setShowModal(true)} className={styles.bottomButton}>
          혜택 받으러 이동하기
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
