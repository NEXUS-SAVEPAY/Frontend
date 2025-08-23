// src/pages/BrandBenefitPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { likedBrandsAtom } from '../recoil/atoms/likedBrandsAtom';
import styles from './BrandBenefitPage.module.css';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import OwlScrollTop from '../components/Common/OwlScrollTop';
import favoriteBrandBenefits from '../data/favoriteBrandBenefits';

// ✅ 새 API import
import { fetchDiscountsByBrand } from '../services/api/discountApi';
import { addFavoriteBrandByName, removeFavoriteBrandById, getUserFavoriteBrands } from '../services/api/interestbrandApi';

const norm = (s) => (s ?? '').toString().trim().toLowerCase();

const BrandBenefitPage = () => {
    const { brand } = useParams();
    const decodedBrand = decodeURIComponent(brand);
    const navigate = useNavigate();

    const [likedBrands, setLikedBrands] = useRecoilState(likedBrandsAtom);

    const [favBrands, setFavBrands] = useState([]); // 서버에서 가져온 관심 브랜드 목록
    const isLiked = useMemo(
        () => !!favBrands.find((b) => norm(b.name) === norm(decodedBrand)),
        [favBrands, decodedBrand]
    );

    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false); // 중복 클릭 방지

    // ✅ 관심 브랜드 동기화
    const syncFavorites = async () => {
        try {
            const list = await getUserFavoriteBrands();
            setFavBrands(Array.isArray(list) ? list : []);
            const mirrored = {};
            for (const b of list || []) mirrored[b.name] = true;
            setLikedBrands(mirrored);
        } catch (e) {
            console.error('[BrandBenefitPage] 관심브랜드 불러오기 실패', e);
            setFavBrands([]);
            setLikedBrands({});
        }
    };

    const toggleLike = async () => {
        if (busy) return;
        setBusy(true);

        try {
            if (!isLiked) {
                // 관심 브랜드 추가
                await addFavoriteBrandByName(decodedBrand);
            } else {
                // 관심 브랜드 삭제 → 서버 ID 찾아서 삭제
                const target = favBrands.find((b) => norm(b.name) === norm(decodedBrand));
                if (target?.id) {
                    await removeFavoriteBrandById(target.id);
                }
            }
            // 서버와 동기화
            await syncFavorites();
        } catch (e) {
            console.error('[BrandBenefitPage] toggleLike error', e);
            alert(e?.message || '관심 브랜드 변경 실패');
        } finally {
            setBusy(false);
        }
    };

    // ✅ 서버 호출 + 매핑
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                // 관심 브랜드 최신화
                await syncFavorites();

                // 브랜드별 혜택 불러오기
                const data = await fetchDiscountsByBrand(decodedBrand);
                if (Array.isArray(data?.result)) {
                    const mapped = data.result.map((it) => ({
                        id: it.id,
                        brand: it.brandName,
                        description: `${it.discountPercent ?? ''}% 할인`,
                        detail: it.details ?? '',
                        imageSrc: it.brandImage ?? '',
                        type: (it.source ?? '').toLowerCase(),
                    }));
                    setBenefits(mapped);
                } else {
                    setBenefits([]);
                }
            } catch (e) {
                console.error('[BrandBenefitPage] API 에러:', e);
                setError(e?.message || '혜택을 불러오지 못했습니다.');
                // fallback: 로컬 목데이터
                const local = favoriteBrandBenefits.find(item => item.brand === decodedBrand);
                const mappedLocal = (local?.benefits || []).map((it) => ({
                    id: it.id,
                    brand: decodedBrand,
                    description: it.description ?? '',
                    detail: it.detail ?? '',
                    imageSrc: it.imageSrc ?? '',
                    type: (it.type ?? '').toLowerCase(),
                }));
                setBenefits(mappedLocal);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [decodedBrand]);

    // type별 분리
    const cardBenefits = benefits.filter((b) => b.type === 'card');
    const simplePayBenefits = benefits.filter((b) => b.type === 'pay');
    const telcoBenefits = benefits.filter((b) => b.type === 'telco');

    return (
        <div className={styles.container}>
            <div className={styles.fixedHeader}>
                <div className={styles.header}>
                    <span className={styles.backButton} onClick={() => navigate('/home')}>〈</span>
                    <div className={styles.brandTitleWrapper}>
                        <h2 className={styles.pageTitle}>{decodedBrand}</h2>
                        <button className={styles.starButton} onClick={toggleLike} disabled={busy}>
                            {isLiked ? '★' : '☆'}
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                {!loading && error && <p className={styles.error}>{error}</p>}
                {!loading && !error && benefits.length === 0 && (
                    <div className={styles.notFound}>해당 브랜드의 혜택이 없습니다.</div>
                )}

                {/* 카드 혜택 */}
                {cardBenefits.length > 0 && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>카드 혜택</h3>
                        </div>
                        <div className={styles.benefitList}>
                            {cardBenefits.map((benefit) => (
                                <BenefitListItem key={benefit.id} {...benefit} />
                            ))}
                        </div>
                    </section>
                )}

                {/* 간편결제 혜택 */}
                {simplePayBenefits.length > 0 && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>간편결제 혜택</h3>
                        </div>
                        <div className={styles.benefitList}>
                            {simplePayBenefits.map((benefit) => (
                                <BenefitListItem key={benefit.id} {...benefit} />
                            ))}
                        </div>
                    </section>
                )}

                {/* 통신사 혜택 */}
                {telcoBenefits.length > 0 && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>통신사 혜택</h3>
                        </div>
                        <div className={styles.benefitList}>
                            {telcoBenefits.map((benefit) => (
                                <BenefitListItem key={benefit.id} {...benefit} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
            <OwlScrollTop />
        </div>
    );
};

export default BrandBenefitPage;
