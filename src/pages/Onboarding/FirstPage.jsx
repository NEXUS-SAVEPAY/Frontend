import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FirstPage.module.css';
import characterImg from '../../assets/images/character.svg';
import logoImg from '../../assets/images/logo.svg';

function FirstPage() {
    const navigate = useNavigate();
    const [startTransition, setStartTransition] = useState(false);

    useEffect(() => {
        const transitionTimer = setTimeout(() => {
            setStartTransition(true); // 부엉이 위로 이동 시작
        }, 1500); // 1.5초 후 이동

        const navTimer = setTimeout(() => {
            navigate('/onboarding');
        }, 2200); // 부드럽게 끝난 후 이동

        return () => {
            clearTimeout(transitionTimer);
            clearTimeout(navTimer);
        };
    }, [navigate]);

    return (
        <div className={`${styles.splashWrapper} ${startTransition ? styles['fade-out'] : ''}`}>
            <img
                src={characterImg}
                alt="부엉이 캐릭터"
                className={`${styles.character} ${startTransition ? styles['move-up'] : ''}`}
            />
            <img src={logoImg} alt="SAVE PAY 로고" className={styles.logo} />
        </div>
    );
}

export default FirstPage;
