// src/pages/FavoriteBenefit/FavoriteBenefitPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { likedBrandsAtom } from '../recoil/atoms/likedBrandsAtom';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import favoriteBrandBenefits from '../data/favoriteBrandBenefits';
import styles from './FavoriteBenefitPage.module.css';
import OwlScrollTop from '../components/Common/OwlScrollTop';

const FavoriteBenefitPage = () => {
    const navigate = useNavigate();

    const [likedBrands, setLikedBrands] = useRecoilState(likedBrandsAtom);

    // 관심 브랜드만 필터링
    const likedBrandGroups = favoriteBrandBenefits.filter(
        (group) => likedBrands[group.brand]
    );

    // 좋아요 토글
    const toggleLike = (brand) => {
        setLikedBrands((prev) => ({
            ...prev,
            [brand]: !prev[brand],
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.fixedHeader}>
                <div className={styles.header}>
                    <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
                    <h2 className={styles.title}>관심 브랜드 혜택</h2>
                </div>
            </div>

            <div className={styles.content}>
                {likedBrandGroups.length === 0 ? (
                    <p className={styles.emptyMessage}>관심 브랜드가 없습니다.</p>
                ) : (
                    likedBrandGroups.map((brandGroup) => (
                        <div key={brandGroup.brand} className={styles.benefitListColumn}>
                            <div className={styles.brandTitleWrapper}>
                                <span className={styles.brandTitle}>{brandGroup.brand}</span>
                                <button
                                    className={styles.starButton}
                                    onClick={() => toggleLike(brandGroup.brand)}
                                >
                                    {likedBrands[brandGroup.brand] ? '★' : '☆'}
                                </button>
                            </div>
                            {brandGroup.benefits.map((benefit) => (
                                <BenefitListItem
                                    key={benefit.id}
                                    brand={brandGroup.brand}
                                    description={benefit.description}
                                    detail={benefit.detail}
                                    imageSrc={benefit.imageSrc}
                                />
                            ))}
                        </div>
                    ))
                )}
            </div>
            <OwlScrollTop/>
        </div>
    );
};

export default FavoriteBenefitPage;
