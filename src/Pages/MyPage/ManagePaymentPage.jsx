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

import { fetchRegisteredCards } from '../../services/api/cardApi';
import { fetchSimplePays } from '../../services/api/payApi';
import { fetchUserTelco } from '../../services/api/telcoService';

function ManagePaymentPage() {
    const navigate = useNavigate();
    const setSelectedCard = useSetRecoilState(selectedCardAtom);

    const setRegisteredCards = useSetRecoilState(registeredCardsAtom);
    const registeredCards = useRecoilValue(registeredCardsAtom);

    const setUserPayment = useSetRecoilState(userPaymentsAtom);
    const userPaymentRaw = useRecoilValue(userPaymentsAtom);
    const [userTelcoInfo, setUserTelcoInfo] = useRecoilState(userTelcoInfoAtom);

    // 로딩/에러 상태
    const [loadingCards, setLoadingCards] = useState(false);
    const [cardsError, setCardsError] = useState('');
    const [loadingPays, setLoadingPays] = useState(false);
    const [paysError, setPaysError] = useState('');

    // 카드 병합 (중복 제거)
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

    // 통신사 동기화
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
                        image: telcoRes.result.image,
                    });
                }
            } catch (e) {
                console.error('[ManagePaymentPage] fetchUserTelco error', e);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [setUserTelcoInfo]);

    // 카드 조회
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
        return () => {
            mounted = false;
        };
    }, [setRegisteredCards]);

    // 간편결제 조회
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoadingPays(true);
                setPaysError('');
                const paysFromServer = await fetchSimplePays();
                if (!mounted) return;
                setUserPayment(paysFromServer);
            } catch (e) {
                if (mounted) setPaysError(e.message || '간편결제 정보를 불러오지 못했습니다.');
            } finally {
                if (mounted) setLoadingPays(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [setUserPayment]);

    // 클릭 핸들러
    const handleCardClick = (card, type) => {
        if (type === '카드') {
            setSelectedCard(card);
            navigate('/manage-card', {
                state: { selectedCardId: card.id, isManageMode: true },
            });
        }
    };
    const handleSimplePayClick = () => navigate('/manage-simplepay');
    const handleTelcoClick = () => navigate('/manage-telco');

    // 데이터 정리
    const toArray = (v) => (Array.isArray(v) ? v : typeof v === 'string' && v ? [v] : []);
    const userPayments = toArray(userPaymentRaw).filter((v) => v);

    // 부모/자식 옵션 처리
    const parentsWithSubs = new Set(
        userPayments
            .filter((v) => typeof v.company === 'string' && v.company.includes('_'))
            .map((v) => v.company.split('_')[0])
    );

    const displayPayments = userPayments.filter((v) => {
        if (!v || typeof v.company !== 'string') return false;
        const isParent = !v.company.includes('_');
        return !(isParent && parentsWithSubs.has(v.company));
    });

    const PAYMENT_NAME = {
        kakao: '카카오페이',
        naver: '네이버페이',
        toss: '토스페이',
        payco: '페이코',
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
            items: displayPayments.map((p, idx) => ({
                id: `simplepay_${p.company}_${idx}`,
                name: PAYMENT_NAME[p.company] || p.company,
                image: p.image,
                tag: p.isMembership ? '멤버십' : '멤버십 없음',
            })),
        },
        {
            type: '통신사',
            items: userTelcoInfo?.telco
                    ? [
                        {
                            id: 'telco',
                            name: userTelcoInfo.telco,
                            image: userTelcoInfo.image,
                            tag: userTelcoInfo.hasMembership
                                ? userTelcoInfo.grade || ''
                                : '멤버십 없음',
                        },
                    ]
                : [],
        },
    ];

    return (
        <div className={styles.pageWrapper}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate('/mypage')}>
                    〈
                </button>
                <h2 className={styles.title}>등록된 결제 수단</h2>
            </header>

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
