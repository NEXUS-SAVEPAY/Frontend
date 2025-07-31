import React, { useState, useEffect } from 'react';
import styles from './CardCompanyDropdown.module.css';

const companies = ['신한 카드', '삼성 카드', '롯데 카드', '현대 카드', '국민 카드'];

function CardCompanyDropdown({ onSelect, onToggleOpen, selected }) {
    const [selectedInternal, setSelectedInternal] = useState(selected || '');
    const [isOpen, setIsOpen] = useState(false);

    // 외부 selected prop이 바뀔 때 내부 state도 반영
    useEffect(() => {
        setSelectedInternal(selected || '');
    }, [selected]);

    const toggleDropdown = () => {
        const newOpen = !isOpen;
        setIsOpen(newOpen);
        onToggleOpen?.(newOpen); // 부모에게 드롭다운 열림/닫힘 전달
    };

    const handleSelect = (company) => {
        setSelectedInternal(company);
        onSelect(company);
        setIsOpen(false);
        onToggleOpen?.(false); // 닫히도록 부모에게도 알림
    };

    return (
        <div className={styles.wrapper}>
            <div
                className={`${styles.dropdownTrigger} ${selectedInternal && !isOpen ? styles.selected : ''}`}
                onClick={toggleDropdown}
            >
                <span>{selectedInternal || '카드사 선택'}</span>
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
