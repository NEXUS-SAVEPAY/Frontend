import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useRecoilValue } from 'recoil';
import { registeredCardsAtom } from '../recoil/atoms/CardRegisterAtom';
import { userPaymentsAtom } from '../recoil/atoms/userPaymentsAtom';
import { userTelcoInfoAtom } from '../recoil/atoms/userTelcoInfoAtom';
import { likedBrandsAtom } from '../recoil/atoms/likedBrandsAtom';
import SearchBar from '../components/Common/SearchBar';
import BenefitCard from '../components/Benefit/BenefitCard';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import TabBar from '../components/Common/TabBar';
import styles from './HomePage.module.css';
import recommendedBenefits from '../data/mockRecommendBenefits';
import favoriteBrandBenefits from '../data/favoriteBrandBenefits';
import brandIcons from '../data/brandIcons';
import owlImage from '../assets/images/character.svg';

import logoImage from '../assets/images/logo-purple.svg';
import oliveyoung from '../assets/images/oliveyoung.svg';
import starbucks from '../assets/images/starbucks.svg';
import mcdonalds from '../assets/images/mcdonalds.svg';
import megabox from '../assets/images/megabox.svg';
import kakaopayImg from '../assets/images/kakaopay.png';
import sktImg from '../assets/images/skt.png';


