import React from 'react';
import styles from './SocialLoginButton.module.css';
import kakaoIcon from '../../assets/images/kakao_logo.svg';
import naverIcon from '../../assets/images/naver_logo.svg';

const SocialLoginButton = ({ type, onClick }) => {
    const isKakao = type === 'kakao';

    return (
        <button
            className={isKakao ? styles.kakaoButton : styles.naverButton}
            onClick={onClick}
        >
            <img
                src={isKakao ? kakaoIcon : naverIcon}
                alt={`${type} 아이콘`}
                width="24"
                height="24"
            />
            {isKakao ? '카카오로 시작하기' : '네이버로 시작하기'}
        </button>
    );
};

export default SocialLoginButton;
