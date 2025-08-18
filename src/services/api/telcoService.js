// src/services/telcoService.js
import { authorizedFetch } from './https';

export async function registerUserTelco(data) {
    const body = {
        telecomName: data.telco,
        isMembership: data.hasMembership ?? false,   // null이면 false
        // grade가 없으면 아예 필드를 빼버림 (빈 문자열 보내지 않음)
        ...(data.grade ? { grade: data.grade } : {})
    };

    console.log('[registerUserTelco] POST body:', body);

    const res = await authorizedFetch('/api/user-telecoms/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const resJson = await res.json().catch(() => null);
    console.log('[registerUserTelco] response:', resJson, 'status:', res.status);

    return resJson;
}

// 등록된 통신사 불러오기 (GET)
export async function fetchUserTelco() {
    const res = await authorizedFetch('/api/user-telecoms/', {
        method: 'GET',
    });

    const resJson = await res.json().catch(() => null);
    console.log('[fetchUserTelco] response:', resJson, 'status:', res.status);

    return resJson;
}

export async function updateUserTelco(payload) {
    const body = {
        telecomName: payload.telco,
        isMembership: payload.hasMembership ?? false, // null이면 false
        ...(payload.grade ? { grade: payload.grade } : {}) // grade 없으면 아예 안 보냄
    };

    console.log('[updateUserTelco] PUT body:', body);

    const res = await authorizedFetch('/api/user-telecoms/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const resJson = await res.json().catch(() => null);
    console.log('[updateUserTelco] response:', resJson, 'status:', res.status);

    return resJson;
}
