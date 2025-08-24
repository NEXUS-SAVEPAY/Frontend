// src/pages/MyPage/BrandSection.jsx
import React from 'react';
import styles from './BrandSection.module.css';
import brandIcons from '../../data/brandIcons';

function BrandSection({ brands = [], onAdd, onBrandClick }) {
    const displayBrands = brands.map((b) => {
        if (typeof b === 'string') {
            return { name: b, image: brandIcons[b] };
        }
        return { name: b.name, image: b.image || brandIcons[b.name] };
    });

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h3 className={styles.title}>관심 브랜드</h3>
                <button className={styles.addButton} onClick={onAdd}>
                    관심 브랜드 추가
                    <span className={styles.arrowShape} />
                </button>
            </div>

            {displayBrands.length === 0 ? (
                <p className={styles.noBrandText}>등록된 브랜드가 없습니다</p>
            ) : (
                <div className={styles.brandList} role="list">
                    {displayBrands.map(({ name, image }) => (
                        <button
                            key={name}
                            type="button"
                            className={styles.brandItem}
                            onClick={() => onBrandClick && onBrandClick(name)}
                            aria-label={`${name} 혜택 보기`}
                        >
                            <img
                                src={image}
                                alt={name}
                                className={styles.brandImage}
                            />
                            <span className={styles.brandName}>{name}</span>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}

export default BrandSection;
