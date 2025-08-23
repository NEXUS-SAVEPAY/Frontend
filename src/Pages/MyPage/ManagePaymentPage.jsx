// src/pages/ManagePaymentPage/ManagePaymentPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';

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
import { fetchSimplePays } from '../../services/api/payApi'; // ✅ 추가
// src/pages/ManagePaymentPage/ManagePaymentPage.jsx
import { fetchUserTelco } from '../../services/api/telcoService'; // ✅ 추가


function ManagePaymentPage() {
  const navigate = useNavigate();
  const setSelectedCard = useSetRecoilState(selectedCardAtom);

  const setRegisteredCards = useSetRecoilState(registeredCardsAtom);
  const registeredCards = useRecoilValue(registeredCardsAtom);

  const setUserPayment = useSetRecoilState(userPaymentsAtom);
  const userPaymentRaw = useRecoilValue(userPaymentsAtom);
  const [userTelcoInfo, setUserTelcoInfo] = useRecoilState(userTelcoInfoAtom);

  const [loadingCards, setLoadingCards] = useState(false);
  const [cardsError, setCardsError] = useState('');
  const [loadingPays, setLoadingPays] = useState(false);
  const [paysError, setPaysError] = useState('');

  const mergeCards = (prev, next) => {
    if (!Array.isArray(next) || next.length === 0) return prev;
    const keyOf = (c) => String(c?.id ?? `${c?.company ?? ''}::${c?.name ?? ''}`);
    const map = new Map(prev.map((c) => [keyOf(c), c]));
    next.forEach((c) => {
      const k = keyOf(c);
      map.set(k, { ...(map.get(k) || {}), ...c });
    });
    return Array.from(map.values());
  };

    // ✅ 통신사 정보 동기화 (MyPage랑 동일하게 추가)
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
                image: telcoRes.result.image, // 여기서 바로 DB 이미지 저장
              });
            }
          } catch (e) {
            console.error('[ManagePaymentPage] fetchUserTelco error', e);
          }
        })();
        return () => { mounted = false; };
      }, [setUserTelcoInfo]);

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

  // ✅ 간편결제 조회
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingPays(true);
        setPaysError('');
        const selectedFromServer = await fetchSimplePays();
        if (!mounted) return;
        setUserPayment(selectedFromServer);
      } catch (e) {
        if (mounted) setPaysError(e.message || '간편결제 정보를 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoadingPays(false);
      }
    })();
    return () => { mounted = false; };
  }, [setUserPayment]);

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
        image: userTelcoInfo.image,
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
{/*
      {loadingCards && <p className={styles.helperText}>등록된 카드를 불러오는 중…</p>}
      {cardsError && <p className={styles.errorText}>{cardsError}</p>}
      {loadingPays && <p className={styles.helperText}>간편결제를 불러오는 중…</p>}
      {paysError && <p className={styles.errorText}>{paysError}</p>}
*/}
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
