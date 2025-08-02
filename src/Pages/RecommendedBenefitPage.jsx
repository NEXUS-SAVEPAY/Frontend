import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecommendedBenefitPage.module.css';
import BenefitListItem from '../components/Benefit/BenefitListItem';

const mockBenefits = [
    {
        id: 1,
        brand: '올리브영',
        description: '10% 캐시백',
        detail: '등록하신 카드로 매장에서 결제해주세요',
        imageSrc: '../assets/images/oliveyoung.svg'
    },
    {
        id: 2,
        brand: '스타벅스',
        description: '무료 사이즈 업',
        detail: '등록하신 카드로 사이즈 업 혜택을 받아보세요',
        imageSrc: '../assets/images/starbucks.svg'
    },
    {
        id: 3,
        brand: '메가박스',
        description: '영화 1+1',
        detail: '메가박스에서 1장 구매 시 1장 무료',
        imageSrc: '../assets/images/megabox.svg'
    }
];

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
                    {mockBenefits.map((benefit) => (
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
        </div>
    );
}

export default RecommendedBenefitPage;
