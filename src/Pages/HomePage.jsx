import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useRecoilValue } from 'recoil';
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

    console.log('🔥 likedBrands:', likedBrands);
    console.log('🔥 likedBrandList:', likedBrandList);
    console.log('🔥 brandIcons:', brandIcons);

    console.log('🔥 localStorage:', localStorage.getItem('recoil-persist'));
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
                <section className={styles.section2}>
                    <div className={styles.sectionHeader}>
                        <h1 className={styles.title}>관심 브랜드 혜택</h1>
                        <button 
                            className={styles.viewAllButton}
                            onClick={() => navigate('/benefit/favorites')}
                        >
                            전체 보기  〉
                        </button>
                    </div>

                    {/*
                    <div className={styles.brandList}>
                        {likedBrandList.map((brand) => {
                            return (
                                <div
                                    key={brand}
                                    className={styles.brandItem}
                                    onClick={() => navigate(`/benefit/${encodeURIComponent(brand)}`)}
                                >
                                    <img
                                        src={brand.imageSrc}
                                        alt={brand}
                                        className={styles.brandIcon}
                                    />
                                    <span className={styles.brandLabel}>{brand}</span>
                                </div>
                            );
                        })}
                    </div>
                    */}

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
