import React from 'react';
import styles from './OwlScrollTop.module.css';
import owlImage from '../../assets/images/character.svg';

function OwlScrollTop() {
    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.owlButtonWrapper}>
            <img src={owlImage} alt="혜택 부엉이" className={styles.owlIcon} />
            <button className={styles.scrollTopButton} onClick={handleScrollTop}>
                ↑
            </button>
        </div>
    );
}

export default OwlScrollTop;
