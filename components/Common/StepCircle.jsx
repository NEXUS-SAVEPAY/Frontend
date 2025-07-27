import React from 'react';
import styles from './StepCircle.module.css';
import classNames from 'classnames';

function StepCircle({ number, isActive, isDone }) {
    return (
        <div
            className={classNames(styles.circle, {
                [styles.active]: isActive,
                [styles.done]: isDone,
            })}
        >
            {number}
        </div>
    );
}

export default StepCircle;
