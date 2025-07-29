// components/Common/StepCircle.jsx

import React from 'react';
import styles from './StepCircle.module.css';

function StepCircle({ number }) {
    return (
        <div className={styles.circle}>
            <span className={styles.number}>{number}</span>
        </div>
    );
}

export default StepCircle;
