import React from 'react';
import styles from './PreviewBox.module.css';

function PreviewBox({ card, onDelete }) {
    if (!card) return null;

    return (
        <div className={styles.previewBox}>
            <img src={card.image} alt="카드 이미지" className={styles.cardImage} />

            <div className={styles.cardDetail}>
                <div className={styles.cardCompany}>{card.company}</div>
                <div className={styles.cardName}>{card.name}</div>
            </div>

            <button className={styles.deleteButton} onClick={onDelete}>
                ✕
            </button>
        </div>
    );
}

export default PreviewBox;
