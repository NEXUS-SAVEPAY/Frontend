import React from 'react';
import styles from './ExternalLinkModal.module.css';

function ExternalLinkModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.icon}>✨</div>
                <p className={styles.title}>해당 혜택을 받으러<br />외부사이트로 이동하시겠습니까?</p>
                <p className={styles.subtitle}>외부사이트 접속 시 앱은 종료됩니다.</p>
                <div className={styles.buttonGroup}>
                    <button className={styles.confirm} onClick={onConfirm}>네</button>
                    <button className={styles.cancel} onClick={onClose}>아니오</button>
                </div>
            </div>
        </div>
    );
}

export default ExternalLinkModal;
