// src/pages/MyPage/MyPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';

import { likedBrandsAtom } from '../../recoil/atoms/likedBrandsAtom';
import { registeredCardsAtom } from '../../recoil/atoms/CardRegisterAtom';
import { userPaymentsAtom } from '../../recoil/atoms/userPaymentsAtom';
import { userTelcoInfoAtom } from '../../recoil/atoms/userTelcoInfoAtom';

import { fetchUserTelco } from '../../services/api/telcoService';
import { fetchRegisteredCards } from '../../services/api/cardApi';
import { fetchSimplePays } from '../../services/api/payApi';
import { getUserFavoriteBrands } from '../../services/api/interestbrandApi';

import styles from './MyPage.module.css';
import PaymentMethodSection from './PaymentMethodSection';
import BrandSection from './BrandSection';
import NotificationSection from './NotificationSection';
import TabBar from '../../components/Common/TabBar';

import cardImg from '../../assets/images/card.png';
import kakaopayImg from '../../assets/images/kakaopay.png';
import sktImg from '../../assets/images/skt.png';

function MyPage() {
    const navigate = useNavigate();

    // ---------------- 관심 브랜드 ----------------
    const [favBrands, setFavBrands] = useState([]); // [{ id, name, image }, ...]
    const [favLoading, setFavLoading] = useState(false);
    const [favError, setFavError] = useState('');
    const [, setLikedBrandsMirror] = useRecoilState(likedBrandsAtom); // Recoil에는 "미러"로만 반영

    // 관심 브랜드 갱신
    const refreshFavorites = async () => {
        setFavLoading(true);
        setFavError('');
        try {
            const res = await getUserFavoriteBrands();

            // 응답 포맷이 여러 가지일 수 있어 방어적으로 처리
            const raw = Array.isArray(res)
                ? res
                : Array.isArray(res?.result)
                ? res.result
                : Array.isArray(res?.data)
                ? res.data
                : [];

            // 통일된 형태로 normalize
            const normalized = raw
                .map((it) => ({
                    id: it.id ?? it.interestBrandId ?? it.brandId,
                    name: it.name ?? it.brandName ?? it.brand,
                    image: it.image ?? it.brandImage ?? it.logo ?? '',
                }))
                .filter((b) => !!b.name);

            setFavBrands(normalized);

            // Recoil 미러 반영 (다른 페이지에서 "좋아요 여부" 활용)
            const mirror = {};
            normalized.forEach((b) => {
                mirror[b.name] = true;
            });
            setLikedBrandsMirror(mirror);
        } catch (e) {
            setFavError(e?.message || '관심 브랜드를 불러오지 못했습니다.');
            setFavBrands([]);
        } finally {
            setFavLoading(false);
        }
    };

    useEffect(() => {
        refreshFavorites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddBrand = () => navigate('/favorite-brand');
    const handleBrandClick = (brandName) =>
        navigate(`/benefit/${encodeURIComponent(brandName)}`);

    // ---------------- 카드 / 간편결제 / 통신사 ----------------
    const setRegisteredCards = useSetRecoilState(registeredCardsAtom);
    const registeredCards = useRecoilValue(registeredCardsAtom);

    const setUserPayment = useSetRecoilState(userPaymentsAtom);
    const userPaymentRaw = useRecoilValue(userPaymentsAtom);

    const [userTelcoInfo, setUserTelcoInfo] = useRecoilState(userTelcoInfoAtom);

    // 카드 목록 불러오기
    const [loadingCards, setLoadingCards] = useState(false);
    const [cardsError, setCardsError] = useState('');
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoadingCards(true);
                setCardsError('');
                const serverCards = await fetchRegisteredCards();
                if (!mounted) return;
                setRegisteredCards((prev) => {
                    if (!Array.isArray(serverCards) || serverCards.length === 0) return prev;
                    const keyOf = (c) => String(c?.id ?? `${c?.company ?? ''}::${c?.name ?? ''}`);
                    const map = new Map();
                    [...prev, ...serverCards].forEach((c) => map.set(keyOf(c), c));
                    return Array.from(map.values());
                });
            } catch (e) {
                if (mounted) setCardsError(e.message || '카드 목록을 불러오지 못했습니다.');
            } finally {
                if (mounted) setLoadingCards(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [setRegisteredCards]);

    // 간편결제 불러오기
    const [loadingPays, setLoadingPays] = useState(false);
    const [paysError, setPaysError] = useState('');
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoadingPays(true);
                setPaysError('');
                const paysFromServer = await fetchSimplePays(); // 서버에서 객체 배열 응답
                if (!mounted) return;
                setUserPayment(paysFromServer); // 문자열 X, 객체 배열 그대로 저장
            } catch (e) {
                if (mounted) setPaysError(e.message || '간편결제 정보를 불러오지 못했습니다.');
            } finally {
                if (mounted) setLoadingPays(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [setUserPayment]);

    // 통신사 불러오기
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const telcoRes = await fetchUserTelco();
                if (!mounted) return;
                if (telcoRes?.isSuccess && telcoRes.result) {
                    setUserTelcoInfo({
                        telco: telcoRes.result.telecomName,
                        hasMembership: telcoRes.result.isMembership,
                        grade: telcoRes.result.grade,
                        image: telcoRes.result.image,
                    });
                }
            } catch {
                // 필요시 에러 처리 가능
            }
        })();
        return () => {
            mounted = false;
        };
    }, [setUserTelcoInfo]);

    // ---------------- 데이터 정리 ----------------
    // 간편결제 배열 정규화 + 'none' 제거
    const toArray = (v) => (Array.isArray(v) ? v : typeof v === 'string' && v ? [v] : []);
    const userPayments = toArray(userPaymentRaw).filter((v) => v && v !== 'none');

    // 부모/자식 옵션(네이버 멤버십 등) 처리 → 부모 중복 제거
    const parentsWithSubs = new Set(
        (Array.isArray(userPayments) ? userPayments : [])
            .filter((v) => typeof v.company === 'string' && v.company.includes('_'))
            .map((v) => v.company.split('_')[0])
    );

    const displayPayments = (Array.isArray(userPayments) ? userPayments : []).filter((v) => {
        if (!v || typeof v.company !== 'string') return false;
        const isParent = !v.company.includes('_');
        return !(isParent && parentsWithSubs.has(v.company));
    });

    const PAYMENT_NAME = {
        kakao: '카카오페이',
        naver: '네이버페이',
        toss: '토스페이',
        payco: '페이코',
    };
    const SUBOPTION_LABELS = {
        naver_membership: '멤버십',
        toss_prime: '프라임',
    };

    // 최종 표시용 데이터 구조
    const groupedMethods = [
        {
            type: '카드',
            items: registeredCards.map((card) => ({
                id: card.id,
                name: card.name,
                image: card.image || cardImg,
                tag: card.company,
            })),
        },
        {
            type: '간편결제',
            items: (Array.isArray(userPaymentRaw) ? userPaymentRaw : []).map((p, idx) => ({
                id: `simplepay_${p.company}_${idx}`,
                name: PAYMENT_NAME[p.company] || p.company, // 한글 이름 매핑
                image: p.image,
                tag: p.isMembership ? '멤버십' : '멤버십 없음',
            })),
        },
        {
            type: '통신사',
            items: userTelcoInfo?.telco
                ? [
                      {
                          id: 'telco',
                          name: userTelcoInfo.telco,
                          image: userTelcoInfo.image,
                          tag: userTelcoInfo.hasMembership
                              ? userTelcoInfo.grade || ''
                              : '멤버십 없음',
                      },
                  ]
                : [],
        },
    ];

    const handleDelete = () => {}; // 현재는 사용 안 함 (향후 확장용)

    // ---------------- 렌더링 ----------------
    return (
        <div className={styles.pageWrapper}>
            <h2 className={styles.title}>마이페이지</h2>

            {/* 결제 수단 섹션 */}
            <div className={styles.headerRow}>
                <h3 className={styles.sectionTitle}>내 결제 수단</h3>
                <button
                    className={styles.changeButton}
                    onClick={() => navigate('/manage-payment')}
                >
                    결제 수단 변경 <span className={styles.arrow}></span>
                </button>
            </div>

            <PaymentMethodSection groupedMethods={groupedMethods} onDelete={handleDelete} />

            {/* 관심 브랜드 섹션 */}
            {favLoading && <p className={styles.helperText}>관심 브랜드를 불러오는 중…</p>}
            {favError && <p className={styles.errorText}>{favError}</p>}
            {!favLoading && !favError && (
                <BrandSection
                    brands={favBrands}
                    onAdd={handleAddBrand}
                    onBrandClick={handleBrandClick}
                />
            )}

            {/* 알림 / 하단 탭 */}
            <NotificationSection />
            <TabBar />
        </div>
    );
}

export default MyPage;
