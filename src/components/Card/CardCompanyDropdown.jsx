import React, { useState } from 'react';
import styles from './CardCompanyDropdown.module.css';

const companies = ['신한 카드', '삼성 카드', '롯데 카드', '현대 카드', '국민 카드'];

function CardCompanyDropdown({ onSelect }) {
    const [selected, setSelected] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (company) => {
        setSelected(company);
        onSelect(company);
        setIsOpen(false);
    };

    return (
        <div className={styles.wrapper}>
            <div
                className={`${styles.dropdownTrigger} ${selected && !isOpen ? styles.selected : ''}`}
                onClick={toggleDropdown}
            >
                <span>{selected || '카드사 선택'}</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <div className={styles.dropdownList}>
                    {companies.map((company, index) => (
                        <div
                            key={index}
                            className={styles.dropdownItem}
                            onClick={() => handleSelect(company)}
                        >
                            <span>{company}</span>
                            <span>▲</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CardCompanyDropdown;
