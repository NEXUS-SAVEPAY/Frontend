// src/services/api/https.js
import { getAccessToken } from './token';

export async function authorizedFetch(path, options = {}) {
    const token = getAccessToken();
    console.log('[authorizedFetch] token =', token); // 👈 토큰 값 확인
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const url = path.startsWith('/api') ? path : `/api${path}`;
    console.log('[authorizedFetch] url =', url);      // 👈 호출 경로 확인
    console.log('[authorizedFetch] headers =', headers); // 👈 Authorization 헤더 확인
    return fetch(url, { ...options, headers });
}

// JSON 파싱 전용 함수
export async function getJson(path, options = {}) {
    const res = await authorizedFetch(path, { method: 'GET', ...options });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
}