import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userTelcoInfoAtom } from '../../recoil/atoms/userTelcoInfoAtom';
import { registerUserTelco, updateUserTelco, fetchUserTelco } from '../../services/api/telcoService';
import TelcoOption from '../../components/Telco/TelcoOption';
import MembershipSelector from '../../components/Telco/MembershipSelector';
import styles from './PayRegisterPage.module.css';

function TelcoRegisterPage({ isManageMode = false }) {
    const navigate = useNavigate();
    const setUserTelcoInfo = useSetRecoilState(userTelcoInfoAtom);
    const savedTelcoInfo = useRecoilValue(userTelcoInfoAtom); // 관리모드에서 불러올 값

    const [selectedTelco, setSelectedTelco] = useState('');
    const [membershipInfo, setMembershipInfo] = useState(null);



    const telcos = [
        { label: "SKT", value: "SKT" },
        { label: "LG U+", value: "LG" }, // 서버 enum에 맞춤
        { label: "KT", value: "KT" },
        { label: "알뜰폰", value: "MVNO" }, // 서버가 쓰는 값 확인 필요
    ];
    

    // 관리모드일 경우 서버에서 불러오기
    useEffect(() => {
        async function loadTelco() {
            if (isManageMode) {
                try {
                    const res = await fetchUserTelco();
                    if (res.isSuccess && res.result) {
                        setSelectedTelco(res.result.telecomName);
                        setMembershipInfo({
                            hasMembership: res.result.isMembership,
                            grade: res.result.grade,
                        });
                        setUserTelcoInfo({
                            telco: res.result.telecomName,
                            hasMembership: res.result.isMembership,
                            grade: res.result.grade,
                        });
                    }
                } catch (err) {
                    console.error('[TelcoRegisterPage] 통신사 불러오기 실패', err);
                }
            }
        }
        loadTelco();
    }, [isManageMode, setUserTelcoInfo]);

    const handleComplete = async () => {
        try {
            const payload = {
                telco: selectedTelco,
                hasMembership: membershipInfo?.hasMembership,
                grade: membershipInfo?.grade || '',
            };

            // 등록/수정 구분
            const res = isManageMode
            ? await updateUserTelco(payload) // 수정 (PUT)
            : await registerUserTelco(payload); // 등록 (POST)

            if (res.isSuccess) {
                setUserTelcoInfo(payload);
                navigate(isManageMode ? '/manage-payment' : '/home');
            } else {
                alert('저장 실패: ' + res.message);
            }
        } catch (err) {
        console.error('[TelcoRegisterPage] 저장 실패', err);
        alert('서버 오류가 발생했습니다.');
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
                    <div key={telco.value} className={styles.telcoItem}>
                        {selectedTelco === telco.value ? (
                        <MembershipSelector
                            telco={telco.label} // 화면에 보여줄 라벨
                            onComplete={(info) => setMembershipInfo(info)}
                            initialMembershipInfo={isManageMode ? membershipInfo : null}
                        />
                        ) : (
                        <TelcoOption
                            label={telco.label}   // 👈 TelcoOption에는 string만 전달
                            selected={false}
                            onClick={() => {
                            setSelectedTelco(telco.value); // 서버에 보낼 값 저장
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
