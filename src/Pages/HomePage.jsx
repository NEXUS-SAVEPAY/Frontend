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
import { fetchInterestOrPaymentBenefits } from '../services/api/interestOrPaymentApi';
import { checkUserHasFavoriteBrands } from '../services/api/interestbrandApi';
import { fetchDiscountsByBrand } from '../services/api/discountApi';

const norm = (s) => (s ?? '').toString().trim().replace(/\s+/g, ' ').toLowerCase();
const MAX_PREVIEW = 6; // 홈 프리뷰 개수 제한

function HomePage() {
  const navigate = useNavigate();
  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // ---------- 추천 혜택(서버) ----------
  const [recBenefits, setRecBenefits] = useState([]);
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
        // 추천 섹션은 source를 전달하지 않음
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
      setFavBrands(Array.isArray(list) ? list : []);
      const mirrored = {};
      for (const b of list || []) mirrored[b.name] = true;
      setLikedBrandsMirror(mirrored);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      setFavError(e?.message || '관심 브랜드를 불러오지 못했습니다.');
      setFavBrands([]);
      setLikedBrandsMirror({});
      return [];
    } finally {
      setFavLoading(false);
    }
  };

  // ---------- 서버 관심사 혜택(브랜드별 그룹) ----------
  const [benefitGroups, setBenefitGroups] = useState([]); // [{ brand, brandImage, benefits:[...] }, ...]
  const [benefitLoading, setBenefitLoading] = useState(false);
  const [benefitError, setBenefitError] = useState('');

  // ✨ favsFromServer를 인자로 받아 최신 목록 기준으로 필터
  const refreshBenefits = async (favsFromServer = []) => {
    setBenefitLoading(true);
    setBenefitError('');
    try {
      const groups = await fetchFavoriteBenefits(); // [{ brand, brandImage, benefits: [...] }]
      const likeSet = new Set((favsFromServer || []).map(b => norm(b?.name)));
      let filtered = groups;
      if (likeSet.size > 0) {
        const inter = groups.filter(g => likeSet.has(norm(g.brand)));
        filtered = inter.length > 0 ? inter : groups;
      }
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

  // ---------- 관심브랜드 or 결제수단 혜택 (새 API) ----------
  const [interestOrPaymentBenefits, setInterestOrPaymentBenefits] = useState([]);
  const [hasLikedBrandsByApi, setHasLikedBrandsByApi] = useState(false);

  const refreshInterestOrPayment = async () => {
    try {
      const check = await checkUserHasFavoriteBrands();
      const data = await fetchInterestOrPaymentBenefits();
      const list = Array.isArray(data?.result) ? data.result : [];
      setInterestOrPaymentBenefits(list);

      if (check?.result === true) setHasLikedBrandsByApi(true);
      else if (check?.result === false) setHasLikedBrandsByApi(false);
      else setHasLikedBrandsByApi(false);
    } catch (e) {
      console.error('[HomePage] interest-or-payment API error:', e);
      setInterestOrPaymentBenefits([]);
      setHasLikedBrandsByApi(false);
    }
  };

  // 🔹 아이콘용: 브랜드 중복 제거 (브랜드당 1개)
  const uniqueBrandIcons = useMemo(() => {
    const map = new Map(); // key: normalized brandName
    for (const b of interestOrPaymentBenefits || []) {
      const key = norm(b?.brandName);
      if (!key) continue;
      if (!map.has(key)) {
        map.set(key, {
          brandName: b.brandName,
          brandImage: b.brandImage || '',
        });
      }
    }
    return Array.from(map.values());
  }, [interestOrPaymentBenefits]);

  // ---------- 결제수단(카드/간편/통신) ----------
  const registeredCards = useRecoilValue(registeredCardsAtom);
  const userPaymentRaw = useRecoilValue(userPaymentsAtom);
  const telcoInfo = useRecoilValue(userTelcoInfoAtom);

  const normalizeSimplePays = (raw) => {
    const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const set = new Set();

    for (const it of arr) {
      if (!it) continue;

      if (typeof it === 'string') {
        const parent = it.split('_')[0];
        if (parent) set.add(parent.toLowerCase());
        continue;
      }

      if (typeof it === 'object') {
        const prov = (it.provider ?? '').toString().trim().toLowerCase();
        if (prov) set.add(prov);
        continue;
      }
    }

    return [...set];
  };

  const payParents = useMemo(() => normalizeSimplePays(userPaymentRaw), [userPaymentRaw]);

  const PAYMENT_NAME = {
    kakao: '카카오페이',
    naver: '네이버페이',
    toss:  '토스페이',
    payco: '페이코',
  };
  const payIconMap = { kakao: kakaopayImg };
  const telcoIconMap = { 'SKT': sktImg };

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

  // 최초 진입 시: 관심 브랜드 → 관심 혜택 → 추천 혜택 순서 보장
  useEffect(() => {
    (async () => {
      const favs = await refreshFavorites();
      await refreshBenefits(favs);
      await refreshRecommended();
      await refreshInterestOrPayment();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로딩 상태 하나라도 true면 흰 화면
  const isLoadingAll = recLoading || favLoading || benefitLoading || interestOrPaymentBenefits.length === 0;

  // ---------- 검색 ----------
  const [showNoResult, setShowNoResult] = useState(false);
  const handleSearch = async (keyword) => {
    const brandName = (keyword ?? '').trim();
    if (!brandName) return;

    try {
      const data = await fetchDiscountsByBrand(brandName);
      if (Array.isArray(data?.result) && data.result.length > 0) {
        navigate(`/benefit/${encodeURIComponent(brandName)}`);
      } else {
        setShowNoResult(true);
        setTimeout(() => setShowNoResult(false), 2000);
      }
    } catch (e) {
      console.error('[HomePage] 검색 API 오류', e);
      setShowNoResult(true);
      setTimeout(() => setShowNoResult(false), 2000);
    }
  };

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
  const serverFlatBenefits = useMemo(() => {
    if (benefitGroups.length === 0) return [];
    const flat = benefitGroups.flatMap((g) =>
      (g.benefits || []).map((b) => ({
        id: b.id,
        brand: g.brand,
        description: b.description,
        detail: b.detail,
        imageSrc: b.imageSrc || g.brandImage,
        infoLink: b.infoLink,
        pointInfo: b.pointInfo,
        createdAt: b.createdAt,
      }))
    );
    return flat.slice(0, MAX_PREVIEW);
  }, [benefitGroups]);

  const serverNameSet = useMemo(() => {
    const s = new Set();
    for (const b of favBrands) s.add(norm(b.name));
    return s;
  }, [favBrands]);

  const localFlatBenefits = useMemo(() => {
    const flat = favoriteBrandBenefits
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
    return flat.slice(0, MAX_PREVIEW);
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
        {isLoadingAll ? (
          null
        ) : (
          <>
            {/* 추천 혜택 (source 전달 X) */}
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
                {recError ? (
                  recommendedBenefits.map((benefit) => (
                    <BenefitCard
                      key={benefit.id}
                      id={benefit.id}
                      brand={benefit.brand}
                      description={benefit.description}
                      imageSrc={benefit.imageSrc}
                      // source 전달 안 함
                    />
                  ))
                ) : (
                  recBenefits.map((benefit) => (
                    <BenefitCard
                      key={benefit.id}
                      id={benefit.id}
                      brand={benefit.brand}
                      description={benefit.description}
                      imageSrc={benefit.imageSrc}
                      // source 전달 안 함
                    />
                  ))
                )}
              </div>
            </section>

            {/* 관심 브랜드 혜택 OR 결제 수단 혜택 */}
            <section className={styles.section2}>
              <div className={styles.sectionHeader}>
                <h1 className={styles.title}>
                  {hasLikedBrandsByApi ? '관심 브랜드 혜택' : '결제 수단 혜택'}
                </h1>

                <button
                  className={styles.viewAllButton}
                  onClick={() =>
                    hasLikedBrandsByApi
                      ? navigate('/benefit/favorites')
                      : navigate('/benefit/registered')
                  }
                >
                  전체 보기 〉
                </button>
              </div>

              {hasLikedBrandsByApi ? (
                <>
                  {/* 🔹 관심 브랜드 아이콘 (중복 제거) */}
                  <div className={styles.brandList}>
                    {uniqueBrandIcons.map((item) => (
                      <div
                        key={item.brandName}
                        className={styles.brandItem}
                        onClick={() =>
                          navigate(`/benefit/${encodeURIComponent(item.brandName)}`)
                        }
                      >
                        <img
                          src={item.brandImage || ''}
                          alt={item.brandName}
                          className={styles.brandIcon}
                          onError={(e) => (e.currentTarget.src = '')}
                        />
                        <span className={styles.brandLabel}>{item.brandName}</span>
                      </div>
                    ))}
                  </div>

                  {/* 혜택 리스트 — 여기서만 CARD 항목에 state 전달 */}
                  <div className={styles.listColumn}>
                    {interestOrPaymentBenefits.map((b) => (
                      <BenefitListItem
                        key={b.id}
                        id={b.id}
                        brand={b.brandName}
                        description={`${b.discountPercent}% ${b.discountType}`}
                        detail={b.details}
                        imageSrc={b.brandImage}
                        infoLink={b.infoLink}
                        pointInfo={b.pointInfo}
                        createdAt={b.createdAt}
                        source={b.source === 'CARD' ? 'card' : undefined}  // ★ 핵심
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* 결제수단 아이콘 */}
                  <div className={styles.brandList}>
                    {paymentItems.map((item) => (
                      <div
                        key={item.key}
                        className={styles.brandItem}
                        onClick={item.onClick}
                      >
                        <img
                          src={item.image || ''}
                          alt={item.name}
                          className={styles.brandIcon}
                          onError={(e) => (e.currentTarget.src = '')}
                        />
                        <span className={styles.brandLabel}>{item.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* 결제수단별 혜택 — CARD만 state 전달 */}
                  <div className={styles.listColumn}>
                    {interestOrPaymentBenefits.map((b) => (
                      <BenefitListItem
                        key={b.id}
                        id={b.id}
                        brand={b.source}  // PAY / CARD / TELCO 등
                        description={`${b.brandName} ${b.discountPercent}% ${b.discountType}`}
                        detail={b.details}
                        imageSrc={b.brandImage}
                        source={b.source === 'CARD' ? 'card' : undefined}  // ★ 핵심
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
          </>
        )}
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
