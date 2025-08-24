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

    // result 배열을 안전하게 매핑
    const list = Array.isArray(data?.result) ? data.result : [];

    return list.map((item) => {
        const discountPercent = Number(item?.discountPercent ?? 0) || 0;
        const discountType = (item?.discountType ?? '').toString().trim();

        // 0%일 때는 퍼센트 없이 discountType만
        const discountLabel =
            discountPercent && discountType
                ? `${discountPercent}% ${discountType}`
                : discountType || '';

        return {
            id: item.id,
            brand: item.brandName,
            imageSrc: item.brandImage,
            description: discountLabel || item.details || '',
            detail: item.details ?? '',
            infoLink: item.infoLink ?? '',
            pointInfo: item.pointInfo ?? '',
            createdAt: item.createdAt ?? '',
        };
    });
}

export { fetchDiscountsByBrand };
