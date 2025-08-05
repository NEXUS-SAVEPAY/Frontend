import React from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../components/Common/TabBar';

import styles from './RegisteredBenefitPage.module.css';
import brandIcons from '../data/brandIcons';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import registeredBenefits from '../data/registeredBenefits';


// 목데이터
// 구분해서 슬라이스
const cardBenefits = registeredBenefits.filter(b => b.type === 'card');
const simplePayBenefits = registeredBenefits.filter(b => b.type === 'simplepay');
const telcoBenefits = registeredBenefits.filter(b => b.type === 'telco');

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
                    <button className={styles.viewAllButton} onClick={() => navigate('/benefit/cards')}>
                        전체 보기 〉
                    </button>
                </div>

                <div className={styles.benefitList}>
                    {cardBenefits.slice(0, 2).map((benefit) => (
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
                    <button className={styles.viewAllButton} onClick={() => navigate('/benefit/simplepay')}>
                        전체 보기 〉
                    </button>
                </div>

                <div className={styles.benefitList}>
                    {simplePayBenefits.slice(0, 2).map((benefit) => (
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
                    <button className={styles.viewAllButton} onClick={() => navigate('/benefit/telco')}>
                        전체 보기 〉
                    </button>
                </div>

                <div className={styles.benefitList}>
                    {telcoBenefits.slice(0, 2).map((benefit) => (
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
