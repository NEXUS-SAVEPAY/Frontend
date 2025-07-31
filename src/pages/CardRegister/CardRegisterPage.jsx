import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { HiChevronLeft } from 'react-icons/hi';

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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const handleBack = () => navigate(-1);

    const currentStep = !cardCompany
        ? 1
        : cardCompany && registeredCards.length === 0
        ? 2
        : 3;

    const handleSearch = () => {
        if (cardCompany && cardName) {
            const foundCard = mockCardData.find(
                (card) => card.company === cardCompany && card.name.includes(cardName)
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

    const handleCompanySelect = (company) => {
        // 카드사를 새로 선택하면 상태 초기화
        setCardCompany(company);
        setCardName('');
        setSearchResult(null);
        setRegisteredCards([]);
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.contentWrapper}>
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={handleBack}>
                        <HiChevronLeft size={24} />
                    </button>
                    <h1 className={styles.title}>카드 등록</h1>
                </div>

                <ProgressStepIndicator currentStep={1} totalSteps={3} />
                <p className={styles.description}>자주 사용하는 카드를 등록해주세요.</p>

                {/* Step 1 */}
                <div className={`${styles.inputGroupWithStep} ${styles.alignTop}`}>
                    <div className={styles.stepWrapper}>
                        <div className={styles.circleAndLine}>
                            <StepCircle
                                number={1}
                                hasLineBelow={currentStep >= 2}
                                lineHeight={isDropdownOpen ? '370px' : '50px'}
                            />
                        </div>
                    </div>
                    <div className={styles.inputWithButtonWrapper}>
                        <CardCompanyDropdown 
                        selected={cardCompany}
                        onSelect={handleCompanySelect} 
                        onToggleOpen={(isOpen) => setIsDropdownOpen(isOpen)}
                        />
                    </div>
                </div>

                {/* Step 2 */}
                {currentStep >= 2 && (
                    <>
                        <div className={`${styles.inputGroupWithStep} ${styles.alignTop}`}>
                            <div className={styles.stepWrapper}>
                                <div className={styles.circleAndLine}>
                                    <StepCircle
                                        number={2}
                                        hasLineBelow={currentStep >= 3}
                                        lineHeight="300px"
                                    />
                                </div>
                            </div>
                            <div className={styles.inputWithButtonWrapper}>
                                <CardNameInput
                                    value={cardName}
                                    onChange={setCardName}
                                    onSearch={handleSearch}
                                />
                                <button className={styles.searchButton} onClick={handleSearch}>
                                    카드 검색 하기
                                </button>
                            </div>
                        </div>

                        {searchResult && (
                            <div className={`${styles.inputGroupWithStep} ${styles.alignTop}`}>
                                <div className={styles.stepWrapper}></div>
                                <div className={styles.previewWrapper}>
                                    <CardPreviewBox card={searchResult} />
                                    <button className={styles.registerButton} onClick={handleRegister}>
                                        카드 등록 하기
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Step 3 */}
                {registeredCards.length > 0 && (
                    <>
                        <div className={`${styles.inputGroupWithStep} ${styles.alignMiddle}`}>
                            <div className={styles.resultWrapper}>
                                <CardSearchResultList
                                    cards={registeredCards}
                                    onDelete={handleDeleteClick}
                                />
                            </div>
                        </div>

                        <div className={`${styles.inputGroupWithStep} ${styles.alignMiddle}`}>
                            <div className={styles.stepWrapper}>
                                <div className={styles.circleAndLine}>
                                    <StepCircle number={3} hasLineBelow={false} />
                                </div>
                            </div>
                            <div className={styles.buttonWrapper}>
                                <button className={styles.completeButton}>완료 하기</button>
                            </div>
                        </div>
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