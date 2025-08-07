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

function PayRegisterPage({ isManageMode = false }) {
    const navigate = useNavigate();
    const savedPayment = useRecoilValue(userPaymentsAtom); // 현재 저장된 간편결제
    const setUserPayment = useSetRecoilState(userPaymentsAtom);

    const [selected, setSelected] = useState('');

    // 관리 모드일 때 기존 값 미리 설정
    useEffect(() => {
        if (isManageMode) {
            setSelected(savedPayment);
        }
    }, [isManageMode, savedPayment]);

    const handleSelect = (value) => {
        setSelected(value);
    };

    const handleComplete = () => {
        setUserPayment(selected);
        navigate('/register/telco');
    };

    const handleSave = () => {
        setUserPayment(selected);
        navigate('/manage-payment');
    };

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <div className={styles.fixedHeader}>
                <div className={styles.header}>
                    <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
                    <h2 className={styles.title}>
                        {isManageMode ? '등록된 간편결제' : '간편결제 등록'}
                    </h2>
                </div>

                {/* 진행 단계 (관리 모드에서는 생략) */}
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

            {/* 간편결제 선택 */}
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

            {/* 완료 or 저장 버튼 */}
            <div className={styles.fixedUnder}>
                {selected && (
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
