// src/pages/MyPage/MyPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';

import { likedBrandsAtom } from '../../recoil/atoms/likedBrandsAtom';
import { registeredCardsAtom } from '../../recoil/atoms/CardRegisterAtom';
import { userPaymentsAtom } from '../../recoil/atoms/userPaymentsAtom';
import { userTelcoInfoAtom } from '../../recoil/atoms/userTelcoInfoAtom';

import { fetchUserTelco } from '../../services/api/telcoService';
import { fetchRegisteredCards } from '../../services/api/cardApi';
import { fetchSimplePays } from '../../services/api/payApi';

import styles from './MyPage.module.css';
import PaymentMethodSection from './PaymentMethodSection';
import BrandSection from './BrandSection';
import NotificationSection from './NotificationSection';
import TabBar from '../../components/Common/TabBar';

import cardImg from '../../assets/images/card.png';
import kakaopayImg from '../../assets/images/kakaopay.png';
import sktImg from '../../assets/images/skt.png';

function MyPage() {
  const navigate = useNavigate();

  // 관심 브랜드
  const likedBrands = useRecoilValue(likedBrandsAtom);
  const likedBrandList = Object.entries(likedBrands)
    .filter(([, isLiked]) => isLiked)
    .map(([brand]) => brand);

  const handleAddBrand = () => navigate('/favorite-brand');
  const handleBrandClick = (brandName) =>
    navigate(`/benefit/${encodeURIComponent(brandName)}`);

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

  // 카드
  const setRegisteredCards = useSetRecoilState(registeredCardsAtom);
  const registeredCards = useRecoilValue(registeredCardsAtom);

  // 간편결제/통신사
  const setUserPayment = useSetRecoilState(userPaymentsAtom);
  const userPaymentRaw = useRecoilValue(userPaymentsAtom);
  const [userTelcoInfo, setUserTelcoInfo] = useRecoilState(userTelcoInfoAtom);

  // 서버: 카드 목록
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

  // 서버: 간편결제
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
        setUserPayment(selectedFromServer); // 서버 권위
      } catch (e) {
        if (mounted) setPaysError(e.message || '간편결제 정보를 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoadingPays(false);
      }
    })();
    return () => { mounted = false; };
  }, [setUserPayment]);

  // 서버: 통신사
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const telcoRes = await fetchUserTelco();
        if (!mounted) return;
        if (telcoRes?.isSuccess && telcoRes.result) {
          setUserTelcoInfo({
            telco: telcoRes.result.telecomName,
            hasMembership: telcoRes.result.isMembership,
            grade: telcoRes.result.grade,
          });
        }
      } catch {
        /* 필요시 에러 처리 */
      }
    })();
    return () => { mounted = false; };
  }, [setUserTelcoInfo]);

  // 간편결제: 배열로 정규화 + 'none' 제거
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

  const handleDelete = () => {}; // 현재는 사용 안 함

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
