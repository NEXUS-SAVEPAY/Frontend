import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecommendedBenefitPage.module.css';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import recommendedBenefits from '../data/mockRecommendBenefits';
import OwlScrollTop from '../components/Common/OwlScrollTop';


function RecommendedBenefitPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* 고정 헤더 */}
            <div className={styles.fixedHeader}>
                <div className={styles.header}>
                    <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
                    <h2 className={styles.title}>추천 혜택</h2>
                </div>
            </div>

            {/* 콘텐츠는 fixedHeader 높이만큼 아래로 밀기 */}
            <div className={styles.content}>
                <div className={styles.benefitListColumn}>
                    {recommendedBenefits.map((benefit) => (
                        <BenefitListItem
                            key={benefit.id}
                            brand={benefit.brand}
                            description={benefit.description}
                            detail={benefit.detail}
                            imageSrc={benefit.imageSrc}
                        />
                    ))}
                </div>
            </div>
            <OwlScrollTop />
        </div>
    );
}

export default RecommendedBenefitPage;
