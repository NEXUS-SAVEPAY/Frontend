// src/services/api/https.js
import { getAccessToken } from './token';

export async function authorizedFetch(path, options = {}) {
    const token = getAccessToken(); // 'Bearer ...'
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: token } : {}),
    };
    const url = path.startsWith('/api') ? path : `/api${path}`; // -> '/api/auth/me'
    return fetch(url, { ...options, headers });
}
