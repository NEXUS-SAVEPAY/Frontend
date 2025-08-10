import React from 'react';
import styles from './DeleteCardModal.module.css';
import x from '../../assets/images/delete.svg';
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
/*
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <p>정말 이 카드를 삭제하시겠습니까?</p>
                <button onClick={confirmDelete}>삭제</button>
                <button onClick={() => setShowDeleteModal(false)}>취소</button>
            </div>
        </div>
    );
*/

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <div className={styles.closeIconWrapper}>
                    <div
                        className={styles.closeIcon}
                        onClick={() => setShowDeleteModal(false)}
                    >
                    <img src={x} alt="삭제 아이콘" />
                    {/*    × */}
                    </div>
                </div>

                <p className={styles.text}>등록하신 카드를 <br />삭제하시겠습니까?</p>
                <p className={styles.subtext}>삭제 시 처음부터 다시 검색해서 등록해야합니다.</p>

                <div className={styles.buttonGroup}>
                    <button
                        className={`${styles.button} ${styles.confirmButton}`}
                        onClick={confirmDelete}
                    >
                        네
                    </button>
                    <button
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={() => setShowDeleteModal(false)}
                    >
                        아니요
                    </button>
                </div>
            </div>
        </div>
    );


};

export default CardDeleteModal;
