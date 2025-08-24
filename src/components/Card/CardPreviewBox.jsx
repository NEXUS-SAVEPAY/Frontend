import React from 'react';
import styles from './CardPreviewBox.module.css';

function CardPreviewBox({ card }) {
    console.log('💡 전달된 카드 데이터:', card); // 콘솔에서 확인

    // card가 없거나 image가 없는 경우 경고 텍스트 렌더링
    if (!card || !card.image) {
        return (
            <div className={styles.previewBox}>
                <p style={{ color: 'red' }}>⚠ 카드 이미지가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className={styles.previewBox}>
            <img src={card.image} alt="카드 미리보기" className={styles.cardImage} />
        </div>
    );
}

export default CardPreviewBox;