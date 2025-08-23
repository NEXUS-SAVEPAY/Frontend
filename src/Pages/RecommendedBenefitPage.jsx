// src/pages/RecommendedBenefitPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './RecommendedBenefitPage.module.css';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import recommendedBenefits from '../data/mockRecommendBenefits';
import OwlScrollTop from '../components/Common/OwlScrollTop';

// ✅ API
import { fetchRecommendedBenefits } from '../services/api/benefitApi';

function RecommendedBenefitPage() {
    const navigate = useNavigate();

    const [recBenefits, setRecBenefits] = useState(null); // ⬅️ 초기값 null (아직 로딩 전)
    const [isLoaded, setIsLoaded] = useState(false);      // ⬅️ 로딩 완료 여부

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchRecommendedBenefits();
                const list = Array.isArray(data?.result) ? data.result : [];
                const mapped = list.map((it) => ({
                    id: it.id,
                    brand: it.brandName,
                    description: `${it.discountPercent}% ${it.discountType}`,
                    detail: it.details,
                    imageSrc: it.brandImage || '',
                }));
                setRecBenefits(mapped);
            } catch (e) {
                // 실패 시 → 목데이터 사용
                setRecBenefits([]);
            } finally {
                setIsLoaded(true); // 로딩 끝
            }
        })();
    }, []);

    // 서버 성공 시 → 서버 데이터, 실패 시 → 목데이터
    const displayBenefits =
        recBenefits && recBenefits.length > 0
            ? recBenefits
            : recBenefits !== null // 서버 호출 끝났는데 데이터 없음 → fallback
                ? recommendedBenefits
                : [];

    return (
        <div className={styles.container}>
            {/* 고정 헤더 */}
            <div className={styles.fixedHeader}>
                <div className={styles.header}>
                    <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
                    <h2 className={styles.title}>추천 혜택</h2>
                </div>
            </div>

            {/* 콘텐츠 */}
            <div className={styles.content}>
                <div className={styles.benefitListColumn}>
                    {isLoaded && displayBenefits.map((benefit) => (
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
