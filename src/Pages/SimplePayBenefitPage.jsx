import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecommendedBenefitPage.module.css';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import { fetchPayBenefits } from '../services/api/payBenefitApi';

function SimplePayBenefitPage() {
  const navigate = useNavigate();
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPayBenefits();
        setBenefits(data);
      } catch (err) {
        console.error('간편결제 혜택 불러오기 실패:', err);
        setErrMsg(err?.message || '불러오기에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      {/* 고정 헤더 */}
      <div className={styles.fixedHeader}>
        <div className={styles.header}>
          <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
          <h2 className={styles.title}>간편결제 혜택</h2>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className={styles.content}>
        {loading ? (
          null
        ) : errMsg ? (
          <p className={styles.errorText}>{errMsg}</p>
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
                // infoLink를 사용하는 컴포넌트 구현이라면 아래도 전달 가능
                infoLink={benefit.infoLink}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SimplePayBenefitPage;
