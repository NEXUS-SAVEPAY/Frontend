// pages/CardRegister/CardRegisterPage.jsx
import React from 'react';
import { useRecoilState } from 'recoil';
import {
    cardCompanyAtom,
    cardNameAtom,
    searchResultAtom,
    registeredCardsAtom,
    showDeleteModalAtom,
    pendingDeleteCardAtom,
} from '../../recoil/atoms/CardRegisterAtom';

import ProgressStepIndicator from '../../components/Common/ProgressStepIndicator';
import CardCompanyDropdown from '../../components/Card/CardCompanyDropdown';
import CardNameInput from '../../components/Card/CardNameInput';
import CardPreviewBox from '../../components/Card/CardPreviewBox';
import CardDeleteModal from '../../components/Modal/DeleteCardModal';
import CardSearchResultList from '../../components/Card/CardSearchResultList';
import styles from './CardRegisterPage.module.css';

import mockCardData from '../../data/mockCardData';

function CardRegisterPage() {
    const [cardCompany, setCardCompany] = useRecoilState(cardCompanyAtom);
    const [cardName, setCardName] = useRecoilState(cardNameAtom);
    const [searchResult, setSearchResult] = useRecoilState(searchResultAtom);
    const [registeredCards, setRegisteredCards] = useRecoilState(registeredCardsAtom);
    const [showDeleteModal, setShowDeleteModal] = useRecoilState(showDeleteModalAtom);
    const [pendingDeleteCard, setPendingDeleteCard] = useRecoilState(pendingDeleteCardAtom);

    const handleSearch = () => {
        if (cardCompany && cardName) {
            const foundCard = mockCardData.find(
                (card) =>
                    card.company === cardCompany &&
                    card.name.includes(cardName)
            );

            if (foundCard) {
                setSearchResult(foundCard);
            } else {
                setSearchResult({
                    id: Date.now(),
                    name: cardName,
                    company: cardCompany,
                    image: '/assets/images/sample-card.png'
                });
            }
        }
    };

    const handleRegister = () => {
        if (searchResult) {
            setRegisteredCards([...registeredCards, searchResult]);
            setSearchResult(null);
            setCardName('');
        }
    };

    const handleDeleteClick = (card) => {
        setPendingDeleteCard(card);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setRegisteredCards(registeredCards.filter((c) => c.id !== pendingDeleteCard.id));
        setShowDeleteModal(false);
        setPendingDeleteCard(null);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>카드 등록</h1>
            <ProgressStepIndicator currentStep={1} totalSteps={3} /> {/* 항상 1단계 고정 */}
            <p className={styles.description}>자주 사용하는 카드를 등록해주세요.</p>

            <div className={styles.inputRow}>
                <CardCompanyDropdown onSelect={setCardCompany} />
            </div>

            {cardCompany && (
                <div className={styles.inputRow}>
                    <CardNameInput value={cardName} onChange={setCardName} onSearch={handleSearch} />
                </div>
            )}

            {searchResult && (
                <>
                    <CardPreviewBox card={searchResult} />
                    <button className={styles.registerButton} onClick={handleRegister}>
                        카드 등록 하기
                    </button>
                </>
            )}

            <CardSearchResultList cards={registeredCards} onDelete={handleDeleteClick} />

            {registeredCards.length > 0 && (
                <button className={styles.completeButton}>완료 하기</button>
            )}

            {showDeleteModal && (
                <CardDeleteModal
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
}

export default CardRegisterPage;
