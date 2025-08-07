{/*
import React, { useState } from 'react';
import styles from './NotificationSection.module.css';

function NotificationSection() {
    const [all, setAll] = useState(true);
    const [card, setCard] = useState(false);
    const [simplePay, setSimplePay] = useState(false);
    const [telco, setTelco] = useState(false);
    const [brand, setBrand] = useState(false);

    const renderToggle = (label, checked, setChecked) => (
        <div className={styles.toggleRow}>
            <span className={styles.label}>{label}</span>
            <div
                className={`${styles.toggleSwitch} ${checked ? styles.active : ''}`}
                onClick={() => setChecked(!checked)}
            >
                <div className={styles.knob} />
            </div>
        </div>
    );

    return (
        <section className={styles.section}>
            <h3 className={styles.title}>혜택 알림 설정</h3>

            <div className={styles.toggleGroup}>
                {renderToggle('전체 알림 수신', all, setAll)}
                {renderToggle('카드 수단 혜택', card, setCard)}
                {renderToggle('간편결제 혜택', simplePay, setSimplePay)}
                {renderToggle('통신사 혜택', telco, setTelco)}
                {renderToggle('관심 브랜드 혜택', brand, setBrand)}
            </div>
        </section>
    );
}

export default NotificationSection;
*/}

import React, { useState } from 'react';
import styles from './NotificationSection.module.css';

function NotificationSection() {
    const [all, setAll] = useState(true);
    const [useMethod, setUseMethod] = useState(false);
    const [card, setCard] = useState(false);
    const [simplePay, setSimplePay] = useState(false);
    const [telco, setTelco] = useState(false);
    const [brand, setBrand] = useState(false);

    const renderToggle = (checked, setChecked) => (
        <div
            className={`${styles.toggleSwitch} ${checked ? styles.active : ''}`}
            onClick={() => setChecked(!checked)}
        >
            <div className={styles.knob} />
        </div>
    );

    return (
        <section className={styles.section}>
            <h3 className={styles.title}>혜택 알림</h3>

            {/* 모든 혜택 알림 */}
            <div className={styles.box}>
                <div className={styles.rowBetween}>
                    <span className={styles.label}>모든 혜택 알림 받기</span>
                    {renderToggle(all, setAll)}
                </div>
            </div>

            {/* 등록 수단 혜택 알림 */}
            <div className={styles.box}>
                <div className={styles.rowBetween}>
                    <span className={styles.label}>등록 수단 혜택 알림 받기</span>
                    {renderToggle(useMethod, setUseMethod)}
                </div>
                <div className={styles.methodCheckboxGroup}>
                    <label
                        className={`${styles.checkboxLabel} ${card ? styles.checked : ''}`}
                        onClick={() => setCard(!card)}
                    >
                        카드
                        <span className={styles.customCheckbox} />
                        <input
                            type="checkbox"
                            checked={card}
                            readOnly
                        />
                    </label>

                    <label className={styles.checkboxLabel}>
                        간편결제
                        <span className={styles.customCheckbox} />
                        <input
                            type="checkbox"
                            checked={simplePay}
                            onChange={() => setSimplePay(!simplePay)}
                        />
                    </label>

                    <label className={styles.checkboxLabel}>
                        통신사
                        <span className={styles.customCheckbox} />
                        <input
                            type="checkbox"
                            checked={telco}
                            onChange={() => setTelco(!telco)}
                        />
                    </label>
                </div>

            </div>

            {/* 관심 브랜드 혜택 알림 */}
            <div className={styles.box}>
                <div className={styles.rowBetween}>
                    <span className={styles.label}>관심 브랜드 혜택 알림 받기</span>
                    {renderToggle(brand, setBrand)}
                </div>
            </div>
        </section>
    );
}

export default NotificationSection;
