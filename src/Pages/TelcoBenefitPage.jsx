import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecommendedBenefitPage.module.css';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import { fetchTelcoBenefits } from '../services/api/telcoBenefitApi';

function TelcoBenefitPage() {
    const navigate = useNavigate();
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchTelcoBenefits();
                setBenefits(data);
            } catch (err) {
                console.error('통신사 혜택 불러오기 실패:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <div className={styles.container}>
            {/* 고정 헤더 */}
            <div className={styles.fixedHeader}>
                <div className={styles.header}>
                    <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
                    <h2 className={styles.title}>통신사 혜택</h2>
                </div>
            </div>

            {/* 콘텐츠 */}
            <div className={styles.content}>
                {loading ? (
                    <p>불러오는 중...</p>
                ) : (
                    <div className={styles.benefitListColumn}>
                        {benefits.map((benefit) => (
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
                )}
            </div>
        </div>
    );
}

export default TelcoBenefitPage;
