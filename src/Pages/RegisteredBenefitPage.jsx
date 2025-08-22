import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../components/Common/TabBar';

import styles from './RegisteredBenefitPage.module.css';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import owlImage from '../assets/images/character.svg';

import { fetchRegisteredPaymentTop2 } from '../services/api/registeredBenefitApi';

function RegisteredBenefitPage() {
  const navigate = useNavigate();

  const [cardTop2, setCardTop2] = useState([]);
  const [payTop2, setPayTop2] = useState([]);
  const [telcoTop2, setTelcoTop2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { card, pay, telco } = await fetchRegisteredPaymentTop2();
        setCardTop2(card ?? []);
        setPayTop2(pay ?? []);
        setTelcoTop2(telco ?? []);
      } catch (err) {
        console.error('등록 수단별 TOP2 혜택 불러오기 실패:', err);
        setErrMsg(err?.message || '혜택을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>등록 수단별 혜택</h2>

      {loading ? (
        <p>불러오는 중...</p>
      ) : errMsg ? (
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
              {(cardTop2 ?? []).map((benefit) => (
                <BenefitListItem
                  key={benefit.id}
                  id={benefit.id}
                  brand={benefit.brand}
                  description={benefit.description}
                  detail={benefit.detail}
                  imageSrc={benefit.imageSrc}
                  infoLink={benefit.infoLink}
                />
              ))}
              {cardTop2?.length === 0 && (
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
              {(payTop2 ?? []).map((benefit) => (
                <BenefitListItem
                  key={benefit.id}
                  id={benefit.id}
                  brand={benefit.brand}
                  description={benefit.description}
                  detail={benefit.detail}
                  imageSrc={benefit.imageSrc}
                  infoLink={benefit.infoLink}
                />
              ))}
              {payTop2?.length === 0 && (
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
              {(telcoTop2 ?? []).map((benefit) => (
                <BenefitListItem
                  key={benefit.id}
                  id={benefit.id}
                  brand={benefit.brand}
                  description={benefit.description}
                  detail={benefit.detail}
                  imageSrc={benefit.imageSrc}
                  infoLink={benefit.infoLink}
                />
              ))}
              {telcoTop2?.length === 0 && (
                <p className={styles.emptyText}>표시할 통신사 혜택이 없습니다.</p>
              )}
            </div>
          </section>
        </>
      )}

      {/* 위로가기 버튼 */}
      <div className={styles.owlButtonWrapper}>
        <img src={owlImage} alt="혜택 부엉이" className={styles.owlIcon} />
        <button className={styles.scrollTopButton} onClick={handleScrollTop}>↑</button>
      </div>

      {/* 하단 탭바 */}
      <TabBar />
    </div>
  );
}

export default RegisteredBenefitPage;
