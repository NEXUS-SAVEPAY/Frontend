
import React from 'react';
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

function ManagePaymentPage() {
    const navigate = useNavigate();
    const setSelectedCard = useSetRecoilState(selectedCardAtom);

    const registeredCards = useRecoilValue(registeredCardsAtom);
    const userPaymentRaw = useRecoilValue(userPaymentsAtom); // ← 배열/문자열 둘 다 올 수 있음
    const userTelcoInfo = useRecoilValue(userTelcoInfoAtom);

    const handleCardClick = (card, type) => {
        if (type === '카드') {
            setSelectedCard(card);
            navigate('/manage-card', {
                state: { selectedCardId: card.id, isManageMode: true }
            });
        }
    };


    const handleSimplePayClick = () => {
        navigate('/manage-simplepay');
    };

    const handleTelcoClick = () => {
        navigate('/manage-telco');
    };

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

    // ✅ 변경 1: 간편결제 저장값을 "항상 배열"로 맞춤(과거 string 호환)
    const toArray = (v) =>
        Array.isArray(v) ? v : (typeof v === 'string' && v ? [v] : []);
    const userPayments = toArray(userPaymentRaw).filter(v => v && v !== 'none');

    // 추가: 서브옵션(parent_sub) 가진 부모 집합
    const parentsWithSubs = new Set(
        userPayments
        .filter(v => v.includes('_'))
        .map(v => v.split('_')[0])
    );
    
    // 표시용 목록: 부모만 선택됐으면 보여주고, 서브옵션이 있으면 부모는 숨긴다
    const displayPayments = userPayments.filter(v => {
        const isParent = !v.includes('_');
        return !(isParent && parentsWithSubs.has(v));
    });

    // ✅ 변경 2: 간편결제 여러 개를 카드처럼 나열
    // 서브옵션이 있을 수 있어 'naver_membership' 같은 값이 들어올 수도 있음 → 표시 이름은 부모 키로.
    const PAYMENT_NAME = {
        kakao: '카카오페이',
        naver: '네이버페이',
        toss:  '토스페이',
        payco: '페이코',
    };

    // 서브옵션 텍스트(있으면 tag로 보여줌). 없으면 '등록됨'
    const SUBOPTION_LABELS = {
        naver_membership: '멤버십',
        toss_prime: '프라임',
        // payco 관련 서브옵션 쓰면 여기에 추가: payco_points: '페이코 포인트 사용'
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
                const parent = p.split('_')[0]; // 'naver_membership' → 'naver'
                return {
                    id: `simplepay_${p}_${idx}`,
                    name: PAYMENT_NAME[parent] || parent,
                    image: getPaymentImage(parent),
                    tag: SUBOPTION_LABELS[p] ? SUBOPTION_LABELS[p] : '등록됨',
                };
            }),
        },
        {
            type: '통신사',
            items: userTelcoInfo?.telco ? [{
                id: 'telco',
                name: userTelcoInfo.telco,
                image: getTelcoImage(userTelcoInfo.telco),
                tag: userTelcoInfo.hasMembership
                    ? (userTelcoInfo.grade || '')
                    : '멤버십 없음',
            }] : [],
        },
    ];

    return (
        <div className={styles.pageWrapper}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate('/mypage')}>〈</button>
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
