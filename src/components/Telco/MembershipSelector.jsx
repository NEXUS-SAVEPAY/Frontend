// components/Telco/MembershipSelector.js
import { useState } from 'react';
import styles from './MembershipSelector.module.css';

function MembershipSelector({ telco, onComplete }) {
    const [hasMembership, setHasMembership] = useState(null);
    const [grade, setGrade] = useState('');

    const handleYes = () => {
        setHasMembership(true);
        setGrade(''); // 이전 등급 초기화
        onComplete(null); // 완료 버튼 비활성화를 위해 초기화 전달
    };

    const handleNo = () => {
        setHasMembership(false);
        setGrade(''); // 등급 초기화
        onComplete({ hasMembership: false, grade: '' });
    };

    const handleGradeSelect = (selectedGrade) => {
        setGrade(selectedGrade);
        onComplete({ hasMembership: true, grade: selectedGrade });
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>{telco}</div>
            <div className={styles.question}>통신사 멤버십에 가입하셨나요?</div>
            <div className={styles.buttonGroup}>
                <button
                    className={`${styles.button} ${hasMembership === true ? styles.active : ''}`}
                    onClick={handleYes}
                >
                    네
                </button>
                <button
                    className={`${styles.button} ${hasMembership === false ? styles.active : ''}`}
                    onClick={handleNo}
                >
                    아니요
                </button>
            </div>

            {hasMembership && (
                <>
                    <div className={styles.gradeQuestion}>멤버십 등급을 선택해주세요.</div>
                    <div className={styles.gradeGroup}>
                        {['SILVER', 'GOLD', 'VIP'].map((g) => (
                            <button
                                key={g}
                                className={`${styles.gradeButton} ${grade === g ? styles.active : ''}`}
                                onClick={() => handleGradeSelect(g)}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                    <p className={styles.guide}>
                        통신사 멤버십의 가입 여부 및 등급을 모르신다면<br />
                        멤버십 어플이나 홈페이지에서 확인해주세요.
                    </p>
                </>
            )}
        </div>
    );
}

export default MembershipSelector;
