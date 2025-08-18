// src/pages/ManagePaymentPage/ManagePaymentPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState, useRecoilValue } from 'recoil';

import { registeredCardsAtom } from '../../recoil/atoms/CardRegisterAtom';
import { selectedCardAtom } from '../../recoil/atoms/selectedCardAtom';
import { userPaymentsAtom } from '../../recoil/atoms/userPaymentsAtom';
import { userTelcoInfoAtom } from '../../recoil/atoms/userTelcoInfoAtom';

import styles from './ManagePaymentPage.module.css';
import PaymentMethodSection from './PaymentMethodSection';

import rightArrowImg from '../../assets/images/rightArrowImg.png';
import kakaopayImg from '../../assets/images/kakaopay.png';
import sktImg from '../../assets/images/skt.png';

import { fetchRegisteredCards } from '../../services/api/cardApi';

function ManagePaymentPage() {
  const navigate = useNavigate();
  const setSelectedCard = useSetRecoilState(selectedCardAtom);

  const setRegisteredCards = useSetRecoilState(registeredCardsAtom);
  const registeredCards = useRecoilValue(registeredCardsAtom);

  const userPaymentRaw = useRecoilValue(userPaymentsAtom);
  const userTelcoInfo = useRecoilValue(userTelcoInfoAtom);

  const [loadingCards, setLoadingCards] = useState(false);
  const [cardsError, setCardsError] = useState('');

  // 🔧 prev + serverCards 머지(중복 제거)
  const mergeCards = (prev, next) => {
    if (!Array.isArray(next) || next.length === 0) return prev; // 서버 비면 유지
    const keyOf = (c) => String(c?.id ?? `${c?.company ?? ''}::${c?.name ?? ''}`);
    const map = new Map(prev.map((c) => [keyOf(c), c]));
    next.forEach((c) => {
      const k = keyOf(c);
      map.set(k, { ...(map.get(k) || {}), ...c }); // 서버 값 우선
    });
    return Array.from(map.values());
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCards(true);
        setCardsError('');
        const serverCards = await fetchRegisteredCards();
        if (!mounted) return;
        setRegisteredCards((prev) => mergeCards(prev, serverCards));
      } catch (e) {
        if (mounted) setCardsError(e.message || '카드 목록을 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoadingCards(false);
      }
    })();
    return () => { mounted = false; };
  }, [setRegisteredCards]);

  const handleCardClick = (card, type) => {
    if (type === '카드') {
      setSelectedCard(card);
      navigate('/manage-card', {
        state: { selectedCardId: card.id, isManageMode: true }
      });
    }
  };

  const handleSimplePayClick = () => navigate('/manage-simplepay');
  const handleTelcoClick = () => navigate('/manage-telco');

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

  const toArray = (v) => Array.isArray(v) ? v : (typeof v === 'string' && v ? [v] : []);
  const userPayments = toArray(userPaymentRaw).filter(v => v && v !== 'none');

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
        image: card.image,
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

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/mypage')}>〈</button>
        <h2 className={styles.title}>등록된 결제 수단</h2>
      </header>

      {loadingCards && <p className={styles.helperText}>등록된 카드를 불러오는 중…</p>}
      {cardsError && <p className={styles.errorText}>{cardsError}</p>}

      <PaymentMethodSection
        groupedMethods={groupedMethods}
        onCardClick={handleCardClick}
        onSimplePayClick={handleSimplePayClick}
        onTelcoClick={handleTelcoClick}
        arrowIcon={rightArrowImg}
      />
    </div>
  );
}

export default ManagePaymentPage;
