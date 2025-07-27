import React from 'react';
import styles from './ProgressStepIndicator.module.css';

function ProgressStepIndicator({ currentStep, totalSteps }) {
    const stepLabel = `${currentStep}단계`;
    const progressPercent = (currentStep / totalSteps) * 100;

    return (
        <div className={styles.wrapper}>
            <div className={styles.label}>{stepLabel}</div>
            <div className={styles.progressBar}>
                <div
                    className={styles.progress}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );
}

export default ProgressStepIndicator;
