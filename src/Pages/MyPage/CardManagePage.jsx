import React, { useEffect } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import {
    cardCompanyAtom,
    cardNameAtom,
    searchResultAtom,
    registeredCardsAtom,
    showDeleteModalAtom,
    pendingDeleteCardAtom
} from '../../recoil/atoms/CardRegisterAtom';

import CardCompanyDropdown from '../../components/Card/CardCompanyDropdown';
import CardNameInput from '../../components/Card/CardNameInput';
import CardPreviewBox from '../../components/Card/CardPreviewBox';
import CardDeleteModal from '../../components/Modal/DeleteCardModal';

import styles from './CardManagePage.module.css';

function CardManagePage() {
    const [cardCompany, setCardCompany] = useRecoilState(cardCompanyAtom);
    const [cardName, setCardName] = useRecoilState(cardNameAtom);
    const [searchResult, setSearchResult] = useRecoilState(searchResultAtom);
    const [registeredCards, setRegisteredCards] = useRecoilState(registeredCardsAtom);

    const resetCardCompany = useResetRecoilState(cardCompanyAtom);
    const resetCardName = useResetRecoilState(cardNameAtom);
    const resetSearchResult = useResetRecoilState(searchResultAtom);

    useEffect(() => {
        // 카드사 / 카드명 / 검색결과 초기화
        resetCardCompany();
        resetCardName();
        resetSearchResult();

        // 등록된 카드만 보여줌 (기존 등록된 정보)
        setRegisteredCards([
            {
                id: 1,
                name: 'taptap O',
                company: '삼성카드',
                image: '/assets/images/taptap_o.png',
            }
        ]);
    }, []);

    const handleSave = () => {
        alert('카드 정보가 저장되었습니다.');
        window.history.back(); // 또는 useNavigate(-1)
    };

    return (
        <div className={styles.pageWrapper}>
            <h2 className={styles.title}>등록된 카드</h2>

            {/* 드롭다운 (선택되지 않은 상태) */}
            <CardCompanyDropdown />

            {/* 카드명 입력창 (비어 있음) */}
            <CardNameInput />

            {/* 검색 버튼 (비활성화 가능) */}
            <button className={styles.searchButton} disabled>
                카드 검색 하기
            </button>

            {/* 등록된 카드 보여주기 */}
            {registeredCards.map((card) => (
                <CardPreviewBox key={card.id} card={card} />
            ))}

            {/* 저장 버튼 */}
            <button className={styles.saveButton} onClick={handleSave}>
                저장
            </button>

            <CardDeleteModal />
        </div>
    );
}

export default CardManagePage;
