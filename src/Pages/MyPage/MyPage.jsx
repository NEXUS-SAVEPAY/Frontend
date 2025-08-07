import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
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

function MyPage() {
    const navigate = useNavigate();

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

    const registeredCards = useRecoilValue(registeredCardsAtom);
    const userPayment = useRecoilValue(userPaymentsAtom);
    const userTelcoInfo = useRecoilValue(userTelcoInfoAtom);


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
    

    const [brandList, setBrandList] = useState([
        { name: '올리브영', image: oliveyoungImg },
        { name: '스타벅스', image: starbucksImg },
        { name: '메가박스', image: megaboxImg },
    ]);

    const handleDelete = (type, id) => {
        setMethods(prev => ({
            ...prev,
            [type]: prev[type].filter(item => item.id !== id),
        }));
    };

    const handleAddBrand = () => {
        navigate('/brand/add');
    };

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

            <PaymentMethodSection
                groupedMethods={groupedMethods}
                onDelete={handleDelete}
            />

            <BrandSection brands={brandList ?? []} onAdd={handleAddBrand} />
            <NotificationSection />

            <TabBar />
        </div>
    );
}

export default MyPage;
