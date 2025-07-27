// components/Card/CardCompanyDropdown.jsx
import React, { useState } from 'react';
import styles from './CardCompanyDropdown.module.css';

const CARD_COMPANIES = ['신한 카드', '삼성 카드', '롯데 카드', '현대 카드', '국민 카드'];

function CardCompanyDropdown({ onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('카드사 선택');

    const handleSelect = (company) => {
        setSelected(company);
        onSelect(company);
        setIsOpen(false);
    };

    return (
        <div className={styles.dropdown}>
            <div className={styles.selected} onClick={() => setIsOpen(!isOpen)}>
                {selected}
                <span className={styles.arrow}>▾</span>
            </div>
            {isOpen && (
                <ul className={styles.options}>
                    {CARD_COMPANIES.map((company) => (
                        <li
                            key={company}
                            className={styles.optionItem}
                            onClick={() => handleSelect(company)}
                        >
                            {company}
                            <span className={styles.optionarrow}>▴</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CardCompanyDropdown;
