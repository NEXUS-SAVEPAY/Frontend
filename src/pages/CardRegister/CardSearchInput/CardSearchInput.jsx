import React from 'react';
import styles from './CardSearchInput.module.css';
import { Search } from 'lucide-react';

function CardSearchInput({ cardName, setCardName, onSearch }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.inputWrapper}>
                <Search className={styles.icon} size={16} />
                <input
                    type="text"
                    placeholder="카드 이름 검색"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className={styles.input}
                />
                <button className={styles.searchButton} onClick={onSearch}>
                    카드 검색 하기
                </button>
            </div>
        </div>
    );
}

export default CardSearchInput;
