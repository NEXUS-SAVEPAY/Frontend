import React, { useState, useEffect } from 'react';
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

function CardRegisterPage({ isManageMode = false }) {
    const [cardCompany, setCardCompany] = useRecoilState(cardCompanyAtom);
    const [cardName, setCardName] = useRecoilState(cardNameAtom);
    const [searchResult, setSearchResult] = useRecoilState(searchResultAtom);
    const [registeredCards, setRegisteredCards] = useRecoilState(registeredCardsAtom);
    const [showDeleteModal, setShowDeleteModal] = useRecoilState(showDeleteModalAtom);
    const [pendingDeleteCard, setPendingDeleteCard] = useRecoilState(pendingDeleteCardAtom);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();

    const currentStep = !cardCompany
        ? 1
        : cardCompany && registeredCards.length === 0
        ? 2
        : 3;

    // 🔥 관리 페이지일 경우 localStorage에서 등록 카드 정보 불러오기
    useEffect(() => {
        if (isManageMode) {
            const saved = localStorage.getItem('savedCards');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setRegisteredCards(parsed);
                } catch (e) {
                    console.error('카드 불러오기 실패:', e);
                }
            }
        }
    }, [isManageMode]);

    const handleBack = () => navigate(-1);

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
        setCardCompany(company);
        setCardName('');
        setSearchResult(null);
        setRegisteredCards([]);
    };

    const handleComplete = () => {
        // CR 모드에서 완료 → localStorage에 저장
        localStorage.setItem('savedCards', JSON.stringify(registeredCards));
        navigate('/register/simple-pay');
    };

    const handleSave = () => {
        alert('저장 완료!');
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.contentWrapper}>
                {/* 상단 헤더 */}
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={handleBack}>
                        <HiChevronLeft size={24} />
                    </button>
                    <h1 className={styles.title}>{isManageMode ? '등록된 카드' : '카드 등록'}</h1>
                </div>

                {/* 상단 안내 및 진행 표시 */}
                {!isManageMode && (
                    <>
                        <ProgressStepIndicator currentStep={1} totalSteps={3} />
                        <p className={styles.description}>자주 사용하는 카드를 등록해주세요.</p>
                    </>
                )}

                {/* Step 1: 카드사 선택 */}
                <div className={`${styles.inputGroupWithStep} ${styles.alignTop}`}>
                    <div className={styles.stepWrapper}>
                        <div className={styles.circleAndLine}>
                            <StepCircle
                                number={1}
                                hasLineBelow={currentStep >= 2}
                                lineHeight={isDropdownOpen ? '1750px' : '50px'}
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

                {/* Step 2: 카드명 입력 및 검색 */}
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

                        {/* 카드 미리보기 */}
                        {searchResult && (
                            <div className={`${styles.inputGroupWithStep} ${styles.alignTop}`}>
                                <div className={styles.stepWrapper}></div>
                                <div className={styles.previewWrapper}>
                                    <p
                                        className={styles.retrySearchText}
                                        onClick={() => {
                                            setSearchResult(null);
                                            setCardName('');
                                        }}
                                    >
                                        검색된 카드가 아니신가요?{' '}
                                        <span className={styles.retryUnderline}>다시 검색</span>
                                    </p>

                                    <CardPreviewBox card={searchResult} />

                                    <button className={styles.registerButton} onClick={handleRegister}>
                                        카드 등록 하기
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Step 3: 등록된 카드 리스트 + 완료 or 저장 버튼 */}
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

                        {/* 저장 or 완료 버튼은 카드 등록 버튼이 보이지 않을 때만 표시 */}
                        {!searchResult && (
                            <div className={`${styles.inputGroupWithStep} ${styles.alignMiddle}`}>
                                <div className={styles.stepWrapper}>
                                    <div className={styles.circleAndLine}>
                                        <StepCircle number={3} hasLineBelow={false} />
                                    </div>
                                </div>
                                <div className={styles.buttonWrapper}>
                                    <button
                                        className={styles.completeButton}
                                        onClick={isManageMode ? handleSave : handleComplete}
                                    >
                                        {isManageMode ? '저장 하기' : '완료 하기'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* 카드 삭제 모달 */}
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
