import React from 'react';
import styles from './CardSearchResultList.module.css';

function CardResultListSingle({ card, onDelete, showDelete = false }) {
    if (!card) return null;

    return (
        <div className={styles.resultContainer}>
            <div className={styles.cardBox}>
                <div className={styles.cardLeft}>
                    <img
                        src={card.image}
                        alt={`${card.company} 카드`}
                        className={styles.cardImage}
                    />
                </div>
                <div className={styles.cardRight}>
                    {showDelete && (
                        <button className={styles.closeButton} onClick={() => onDelete(card)}>×</button>
                    )}
                    <span className={styles.companyBadge}>{card.company}</span>
                    <div className={styles.cardName}>{card.name}</div>
                </div>
            </div>
        </div>
    );
}

export default CardResultListSingle;
