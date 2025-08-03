// src/pages/FavoriteBenefit/FavoriteBenefitPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { likedBrandsAtom } from '../recoil/atoms/likedBrandsAtom';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import styles from './FavoriteBenefitPage.module.css';

const FavoriteBenefitPage = () => {
    const navigate = useNavigate();

    // Recoil 상태 사용
    const [likedBrands, setLikedBrands] = useRecoilState(likedBrandsAtom);

    const likedBrandList = Object.entries(likedBrands)
    .filter(([_, isLiked]) => isLiked)
    .map(([brand]) => brand);

    const toggleLike = (brand) => {
        setLikedBrands((prev) => ({
            ...prev,
            [brand]: !prev[brand],
        }));
    };

    const favoriteBrandBenefits = [
        {
            brand: '올리브영',
            benefits: [
                {
                    id: 1,
                    description: '10% 캐시백',
                    detail: '등록하신 카드로 매장에서 결제해주세요.',
                    imageSrc: '/assets/images/oliveyoung.svg'
                },

                {
                    id: 2,
                    description: '10% 캐시백',
                    detail: '등록하신 카드로 매장에서 결제해주세요.',
                    imageSrc: '/assets/images/oliveyoung.svg'
                }
            ]
            
        },
        {
            brand: '스타벅스',
            benefits: [
                {
                    id: 3,
                    description: '10% 캐시백',
                    detail: '등록하신 카드로 매장에서 결제해주세요.',
                    imageSrc: '/assets/images/starbucks.svg'
                },
                {
                    id: 4,
                    description: '10% 캐시백',
                    detail: '등록하신 카드로 매장에서 결제해주세요.',
                    imageSrc: '/assets/images/starbucks.svg'
                }
            ]
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.fixedHeader}>
                <div className={styles.header}>
                    <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
                    <h2 className={styles.title}>관심 브랜드 혜택</h2>
                </div>
            </div>

            <div className={styles.content}>
                {favoriteBrandBenefits.map((brandGroup) => (
                    <div key={brandGroup.brand} className={styles.benefitListColumn}>
                        <div className={styles.brandTitleWrapper}>
                            <span className={styles.brandTitle}>{brandGroup.brand}</span>
                            <button
                                className={styles.starButton}
                                onClick={() => toggleLike(brandGroup.brand)}
                            >
                                {likedBrands[brandGroup.brand] ? '☆' : '★'}
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
                ))}
            </div>
        </div>
    );
};

export default FavoriteBenefitPage;