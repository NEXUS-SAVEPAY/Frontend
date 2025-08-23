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

    return await res.json();
}

export { fetchDiscountsByBrand };
