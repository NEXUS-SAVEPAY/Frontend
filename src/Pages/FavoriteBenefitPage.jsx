// src/pages/FavoriteBenefit/FavoriteBenefitPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { likedBrandsAtom } from '../recoil/atoms/likedBrandsAtom';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import OwlScrollTop from '../components/Common/OwlScrollTop';
import styles from './FavoriteBenefitPage.module.css';

// API
import { fetchFavoriteBenefits } from '../services/api/favoriteBenefitApi';
import { getUserFavoriteBrands } from '../services/api/interestbrandApi';
import { isCardDiscountId } from '../services/api/cardBenefitApi'; // ★ 카드 혜택 판정

const norm = (s) => (s ?? '').toString().trim().replace(/\s+/g, ' ').toLowerCase();

export default function FavoriteBenefitsPage() {
  const navigate = useNavigate();

  const [favBrands, setFavBrands] = useState([]); // [{id, name, image}]
  const [groups, setGroups] = useState([]);       // [{ brand, brandImage, benefits:[...] }]
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // 카드 혜택 판정 결과를 담는 Set
  const [cardIdSet, setCardIdSet] = useState(null); // Set<string>

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');

        // 1) 서버 "관심사 기반" 혜택 전체
        const serverGroups = await fetchFavoriteBenefits();

        // 2) (선택) 관심 브랜드 목록 기반의 얇은 필터
        let filtered = serverGroups;
        try {
          const brands = await getUserFavoriteBrands();
          setFavBrands(Array.isArray(brands) ? brands : []);
          const likeSet = new Set((brands || []).map(b => norm(b?.name)));
          if (likeSet.size > 0) {
            const inter = serverGroups.filter(g => likeSet.has(norm(g.brand)));
            filtered = inter.length > 0 ? inter : serverGroups;
          }
        } catch {
          setFavBrands([]);
        }

        setGroups(filtered);

        // 3) 카드 혜택 판정: 각 benefit id에 대해 isCardDiscountId 호출
        //    (중복 id 제거 + 병렬 호출)
        const allIds = Array.from(
          new Set(
            filtered.flatMap(g => (g.benefits || []).map(b => String(b.id)))
          )
        );

        // 네트워크 폭주 방지용: 병렬 제한(선택). 간단히 Promise.all로 처리.
        const results = await Promise.all(
          allIds.map(async (id) => {
            try {
              const ok = await isCardDiscountId(id);
              return ok ? id : null;
            } catch {
              return null;
            }
          })
        );

        const setOk = new Set(results.filter(Boolean).map(String));
        setCardIdSet(setOk);
      } catch (e) {
        setErr(e?.message || '관심 브랜드 혜택을 불러오지 못했습니다.');
        setGroups([]);
        setCardIdSet(new Set());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const flat = useMemo(() => {
    return groups.flatMap((g) =>
      (g.benefits || []).map((b) => ({
        ...b,
        brand: g.brand,
        brandImage: g.brandImage,
      }))
    );
  }, [groups]);

  return (
    <div className={styles.container}>
      {/* 고정 헤더 */}
      <div className={styles.fixedHeader}>
        <div className={styles.header}>
          <span className={styles.backButton} onClick={() => navigate(-1)}>〈</span>
          <h2 className={styles.title}>관심 브랜드 혜택</h2>
        </div>
      </div>

      <div className={styles.content}>
        {loading && <p className={styles.dimText}>불러오는 중…</p>}
        {err && !loading && <p className={styles.error}>{err}</p>}

        {/* 브랜드별 섹션 */}
        {groups.map((g) => (
          <section key={g.brand} className={styles.brandSection}>
            <h3 className={styles.brandHeader}>{g.brand}</h3>
            <div className={styles.benefitListColumn}>
              {g.benefits.map((b) => {
                const isCard = cardIdSet?.has(String(b.id)); // ★ 카드 혜택 여부
                return (
                  <BenefitListItem
                    key={`${g.brand}-${b.id}`}
                    id={b.id}
                    brand={g.brand}
                    description={b.description}
                    detail={b.detail}
                    imageSrc={b.imageSrc || g.brandImage}
                    infoLink={b.infoLink}
                    pointInfo={b.pointInfo}
                    createdAt={b.createdAt}
                    source={isCard ? 'card' : undefined}  // ★ 카드 혜택이면 state: { source: 'card' }로 전달됨
                  />
                );
              })}
            </div>
          </section>
        ))}

        {/* 데이터 없을 때 */}
        {!loading && !err && groups.length === 0 && (
          <p className={styles.emptyText}>
            등록된 관심 브랜드와 관련된 혜택이 없습니다.
          </p>
        )}
      </div>

      <OwlScrollTop />
    </div>
  );
}
