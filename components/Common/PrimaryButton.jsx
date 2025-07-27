import React from 'react';
import styles from './PrimaryButton.module.css'; // 없으면 생략 가능

function PrimaryButton({ label, onClick }) {
    return (
        <button className={styles.button} onClick={onClick}>
            {label}
        </button>
    );
}

export default PrimaryButton;