function HomePage() {
    const navigate = useNavigate();
    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const likedBrands = useRecoilValue(likedBrandsAtom);


    const flatFavoriteBenefits = favoriteBrandBenefits.flatMap((brandGroup) =>
        brandGroup.benefits.map((benefit) => ({
            ...benefit,
            brand: brandGroup.brand
        }))
    );

    const filteredFlatBenefits = flatFavoriteBenefits.filter(
        (benefit) => likedBrands[benefit.brand]
    );

    
    const likedBrandList = Object.entries(likedBrands)
    .filter(([_, isLiked]) => isLiked)
    .map(([brand]) => brand);
    
    /*const likedBrandList = ['올리브영', '스타벅스', '맥도날드', '메가박스'];*/

    const likedBrandGroups = favoriteBrandBenefits.filter((item) =>
        likedBrandList.includes(item.brand)
    );

    const [showNoResult, setShowNoResult] = useState(false);
    const handleSearch = (keyword) => {
        const brandName = keyword.trim();
        if (!brandName) return;
    
        // 유효한 브랜드인지 검사 (옵션)
        const brandExists = favoriteBrandBenefits.some((item) => item.brand === brandName);
        
        if (brandExists) {
            navigate(`/benefit/${encodeURIComponent(brandName)}`);
        } else {
            setShowNoResult(true);
            setTimeout(() => setShowNoResult(false), 2000); // 2초 후 사라짐
        }
    };    

    // ★ 여기부터 교체
    // 등록된 카드/간편결제/통신사 읽기
    const registeredCards = useRecoilValue(registeredCardsAtom);
    const userPaymentRaw = useRecoilValue(userPaymentsAtom);
    const telcoInfo = useRecoilValue(userTelcoInfoAtom);

    // (1) 간편결제: 문자열/배열 모두 배열로 통일
    const toArray = (v) => Array.isArray(v) ? v : (typeof v === 'string' && v ? [v] : []);
    const rawPays = toArray(userPaymentRaw).filter(v => v && v !== 'none');

    // (2) 간편결제 parent만 추출(예: 'naver_membership' -> 'naver')
    const payParents = [...new Set(
    rawPays.map(p => (typeof p === 'string' ? p.split('_')[0] : p))
    )];

    // (3) 이름/아이콘 매핑 (parent 키 기준)
    const PAYMENT_NAME = {
    kakao: '카카오페이',
    naver: '네이버페이',
    toss:  '토스페이',
    payco: '페이코',
    };

    const payIconMap = {
    kakao: kakaopayImg,
    // naver: naverpayImg,
    // toss: tosspayImg,
    // payco: paycoImg,
    };

    // (4) 통신사 아이콘 매핑 — 필드는 telco 사용!
    const telcoIconMap = {
    'SKT': sktImg,
    // 'KT': ktImg,
    // 'LG U+': lguplusImg,
    };

    // (5) 홈에 보여줄 타일 데이터(카드 + 간편결제 + 통신사)
    const paymentItems = [
    ...(registeredCards || []).map(card => ({
        key: `card-${card.id}`,
        name: card.name,
        image: card.image,
        onClick: () => navigate('/benefit/cards'),
    })),
    ...payParents.map(p => ({
        key: `pay-${p}`,
        name: PAYMENT_NAME[p] || p,
        image: payIconMap[p],             // parent 키로 아이콘 매핑
        onClick: () => navigate('/benefit/simplepay'),
    })),
    ...(telcoInfo?.telco ? [{            // ★ carrier → telco 로 수정
        key: `telco-${telcoInfo.telco}`,
        name: telcoInfo.telco,
        image: telcoIconMap[telcoInfo.telco],
        onClick: () => navigate('/benefit/telco'),
    }] : []),
    ];

    // (6) 존재 여부
    const hasLikedBrands = likedBrandList.length > 0;
    const hasAnyPayment = paymentItems.length > 0;
    // ★ 여기까지

        // 내가 등록한 카드/페이/통신사 이름 셋
    const cardProviders = new Set(
        (registeredCards || []).map(c => c.company || c.name).filter(Boolean)
    );
    const payProviders = new Set(
        payParents.map(p => PAYMENT_NAME[p] || p).filter(Boolean)
    );
    const telcoProviders = new Set(
        telcoInfo?.telco ? [telcoInfo.telco] : []
    );

        // provider가 내가 등록한 결제수단과 일치하는 혜택만 추출
    const providerFilteredBenefits = flatFavoriteBenefits.filter(b => {
        if (!b.provider) return false; // provider 없으면 스킵
        if (b.type === 'card')      return cardProviders.has(b.provider);
        if (b.type === 'simplepay') return payProviders.has(b.provider);
        if (b.type === 'telco')     return telcoProviders.has(b.provider);
        return false;
    });
    
    // 리스트 아이템: brand=결제수단명(provider), description=가맹점+설명, detail=그대로
    const paymentModeListItems = providerFilteredBenefits.map(b => ({
        id: `pm-${b.id}`,
        brand: b.provider,                         // 예: '삼성카드' / '카카오페이' / 'SKT'
        description: `${b.brand} ${b.description}`,// 예: '올리브영 10% 캐시백'
        detail: b.detail,
        imageSrc: b.imageSrc,
    }));

    return (
        <div className={styles.container}>

            {showNoResult && (
                <div className={styles.toastMessage}>검색 결과가 없습니다</div>
            )}

            <div className={styles.fixedTop}>
                {/*  로고 영역 추가 */}
                <div className={styles.logoWrapper}>
                    <img src={logoImage} alt="SavePay 로고" className={styles.logo} />
                </div>

                {/* 검색창 */}
                <SearchBar 
                    placeholder="혜택을 원하는 브랜드를 검색해주세요" 
                    onSearch={handleSearch}
                />
            </div>

            <div className={styles.content}>
                {/* 추천 혜택 */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h1 className={styles.title}>추천혜택</h1>
                        <button 
                            className={styles.viewAllButton}
                            onClick={() => navigate('/benefit/recommended')}
                        >
                            전체 보기  〉
                        </button>
                    </div>
                    
                    <div className={styles.benefitList}>
                        {recommendedBenefits.map((benefit) => (
                            <BenefitCard
                                key={benefit.id}
                                id={benefit.id}
                                brand={benefit.brand}
                                description={benefit.description}
                                imageSrc={benefit.imageSrc}
                            />
                        ))}
                    </div>
                </section>
                {/* 관심 브랜드 혜택 */}
        {/*
                <section className={styles.section2}>
                    <div className={styles.sectionHeader}>
                        <h1 className={styles.title}>{hasLikedBrands ? '관심 브랜드 혜택' : '결제 수단 혜택'}</h1>
                        <button 
                            className={styles.viewAllButton}
                            onClick={() => navigate('/benefit/favorites')}
                        >
                            전체 보기  〉
                        </button>
                    </div>

                    <div className={styles.brandList}>
                        {likedBrandList.map((brandName) => {
                            const brandData = favoriteBrandBenefits.find((item) => item.brand === brandName);
                            const imageSrc = brandData?.benefits[0]?.imageSrc; // 첫 번째 혜택의 이미지 사용

                            return (
                                <div
                                    key={brandName}
                                    className={styles.brandItem}
                                    onClick={() => navigate(`/benefit/${encodeURIComponent(brandName)}`)}
                                >
                                    <img
                                        src={imageSrc}
                                        alt={brandName}
                                        className={styles.brandIcon}
                                    />
                                    <span className={styles.brandLabel}>{brandName}</span>
                                </div>
                            );
                        })}
                    </div>


                    
                    <div className={styles.listColumn}>
                        {filteredFlatBenefits.map((benefit) => (
                            <BenefitListItem
                                key={benefit.id}
                                id={benefit.id}
                                brand={benefit.brand}
                                description={benefit.description}
                                detail={benefit.detail}
                                imageSrc={benefit.imageSrc}
                            />
                        ))}
                    </div>

                </section> 
                */}
                {/* 관심 브랜드 혜택 OR 결제 수단 혜택 */}
                <section className={styles.section2}>
                <div className={styles.sectionHeader}>
                    <h1 className={styles.title}>
                    {hasLikedBrands ? '관심 브랜드 혜택' : '결제 수단 혜택'}
                    </h1>

                    <button
                    className={styles.viewAllButton}
                    onClick={() =>
                        hasLikedBrands
                        ? navigate('/benefit/favorites')
                        : navigate('/benefit/registered') // or '/benefit/cards' 등 네가 원하는 목록 페이지
                    }
                    >
                    전체 보기  〉
                    </button>
                </div>

                {hasLikedBrands ? (
                    <>
                    {/* 기존 관심브랜드 아이콘 그리드 */}
                    <div className={styles.brandList}>
                        {likedBrandList.map((brandName) => {
                        const brandData = favoriteBrandBenefits.find((b) => b.brand === brandName);
                        const imageSrc = brandData?.benefits[0]?.imageSrc;

                        return (
                            <div
                            key={brandName}
                            className={styles.brandItem}
                            onClick={() => navigate(`/benefit/${encodeURIComponent(brandName)}`)}
                            >
                            <img src={imageSrc} alt={brandName} className={styles.brandIcon} />
                            <span className={styles.brandLabel}>{brandName}</span>
                            </div>
                        );
                        })}
                    </div>

                    <div className={styles.listColumn}>
                        {filteredFlatBenefits.map((benefit) => (
                        <BenefitListItem
                            key={benefit.id}
                            id={benefit.id}
                            brand={benefit.brand}
                            description={benefit.description}
                            detail={benefit.detail}
                            imageSrc={benefit.imageSrc}
                        />
                        ))}
                    </div>
                    </>
                ) : (
                    hasAnyPayment ? (
                    <>
                    <div className={styles.brandList}>
                        {paymentItems.map((item) => (
                        <div key={item.key} className={styles.brandItem} onClick={item.onClick}>
                            <img src={item.image} alt={item.name} className={styles.brandIcon} />
                            <span className={styles.brandLabel}>{item.name}</span>
                        </div>
                        ))}
                    </div>

                    <div className={styles.listColumn}>
                    {paymentModeListItems.map((benefit) => (
                    <BenefitListItem
                        key={benefit.id}
                        id={benefit.id}
                        brand={benefit.brand}               // ← 배지: 카드/페이/통신사
                        description={benefit.description}   // ← "올리브영 10% 캐시백"
                        detail={benefit.detail}
                        imageSrc={benefit.imageSrc}
                    />
                    ))}
                    </div>
                    </>
                    ) : (
                    // 결제수단도 없다면 안내 문구 (선택)
                    <p className={styles.emptyText}>마이페이지에서 결제 수단을 먼저 등록해주세요.</p>
                    )
                )}
                </section>

            </div>

            {/* 위로가기 버튼 (문자 ↑ 사용) */}
            <div className={styles.owlButtonWrapper}>
                <img src={owlImage} alt="혜택 부엉이" className={styles.owlIcon} />
                <button className={styles.scrollTopButton} onClick={handleScrollTop}>↑</button>
            </div>
            <TabBar />
        </div>
    );

}

export default HomePage;
