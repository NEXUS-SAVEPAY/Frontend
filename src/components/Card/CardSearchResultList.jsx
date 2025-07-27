import React from 'react';
import styles from './CardSearchResultList.module.css';

const CardSearchResultList = ({ cards, onDelete }) => {
    if (!cards || cards.length === 0) return null;

    return (
        <div className={styles.resultContainer}>
            {cards.map((card) => (
                <div key={card.id} className={styles.cardBox}>
                    <div className={styles.cardLeft}>
                        <img
                            src={card.image}
                            alt={`${card.company} 카드`}
                            className={styles.cardImage}
                        />
                    </div>
                    <div className={styles.cardRight}>
                        <span className={styles.companyBadge}>{card.company}</span>
                        <div className={styles.cardName}>{card.name}</div>
                        <button className={styles.closeButton} onClick={() => onDelete(card)}>×</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardSearchResultList;
