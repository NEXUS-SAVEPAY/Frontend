import React from 'react';
import styles from './CardNameInput.module.css';
import { Search } from 'lucide-react';

const CardNameInput = ({ value, onChange, onSearch }) => {
    return (
        <div className={styles.container}>
            <div className={styles.inputWrapper}>
                <Search size={18} className={styles.icon} />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="카드 이름 검색"
                    className={styles.input}
                />
            </div>

            <div className={styles.buttonWrapper}>
                <button className={styles.searchButton} onClick={onSearch}>
                    카드 검색 하기
                </button>
            </div>
        </div>
    );
};

export default CardNameInput;