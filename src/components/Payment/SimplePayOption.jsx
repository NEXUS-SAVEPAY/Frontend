import styles from './SimplePayOptionGroup.module.css';

function SimplePayOption({ type, icon, selectedIcon, options = [], selected, onSelect }) {
    // selected: string[]
    const isSelected =
        Array.isArray(selected) &&
        (selected.includes(type) || options.some((opt) => selected.includes(opt.value)));

    const displayIcon = isSelected && selectedIcon ? selectedIcon : icon;

    return (
        <div className={styles.group}>
            <div className={styles.box}>
                <button
                    type="button"
                    className={`${styles.optionButton} ${isSelected ? styles.selected : ''}`}
                    onClick={() => onSelect(type)}  // 기본 타입 토글
                >
                    {/* 아이콘만 */}
                    <div className={styles.iconWrapper}>
                        <img src={displayIcon} alt={type} className={styles.icon} />
                    </div>

                    {/* 서브옵션: 선택 상태일 때 '버튼 내부'에 표시 */}
                    {isSelected && options.length > 0 && (
                        <div className={styles.labelSubGroup}>
                            {options.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={styles.subOption}
                                    onClick={(e) => {
                                        e.stopPropagation(); // 상위 버튼 클릭 방지
                                        onSelect(opt.value); // 'type_sub' 형태 토글
                                    }}
                                >
                                    <span>{opt.label}</span>
                                    <span className={styles.radio}>
                                        {Array.isArray(selected) && selected.includes(opt.value) ? '⦿' : '◯'}
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
