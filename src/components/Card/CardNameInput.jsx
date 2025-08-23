import React from 'react';
import styles from './CardNameInput.module.css';
import { Search } from 'lucide-react';

const CardNameInput = ({ value, onChange, onSearch }) => {
    return (
        <div className={styles.container}>
            <div className={styles.inputWrapper}>
                
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="카드 이름 검색"
                    className={styles.input}
                />
                <Search size={18} className={styles.icon} />
            </div>

        </div>
    );
};

export default CardNameInput;