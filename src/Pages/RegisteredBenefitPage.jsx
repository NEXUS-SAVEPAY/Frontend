// src/pages/RegisteredBenefitPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../components/Common/TabBar';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import styles from './RegisteredBenefitPage.module.css';
import owlImage from '../assets/images/character.svg';

import { fetchRegisteredPaymentTop2 } from '../services/api/registeredBenefitApi';

function RegisteredBenefitPage() {
    const navigate = useNavigate();

    const [cardTop2, setCardTop2] = useState([]);
    const [payTop2, setPayTop2] = useState([]);
    const [telcoTop2, setTelcoTop2] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState('');

    // 서버에서 등록된 결제수단별 TOP2 조회
    useEffect(() => {
        (async () => {
            try {
                const { card, pay, telco } = await fetchRegisteredPaymentTop2();
                setCardTop2(card ?? []);
                setPayTop2(pay ?? []);
                setTelcoTop2(telco ?? []);
            } catch (e) {
                console.error('등록 수단별 TOP2 불러오기 실패:', e);
                setErrMsg(e?.message || '혜택을 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>등록 수단별 혜택</h2>

            {loading ? null : errMsg ? (
                <p className={styles.errorText}>{errMsg}</p>
            ) : (
                <>
                    {/* 카드 혜택 TOP2 */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>카드 혜택 TOP2</h3>
                            <button
                                className={styles.viewAllButton}
                                onClick={() => navigate('/benefit/cards')}
                            >
                                전체 보기 〉
                            </button>
                        </div>
                        <div className={styles.benefitList}>
                            {cardTop2.map((b) => (
                                <BenefitListItem
                                    key={`card-${b.id}`}
                                    id={b.id}
                                    brand={b.brand}
                                    description={b.description}
                                    detail={b.detail}
                                    imageSrc={b.imageSrc}
                                    infoLink={b.infoLink}
                                />
                            ))}
                            {cardTop2.length === 0 && (
                                <p className={styles.emptyText}>표시할 카드 혜택이 없습니다.</p>
                            )}
                        </div>
                    </section>

                    {/* 간편결제 혜택 TOP2 */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>간편결제 혜택 TOP2</h3>
                            <button
                                className={styles.viewAllButton}
                                onClick={() => navigate('/benefit/simplepay')}
                            >
                                전체 보기 〉
                            </button>
                        </div>
                        <div className={styles.benefitList}>
                            {payTop2.map((b) => (
                                <BenefitListItem
                                    key={`pay-${b.id}`}
                                    id={b.id}
                                    brand={b.brand}
                                    description={b.description}
                                    detail={b.detail}
                                    imageSrc={b.imageSrc}
                                    infoLink={b.infoLink}
                                />
                            ))}
                            {payTop2.length === 0 && (
                                <p className={styles.emptyText}>표시할 간편결제 혜택이 없습니다.</p>
                            )}
                        </div>
                    </section>

                    {/* 통신사 혜택 TOP2 */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>통신사 혜택 TOP2</h3>
                            <button
                                className={styles.viewAllButton}
                                onClick={() => navigate('/benefit/telco')}
                            >
                                전체 보기 〉
                            </button>
                        </div>
                        <div className={styles.benefitList}>
                            {telcoTop2.map((b) => (
                                <BenefitListItem
                                    key={`telco-${b.id}`}
                                    id={b.id}
                                    brand={b.brand}
                                    description={b.description}
                                    detail={b.detail}
                                    imageSrc={b.imageSrc}
                                    infoLink={b.infoLink}
                                />
                            ))}
                            {telcoTop2.length === 0 && (
                                <p className={styles.emptyText}>표시할 통신사 혜택이 없습니다.</p>
                            )}
                        </div>
                    </section>
                </>
            )}

            {/* 위로가기 */}
            <div className={styles.owlButtonWrapper}>
                <img src={owlImage} alt="혜택 부엉이" className={styles.owlIcon} />
                <button
                    className={styles.scrollTopButton}
                    onClick={handleScrollTop}
                >
                    ↑
                </button>
            </div>

            <TabBar />
        </div>
    );
}

export default RegisteredBenefitPage;
