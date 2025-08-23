// src/pages/Onboarding/OnboardingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OnboardingPage.module.css';
import characterImage from '../../assets/images/character.svg';
import SocialLoginButton from '../../components/Auth/SocialLoginButton';


export default function OnboardingPage() {
const navigate = useNavigate();

const handleKakaoLogin = () => {
    // ⛔️ fetch로 호출하면 CORS/302에 막힘
    window.location.href = 'http://3.35.204.188:8080/oauth2/authorization/kakao';
};

const handleNaverLogin = () => {
    window.location.href = 'http://3.35.204.188:8080/oauth2/authorization/naver';
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
    <div className={styles.speechBubble}>간편하게 SNS로 시작하기 🚀</div>
    <div className={styles.loginDriver}>로그인/회원가입</div>
    <div className={styles.buttonWrapper}>
        <SocialLoginButton type="kakao" onClick={handleKakaoLogin} />
        <SocialLoginButton type="naver" onClick={handleNaverLogin} />
    </div>
    </div>
);
}
