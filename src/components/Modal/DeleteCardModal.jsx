// src/components/Modal/DeleteCardModal.jsx
import React from 'react';
import styles from './DeleteCardModal.module.css';
import x from '../../assets/images/delete.svg';

function CardDeleteModal({ onConfirm, onCancel }) {
  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.closeIconWrapper}>
          <button type="button" className={styles.closeIcon} onClick={onCancel} aria-label="닫기">
            <img src={x} alt="삭제 아이콘" />
          </button>
        </div>

        <p className={styles.text}>등록하신 카드를 <br />삭제하시겠습니까?</p>
        <p className={styles.subtext}>삭제 시 처음부터 다시 검색해서 등록해야합니다.</p>

        <div className={styles.buttonGroup}>
          <button type="button" className={`${styles.button} ${styles.confirmButton}`} onClick={onConfirm}>
            네
          </button>
          <button type="button" className={`${styles.button} ${styles.cancelButton}`} onClick={onCancel}>
            아니요
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardDeleteModal;
