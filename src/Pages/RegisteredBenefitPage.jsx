import React from 'react';
import { useNavigate } from 'react-router-dom';
import BenefitCard from '../components/Benefit/BenefitCard';
import TabBar from '../components/Common/TabBar';

import styles from './RegisteredBenefitPage.module.css';
import brandIcons from '../data/brandIcons';
import BenefitListItem from '../components/Benefit/BenefitListItem';

// 목데이터
const cardBenefits = [
    {
        id: 1,
        brand: '올리브영',
        description: '10% 캐시백',
        detail: '등록하신 카드로 매장에서 결제해주세요.',
        imageSrc: brandIcons['올리브영'],
    },
    {
        id: 2,
        brand: '스타벅스',
        description: '5% 할인',
        detail: '모바일 카드로 결제 시 적용됩니다.',
        imageSrc: brandIcons['스타벅스'],
    },
];

const simplePayBenefits = [
    {
        id: 3,
        brand: '올리브영',
        description: '10% 캐시백',
        detail: '등록하신 카드로 매장에서 결제해주세요.',
        imageSrc: brandIcons['올리브영'],
    },
    {
        id: 4,
        brand: '메가박스',
        description: '영화 1천원 할인',
        detail: '간편결제로 예매 시 적용됩니다.',
        imageSrc: brandIcons['메가박스'],
    },
];

function RegisteredBenefitPage() {
    const navigate = useNavigate();

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>등록 수단별 혜택</h2>

            {/* 카드 혜택 TOP2 */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3>카드 혜택 TOP2</h3>
                    <button className={styles.viewAllButton} onClick={() => navigate('/benefits/cards')}>
                        전체 보기 〉
                    </button>
                </div>

                <div className={styles.benefitList}>
                    {cardBenefits.map((benefit) => (
                        <BenefitListItem
                            key={benefit.id}
                            brand={benefit.brand}
                            description={benefit.description}
                            detail={benefit.detail}
                            imageSrc={benefit.imageSrc}
                        />
                    ))}
                </div>
            </section>

            {/* 간편결제 혜택 TOP2 */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3>간편결제 혜택 TOP2</h3>
                    <button className={styles.viewAllButton} onClick={() => navigate('/benefits/simplepay')}>
                        전체 보기 〉
                    </button>
                </div>

                <div className={styles.benefitList}>
                    {simplePayBenefits.map((benefit) => (
                        <BenefitListItem
                            key={benefit.id}
                            brand={benefit.brand}
                            description={benefit.description}
                            detail={benefit.detail}
                            imageSrc={benefit.imageSrc}
                        />
                    ))}
                </div>
            </section>

            {/* 통신사 혜택 TOP2 */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3>통신사 혜택 TOP2</h3>
                    <button className={styles.viewAllButton} onClick={() => navigate('/benefits/telco')}>
                        전체 보기 〉
                    </button>
                </div>

                <div className={styles.benefitList}>
                    {simplePayBenefits.map((benefit) => (
                        <BenefitListItem
                            key={benefit.id}
                            brand={benefit.brand}
                            description={benefit.description}
                            detail={benefit.detail}
                            imageSrc={benefit.imageSrc}
                        />
                    ))}
                </div>
            </section>

            {/* 위로가기 버튼 */}
            <button className={styles.scrollTopButton} onClick={handleScrollTop}>↑</button>

            {/* 하단 탭바 */}
            <TabBar />
        </div>
    );
}

export default RegisteredBenefitPage;
