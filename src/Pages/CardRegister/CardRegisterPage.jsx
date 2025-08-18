// src/pages/CardRegister/CardRegisterPage.jsx
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate, useLocation } from 'react-router-dom';
import CardResultListSingle from '../../components/Card/CardResultListSingle';

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
import { fetchCardImage } from '../../services/api/cardApi';

function CardRegisterPage({ isManageMode = false }) {
  const [cardCompany, setCardCompany] = useRecoilState(cardCompanyAtom);
  const [cardName, setCardName] = useRecoilState(cardNameAtom);
  const [searchResult, setSearchResult] = useRecoilState(searchResultAtom); // null 권장
  const [registeredCards, setRegisteredCards] = useRecoilState(registeredCardsAtom);
  const [showDeleteModal, setShowDeleteModal] = useRecoilState(showDeleteModalAtom);
  const [pendingDeleteCard, setPendingDeleteCard] = useRecoilState(pendingDeleteCardAtom);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const selectedCardId = location?.state?.selectedCardId ?? null;

  // manage-card: 전역을 복사한 로컬 스냅샷(저장 전까지 전역 반영 X)
  const [localCards, setLocalCards] = useState(() => registeredCards);
  // 초기 진입 시 선택 카드만 보이게
  const [forceSingleView, setForceSingleView] = useState(isManageMode && !!selectedCardId);

  // 화면 표시 소스 (manage는 로컬, register는 전역)
  const cardsSource = isManageMode ? localCards : registeredCards;

  // manage 모드 단일 진입 시 선택 카드
  const selectedCard =
    isManageMode && selectedCardId
      ? cardsSource.find((c) => String(c.id) === String(selectedCardId))
      : null;

  const currentStep = !cardCompany ? 1 : cardCompany && cardsSource.length === 0 ? 2 : 3;

  const handleSearch = async () => {
    if (!cardCompany || !cardName) return;
    setIsSearching(true);
    setSearchError('');
    try {
      // 1) 백엔드 조회
      const card = await fetchCardImage({ company: cardCompany, cardName });
      setSearchResult(card);
    } catch (e) {
      // 2) 실패 시 mock/fallback
      const fallback = mockCardData.find(
        (c) => c.company === cardCompany && c.name.includes(cardName)
      );
      if (fallback) {
        setSearchResult(fallback);
      } else {
        setSearchResult({
          id: Date.now(),
          name: cardName,
          company: cardCompany,
          image: '',
        });
        setSearchError('카드 이미지를 불러오지 못했어요. 등록은 계속할 수 있어요.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  // 중복 없이 카드 추가(업서트)
  const upsert = (arr, card) => {
    const key = (c) => String(c?.id ?? `${c?.company ?? ''}::${c?.name ?? ''}`);
    const map = new Map(arr.map((c) => [key(c), c]));
    map.set(key(card), card);
    return Array.from(map.values());
  };

  const handleRegister = () => {
    if (!searchResult) return;

    if (isManageMode) {
      setLocalCards((prev) => upsert(prev, searchResult)); // 로컬만 추가/업데이트
      setForceSingleView(false); // 이후 리스트 전환
    } else {
      setRegisteredCards((prev) => upsert(prev, searchResult)); // 전역 추가/업데이트
    }
    setSearchResult(null);
    setCardName('');
  };

  // X 클릭 → 모달 오픈 (두 모드 공통)
  const handleDeleteClick = (card) => {
    setPendingDeleteCard(card);
    setShowDeleteModal(true);
  };

  // 모달 "네" → manage: 로컬 삭제, register: 전역 삭제
  const confirmDelete = () => {
    if (!pendingDeleteCard) return;

    const removeById = (arr) => arr.filter((c) => String(c.id) !== String(pendingDeleteCard.id));

    if (isManageMode) {
      setLocalCards((prev) => removeById(prev));
      setForceSingleView(false); // 변경 발생 후 리스트 뷰 유지
    } else {
      setRegisteredCards((prev) => removeById(prev));
    }

    setShowDeleteModal(false);
    setPendingDeleteCard(null);
  };

  const handleCompanySelect = (company) => {
    setCardCompany(company);
    setCardName('');
    setSearchResult(null);
    if (isManageMode) {
      setLocalCards([]);
      setForceSingleView(true);
    }
    // ✅ 등록 모드에서 전역 카드 초기화하지 않음 (기존 카드가 사라지는 문제 방지)
  };

  const handleComplete = () => navigate('/register/simple-pay');

  const handleSave = () => {
    // 저장 시점에만 전역 반영
    setRegisteredCards(localCards);
    navigate('/manage-payment');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => navigate('/mypage')}>
            〈
          </button>
          <h1 className={styles.title}>{isManageMode ? '등록된 카드' : '카드 등록'}</h1>
        </div>

        {!isManageMode && (
          <>
            <ProgressStepIndicator currentStep={1} totalSteps={3} />
            <p className={styles.description}>자주 사용하는 카드를 등록해주세요.</p>
          </>
        )}

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

        {currentStep >= 2 && (
          <>
            <div className={`${styles.inputGroupWithStep} ${styles.alignTop}`}>
              <div className={styles.stepWrapper}>
                <div className={styles.circleAndLine}>
                  <StepCircle
                    number={2}
                    hasLineBelow={!isManageMode && cardsSource.length > 0}
                    lineHeight="300px"
                  />
                </div>
              </div>
              <div className={styles.inputWithButtonWrapper}>
                <CardNameInput value={cardName} onChange={setCardName} onSearch={handleSearch} />
                <button className={styles.searchButton} onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? '검색 중…' : '카드 검색 하기'}
                </button>
                {searchError && <p className={styles.errorText}>{searchError}</p>}
              </div>
            </div>

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

        {cardsSource.length > 0 && (
          <>
            <div className={`${styles.inputGroupWithStep} ${styles.alignMiddle}`}>
              <div className={styles.resultWrapper}>
                {isManageMode ? (
                  forceSingleView && (selectedCard || cardsSource[0]) ? (
                    <CardResultListSingle
                      card={selectedCard || cardsSource[0]}
                      onDelete={handleDeleteClick}
                      showDelete={true}
                    />
                  ) : (
                    <CardSearchResultList cards={cardsSource} onDelete={handleDeleteClick} />
                  )
                ) : (
                  <CardSearchResultList cards={cardsSource} onDelete={handleDeleteClick} />
                )}
              </div>
            </div>

            {!searchResult && (cardsSource.length > 0 || isManageMode) && (
              <div className={`${styles.inputGroupWithStep} ${styles.alignMiddle}`}>
                {!isManageMode && (
                  <div className={styles.stepWrapper}>
                    <div className={styles.circleAndLine}>
                      <StepCircle number={3} hasLineBelow={false} />
                    </div>
                  </div>
                )}
                <div className={styles.buttonWrapper}>
                  <button
                    className={isManageMode ? styles.saveButton : styles.completeButton}
                    onClick={isManageMode ? handleSave : handleComplete}
                  >
                    {isManageMode ? '저장' : '완료 하기'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {showDeleteModal && (
          <CardDeleteModal onConfirm={confirmDelete} onCancel={() => setShowDeleteModal(false)} />
        )}
      </div>
    </div>
  );
}

export default CardRegisterPage;
