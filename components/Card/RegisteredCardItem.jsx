import React from 'react';
import styles from './RegisteredCardItem.module.css';
import { X } from 'lucide-react';

function RegisteredCardItem({ cardName, onDelete }) {
    return (
        <div className={styles.cardItem}>
            <span className={styles.cardName}>{cardName}</span>
            <button className={styles.deleteButton} onClick={onDelete}>
                <X size={16} />
            </button>
        </div>
    );
}

export default RegisteredCardItem;
