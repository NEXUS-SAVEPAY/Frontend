import React from 'react';
import styles from './StepIndicator.module.css';
import { useRecoilValue } from 'recoil';
import { currentStepAtom } from '../../recoil/atoms/CardRegisterAtom';

const StepIndicator = () => {
    const currentStep = useRecoilValue(currentStepAtom);

    return (
        <div className={styles.container}>
            {[1, 2, 3].map((step) => (
                <div key={step} className={styles.stepItem}>
                    <StepCircle number={step} isActive={step === currentStep} isDone={step < currentStep} />
                    {step < 3 && <div className={styles.line} />}
                </div>
            ))}
        </div>
    );
};

export default StepIndicator;
