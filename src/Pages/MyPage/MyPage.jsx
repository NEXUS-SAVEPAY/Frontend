// src/pages/MyPage/MyPage.jsx (경로만 너 프로젝트에 맞게)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { likedBrandsAtom } from '../../recoil/atoms/likedBrandsAtom';
import { registeredCardsAtom } from '../../recoil/atoms/CardRegisterAtom';
import { userPaymentsAtom } from '../../recoil/atoms/userPaymentsAtom';
import { userTelcoInfoAtom } from '../../recoil/atoms/userTelcoInfoAtom';

import styles from './MyPage.module.css';
import PaymentMethodSection from './PaymentMethodSection';
import BrandSection from './BrandSection';
import NotificationSection from './NotificationSection';
import TabBar from '../../components/Common/TabBar';

import cardImg from '../../assets/images/card.png';
import kakaopayImg from '../../assets/images/kakaopay.png';
import sktImg from '../../assets/images/skt.png';
import oliveyoungImg from '../../assets/images/oliveyoung.svg';
import starbucksImg from '../../assets/images/starbucks.svg';
import megaboxImg from '../../assets/images/megabox.svg';

import { fetchRegisteredCards } from '../../services/api/cardApi'; // ✅ 추가

function MyPage() {
  const navigate = useNavigate();

  // 관심 브랜드
  const likedBrands = useRecoilValue(likedBrandsAtom);
  const likedBrandList = Object.entries(likedBrands)
    .filter(([, isLiked]) => isLiked)
    .map(([brand]) => brand);

  const handleAddBrand = () => navigate('/favorite-brand');
  const handleBrandClick = (brandName) => navigate(`/benefit/${encodeURIComponent(brandName)}`);

  // 간편결제/통신사
  const getPaymentImage = (type) => {
    switch (type) {
      case 'kakao': return kakaopayImg;
      case 'naver': return null;
      case 'toss':  return null;
      case 'payco': return null;
      default: return null;
    }
  };
  const getTelcoImage = (telco) => {
    switch (telco) {
      case 'SKT': return sktImg;
      case 'KT': return null;
      case 'LG U+': return null;
      case '알뜰폰': return null;
      default: return null;
    }
  };

  // ✅ 카드 목록: 전역 상태 + 서버 동기화
  const setRegisteredCards = useSetRecoilState(registeredCardsAtom);
  const registeredCards = useRecoilValue(registeredCardsAtom);

  const userPaymentRaw = useRecoilValue(userPaymentsAtom);
  const userTelcoInfo = useRecoilValue(userTelcoInfoAtom);

  // ✅ 서버 카드 목록 불러오기 (머지, 중복 제거)
  const [loadingCards, setLoadingCards] = useState(false);
  const [cardsError, setCardsError] = useState('');
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCards(true);
        setCardsError('');
        const serverCards = await fetchRegisteredCards();
        if (!mounted) return;
        setRegisteredCards((prev) => {
          if (!Array.isArray(serverCards) || serverCards.length === 0) return prev; // 서버 비어있으면 유지
          const keyOf = (c) => String(c?.id ?? `${c?.company ?? ''}::${c?.name ?? ''}`);
          const map = new Map();
          [...prev, ...serverCards].forEach((c) => map.set(keyOf(c), c));
          return Array.from(map.values());
        });
      } catch (e) {
        if (mounted) setCardsError(e.message || '카드 목록을 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoadingCards(false);
      }
    })();
    return () => { mounted = false; };
  }, [setRegisteredCards]);

  // ✅ 간편결제 값: 항상 배열로 정규화 + 'none' 제거
  const toArray = (v) => Array.isArray(v) ? v : (typeof v === 'string' && v ? [v] : []);
  const userPayments = toArray(userPaymentRaw).filter(v => v && v !== 'none');

  // ✅ 서브옵션 선택 시 부모 숨김
  const parentsWithSubs = new Set(
    userPayments.filter(v => v.includes('_')).map(v => v.split('_')[0])
  );
  const displayPayments = userPayments.filter(v => {
    const isParent = !v.includes('_');
    return !(isParent && parentsWithSubs.has(v));
  });

  const PAYMENT_NAME = {
    kakao: '카카오페이',
    naver: '네이버페이',
    toss:  '토스페이',
    payco: '페이코',
  };
  const SUBOPTION_LABELS = {
    naver_membership: '멤버십',
    toss_prime: '프라임',
  };

  const groupedMethods = [
    {
      type: '카드',
      items: registeredCards.map((card) => ({
        id: card.id,
        name: card.name,
        image: card.image || cardImg, // ✅ placeholder
        tag: card.company,
      })),
    },
    {
      type: '간편결제',
      items: displayPayments.map((p, idx) => {
        const parent = p.split('_')[0];
        return {
          id: `simplepay_${p}_${idx}`,
          name: PAYMENT_NAME[parent] || parent,
          image: getPaymentImage(parent),
          tag: SUBOPTION_LABELS[p] ? SUBOPTION_LABELS[p] : '멤버십 없음',
        };
      }),
    },
    {
      type: '통신사',
      items: userTelcoInfo?.telco ? [{
        id: 'telco',
        name: userTelcoInfo.telco,
        image: getTelcoImage(userTelcoInfo.telco),
        tag: userTelcoInfo.hasMembership ? (userTelcoInfo.grade || '') : '멤버십 없음',
      }] : [],
    },
  ];

  // ❌ 기존 handleDelete는 setMethods를 참조해 오류 → 읽기 전용이라 삭제 핸들러 제거/무시
  const handleDelete = () => {};

  const [brandList] = useState([
    { name: '올리브영', image: oliveyoungImg },
    { name: '스타벅스', image: starbucksImg },
    { name: '메가박스', image: megaboxImg },
  ]);

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.title}>마이페이지</h2>

      <div className={styles.headerRow}>
        <h3 className={styles.sectionTitle}>내 결제 수단</h3>
        <button
          className={styles.changeButton}
          onClick={() => navigate('/manage-payment')}
        >
          결제 수단 변경 <span className={styles.arrow}></span>
        </button>
      </div>

      {loadingCards && <p className={styles.helperText}>등록된 카드를 불러오는 중…</p>}
      {cardsError && <p className={styles.errorText}>{cardsError}</p>}

      <PaymentMethodSection
        groupedMethods={groupedMethods}
        onDelete={handleDelete}  // 읽기 전용이면 이 prop 제거해도 됨
      />

      <BrandSection
        brands={likedBrandList}
        onAdd={handleAddBrand}
        onBrandClick={handleBrandClick}
      />
      <NotificationSection />
      <TabBar />
    </div>
  );
}

export default MyPage;
