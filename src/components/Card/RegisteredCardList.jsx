import React from 'react';
import RegisteredCardItem from './RegisteredCardItem';
import styles from './RegisteredCardList.module.css';

function RegisteredCardList({ cards, onDelete }) {
    return (
        <div className={styles.cardList}>
            {cards.length === 0 ? (
                <p className={styles.empty}>등록된 카드가 없습니다.</p>
            ) : (
                cards.map((card, index) => (
                    <RegisteredCardItem
                        key={index}
                        cardName={card}
                        onDelete={() => onDelete(index)}
                    />
                ))
            )}
        </div>
    );
}

export default RegisteredCardList;
