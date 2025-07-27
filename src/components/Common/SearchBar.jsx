import React from 'react';
import styles from './SearchBar.module.css';

function SearchBar({ placeholder }) {
    return (
        <div className={styles.searchBar}>
            <input
                className={styles.input}
                type="text"
                placeholder={placeholder}
            />
        </div>
    );
}

export default SearchBar;
