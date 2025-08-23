import React, { useState, useEffect } from 'react';
import styles from './CardCompanyDropdown.module.css';

const companies = [
    '카카오뱅크',
    '신한 카드',
    'NH농협 카드',
    '현대 카드',
    '삼성',
    '우리 카드',
    '케이뱅크',
    '우체국',
    '새마을금고',
    '하나 카드',
    '롯데 카드',
    'IBK기업 카드',
    'BC바로 카드',
    '토스뱅크',
    '씨티 카드',
    'SC 카드',
    '국민 카드',
    'KDB산업 카드',
    '신협',
    'iM뱅크',
    '부산은행',
    '경남은행',
    '광주은행',
    '제주은행',
    '수협',
    '전북은행',
];


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