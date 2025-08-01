// pages/Register/TelcoRegisterPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userTelcoInfoAtom } from '../../recoil/atoms/userInfoAtom';
import TelcoOption from '../../components/Telco/TelcoOption';
import MembershipSelector from '../../components/Telco/MembershipSelector';
import styles from './PayRegisterPage.module.css';

function TelcoRegisterPage() {
    const [selectedTelco, setSelectedTelco] = useState('');
    const [membershipInfo, setMembershipInfo] = useState(null);
    const navigate = useNavigate();

    const telcos = ['SKT', 'LG U+', 'KT', '알뜰폰'];

    const setUserTelcoInfo = useSetRecoilState(userTelcoInfoAtom);

    const handleNext = () => {
        setUserTelcoInfo({
            telco: selectedTelco,
            hasMembership: membershipInfo?.hasMembership,
            grade: membershipInfo?.grade || '',
        });
    
        navigate('/home'); // 다음 단계로
    };

    const showCompleteButton =
        (membershipInfo?.hasMembership === false) ||
        (membershipInfo?.hasMembership && membershipInfo?.grade);

    return (
        <div className={styles.container}>
            <div className={styles.fixedHeader}>
                {/* 기존 헤더 유지 */}
                <div className={styles.header}>
                    <span
                        className={styles.backButton}
                        onClick={() => navigate(-1)}
                    >
                        〈
                    </span>
                    <h2 className={styles.title}>통신사 등록</h2>
                </div>

                <div className={styles.stepContainer}>
                    <p className={styles.stepText}>3단계</p>
                    <div className={styles.progressBar}>
                        <div className={styles.thirdProgress} />
                    </div>
                </div>

                <p className={styles.subTitle}>사용중인 통신사를 등록해주세요.</p>
            </div>

            <div className={styles.scrollArea}>
                {/* 통신사 선택 or 선택된 곳만 MembershipSelector로 교체 */}
                <div className={styles.buttonGroup}>
                    {telcos.map((telco) => (
                        <div key={telco} className={styles.telcoItem}>
                            {selectedTelco === telco ? (
                                <MembershipSelector
                                    telco={telco}
                                    onComplete={(info) => setMembershipInfo(info)}
                                />
                            ) : (
                                <TelcoOption
                                    label={telco}
                                    selected={false}
                                    onClick={() => {
                                        setSelectedTelco(telco);
                                        setMembershipInfo(null);
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {showCompleteButton && (
                <button className={styles.completeButton} onClick={handleNext}>
                    완료
                </button>
            )}
        </div>
    );
}

export default TelcoRegisterPage;
