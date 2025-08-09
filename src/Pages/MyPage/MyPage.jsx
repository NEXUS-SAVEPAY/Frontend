import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { likedBrandsAtom } from '../../recoil/atoms/likedBrandsAtom';
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
    const likedBrands = useRecoilValue(likedBrandsAtom);

    const likedBrandList = Object.entries(likedBrands)
        .filter(([, isLiked]) => isLiked)
        .map(([brand]) => brand);

    const handleAddBrand = () => {
        navigate('/favorite-brand'); // 네가 쓰는 “관심 브랜드 추가” 라우트로 변경
    };

    const handleBrandClick = (brandName) => {
        navigate(`/benefit/${encodeURIComponent(brandName)}`);
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

    const registeredCards = useRecoilValue(registeredCardsAtom);
    const userPaymentRaw = useRecoilValue(userPaymentsAtom); // 배열/문자열 둘 다 올 수 있음
    const userTelcoInfo = useRecoilValue(userTelcoInfoAtom);

    // ✅ 간편결제 값: 항상 배열로 정규화 + 'none' 제거
    const toArray = (v) => Array.isArray(v) ? v : (typeof v === 'string' && v ? [v] : []);
    const userPayments = toArray(userPaymentRaw).filter(v => v && v !== 'none');

    // ✅ 서브옵션이 선택된 부모는 표시에서 숨기기 (부모+서브 동시 선택 시 서브만 보여줌)
    const parentsWithSubs = new Set(
        userPayments.filter(v => v.includes('_')).map(v => v.split('_')[0])
    );
    const displayPayments = userPayments.filter(v => {
        const isParent = !v.includes('_');
        return !(isParent && parentsWithSubs.has(v));
    });

    // ✅ 표시용 이름/태그 매핑
    const PAYMENT_NAME = {
        kakao: '카카오페이',
        naver: '네이버페이',
        toss:  '토스페이',
        payco: '페이코',
    };
    const SUBOPTION_LABELS = {
        naver_membership: '멤버십',
        toss_prime: '프라임',
        // payco 관련 서브옵션 쓰면 여기에 추가: payco_points: '포인트'
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
            // ✅ 여러 개를 카드처럼 나열 (서브옵션이면 태그에 짧은 라벨, 아니면 '등록됨')
            items: displayPayments.map((p, idx) => {
                const parent = p.split('_')[0];
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
    
    const [brandList, setBrandList] = useState([
        { name: '올리브영', image: oliveyoungImg },
        { name: '스타벅스', image: starbucksImg },
        { name: '메가박스', image: megaboxImg },
    ]);

    const handleDelete = (type, id) => {
        // 기존 로직 유지 (스타일/기능 변경 없음)
        setMethods(prev => ({
            ...prev,
            [type]: prev[type].filter(item => item.id !== id),
        }));
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

            {/*<BrandSection brands={brandList ?? []} onAdd={handleAddBrand} />*/}
            <BrandSection
                brands={likedBrandList}        // ['올리브영','스타벅스', ...]
                onAdd={handleAddBrand}
                onBrandClick={handleBrandClick}
            />
            <NotificationSection />

            <TabBar />
        </div>
    );
}

export default MyPage;
