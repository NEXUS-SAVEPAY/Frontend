// src/pages/FavoriteBenefitsPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FavoriteBenefitPage.module.css';
import BenefitListItem from '../components/Benefit/BenefitListItem';
import OwlScrollTop from '../components/Common/OwlScrollTop';

import { fetchFavoriteBenefits } from '../services/api/favoriteBenefitApi';
import { getUserFavoriteBrands } from '../services/api/interestbrandApi';

const norm = (s) => (s ?? '').toString().trim().replace(/\s+/g, ' ').toLowerCase();

export default function FavoriteBenefitsPage() {
  const navigate = useNavigate();

  const [favBrands, setFavBrands] = useState([]); // [{id, name, image}]
  const [groups, setGroups] = useState([]);       // [{ brand, brandImage, benefits:[...] }]
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');

        // 1) 서버가 이미 "관심사 기반"으로 돌려주므로
        //    우선 전체를 받아온다.
        const serverGroups = await fetchFavoriteBenefits();

        // 2) (선택) 관심 브랜드 목록이 정상 응답이면 이름이 완전히 다른 경우를 대비해 얇게 필터
        //    - 서버가 이미 필터해주면 likeSet과 매칭되지 않아도 serverGroups를 그대로 사용
        let filtered = serverGroups;

        try {
          const brands = await getUserFavoriteBrands();
          setFavBrands(Array.isArray(brands) ? brands : []);
          const likeSet = new Set((brands || []).map(b => norm(b?.name)));
          // 관심 브랜드 목록이 비어있지 않을 때만 추가 필터 (안 비면 교집합 느낌으로)
          if (likeSet.size > 0) {
            filtered = serverGroups.filter(g => likeSet.has(norm(g.brand)));
            // 만약 교집합이 비면 서버 응답을 그대로 사용 (서버가 이미 관심사 기준이라고 가정)
            if (filtered.length === 0) filtered = serverGroups;
          }
        } catch {
          // 관심 브랜드 API 실패 시에도 서버 응답은 그대로 사용
          setFavBrands([]);
        }

        setGroups(filtered);
      } catch (e) {
        setErr(e?.message || '관심 브랜드 혜택을 불러오지 못했습니다.');
        setGroups([]);
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
              {g.benefits.map((b) => (
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
                />
              ))}
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
