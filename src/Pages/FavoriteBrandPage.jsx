// src/pages/FavoriteBrand/FavoriteBrandPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { likedBrandsAtom } from '../recoil/atoms/likedBrandsAtom';
import SearchBar from '../components/Common/SearchBar';
import BrandCard from '../components/Common/BrandCard';
import favoriteBrandBenefits from '../data/favoriteBrandBenefits';
import styles from './FavoriteBrandPage.module.css';

import {
  getRecentSearchedBrands,
  saveSearchedBrandByName, // 이름 기반 저장
} from '../services/api/interestbrandApi';

function FavoriteBrandPage() {
  const navigate = useNavigate();
  const [likedBrands, setLikedBrands] = useRecoilState(likedBrandsAtom);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [recentBrands, setRecentBrands] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [saving, setSaving] = useState(false); // 중복 저장 방지

  async function refreshRecent(limit = 10) {
    setRecentLoading(true);
    setRecentError('');
    try {
      const list = await getRecentSearchedBrands(limit);
      setRecentBrands(list);
    } catch (e) {
      setRecentError(e?.message || '최근 검색을 불러오지 못했습니다.');
    } finally {
      setRecentLoading(false);
    }
  }

  useEffect(() => {
    refreshRecent(10);
  }, []);

  const toggleFavorite = (brandName) => {
    setLikedBrands((prev) => ({
      ...prev,
      [brandName]: !prev[brandName],
    }));
  };

  // 검색 시: 바로 저장 + 최근 검색 갱신
  const handleSearch = async (keyword) => {
    const kw = (keyword ?? '').trim();
    setSearchKeyword(kw);

    // 로컬 결과는 그대로 노출
    const results = favoriteBrandBenefits
      .filter((item) => item.brand.includes(kw))
      .map((item) => ({
        name: item.brand,
        image: item.benefits[0].imageSrc,
      }));
    setSearchResults(results);

    if (!kw) return; // 빈 검색어는 저장 안 함
    if (saving) return; // 연타 방지

    try {
      setSaving(true);
      await saveSearchedBrandByName(kw); // ← 여기서 저장!
      await refreshRecent(10);           // 저장 직후 최신
    } catch (e) {
      setSaveMsg(e?.message || '저장 실패');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 1500);
    }
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
          onSearch={handleSearch} // ← 변경: 검색 시 즉시 저장 로직 포함
        />
      </div>

      {saveMsg && <div className={styles.toast}>{saveMsg}</div>}

      {/* 🕘 최근 검색한 브랜드 */}
      <div className={styles.recentSection}>
        <div className={styles.recentHeader}>
          <h3 className={styles.subTitle}>최근 검색한 브랜드</h3>
          {recentLoading && <span className={styles.dimText}>불러오는 중…</span>}
          {recentError && <span className={styles.errorText}>{recentError}</span>}
        </div>

        <div className={styles.brandList}>
          {!recentLoading && !recentError && recentBrands.length === 0 && (
            <span className={styles.dimText}>최근 검색 이력이 없습니다.</span>
          )}

          {recentBrands.map((brand) => (
            <BrandCard
              key={brand.id ?? brand.name}
              imageSrc={brand.image}
              brandName={brand.name}
              isFavorite={!!likedBrands[brand.name]}
              onToggle={() => toggleFavorite(brand.name)}
            />
          ))}
        </div>
      </div>

      {/* 🔍 검색 결과 */}
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
      <div
        className={`${styles.registeredBrandSection} ${
          searchResults.length === 0 ? styles.withPadding : ''
        }`}
      >
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
