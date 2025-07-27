import React from 'react';
import styles from './DeleteCardModal.module.css';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { registeredCardsAtom, showDeleteModalAtom, pendingDeleteCardAtom } from '../../recoil/atoms/CardRegisterAtom';

const CardDeleteModal = () => {
    const [registeredCards, setRegisteredCards] = useRecoilState(registeredCardsAtom);
    const setShowDeleteModal = useSetRecoilState(showDeleteModalAtom);
    const [pendingDeleteCard, setPendingDeleteCard] = useRecoilState(pendingDeleteCardAtom);

    const confirmDelete = () => {
        const updated = registeredCards.filter(card => card.id !== pendingDeleteCard.id);
        setRegisteredCards(updated);
        setShowDeleteModal(false);
        setPendingDeleteCard(null);
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <p>정말 이 카드를 삭제하시겠습니까?</p>
                <button onClick={confirmDelete}>삭제</button>
                <button onClick={() => setShowDeleteModal(false)}>취소</button>
            </div>
        </div>
    );
};

export default CardDeleteModal;
