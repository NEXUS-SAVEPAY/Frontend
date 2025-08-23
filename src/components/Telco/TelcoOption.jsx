// components/Telco/TelcoOption.js
import styles from './TelcoOption.module.css';

function TelcoOption({ label, selected, onClick }) {
    return (
        <button
            className={`${styles.optionButton} ${selected ? styles.selected : ''}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

export default TelcoOption;
