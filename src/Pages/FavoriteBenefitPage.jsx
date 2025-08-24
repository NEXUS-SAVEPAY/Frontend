// src/pages/FavoriteBenefit/FavoriteBenefitPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { likedBrandsAtom } from '../../recoil/atoms/likedBrandsAtom';
import BenefitListItem from '../../components/Benefit/BenefitListItem';
import OwlScrollTop from '../../components/Common/OwlScrollTop';
import styles from './FavoriteBenefitPage.module.css';

// API
import { fetchFavoriteBenefits } from '../../services/api/favoriteBenefitApi';
import {
  getUserFavoriteBrands,
  addFavoriteBrandByName,
  removeFavoriteBrandById,
} from '../../services/api/interestbrandApi';
import { isCardDiscountId } from '../../services/api/cardBenefitApi'; // 카드 혜택 판정

// 문자열 정규화 (공백 제거 + 소문자 변환)
const norm = (s) => (s ?? '').toString().trim().replace(/\s+/g, ' ').toLowerCase();

const FavoriteBenefitPage = () => {
  const navigate = useNavigate();
  const [likedBrands, setLikedBrands] = useRecoilState(likedBrandsAtom);

  // 서버 데이터
  const [favBrands, setFavBrands] = useState([]); // 관심 브랜드 목록
  const [groups, setGroups] = useState([]);       // [{ brand, brandImage, benefits:[...] }]
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  // 카드 혜택 ID 집합(사전 최적화; 없어도 동작)
  const [cardIdSet, setCardIdSet] = useState(null); // Set<string> | null

  // 서버 목록 동기화
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');

        const serverGroups = await fetchFavoriteBenefits();
        let filtered = serverGroups;

        try {
          const brands = await getUserFavoriteBrands();
          setFavBrands(Array.isArray(brands) ? brands : []);

          // Recoil likedBrands 동기화
          const mirrored = {};
          for (const b of brands || []) mirrored[b.name] = true;
          setLikedBrands(mirrored);

          // 관심 브랜드만 필터링
          const likeSet = new Set((brands || []).map((b) => norm(b?.name)));
          if (likeSet.size > 0) {
            const inter = serverGroups.filter((g) => likeSet.has(norm(g.brand)));
            filtered = inter.length > 0 ? inter : serverGroups;
          }
        } catch {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 그룹이 준비되면 카드 혜택 판정해서 Set 구성(있으면 사용, 없어도 아래 클릭시 재확인)
  useEffect(() => {
    (async () => {
      if (!groups || groups.length === 0) {
        setCardIdSet(new Set());
        return;
      }
      const ids = Array.from(
        new Set(groups.flatMap((g) => (g.benefits || []).map((b) => String(b.id))))
      );
      if (ids.length === 0) {
        setCardIdSet(new Set());
        return;
      }
      try {
        const res = await Promise.all(
          ids.map(async (id) => {
            try {
              const normalized = /^\d+$/.test(id) ? Number(id) : id;
              const ok = await isCardDiscountId(normalized);
              return ok ? id : null;
            } catch {
              return null;
            }
          })
        );
        setCardIdSet(new Set(res.filter(Boolean).map(String)));
      } catch {
        setCardIdSet(new Set());
      }
    })();
  }, [groups]);

  // 서버 관심 브랜드 이름 Set
  const serverNameSet = useMemo(() => {
    const s = new Set();
    for (const b of favBrands) s.add(norm(b.name));
    return s;
  }, [favBrands]);

  // 좋아요 토글 (API 반영)
  const toggleLike = async (brandName) => {
    if (busy) return;
    setBusy(true);

    try {
      if (!serverNameSet.has(norm(brandName))) {
        // 등록
        await addFavoriteBrandByName(brandName);
      } else {
        // 해제
        const target = favBrands.find((b) => norm(b.name) === norm(brandName));
        if (target?.id) {
          await removeFavoriteBrandById(target.id);
          // UI에서도 해당 그룹 제거
          setGroups((prev) => prev.filter((g) => norm(g.brand) !== norm(brandName)));
        }
      }

      // 최신 관심 브랜드 동기화
      const latestBrands = await getUserFavoriteBrands();
      setFavBrands(latestBrands);
      const mirrored = {};
      for (const b of latestBrands || []) mirrored[b.name] = true;
      setLikedBrands(mirrored);
    } catch (e) {
      console.error('toggleLike error', e);
      alert(e?.message || '관심 브랜드 변경 실패');
    } finally {
      setBusy(false);
    }
  };

  // 클릭 시 최종 확인하고 이동 (자식의 source 우선)
  const openDetailWithCardCheck = async ({ id, brand, source }) => {
    const safeBrand = encodeURIComponent(String(brand).trim());
    let isCard = false;

    // 1) 자식이 이미 source='card'로 넘겼다면 최우선 존중
    if (source === 'card') isCard = true;

    // 2) 사전 판정 Set
    if (!isCard && cardIdSet && cardIdSet.size > 0) {
      isCard = cardIdSet.has(String(id));
    }

    // 3) 클릭 시점 최종 확인
    if (!isCard) {
      const maybeNum = /^\d+$/.test(String(id)) ? Number(id) : id;
      try {
        isCard = !!(await isCardDiscountId(maybeNum));
      } catch {
        isCard = false;
      }
    }

    navigate(`/benefit/${safeBrand}/${String(id)}${isCard ? '?source=card' : ''}`, {
      state: isCard ? { source: 'card' } : undefined,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {loading && null}
        {err && !loading && <p className={styles.error}>{err}</p>}

        {groups.length === 0 && !loading && !err && (
          <p className={styles.emptyMessage}>관심 브랜드가 없습니다.</p>
        )}

        {groups.map((g, index) => (
          <div key={g.brand} className={styles.benefitListColumn}>
            {/* 브랜드명 + (첫 번째만 뒤로가기 버튼) + 즐겨찾기 버튼 */}
            <div className={styles.brandTitleWrapper}>
              {index === 0 && (
                <span className={styles.backButton} onClick={() => navigate(-1)}>
                  〈
                </span>
              )}
              <span className={styles.brandTitle}>{g.brand}</span>
              <button
                className={styles.starButton}
                onClick={() => toggleLike(g.brand)}
                disabled={busy}
              >
                {likedBrands[g.brand] ? '★' : '☆'}
              </button>
            </div>

            {g.benefits.map((b) => {
              // 🔸 외부 링크가 없으면 카드 간주
              const isCardByNoLink = !String(b?.infoLink || '').trim();
              // 사전 판정 Set 결과와 OR
              const isCard = isCardByNoLink || cardIdSet?.has(String(b.id));

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
                  source={isCard ? 'card' : undefined}
                  onClickDetail={openDetailWithCardCheck} // 클릭 시점 최종 확인 & 이동
                />
              );
            })}
          </div>
        ))}
      </div>

      <OwlScrollTop />
    </div>
  );
};

export default FavoriteBenefitPage;
