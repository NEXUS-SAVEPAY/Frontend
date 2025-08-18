// src/pages/PayRegister/PayRegisterPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userPaymentsAtom } from '../../recoil/atoms/userPaymentsAtom';
import SimplePayOption from '../../components/Payment/SimplePayOption';
import styles from './PayRegisterPage.module.css';

import kakaoIcon from '../../assets/icons/kakao.svg';
import kakaoSelectedIcon from '../../assets/icons/kakao_select.svg';

import naverIcon from '../../assets/icons/naver.svg';
import naverSelectedIcon from '../../assets/icons/naver_select.svg';

import tossIcon from '../../assets/icons/toss.svg';
import tossSelectedIcon from '../../assets/icons/toss_select.svg';

import paycoIcon from '../../assets/icons/payco.svg';
import paycoSelectedIcon from '../../assets/icons/payco_select.svg';

import noneIcon from '../../assets/icons/none.svg';
import noneSelectedIcon from '../../assets/icons/none_select.svg';

import { registerSimplePays, updateSimplePays } from '../../services/api/payApi';

const OPTIONS = [
  { type: 'kakao', label: '카카오 페이', icon: kakaoIcon, selectedIcon: kakaoSelectedIcon },
  {
    type: 'naver',
    label: '네이버 페이',
    icon: naverIcon,
    selectedIcon: naverSelectedIcon,
    options: [{ value: 'naver_membership', label: '네이버 멤버십 사용' }],
  },
  {
    type: 'toss',
    label: '토스 페이',
    icon: tossIcon,
    selectedIcon: tossSelectedIcon,
    options: [{ value: 'toss_prime', label: '토스 프라임 사용' }],
  },
  { type: 'payco', label: '페이코 페이', icon: paycoIcon, selectedIcon: paycoSelectedIcon },
  { type: 'none', label: '간편결제 미사용', icon: noneIcon, selectedIcon: noneSelectedIcon },
];

// 프론트 타입 → 백엔드 ENUM 매핑
const PROVIDER_MAP = {
  kakao: 'KAKAO',
  naver: 'NAVER',
  toss: 'TOSS',
  payco: 'PAYCO',
  none: 'NONE',
};

// selected 배열을 스웨거 바디로 변환
function buildPayRequestList(selected) {
  if (selected.includes('none')) {
    return [{ payProvider: PROVIDER_MAP.none, isMemberShip: false }];
  }

  const has = (key) => selected.includes(key);
  const entries = [];

  if (has('kakao')) entries.push({ payProvider: PROVIDER_MAP.kakao, isMemberShip: false });

  if (has('naver') || has('naver_membership')) {
    entries.push({
      payProvider: PROVIDER_MAP.naver,
      isMemberShip: has('naver_membership'),
    });
  }

  if (has('toss') || has('toss_prime')) {
    entries.push({
      payProvider: PROVIDER_MAP.toss,
      isMemberShip: has('toss_prime'),
    });
  }

  if (has('payco')) entries.push({ payProvider: PROVIDER_MAP.payco, isMemberShip: false });

  return entries;
}

function PayRegisterPage({ isManageMode = false }) {
  const navigate = useNavigate();
  const savedPayment = useRecoilValue(userPaymentsAtom);
  const setUserPayment = useSetRecoilState(userPaymentsAtom);

  const [selected, setSelected] = useState([]);

  // 관리 모드일 때 기존 값 세팅 (string 호환)
  useEffect(() => {
    if (!isManageMode) return;
    if (Array.isArray(savedPayment)) setSelected(savedPayment);
    else if (typeof savedPayment === 'string' && savedPayment) setSelected([savedPayment]);
    else setSelected([]);
  }, [isManageMode, savedPayment]);

  // 클릭 토글
  const handleSelect = (value) => {
    setSelected((prev) => {
      if (value === 'none') return prev.includes('none') ? [] : ['none'];

      if (value.includes('_')) {
        const parent = value.split('_')[0];
        const base = prev.filter((v) => v !== 'none' && !(v.startsWith(parent + '_')));
        const ensureParent = base.includes(parent) ? base : [...base, parent];
        return ensureParent.includes(value)
          ? ensureParent.filter((v) => v !== value)
          : [...ensureParent, value];
      }

      const base = prev.filter((v) => v !== 'none');
      if (base.includes(value)) {
        return base.filter((v) => v !== value && !v.startsWith(value + '_'));
      }
      return [...base, value];
    });
  };

  // 서버 반영 + 로컬 상태 갱신 + 다음 단계 이동
  const persistAndThen = async (next) => {
    try {
      const list = buildPayRequestList(selected);

      if (list.length === 0) {
        setUserPayment(selected);
        next();
        return;
      }

      if (isManageMode) {
        await updateSimplePays(list);   // 수정(PUT)
      } else {
        await registerSimplePays(list); // 신규(POST)
      }

      setUserPayment(selected);
      next();
    } catch (err) {
      console.error(err);
      window.alert(err?.message || '간편결제 저장 중 오류가 발생했습니다.');
    }
  };

  const handleComplete = () => {
    persistAndThen(() => navigate('/register/telco'));
  };

  const handleSave = () => {
    persistAndThen(() => navigate('/manage-payment'));
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.fixedHeader} ${isManageMode ? styles.headerCompact : ''}`}>
        <div className={styles.header}>
          <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
          <h2 className={styles.title}>
            {isManageMode ? '등록된 간편결제' : '간편결제 등록'}
          </h2>
        </div>

        {!isManageMode && (
          <div className={styles.stepContainer}>
            <p className={styles.stepText}>2단계</p>
            <div className={styles.progressBar}>
              <div className={styles.secondProgress} />
            </div>
          </div>
        )}

        {!isManageMode && (
          <p className={styles.subTitle}>자주 사용하는 간편결제를 등록해주세요.</p>
        )}
      </div>

      <div className={`${styles.scrollArea} ${isManageMode ? styles.manageScrollArea_pay : ''}`}>
        {OPTIONS.map((option) => (
          <SimplePayOption
            key={option.type}
            {...option}
            selected={selected}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <div className={styles.fixedUnder}>
        {selected.length > 0 && (
          <button
            className={styles.completeButton}
            onClick={isManageMode ? handleSave : handleComplete}
          >
            {isManageMode ? '저장' : '완료'}
          </button>
        )}
      </div>
    </div>
  );
}

export default PayRegisterPage;
