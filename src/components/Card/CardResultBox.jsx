import React from 'react';
import styles from './CardResultBox.module.css';

function CardResultBox({ cardName, benefitSummary, onRegister }) {
    return (
        <div className={styles.cardBox}>
            <div className={styles.cardInfo}>
                <h3 className={styles.cardName}>{cardName}</h3>
                <p className={styles.benefit}>{benefitSummary}</p>
            </div>
            <button className={styles.registerButton} onClick={onRegister}>
                등록
            </button>
        </div>
    );
}

export default CardResultBox;
