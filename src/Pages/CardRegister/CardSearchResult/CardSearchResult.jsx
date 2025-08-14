import React from 'react';
import styles from './CardSearchResult.module.css';

function CardSearchResult({ results, onRegister }) {
    if (!results || results.length === 0) {
        return <p className={styles.empty}>검색 결과가 없습니다.</p>;
    }

    return (
        <div className={styles.resultList}>
            {results.map((card) => (
                <div key={card.id} className={styles.cardBox}>
                    <img src={card.image} alt={`${card.name} 이미지`} className={styles.thumbnail} />
                    <div className={styles.info}>
                        <p className={styles.name}>{card.name}</p>
                        <p className={styles.company}>{card.company}</p>
                    </div>
                    <button
                        className={styles.registerButton}
                        onClick={() => onRegister(card)}
                    >
                        등록하기
                    </button>
                </div>
            ))}
        </div>
    );
}

export default CardSearchResult;
