// src/pages/BrandBenefitPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { likedBrandsAtom } from '../recoil/atoms/likedBrandsAtom';
import styles from './BrandBenefitPage.module.css';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import favoriteBrandBenefits from '../data/favoriteBrandBenefits';
import OwlScrollTop from '../components/Common/OwlScrollTop';

const BrandBenefitPage = () => {
    const { brand } = useParams();
    const decodedBrand = decodeURIComponent(brand);
    const navigate = useNavigate();

    const [likedBrands, setLikedBrands] = useRecoilState(likedBrandsAtom);
    const isLiked = likedBrands[decodedBrand];

    const toggleLike = () => {
        setLikedBrands((prev) => ({
            ...prev,
            [decodedBrand]: !prev[decodedBrand],
        }));
    };

    const brandData = favoriteBrandBenefits.find(item => item.brand === decodedBrand);

    if (!brandData) {
        return <div className={styles.notFound}>해당 브랜드의 혜택이 없습니다.</div>;
    }

    // type별 분리
    const cardBenefits = brandData.benefits.filter(b => b.type === 'card');
    const simplePayBenefits = brandData.benefits.filter(b => b.type === 'simplepay');
    const telcoBenefits = brandData.benefits.filter(b => b.type === 'telco');

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.fixedHeader}>
                <div className={styles.header}>
                    <span className={styles.backButton} onClick={() => navigate('/home')}>〈</span>
                    <div className={styles.brandTitleWrapper}>
                        <h2 className={styles.pageTitle}>{decodedBrand} </h2>
                        <button className={styles.starButton} onClick={toggleLike}>
                        {isLiked ? '★' : '☆'}
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                {/* 카드 혜택 */}
                {cardBenefits.length > 0 && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>카드 혜택</h3>
                        </div>
                        <div className={styles.benefitList}>
                            {cardBenefits.map((benefit) => (
                                <BenefitListItem
                                    key={benefit.id}
                                    brand={decodedBrand}
                                    description={benefit.description}
                                    detail={benefit.detail}
                                    imageSrc={benefit.imageSrc}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* 간편결제 혜택 */}
                {simplePayBenefits.length > 0 && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>간편결제 혜택</h3>
                        </div>
                        <div className={styles.benefitList}>
                            {simplePayBenefits.map((benefit) => (
                                <BenefitListItem
                                    key={benefit.id}
                                    brand={decodedBrand}
                                    description={benefit.description}
                                    detail={benefit.detail}
                                    imageSrc={benefit.imageSrc}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* 통신사 혜택 */}
                {telcoBenefits.length > 0 && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>통신사 혜택</h3>
                        </div>
                        <div className={styles.benefitList}>
                            {telcoBenefits.map((benefit) => (
                                <BenefitListItem
                                    key={benefit.id}
                                    brand={decodedBrand}
                                    description={benefit.description}
                                    detail={benefit.detail}
                                    imageSrc={benefit.imageSrc}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
            <OwlScrollTop/>
        </div>
    );
};

export default BrandBenefitPage;
