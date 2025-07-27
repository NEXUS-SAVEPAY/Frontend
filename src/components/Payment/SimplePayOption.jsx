import styles from './SimplePayOptionGroup.module.css';

function SimplePayOption({ type, label, icon, selectedIcon, options = [], selected, onSelect }) {
    const isSelected = selected === type || options.some((opt) => selected === opt.value);
    const selectedSubLabel = options.find((opt) => selected === opt.value)?.label || options[0]?.label;

    const displayIcon = isSelected && selectedIcon ? selectedIcon : icon;

    return (
        <div className={styles.group}>
            <div className={styles.box}>
                <button
                    className={`${styles.optionButton} ${isSelected ? styles.selected : ''}`}
                    onClick={() => onSelect(type)}
                >
                    <div className={styles.iconWrapper}>
                        <img src={displayIcon} alt={label} className={styles.icon} />
                    </div>

                    {/* 하위 옵션이 있을 경우 동그라미로 선택 상태 표시 */}
                    {isSelected && options.length > 0 && (
                        <div className={styles.labelSubGroup}>
                            {options.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={styles.subOption}
                                    onClick={(e) => {
                                        e.stopPropagation(); // 부모 버튼 클릭 방지
                                        onSelect(opt.value);
                                    }}
                                >
                                    <span>{opt.label}</span>
                                    <span className={styles.radio}>
                                        {selected === opt.value ? '⦿' : '◯'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
}

export default SimplePayOption;
