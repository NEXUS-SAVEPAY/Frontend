import React from 'react';
import styles from './ExternalLinkModal.module.css';
import money from '../../assets/images/money.svg';

function ExternalLinkModal() {

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.icon}><img src={money} alt="돈 아이콘" /></div>
                <p className={styles.title}>등록하신 결제 수단 중<br />새로운 혜택이 나왔습니다.</p>
                <p className={styles.subtitle}>혜택을 받으러 가시겠습니까?</p>
                <div className={styles.buttonGroup}>
                    <button className={styles.confirm} >네</button>
                    <button className={styles.cancel} >아니오</button>
                </div>
            </div>
        </div>
    );
}

export default ExternalLinkModal;
