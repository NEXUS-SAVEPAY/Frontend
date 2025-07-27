import React, { useState } from 'react';
import styles from './CardRegisterStepOne.module.css';
import CardCompanySelector from '../../components/Card/CardCompanyDropdown';
import CardNameSearch from '../../components/Card/CardNameInput';
import CardResultBox from '../../components/Card/CardResultBox';
import PrimaryButton from '../../components/Common/PrimaryButton';

const CardRegisterStepOne = () => {
    const [selectedCompany, setSelectedCompany] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardImage, setCardImage] = useState('');
    const [isCardSelected, setIsCardSelected] = useState(false);

    const handleCardSearch = () => {
        // 샘플 로직: 검색 후 카드 선택
        if (selectedCompany && cardName) {
            setCardImage(`/assets/cards/samsung_taptap.png`);
            setIsCardSelected(true);
        }
    };

    const handleCardDelete = () => {
        setIsCardSelected(false);
        setSelectedCompany('');
        setCardName('');
    };

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>카드 등록</h2>
            <div className={styles.stepBar}>
                <div className={styles.stepText}>1단계</div>
                <div className={styles.progressBar}></div>
            </div>

            <p className={styles.instruction}>자주 사용하는 카드를 등록해주세요.</p>

            <div className={styles.selectorWrapper}>
                <span className={styles.stepNum}>1</span>
                <CardCompanySelector
                    selected={selectedCompany}
                    onChange={setSelectedCompany}
                />
            </div>

            <div className={styles.selectorWrapper}>
                <span className={styles.stepNum}>2</span>
                <CardNameSearch
                    cardName={cardName}
                    onChange={setCardName}
                    onSearch={handleCardSearch}
                />
            </div>

            {isCardSelected && (
                <CardResultBox
                    cardImage={cardImage}
                    company={selectedCompany}
                    name={cardName}
                    onDelete={handleCardDelete}
                />
            )}

            {isCardSelected && (
                <div className={styles.completeButton}>
                    <PrimaryButton label="완료하기" onClick={() => alert('등록 완료')} />
                </div>
            )}
        </div>
    );
};

export default CardRegisterStepOne;
