// src/services/api/discountApi.js
import { getAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function fetchDiscountsByBrand(brandName) {
    const token = typeof getAccessToken === 'function' ? getAccessToken() : null;

    const res = await fetch(`${BASE_URL}/api/discount/discounts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ brandName }),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `요청 실패 (${res.status})`);
    }

    const data = await res.json();

    // 🔹 응답 매핑: 0%일 때는 퍼센트 빼고 discountType만 표시
    if (Array.isArray(data?.result)) {
        return data.result.map((it) => {
            const discountPercent = Number(it.discountPercent ?? 0) || 0;
            const discountType = (it.discountType ?? '').toString().trim();

            const discountLabel =
                discountPercent && discountType
                    ? `${discountPercent}% ${discountType}`
                    : discountType || '';

            return {
                id: it.id,
                brand: it.brandName,
                description: discountLabel || it.details || '',
                detail: it.details ?? '',
                imageSrc: it.brandImage ?? '',
                type: (it.source ?? '').toLowerCase(),
                infoLink: it.infoLink ?? '',
                pointInfo: it.pointInfo ?? '',
                createdAt: it.createdAt ?? '',
            };
        });
    }

    return [];
}

export { fetchDiscountsByBrand };
