import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar() {
    const [searchText, setSearchText] = useState('');

    const handleChange = (e) => setSearchText(e.target.value);

    return (
        <div className="searchbar-container">
            <input
                type="text"
                value={searchText}
                onChange={handleChange}
                placeholder="혜택 받고 싶은 브랜드를 검색해주세요"
            />
        </div>
    );
}

export default SearchBar;
