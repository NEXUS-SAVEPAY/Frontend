import React from 'react';
import styles from './CardStepIndicator.module.css';

const CardStepIndicator = ({ currentStep }) => {
    const steps = [1, 2, 3];

    return (
        <div className={styles.container}>
            {steps.map((step, idx) => (
                <div key={step} className={styles.stepContainer}>
                    <div
                        className={`${styles.circle} ${currentStep === step ? styles.active : ''}`}
                    >
                        {step}
                    </div>
                    {idx < steps.length - 1 && <div className={styles.line} />}
                </div>
            ))}
        </div>
    );
};

export default CardStepIndicator;
