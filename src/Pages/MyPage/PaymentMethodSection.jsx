import React from 'react';
import styles from './PaymentMethodSection.module.css';

function PaymentMethodSection({
    groupedMethods = [],
    onCardClick,
    onSimplePayClick,
    onTelcoClick,
    arrowIcon,
}) {
    const handleClick = (item, type) => {
        if (type === '카드' && onCardClick) {
            onCardClick(item, type);
        } else if (type === '간편결제' && onSimplePayClick) {
            onSimplePayClick(item, type);
        } else if (type === '통신사' && onTelcoClick) {
            onTelcoClick(item, type);
        }
    };

    return (
        <div className={styles.resultContainer}>
            {groupedMethods.map(group => (
                <div key={group.type} className={styles.categoryBlock}>
                    <div className={styles.typeBadge}>{group.type}</div>

                    <div className={styles.cardList}>
                        {group.items.map(item => (
                            <div
                                key={item.id}
                                className={styles.cardBox}
                                onClick={() => handleClick(item, group.type)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={styles.cardLeft}>
                                    <img
                                        src={item.image}
                                        alt={`${item.name} 이미지`}
                                        className={styles.cardImage}
                                    />
                                </div>

                                <div className={styles.cardRight}>
                                    <span className={styles.companyBadge}>{item.tag}</span>
                                    <span className={styles.cardName}>{item.name}</span>
                                    {arrowIcon && (
                                        <img
                                            src={arrowIcon}
                                            alt="화살표"
                                            className={styles.arrowIcon}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PaymentMethodSection;
