import React from 'react';
import styles from './TabBar.module.css';

function TabBar() {
    return (
        <nav className={styles.tabBar}>
            <button className={styles.tab}>홈</button>
            <button className={styles.tab}>등록 수단별 혜택</button>
            <button className={styles.tab}>마이페이지</button>
        </nav>
    );
}

export default TabBar;
