import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    // 💳 결제 수단 데이터
    const paymentMethods = {
        카드: [
            {
                id: 1,
                name: 'taptap O',
                image: cardImg,
                tag: '삼성카드',
            },
        ],
        간편결제: [
            {
                id: 2,
                name: '카카오페이',
                image: kakaopayImg,
                tag: '멤버십 없음',
            },
        ],
        통신사: [
            {
                id: 3,
                name: 'SK텔레콤',
                image: sktImg,
                tag: 'VIP',
            },
        ],
    };

    const [methods, setMethods] = useState(paymentMethods);

    const groupedMethods = Object.entries(methods).map(([type, items]) => ({
        type,
        items,
    }));

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
