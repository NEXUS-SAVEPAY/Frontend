// src/pages/HomePage.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useRecoilValue, useRecoilState } from 'recoil';

import { registeredCardsAtom } from '../recoil/atoms/CardRegisterAtom';
import { userPaymentsAtom } from '../recoil/atoms/userPaymentsAtom';
import { userTelcoInfoAtom } from '../recoil/atoms/userTelcoInfoAtom';
import { likedBrandsAtom } from '../recoil/atoms/likedBrandsAtom';

import SearchBar from '../components/Common/SearchBar';
import BenefitCard from '../components/Benefit/BenefitCard';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import TabBar from '../components/Common/TabBar';
import styles from './HomePage.module.css';

import recommendedBenefits from '../data/mockRecommendBenefits';
import favoriteBrandBenefits from '../data/favoriteBrandBenefits';

import logoImage from '../assets/images/logo-purple.svg';
import kakaopayImg from '../assets/images/kakaopay.png';
import sktImg from '../assets/images/skt.png';
import owlImage from '../assets/images/character.svg';

// ✅ API
import { getUserFavoriteBrands } from '../services/api/interestbrandApi';
import { fetchFavoriteBenefits } from '../services/api/favoriteBenefitApi';
import { fetchRecommendedBenefits } from '../services/api/benefitApi';

const norm = (s) => (s ?? '').toString().trim().replace(/\s+/g, ' ').toLowerCase();

