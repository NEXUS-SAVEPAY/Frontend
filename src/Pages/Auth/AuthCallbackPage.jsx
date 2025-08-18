// src/pages/Auth/AuthCallbackPage.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authAtom } from '../../recoil/atoms/authAtom';
import { setAccessToken } from '../../services/api/token';   // 👈 추가


export default function AuthCallbackPage() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const setAuth = useSetRecoilState(authAtom);

    useEffect(() => {
        const params = new URLSearchParams(search);
        const accessToken = params.get('accessToken') || params.get('token');
        const refreshToken = params.get('refreshToken') || null;

        if (!accessToken) {
            navigate('/onboarding?error=missing_token', { replace: true });
            return;
        }

        setAuth(prev => ({
            ...prev,
            isAuthed: true,
            accessToken,
            refreshToken,
        }));

        // 👉 localStorage에도 저장
        setAccessToken(accessToken);
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }

        // URL 깔끔하게: 토큰 쿼리 제거 + 다음 페이지로
        navigate('/register/card', { replace: true });
    }, [navigate, search, setAuth]);

    return null; // 아주 잠깐 머무는 페이지라 UI 불필요
}
