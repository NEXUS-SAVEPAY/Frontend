import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import SearchBar from '../components/Common/SearchBar';
import BenefitCard from '../components/Benefit/BenefitCard';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import TabBar from '../components/Common/TabBar';
import styles from './HomePage.module.css';
import recommendedBenefits from '../data/mockRecommendBenefits';


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

    return (
        <div className={styles.container}>
            <div className={styles.fixedTop}>
                {/*  로고 영역 추가 */}
                <div className={styles.logoWrapper}>
                    <img src={logoImage} alt="SavePay 로고" className={styles.logo} />
                </div>

                {/* 검색창 */}
                <SearchBar placeholder="혜택을 원하는 브랜드를 검색해주세요" />
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
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h1 className={styles.title}>관심 브랜드 혜택</h1>
                        <button 
                            className={styles.viewAllButton}
                            onClick={() => navigate('/benefit/favorites')}
                        >
                            전체 보기  〉
                        </button>
                    </div>
                    <div className={styles.brandList}>
                        <div className={styles.brandItem}>
                            <img src={oliveyoung} alt="올리브영" className={styles.brandIcon} />
                            <span className={styles.brandLabel}>올리브영</span>
                        </div>
                        <div className={styles.brandItem}>
                            <img src={starbucks} alt="스타벅스" className={styles.brandIcon} />
                            <span className={styles.brandLabel}>스타벅스</span>
                        </div>
                        <div className={styles.brandItem}>
                            <img src={mcdonalds} alt="맥도날드" className={styles.brandIcon} />
                            <span className={styles.brandLabel}>맥도날드</span>
                        </div>
                        <div className={styles.brandItem}>
                            <img src={megabox} alt="메가박스" className={styles.brandIcon} />
                            <span className={styles.brandLabel}>메가박스</span>
                        </div>
                    </div>
                    
                    <div className={styles.listColumn}>
                        {recommendedBenefits.map((benefit) => (
                            <BenefitListItem
                                key={benefit.id}
                                id={benefit.id}
                                brand={benefit.brand}
                                description={benefit.description}
                                imageSrc={benefit.imageSrc}
                            />
                        ))}
                    </div>

                </section>
            </div>

            {/* 위로가기 버튼 (문자 ↑ 사용) */}
            <button className={styles.scrollTopButton} onClick={handleScrollTop}>↑</button>

            <TabBar />
        </div>
    );
}

export default HomePage;
