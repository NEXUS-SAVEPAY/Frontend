import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { selectedCardAtom } from '../../recoil/atoms/selectedCardAtom';
import styles from './ManagePaymentPage.module.css';
import PaymentMethodSection from './PaymentMethodSection';

import rightArrowImg from '../../assets/images/rightArrowImg.png';
import cardImg from '../../assets/images/card.png';
import kakaopayImg from '../../assets/images/kakaopay.png';
import sktImg from '../../assets/images/skt.png';

function ManagePaymentPage() {
    const navigate = useNavigate();
    const setSelectedCard = useSetRecoilState(selectedCardAtom);

    const [methods, setMethods] = useState({
        카드: [{ id: 1, name: 'taptap O', image: cardImg, tag: '삼성카드' }],
        간편결제: [{ id: 2, name: '카카오페이', image: kakaopayImg, tag: '멤버십 없음' }],
        통신사: [{ id: 3, name: 'SK텔레콤', image: sktImg, tag: 'VIP' }],
    });

    const handleCardClick = (card, type) => {
        if (type === '카드') {
            setSelectedCard(card);
            navigate('/manage-card');
        }
    };

    const groupedMethods = Object.entries(methods).map(([type, items]) => ({
        type,
        items,
    }));

    return (
        <div className={styles.pageWrapper}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>〈</button>
                <h2 className={styles.title}>등록된 결제 수단</h2>
            </header>

            <PaymentMethodSection
                groupedMethods={groupedMethods}
                onCardClick={handleCardClick}
                arrowIcon={rightArrowImg}
            />
        </div>
    );
}
export default ManagePaymentPage;
