import React from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { selectedBenefitAtom } from '../recoil/atoms/selectedBenefitAtom';
import { HiChevronLeft } from 'react-icons/hi';
import styles from './BenefitDetailPage.module.css';

function BenefitDetailPage() {
    const benefit = useRecoilValue(selectedBenefitAtom);
    const navigate = useNavigate();

    if (!benefit) return <div className={styles.pageWrapper}>혜택 정보를 불러올 수 없습니다.</div>;

    return (
        <div className={styles.pageWrapper}>
            {/* 상단 헤더 */}
             <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    <HiChevronLeft size={24} />
                </button>
                <div className={styles.title}>혜택 상세 보기</div>
            </div>
            {/* 이미지 */}
            <img src={benefit.image} alt="혜택 이미지" className={styles.storeImage} />

            {/* 브랜드 + 제목 + 설명 + 버튼 */}
            <div className={styles.summaryBox}>
                <span className={styles.brandTag}>{benefit.brand}</span>
                <h2 className={styles.benefitTitle}>{benefit.title}</h2>

                <div className={styles.subTextRow}>
                    <p className={styles.subText}>{benefit.description}</p>
                    <button className={styles.inlineButton}>혜택 받기 &gt;</button>
                </div>
            </div>

            {/* 혜택 내역 */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>혜택 내역</div>
                <div className={styles.benefitGrid}>
                    {benefit.cashback && (
                        <div className={styles.benefitBox}>
                            <div className={styles.label}>캐시백</div>
                            <div className={styles.value}>{benefit.cashback}</div>
                        </div>
                    )}
                    {benefit.point && (
                        <div className={styles.benefitBox}>
                            <div className={styles.label}>포인트</div>
                            <div className={styles.value}>{benefit.point}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* 혜택 받는 방법 */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>혜택 받는 방법</div>
                <div className={styles.instructionContainer}>
                    <ol className={styles.instructionList}>
                        {(benefit.instructions ?? benefit.steps ?? []).map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* 하단 버튼 */}
            <a
                href={benefit.externalUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bottomButton}
            >
                혜택 받으러 이동하기
            </a>
        </div>
    );
}

export default BenefitDetailPage;
