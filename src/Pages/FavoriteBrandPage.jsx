// src/pages/FavoriteBrandPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { likedBrandsAtom } from '../recoil/atoms/likedBrandsAtom';
import SearchBar from '../components/Common/SearchBar';
import BrandCard from '../components/Common/BrandCard';
import favoriteBrandBenefits from '../data/favoriteBrandBenefits';
import styles from './FavoriteBrandPage.module.css';

import {
    getRecentSearchedBrands,
    saveSearchedBrandByName,
    getUserFavoriteBrands,
    addFavoriteBrandByName,
    removeFavoriteBrandById,
} from '../services/api/interestbrandApi';

const norm = (s) =>
    (s ?? '').toString().trim().replace(/\s+/g, ' ').toLowerCase();

function FavoriteBrandPage() {
    const navigate = useNavigate();
    const [likedBrands, setLikedBrands] = useRecoilState(likedBrandsAtom);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // 최근 검색
    const [recentBrands, setRecentBrands] = useState([]);
    const [recentLoading, setRecentLoading] = useState(false);
    const [recentError, setRecentError] = useState('');

    // 서버 관심 브랜드 (진실)
    const [favBrands, setFavBrands] = useState([]);
    const [favLoading, setFavLoading] = useState(false);
    const [favError, setFavError] = useState('');

    // UI 보조
    const [toast, setToast] = useState('');
    const [savingSearch, setSavingSearch] = useState(false);
    const [busy, setBusy] = useState(false);

    const showToast = (msg, ms = 1500) => {
        setToast(msg);
        setTimeout(() => setToast(''), ms);
    };

    // 서버 관심 브랜드 새로고침 + Recoil 동기화
    const refreshFavorites = async () => {
        setFavLoading(true);
        setFavError('');
        try {
            const list = await getUserFavoriteBrands();
            setFavBrands(list);

            // 서버 목록을 Recoil likedBrands로 미러링
            const mirrored = {};
            for (const b of list) mirrored[b.name] = true;
            setLikedBrands(mirrored);

            return list;
        } catch (e) {
            setFavError(e?.message || '관심 브랜드를 불러오지 못했습니다.');
            return [];
        } finally {
            setFavLoading(false);
        }
    };

    // 최근 검색 불러오기
    const refreshRecent = async (limit = 10) => {
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
    };

    useEffect(() => {
        refreshRecent(10);
        refreshFavorites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 서버 관심 브랜드 이름 Set
    const serverNameSet = useMemo(() => {
        const s = new Set();
        for (const b of favBrands) s.add(norm(b.name));
        return s;
    }, [favBrands]);

    // 즐겨찾기 토글
    const toggleFavorite = async (brandName) => {
        if (busy) return;
        const nameKey = norm(brandName);
        const isFavoritedOnServer = serverNameSet.has(nameKey);

        try {
            setBusy(true);

            if (!isFavoritedOnServer) {
                await addFavoriteBrandByName(brandName);
                await refreshFavorites();
            } else {
                // 삭제: id 필요
                let target = favBrands.find((b) => norm(b.name) === nameKey);
                if (!target) {
                    const latest = await refreshFavorites();
                    target = latest.find((b) => norm(b.name) === nameKey);
                }
                if (!target?.id) throw new Error('삭제용 ID를 찾지 못했습니다.');
                await removeFavoriteBrandById(target.id);
                await refreshFavorites();
            }
        } catch (e) {
            showToast(e?.message || '요청 실패');
        } finally {
            setBusy(false);
        }
    };

    // 검색
    const handleSearch = async (keyword) => {
        const kw = (keyword ?? '').trim();
        setSearchKeyword(kw);

        const results = favoriteBrandBenefits
            .filter((item) => item.brand.includes(kw))
            .map((item) => ({
                name: item.brand,
                image: item.benefits?.[0]?.imageSrc,
            }));
        setSearchResults(results);

        if (!kw || savingSearch) return;
        try {
            setSavingSearch(true);
            await saveSearchedBrandByName(kw);
            await refreshRecent(10);
        } catch (e) {
            showToast(e?.message || '검색 기록 저장 실패');
        } finally {
            setSavingSearch(false);
        }
    };

    // 화면에 보여줄 관심 브랜드는 서버 목록 그대로 사용
    const finalFavList = favBrands;

    return (
        <div className={styles.container}>
            <div className={styles.fixedHeader}>
                <div className={styles.header}>
                    <span className={styles.backButton} onClick={() => navigate(-1)}>
                        〈
                    </span>
                    <h2 className={styles.title}>관심 브랜드</h2>
                </div>
                <SearchBar
                    placeholder="혜택을 원하는 브랜드를 검색해주세요"
                    onSearch={handleSearch}
                />
            </div>

            {toast && <div className={styles.toast}>{toast}</div>}

            {/* 최근 검색 */}
            <div className={styles.recentSection}>
                <div className={styles.recentHeader}>
                    <h3 className={styles.subTitle}>최근 검색한 브랜드</h3>
                </div>
                <div className={styles.brandList}>
                    {recentLoading && <span className={styles.dimText}>불러오는 중…</span>}
                    {recentError && <span className={styles.errorText}>{recentError}</span>}
                    {!recentLoading && !recentError && recentBrands.length === 0 && (
                        <span className={styles.dimText}>최근 검색 이력이 없습니다.</span>
                    )}
                    {recentBrands.map((brand) => (
                        <BrandCard
                            key={brand.id ?? brand.name}
                            imageSrc={brand.image}
                            brandName={brand.name}
                            isFavorite={serverNameSet.has(norm(brand.name))}
                            onToggle={() => toggleFavorite(brand.name)}
                        />
                    ))}
                </div>
            </div>

            {/* 검색 결과 */}
            {searchKeyword && searchResults.length > 0 && (
                <div className={styles.searchSection}>
                    <h3 className={styles.subTitle}>검색된 브랜드</h3>
                </div>
            )}
            {searchKeyword && (
                <div className={styles.brandList}>
                    {searchResults.map((brand) => (
                        <BrandCard
                            key={brand.name}
                            imageSrc={brand.image}
                            brandName={brand.name}
                            isFavorite={serverNameSet.has(norm(brand.name))}
                            onToggle={() => toggleFavorite(brand.name)}
                        />
                    ))}
                </div>
            )}

            {/* 등록된 관심 브랜드 */}
            <div
                className={`${styles.registeredBrandSection} ${
                    searchResults.length === 0 ? styles.withPadding : ''
                }`}
            >
                <div className={styles.recentHeader}>
                    <h3 className={styles.subTitle}>등록된 관심 브랜드</h3>
                </div>

                <div className={styles.brandList}>
                    {favLoading && <span className={styles.dimText}>불러오는 중…</span>}
                    {favError && <span className={styles.errorText}>{favError}</span>}

                    {finalFavList.map((brand) => (
                        <BrandCard
                            key={brand.id ?? brand.name}
                            imageSrc={brand.image}
                            brandName={brand.name}
                            isFavorite={true}
                            onToggle={() => toggleFavorite(brand.name)}
                        />
                    ))}
                </div>
            </div>

            <button
                className={styles.saveButton}
                onClick={() => navigate('/mypage')}
                disabled={busy}
            >
                저장
            </button>
        </div>
    );
}

export default FavoriteBrandPage;
