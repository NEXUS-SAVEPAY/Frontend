// PayRegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
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

const OPTIONS = [
    {
        type: 'kakao',
        label: '카카오 페이',
        icon: kakaoIcon,
        selectedIcon: kakaoSelectedIcon,
    },
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
    {
        type: 'payco',
        label: '페이코 페이',
        icon: paycoIcon,
        selectedIcon: paycoSelectedIcon,
    },
    {
        type: 'none',
        label: '간편결제 미사용',
        icon: noneIcon,
        selectedIcon: noneSelectedIcon,
    },
];

function PayRegisterPage() {
    const [selected, setSelected] = useState('');
    const setUserPayment = useSetRecoilState(userPaymentsAtom);
    const navigate = useNavigate();

    const handleSelect = (value) => {
        setSelected(value);
        setUserPayment(value);
    };

    const handleComplete = () => {
        navigate('/register/telco');
    };

    return (
        <div className={styles.container}>
            <div className={styles.fixedHeader}>
                <div className={styles.header}>
                    <span className={styles.backButton}
                    onClick={() => navigate(-1)} >
                    〈
                    </span>
                    <h2 className={styles.title}>간편결제 등록</h2>
                </div>

                <div className={styles.stepContainer}>
                    <p className={styles.stepText}>2단계</p>
                    <div className={styles.progressBar}>
                        <div className={styles.progress} />
                    </div>
                </div>

                <p className={styles.subTitle}>자주 사용하는 간편결제를 등록해주세요.</p>
            </div>

            <div className={styles.scrollArea}>
                {OPTIONS.map((option) => (
                    <SimplePayOption
                        key={option.type}
                        {...option}
                        selected={selected}
                        onSelect={handleSelect}
                    />
                ))}
            </div>

            {/* 완료 버튼 */}
            <div className={styles.fixedUnder}>
                {selected && (
                    <button className={styles.completeButton} onClick={handleComplete}>완료</button>
                )}
            </div>
        </div>
    );
}

export default PayRegisterPage;
