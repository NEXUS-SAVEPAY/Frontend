import React from 'react';
import styles from './OnboardingPage.module.css';
import characterImage from '../../assets/images/character.svg';
import SocialLoginButton from '../../components/Auth/SocialLoginButton';

const OnboardingPage = () => {
    const handleKakaoLogin = () => {
        console.log('카카오 로그인');
    };

    const handleNaverLogin = () => {
        console.log('네이버 로그인');
    };

    return (
        <div className={styles.container}>
            <img src={characterImage} alt="캐릭터" className={styles.character} />

            <h1 className={styles.logo}>SAVE PAY</h1>

            <p className={styles.description}>
                <strong>SavePay</strong>가 당신이 가지고 있는<br />
                결제 수단, 통신사로<br />
                원하는 곳에서 가장 저렴하게<br />
                결제하는 방법을 알려드려요.
            </p>

            <div className={styles.speechBubble}>
                간편하게 SNS로 시작하기 🚀
            </div>

            <div className={styles.loginDriver}>로그인/회원가입</div>

            <div className={styles.buttonWrapper}>
                <SocialLoginButton type="kakao" onClick={handleKakaoLogin} />
                <SocialLoginButton type="naver" onClick={handleNaverLogin} />
            </div>
        </div>
    );
};

export default OnboardingPage;
