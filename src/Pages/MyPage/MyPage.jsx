// src/pages/MyPage/MyPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';

import { likedBrandsAtom } from '../../recoil/atoms/likedBrandsAtom';
import { registeredCardsAtom } from '../../recoil/atoms/CardRegisterAtom';
import { userPaymentsAtom } from '../../recoil/atoms/userPaymentsAtom';
import { userTelcoInfoAtom } from '../../recoil/atoms/userTelcoInfoAtom';
import { fetchUserTelco } from '../../services/api/telcoService';

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

import { fetchRegisteredCards } from '../../services/api/cardApi';
import { fetchSimplePays } from '../../services/api/payApi'; // ✅ 추가

function MyPage() {
  const navigate = useNavigate();

  // 관심 브랜드
  const likedBrands = useRecoilValue(likedBrandsAtom);
  const likedBrandList = Object.entries(likedBrands)
    .filter(([, isLiked]) => isLiked)
    .map(([brand]) => brand);

  const handleAddBrand = () => navigate('/favorite-brand');
  const handleBrandClick = (brandName) => navigate(`/benefit/${encodeURIComponent(brandName)}`);

  // 이미지 매핑
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

    // 카드 목록
    const setRegisteredCards = useSetRecoilState(registeredCardsAtom);
    // 간편결제/통신사
    const setUserPayment = useSetRecoilState(userPaymentsAtom);

    const registeredCards = useRecoilValue(registeredCardsAtom);
    const userPaymentRaw = useRecoilValue(userPaymentsAtom); // 배열/문자열 둘 다 올 수 있음
    const [userTelcoInfo, setUserTelcoInfo] = useRecoilState(userTelcoInfoAtom);

    useEffect(() => {
        async function loadTelco() {
            const telcoRes = await fetchUserTelco();
            if (telcoRes.isSuccess && telcoRes.result) {
                setUserTelcoInfo({
                    telco: telcoRes.result.telecomName,
                    hasMembership: telcoRes.result.isMembership,
                    grade: telcoRes.result.grade,
                });
            }
        }
        loadTelco();
    }, [setUserTelcoInfo]);



  // 서버 카드 목록 불러오기
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
          if (!Array.isArray(serverCards) || serverCards.length === 0) return prev;
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

  // ✅ 서버 간편결제 불러와 Recoil 반영
  const [loadingPays, setLoadingPays] = useState(false);
  const [paysError, setPaysError] = useState('');
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingPays(true);
        setPaysError('');
        const selectedFromServer = await fetchSimplePays();
        if (!mounted) return;
        // 서버 값을 그대로 반영(서버 권위) — 필요 시 로컬과 병합 로직으로 바꿀 수 있음
        setUserPayment(selectedFromServer);
      } catch (e) {
        if (mounted) setPaysError(e.message || '간편결제 정보를 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoadingPays(false);
      }
    })();
    return () => { mounted = false; };
  }, [setUserPayment]);

  // 항상 배열로 정규화 + none 제거
  const toArray = (v) => Array.isArray(v) ? v : (typeof v === 'string' && v ? [v] : []);
  const userPayments = toArray(userPaymentRaw).filter(v => v && v !== 'none');

  // 서브옵션이 있으면 부모 숨김
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
        image: card.image || cardImg,
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
      {loadingPays && <p className={styles.helperText}>간편결제를 불러오는 중…</p>}
      {paysError && <p className={styles.errorText}>{paysError}</p>}

      <PaymentMethodSection
        groupedMethods={groupedMethods}
        onDelete={handleDelete}
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
