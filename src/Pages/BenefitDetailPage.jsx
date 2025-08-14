import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { selectedBenefitAtom } from '../recoil/atoms/selectedBenefitAtom';
import { HiChevronLeft } from 'react-icons/hi';
import ExternalLinkModal from '../components/Modal/ExternalLinkModal';
import styles from './BenefitDetailPage.module.css';
import owlImage from '../assets/images/character.svg';


function BenefitDetailPage() {
    const benefit = useRecoilValue(selectedBenefitAtom);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    if (!benefit) return <div className={styles.pageWrapper}>혜택 정보를 불러올 수 없습니다.</div>;

    const handleConfirm = () => {
        setShowModal(false);
        window.open(benefit.externalUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={styles.pageWrapper}>
            {/* 상단 헤더 */}
            <div className={styles.fixedHeader}>
                <div className={styles.header}>
                    <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
                    <h2 className={styles.title}>혜택 상세 보기</h2>
                </div>
            </div>

            <div className={styles.content}>
        

            {/* 브랜드 + 제목 + 설명 + 버튼 */}
            <div className={styles.summaryBox}>
                <span className={styles.brandTag}>{benefit.brand}</span>
                <h2 className={styles.benefitTitle}>{benefit.title}</h2>

                <div className={styles.subTextRow}>
                    <p className={styles.subText}>{benefit.description}</p>
                    <div className={styles.owlButtonWrapper}>
                        <img src={owlImage} alt="혜택 부엉이" className={styles.owlIcon} />
                        <button onClick={() => setShowModal(true)} className={styles.inlineButton}>
                            혜택 받기 &gt;
                        </button>
                    </div>
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

            {/* 하단 버튼 - 모달 열기 */}
            <button onClick={() => setShowModal(true)} className={styles.bottomButton}>
                혜택 받으러 이동하기
            </button>

            {/* 외부 링크 모달 */}
            <ExternalLinkModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirm}
            />
        </div>
        </div>
    );
}

export default BenefitDetailPage;
