import React, { useState } from 'react';
import styles from './SearchBar.module.css';
import searchIcon from '../../assets/images/search.svg';

function SearchBar({ placeholder, onSearch }) {
    const [inputValue, setInputValue] = useState('');

    const handleSearch = () => {
        if (inputValue.trim()) {
            onSearch?.(inputValue.trim());
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className={styles.searchBar}>
            <input
                className={styles.input}
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
                <img src={searchIcon} alt="검색" className={styles.searchIcon} />
            </button>
        </div>
    );
}

export default SearchBar;
