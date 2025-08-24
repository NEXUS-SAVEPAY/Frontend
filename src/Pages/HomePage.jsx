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

import recommendedBenefits from '../data/mockRecommendBenefits';   // 예: 카드 연계 추천(카드 섹션 대체용)
import favoriteBrandBenefits from '../data/favoriteBrandBenefits'; // 예: 관심 브랜드 섹션(일반 혜택)

// 필요시 로고/이미지
// import logoImage from '../assets/images/logo-purple.svg';
// import kakaopayImg from '../assets/images/kakaopay.png';
// import sktImg from '../assets/images/skt.png';
// import owlImage from '../assets/images/character.svg';

// 만약 API를 사용 중이라면(예: /api/discount/card) 이 섹션에서 받아온 배열을 cardBenefits로 사용
// import { fetchCardBenefits } from '../services/api/cardBenefitApi';

export default function HomePage() {
  const navigate = useNavigate();

  // 전역 상태 (필요 시)
  const registeredCards = useRecoilValue(registeredCardsAtom);
  const userPayments = useRecoilValue(userPaymentsAtom);
  const userTelcoInfo = useRecoilValue(userTelcoInfoAtom);
  const [likedBrands] = useRecoilState(likedBrandsAtom);

  // 로컬 상태
  const [cardBenefits, setCardBenefits] = useState([]);       // 카드 혜택 섹션(여기에만 source="card")
  const [favGroups, setFavGroups] = useState([]);             // 관심 브랜드 혜택(일반 혜택)

  // ----- 데이터 로딩 (예시) -----
  useEffect(() => {
    // 실제 API가 있다면 교체:
    // (async () => {
    //   const list = await fetchCardBenefits();
    //   setCardBenefits(list);
    // })();

    // 여기서는 기존 mock을 카드 혜택 섹션 대체로 사용 (예시)
    setCardBenefits(Array.isArray(recommendedBenefits) ? recommendedBenefits : []);

    // 관심 브랜드 혜택은 기존에 홈에서 사용 중인 데이터/favoriteBenefitApi에서 가져온 가공 결과를 연결
    // 홈에서 이미 favoriteBenefitApi의 결과를 쓰고 있다면 그 결과를 넣어주세요.
    // 여기서는 기존 mock 데이터를 사용 (예시)
    setFavGroups(Array.isArray(favoriteBrandBenefits) ? favoriteBrandBenefits : []);
  }, []);

  // ----- 렌더 유틸: 안전한 배열 -----
  const safeCardBenefits = useMemo(
    () => (Array.isArray(cardBenefits) ? cardBenefits : []),
    [cardBenefits]
  );

  const safeFavGroups = useMemo(
    () => (Array.isArray(favGroups) ? favGroups : []),
    [favGroups]
  );

  // ----- Render -----
  return (
    <div className={styles.page}>
      {/* 검색바 */}
      <div className={styles.searchBarWrapper}>
        <SearchBar
          placeholder="브랜드 또는 혜택을 검색해보세요"
          onSubmit={(keyword) => navigate(`/search?keyword=${encodeURIComponent(keyword)}`)}
        />
      </div>

      {/* 추천/카드 혜택 섹션: 상세로 이동 시 state: { source: 'card' } 전달 */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>내 카드로 받을 수 있는 혜택</h3>
        <div className={styles.horizontalScroll}>
          {safeCardBenefits.map((b) => (
            <BenefitCard
              key={b.id}
              id={b.id}
              brand={b.brand}
              description={b.description}
              imageSrc={b.imageSrc}
              source="card" // ★ A안 핵심: 카드 섹션만 source="card"
            />
          ))}
        </div>
      </section>

      {/* 관심 브랜드 혜택(일반 혜택) — state 전달하지 않음 */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>관심 브랜드 혜택</h3>
        <div className={styles.verticalList}>
          {safeFavGroups.map((group) => (
            <div key={group.brand} className={styles.brandGroup}>
              <div className={styles.brandHeader}>
                <span className={styles.brandName}>{group.brand}</span>
              </div>
              <div className={styles.brandBenefits}>
                {(group.benefits || []).map((it) => (
                  <BenefitListItem
                    key={it.id}
                    id={it.id}
                    brand={group.brand}
                    description={it.description}
                    detail={it.detail}
                    imageSrc={it.imageSrc}
                    // ★ 일반 혜택이므로 source 전달 X (중요)
                    // source={undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 하단 탭 */}
      <TabBar />
    </div>
  );
}