function HomePage() {
  const navigate = useNavigate();
  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // ---------- 추천 혜택(서버) ----------
  const [recBenefits, setRecBenefits] = useState([]); // 서버 추천 혜택
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState('');

  const refreshRecommended = async () => {
    setRecLoading(true);
    setRecError('');
    try {
      const data = await fetchRecommendedBenefits();
      const list = Array.isArray(data?.result) ? data.result : [];
      const mapped = list.map((it) => ({
        id: it.id,
        brand: it.brandName,
        description: `${it.discountPercent}% ${it.discountType}`,
        imageSrc: it.brandImage || '',
      }));
      setRecBenefits(mapped);
      return mapped;
    } catch (e) {
      setRecError(e?.message || '추천 혜택을 불러오지 못했습니다.');
      setRecBenefits([]);
      return [];
    } finally {
      setRecLoading(false);
    }
  };

  // ---------- 서버 진실 동기화(관심 브랜드) ----------
  const [likedBrandsMirror, setLikedBrandsMirror] = useRecoilState(likedBrandsAtom); // 미러
  const [favBrands, setFavBrands] = useState([]); // [{ id, name, image }, ...]
  const [favLoading, setFavLoading] = useState(false);
  const [favError, setFavError] = useState('');

  const refreshFavorites = async () => {
    setFavLoading(true);
    setFavError('');
    try {
      const list = await getUserFavoriteBrands(); // 서버 진실
      setFavBrands(list);
      const mirrored = {};
      for (const b of list) mirrored[b.name] = true;
      setLikedBrandsMirror(mirrored);
      return list;
    } catch (e) {
      setFavError(e?.message || '관심 브랜드를 불러오지 못했습니다.');
      setFavBrands([]);
      return [];
    } finally {
      setFavLoading(false);
    }
  };

  // ---------- 서버 관심사 혜택(브랜드별 그룹) ----------
  const [benefitGroups, setBenefitGroups] = useState([]); // [{ brand, brandImage, benefits:[...] }, ...]
  const [benefitLoading, setBenefitLoading] = useState(false);
  const [benefitError, setBenefitError] = useState('');

  const refreshBenefits = async () => {
    setBenefitLoading(true);
    setBenefitError('');
    try {
      const groups = await fetchFavoriteBenefits(); // [{ brand, brandImage, benefits: [...] }]
      // ✅ 내가 등록한 관심 브랜드만 필터
      const likeSet = new Set((favBrands || []).map(b => (b?.name ?? '').trim().toLowerCase()));
      const filtered = groups.filter(g => likeSet.has((g.brand ?? '').trim().toLowerCase()));
      setBenefitGroups(filtered);
      return filtered;
    } catch (e) {
      setBenefitError(e?.message || '혜택을 불러오지 못했습니다.');
      setBenefitGroups([]);
      return [];
    } finally {
      setBenefitLoading(false);
    }
  };

  // 최초 진입 시: 관심 브랜드 → 관심 혜택 → 추천 혜택 순서로 보장
  useEffect(() => {
    (async () => {
      await refreshFavorites();
      await refreshBenefits();
      await refreshRecommended();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- 검색 ----------
  const [showNoResult, setShowNoResult] = useState(false);
  const handleSearch = (keyword) => {
    const brandName = (keyword ?? '').trim();
    if (!brandName) return;

    const serverHas = favBrands.some((b) => b.name === brandName);
    const localHas = favoriteBrandBenefits.some((b) => b.brand === brandName);

    if (serverHas || localHas) {
      navigate(`/benefit/${encodeURIComponent(brandName)}`);
    } else {
      setShowNoResult(true);
      setTimeout(() => setShowNoResult(false), 2000);
    }
  };

  // ---------- 결제수단(카드/간편/통신) ----------
  const registeredCards = useRecoilValue(registeredCardsAtom);
  const userPaymentRaw = useRecoilValue(userPaymentsAtom);
  const telcoInfo = useRecoilValue(userTelcoInfoAtom);

  const toArray = (v) => Array.isArray(v) ? v : (typeof v === 'string' && v ? [v] : []);
  const rawPays = toArray(userPaymentRaw).filter(v => v && v !== 'none');
  const payParents = [...new Set(rawPays.map(p => (typeof p === 'string' ? p.split('_')[0] : p)))];

  const PAYMENT_NAME = {
    kakao: '카카오페이',
    naver: '네이버페이',
    toss:  '토스페이',
    payco: '페이코',
  };
  const payIconMap = { kakao: kakaopayImg /* naver, toss, payco 아이콘 추가 가능 */ };
  const telcoIconMap = { 'SKT': sktImg /* 'KT': ktImg, 'LG U+': lguplusImg */ };

  const paymentItems = [
    ...(registeredCards || []).map(card => ({
      key: `card-${card.id}`,
      name: card.name,
      image: card.image,
      onClick: () => navigate('/benefit/cards'),
    })),
    ...payParents.map(p => ({
      key: `pay-${p}`,
      name: PAYMENT_NAME[p] || p,
      image: payIconMap[p],
      onClick: () => navigate('/benefit/simplepay'),
    })),
    ...(telcoInfo?.telco ? [{
      key: `telco-${telcoInfo.telco}`,
      name: telcoInfo.telco,
      image: telcoIconMap[telcoInfo.telco],
      onClick: () => navigate('/benefit/telco'),
    }] : []),
  ];

  // ---------- 홈 섹션 표시 조건 ----------
  const hasLikedBrands = favBrands.length > 0; // 서버 기준
  const hasAnyPayment = paymentItems.length > 0;

  // ---------- 표시용: 관심 브랜드 아이콘 그리드 ----------
  const likedBrandIconList = favBrands.map((b) => {
    const local = favoriteBrandBenefits.find((g) => g.brand === b.name);
    const imageSrc = b.image || local?.benefits?.[0]?.imageSrc || '';
    return { name: b.name, image: imageSrc };
  });

  // ---------- 표시용: 관심 브랜드 혜택 프리뷰 ----------
  // 서버 그룹을 평탄화해서 BenefitListItem에 공급
  const serverFlatBenefits = useMemo(() => {
    if (benefitGroups.length === 0) return [];
    return benefitGroups.flatMap((g) =>
      (g.benefits || []).map((b) => ({
        id: b.id,
        brand: g.brand,
        description: b.description,
        detail: b.detail,
        imageSrc: b.imageSrc,
        infoLink: b.infoLink,
      }))
    );
  }, [benefitGroups]);

  // 서버 실패 시 로컬 목데이터에서 "내 관심 브랜드만" 추려서 표시
  const serverNameSet = useMemo(() => {
    const s = new Set();
    for (const b of favBrands) s.add(norm(b.name));
    return s;
  }, [favBrands]);

  const localFlatBenefits = useMemo(() => {
    return favoriteBrandBenefits
      .filter((g) => serverNameSet.has(norm(g.brand)))
      .flatMap((g) =>
        g.benefits.map((b) => ({
          id: b.id,
          brand: g.brand,
          description: b.description,
          detail: b.detail,
          imageSrc: b.imageSrc,
        }))
      );
  }, [serverNameSet]);

  const previewBenefits = serverFlatBenefits.length > 0 ? serverFlatBenefits : localFlatBenefits;

  return (
    <div className={styles.container}>
      {showNoResult && (
        <div className={styles.toastMessage}>검색 결과가 없습니다</div>
      )}

      <div className={styles.fixedTop}>
        <div className={styles.logoWrapper}>
          <img src={logoImage} alt="SavePay 로고" className={styles.logo} />
        </div>
        <SearchBar 
          placeholder="혜택을 원하는 브랜드를 검색해주세요" 
          onSearch={handleSearch}
        />
      </div>

      <div className={styles.content}>
        {/* 추천 혜택 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h1 className={styles.title}>추천혜택</h1>
            <button 
              className={styles.viewAllButton}
              onClick={() => navigate('/benefit/recommended')}
            >
              전체 보기  〉
            </button>
          </div>
          <div className={styles.benefitList}>
            {recLoading && <span className={styles.dimText}>불러오는 중…</span>}
            {recError && !recLoading && (
              <span className={styles.errorText}>{recError} (임시로 로컬 데이터 표시)</span>
            )}
            {(recBenefits.length > 0 ? recBenefits : recommendedBenefits).map((benefit) => (
              <BenefitCard
                key={benefit.id}
                id={benefit.id}
                brand={benefit.brand}
                description={benefit.description}
                imageSrc={benefit.imageSrc}
              />
            ))}
          </div>
        </section>

        {/* 관심 브랜드 혜택 OR 결제 수단 혜택 */}
        <section className={styles.section2}>
          <div className={styles.sectionHeader}>
            <h1 className={styles.title}>
              {hasLikedBrands ? '관심 브랜드 혜택' : '결제 수단 혜택'}
            </h1>

            <button
              className={styles.viewAllButton}
              onClick={() =>
                hasLikedBrands
                  ? navigate('/benefit/favorites')
                  : navigate('/benefit/registered')
              }
            >
              전체 보기  〉
            </button>
          </div>

          {hasLikedBrands ? (
            <>
              {/* 🔹 서버 관심 브랜드 아이콘 그리드 */}
              <div className={styles.brandList}>
                {favLoading && <span className={styles.dimText}>불러오는 중…</span>}
                {favError && <span className={styles.errorText}>{favError}</span>}
                {!favLoading && !favError && likedBrandIconList.map((b) => (
                  <div
                    key={b.name}
                    className={styles.brandItem}
                    onClick={() => navigate(`/benefit/${encodeURIComponent(b.name)}`)}
                  >
                    <img src={b.image} alt={b.name} className={styles.brandIcon} />
                    <span className={styles.brandLabel}>{b.name}</span>
                  </div>
                ))}
              </div>

              {/* 🔹 관심 브랜드 혜택 프리뷰 (서버 우선, 실패 시 로컬 폴백) */}
              <div className={styles.listColumn}>
                {(benefitLoading && <span className={styles.dimText}>불러오는 중…</span>) ||
                 (benefitError && <span className={styles.errorText}>{benefitError}</span>)}
                {previewBenefits.map((benefit) => (
                  <BenefitListItem
                    key={benefit.id}
                    id={benefit.id}
                    brand={benefit.brand}
                    description={benefit.description}
                    detail={benefit.detail}
                    imageSrc={benefit.imageSrc}
                    infoLink={benefit.infoLink}
                  />
                ))}
              </div>
            </>
          ) : (
            hasAnyPayment ? (
              <>
                <div className={styles.brandList}>
                  {paymentItems.map((item) => (
                    <div key={item.key} className={styles.brandItem} onClick={item.onClick}>
                      <img src={item.image} alt={item.name} className={styles.brandIcon} />
                      <span className={styles.brandLabel}>{item.name}</span>
                    </div>
                  ))}
                </div>

                {/* 사용자의 결제수단 기반 혜택은 기존 로직 유지 */}
              </>
            ) : (
              <p className={styles.emptyText}>마이페이지에서 결제 수단을 먼저 등록해주세요.</p>
            )
          )}
        </section>
      </div>

      <div className={styles.owlButtonWrapper}>
        <img src={owlImage} alt="혜택 부엉이" className={styles.owlIcon} />
        <button className={styles.scrollTopButton} onClick={handleScrollTop}>↑</button>
      </div>
      <TabBar />
    </div>
  );
}

export default HomePage;
