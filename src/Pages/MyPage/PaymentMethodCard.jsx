import React from 'react';
import styles from './PaymentMethodCard.module.css';

function PaymentMethodCard({ type, card, onDelete }) {
    return (
        <div className={styles.cardContainer}>
            <div className={styles.cardInfo}>
                <img src={card.image} alt={`${card.name} 이미지`} className={styles.cardImage} />
                <div>
                    <span className={styles.tag}>{card.tag}</span>
                    <p className={styles.name}>{card.name}</p>
                </div>
            </div>
            <button className={styles.deleteButton} onClick={() => onDelete(type, card.id)}>
                삭제
            </button>
        </div>
    );
}

export default PaymentMethodCard;
