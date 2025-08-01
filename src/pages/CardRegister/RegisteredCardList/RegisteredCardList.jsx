import React from 'react';
import styles from './RegisteredCardList.module.css';

function RegisteredCardList({ cards, onRemove }) {
    if (!cards || cards.length === 0) {
        return <p className={styles.empty}>등록된 카드가 없습니다.</p>;
    }

    return (
        <div className={styles.list}>
            {cards.map((card) => (
                <div key={card.id} className={styles.cardItem}>
                    <img src={card.image} alt={`${card.name} 이미지`} className={styles.thumbnail} />
                    <div className={styles.info}>
                        <p className={styles.name}>{card.name}</p>
                        <p className={styles.company}>{card.company}</p>
                    </div>
                    <button
                        className={styles.removeButton}
                        onClick={() => onRemove(card.id)}
                    >
                        삭제
                    </button>
                </div>
            ))}
        </div>
    );
}

export default RegisteredCardList;
