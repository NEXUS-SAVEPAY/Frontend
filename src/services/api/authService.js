// src/services/authService.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchMe() {
    const res = await fetch(`${BASE_URL}/api/v1/auth/me`, {
        method: 'GET',
        credentials: 'include', // 세션/쿠키 사용 시 필수
        headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
