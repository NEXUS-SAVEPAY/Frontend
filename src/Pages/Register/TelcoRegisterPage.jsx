import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userTelcoInfoAtom } from '../../recoil/atoms/userTelcoInfoAtom';
import TelcoOption from '../../components/Telco/TelcoOption';
import MembershipSelector from '../../components/Telco/MembershipSelector';
import styles from './PayRegisterPage.module.css';

function TelcoRegisterPage({ isManageMode = false }) {
    const navigate = useNavigate();
    const setUserTelcoInfo = useSetRecoilState(userTelcoInfoAtom);
    const savedTelcoInfo = useRecoilValue(userTelcoInfoAtom); // 관리모드에서 불러올 값

    const [selectedTelco, setSelectedTelco] = useState('');
    const [membershipInfo, setMembershipInfo] = useState(null);

    const telcos = ['SKT', 'LG U+', 'KT', '알뜰폰'];

    // 관리모드일 경우 기존 값 미리 셋팅
    useEffect(() => {
        if (isManageMode && savedTelcoInfo) {
            setSelectedTelco(savedTelcoInfo.telco || '');
            setMembershipInfo({
                hasMembership: savedTelcoInfo.hasMembership,
                grade: savedTelcoInfo.grade || '',
            });
        }
    }, [isManageMode, savedTelcoInfo]);

    const handleComplete = () => {
        setUserTelcoInfo({
            telco: selectedTelco,
            hasMembership: membershipInfo?.hasMembership,
            grade: membershipInfo?.grade || '',
        });

        // 등록 모드 → 홈으로, 관리 모드 → manage-payment로
        if (isManageMode) {
            navigate('/manage-payment');
        } else {
            navigate('/home');
        }
    };

    const showCompleteButton =
        (membershipInfo?.hasMembership === false) ||
        (membershipInfo?.hasMembership && membershipInfo?.grade);

    return (
        <div className={styles.container}>
            <div className={styles.fixedHeader}>
                <div className={styles.header}>
                    <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
                    <h2 className={styles.title}>
                        {isManageMode ? '등록된 통신사' : '통신사 등록'}
                    </h2>
                </div>

                {!isManageMode && (
                    <div className={styles.stepContainer}>
                        <p className={styles.thirdstepText}>3단계</p>
                        <div className={styles.progressBar}>
                            <div className={styles.thirdProgress} />
                        </div>
                    </div>
                )}

                {!isManageMode && (
                    <p className={styles.subTitle}>사용중인 통신사를 등록해주세요.</p>
                )}
            </div>

            <div className={`${styles.scrollArea} ${isManageMode ? styles.manageScrollArea_telco : ''}`}>
                <div className={styles.buttonGroup}>
                    {telcos.map((telco) => (
                        <div key={telco} className={styles.telcoItem}>
                            {selectedTelco === telco ? (
                                <MembershipSelector
                                    telco={telco}
                                    onComplete={(info) => setMembershipInfo(info)}
                                    initialMembershipInfo={
                                        isManageMode ? membershipInfo : null
                                    }
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
                <button
                    className={styles.completeButton}
                    onClick={handleComplete}
                >
                    {isManageMode ? '저장' : '완료'}
                </button>
            )}
        </div>
    );
}

export default TelcoRegisterPage;
