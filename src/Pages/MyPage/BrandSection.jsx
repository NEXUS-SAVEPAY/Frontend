import React from 'react';
import styles from './BrandSection.module.css';

function BrandSection({ brands, onAdd }) {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h3 className={styles.title}>관심 브랜드</h3>
                    <button className={styles.addButton} onClick={onAdd}>
                        관심 브랜드 추가
                        <span className={styles.arrowShape} />
                    </button>

            </div>

            {brands.length === 0 ? (
                <p className={styles.noBrandText}>등록된 브랜드가 없습니다</p>
            ) : (
                <div className={styles.brandList}>
                    {brands.map((brand, index) => (
                        <div key={index} className={styles.brandItem}>
                            <img
                                src={brand.image}
                                alt={brand.name}
                                className={styles.brandImage}
                            />
                            <span className={styles.brandName}>{brand.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default BrandSection;
