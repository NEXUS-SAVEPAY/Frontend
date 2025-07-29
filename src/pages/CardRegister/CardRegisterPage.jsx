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
import StepCircle from '../../components/Common/StepCircle';

import styles from './CardRegisterPage.module.css';
import mockCardData from '../../data/mockCardData';

function CardRegisterPage() {
    const [cardCompany, setCardCompany] = useRecoilState(cardCompanyAtom);
    const [cardName, setCardName] = useRecoilState(cardNameAtom);
    const [searchResult, setSearchResult] = useRecoilState(searchResultAtom);
    const [registeredCards, setRegisteredCards] = useRecoilState(registeredCardsAtom);
    const [showDeleteModal, setShowDeleteModal] = useRecoilState(showDeleteModalAtom);
    const [pendingDeleteCard, setPendingDeleteCard] = useRecoilState(pendingDeleteCardAtom);

    const currentStep = !cardCompany ? 1 : cardCompany && registeredCards.length === 0 ? 2 : 3;

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
                    image: '/assets/images/sample-card.png',
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
        <div className={styles.pageWrapper}>
            <div className={styles.contentWrapper}>
                <h1 className={styles.title}>카드 등록</h1>
                <ProgressStepIndicator currentStep={1} totalSteps={3} />
                <p className={styles.description}>자주 사용하는 카드를 등록해주세요.</p>

                <div className={styles.inputGroupWithStep}>
                    <StepCircle number={1} />
                    <CardCompanyDropdown onSelect={setCardCompany} />
                </div>

                {currentStep >= 2 && (
                    <>
                        <div className={styles.inputGroupWithStep}>
                            <StepCircle number={2} />
                            <CardNameInput
                                value={cardName}
                                onChange={setCardName}
                                onSearch={handleSearch}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <button
                                className={styles.registerButton}
                                onClick={handleSearch}
                            >
                                카드 검색 하기
                            </button>
                        </div>

                        {searchResult && (
                            <>
                                <CardPreviewBox card={searchResult} />
                                <button
                                    className={styles.registerButton}
                                    onClick={handleRegister}
                                >
                                    카드 등록 하기
                                </button>
                            </>
                        )}
                    </>
                )}

                {registeredCards.length > 0 && (
                    <>
                        <div className={styles.inputGroupWithStep}>
                            <StepCircle number={3} />
                            <button className={styles.completeButton}>완료 하기</button>
                        </div>
                        <CardSearchResultList cards={registeredCards} onDelete={handleDeleteClick} />
                    </>
                )}

                {showDeleteModal && (
                    <CardDeleteModal
                        onConfirm={confirmDelete}
                        onCancel={() => setShowDeleteModal(false)}
                    />
                )}
            </div>
        </div>
    );
}

export default CardRegisterPage;