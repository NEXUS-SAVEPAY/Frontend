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
    const userPayment = useRecoilValue(userPaymentsAtom);
    const userTelcoInfo = useRecoilValue(userTelcoInfoAtom);

    const handleCardClick = (card, type) => {
        if (type === '카드') {
            setSelectedCard(card);
            navigate('/manage-card');
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
            case 'toss': return null;
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
            items: userPayment && userPayment !== 'none' ? [{
                id: 'simplepay',
                name: {
                    kakao: '카카오페이',
                    naver: '네이버페이',
                    toss: '토스페이',
                    payco: '페이코',
                }[userPayment] || '간편결제',
                image: getPaymentImage(userPayment),
                tag: '등록됨',
            }] : [],
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
                <button className={styles.backButton} onClick={() => navigate(-1)}>〈</button>
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
