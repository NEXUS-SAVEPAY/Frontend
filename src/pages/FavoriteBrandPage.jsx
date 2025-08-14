// src/pages/FavoriteBrand/FavoriteBrandPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { likedBrandsAtom } from '../recoil/atoms/likedBrandsAtom';
import SearchBar from '../components/Common/SearchBar';
import BrandCard from '../components/Common/BrandCard';
import favoriteBrandBenefits from '../data/favoriteBrandBenefits';
import styles from './FavoriteBrandPage.module.css';

function FavoriteBrandPage() {
    const navigate = useNavigate();
    const [likedBrands, setLikedBrands] = useRecoilState(likedBrandsAtom);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const toggleFavorite = (brandName) => {
        setLikedBrands((prev) => ({
            ...prev,
            [brandName]: !prev[brandName],
        }));
    };

    const registeredBrands = favoriteBrandBenefits
        .filter((item) => likedBrands[item.brand])
        .map((item) => ({
            name: item.brand,
            image: item.benefits[0].imageSrc,
        }));

    return (
        <div className={styles.container}>
            <div className={styles.fixedHeader}>
                <div className={styles.header}>
                    <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
                    <h2 className={styles.title}>관심 브랜드</h2>
                </div>
                <SearchBar
                    placeholder="혜택을 원하는 브랜드를 검색해주세요"
                    onSearch={(keyword) => {
                        setSearchKeyword(keyword);

                        const results = favoriteBrandBenefits
                            .filter((item) => item.brand.includes(keyword))
                            .map((item) => ({
                                name: item.brand,
                                image: item.benefits[0].imageSrc,
                            }));

                        setSearchResults(results);
                    }}
                />
            </div>

            {/* 🔍 검색 결과 있을 때만 렌더링 */}
            {searchKeyword && searchResults.length > 0 && (
                <div className={styles.searchSection}>
                    <h3 className={styles.subTitle}>검색된 브랜드</h3>
                    <div className={styles.brandList}>
                        {searchResults.map((brand) => (
                            <BrandCard
                                key={brand.name}
                                imageSrc={brand.image}
                                brandName={brand.name}
                                isFavorite={likedBrands[brand.name]}
                                onToggle={() => toggleFavorite(brand.name)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* 등록된 관심 브랜드 */}
            <div className={`${styles.registeredBrandSection} ${
                searchResults.length === 0 ? styles.withPadding : ''
            }`}>
                <h3 className={styles.subTitle}>등록된 관심 브랜드</h3>
                <div className={styles.brandList}>
                    {registeredBrands.map((brand) => (
                        <BrandCard
                            key={brand.name}
                            imageSrc={brand.image}
                            brandName={brand.name}
                            isFavorite={true}
                            onToggle={() => toggleFavorite(brand.name)}
                        />
                    ))}
                </div>
            </div>

            <button className={styles.saveButton} onClick={() => navigate('/mypage')}>저장</button>
        </div>
    );
}

export default FavoriteBrandPage;
