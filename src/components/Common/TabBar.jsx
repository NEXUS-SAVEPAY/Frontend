import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './TabBar.module.css';

import homeIcon from '../../assets/icons/home.svg';
import homeFilledIcon from '../../assets/icons/home-colored.svg';
import registeredIcon from '../../assets/icons/registered-benefits.svg';
import registeredFilledIcon from '../../assets/icons/registered-benefits-colored.svg';
import mypageIcon from '../../assets/icons/mypage.svg';
import mypageFilledIcon from '../../assets/icons/mypageFilledIcon.png'; // ✅ 선택 아이콘

function TabBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <nav className={styles.tabBar}>
            <button className={styles.tab} onClick={() => navigate('/home')}>
                <img
                    src={currentPath === '/home' ? homeFilledIcon : homeIcon}
                    alt="홈"
                    className={styles.icon}
                />
            </button>

            <button className={styles.tab} onClick={() => navigate('/benefit/registered')}>
                <img
                    src={currentPath === '/benefit/registered' ? registeredFilledIcon : registeredIcon}
                    alt="등록 수단별 혜택"
                    className={styles.icon_benefit}
                />
            </button>

            <button className={styles.tab} onClick={() => navigate('/mypage')}>
                <img
                    src={currentPath === '/mypage' ? mypageFilledIcon : mypageIcon}
                    alt="마이페이지"
                    className={styles.icon}
                />
            </button>
        </nav>
    );
}

export default TabBar;
