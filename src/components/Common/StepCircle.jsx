import React from 'react';
import styles from './StepCircle.module.css';

function StepCircle({ number, hasLineBelow, lineHeight }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.circle}>
                <span className={styles.number}>{number}</span>
            </div>
            {hasLineBelow && (
                <div
                    className={styles.verticalLine}
                    style={{ height: lineHeight || '100%' }}
                />
            )}
        </div>
    );
}
export default StepCircle;
