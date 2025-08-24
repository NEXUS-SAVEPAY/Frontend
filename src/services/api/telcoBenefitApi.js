// src/services/api/telcoBenefitApi.js
import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const withBase = (path) =>
    new URL(`${BASE_URL}${path}`, typeof window !== 'undefined' ? window.location.origin : undefined);

// 공통 fetch
async function fetchJson(url) {
    const token = getAccessToken?.();
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: token ? 'omit' : 'include',
        redirect: 'follow',
    });

    if (res.redirected && /\/login/i.test(res.url)) {
        throw new Error('인증이 필요합니다. 먼저 로그인해주세요.');
    }
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`서버 오류 (${res.status}): ${text}`);
    }
    return res.json();
}

// 통신사 혜택 조회
export async function fetchTelcoBenefits() {
    const url = withBase('/api/discount/telecom');
    const data = await fetchJson(url);
    console.log('[통신사 혜택 응답]', data);
    
    if (data?.result && Array.isArray(data.result)) {
        return data.result.map((item) => {
            const discountPercent = Number(item.discountPercent ?? 0) || 0;
            const discountType = (item.discountType ?? '').toString().trim();

            // 📌 0일 때 퍼센트 빼고 타입만
            const discountLabel =
                discountPercent && discountType
                    ? `${discountPercent}% ${discountType}`
                    : discountType || '';

            return {
                id: item.id,
                brand: item.brandName,
                imageSrc: item.brandImage,
                description: discountLabel || item.details || '',
                detail: item.details,
                infoLink: item.infoLink,
                pointInfo: item.pointInfo,
                createdAt: item.createdAt,
            };
        });
    }
    return [];
}

