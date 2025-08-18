// src/pages/Auth/AuthCallbackPage.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authAtom } from '../../recoil/atoms/authAtom';
import { setAccessToken } from '../../services/api/token';
import { authorizedFetch } from '../../services/api/https'; // ✅ 추가

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

        // ✅ 전역 상태 & localStorage 저장
        setAuth(prev => ({
            ...prev,
            isAuthed: true,
            accessToken,
            refreshToken,
        }));
        setAccessToken(accessToken);
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }

        // ✅ 온보딩 체크
        const checkOnboarding = async () => {
            try {
                const res = await authorizedFetch('/api/user-telecoms/onboarding', {
                    method: 'GET',
                });
                const data = await res.json();
                console.log('[Onboarding check after login]', data);

                if (data?.result === true) {
                    navigate('/home', { replace: true }); // 등록 끝난 사용자
                } else {
                    navigate('/register/telco', { replace: true }); // 등록 안 된 사용자 → 등록 페이지
                }
            } catch (err) {
                console.error('[Onboarding check error]', err);
                navigate('/onboarding', { replace: true }); // 실패 시 다시 온보딩
            }
        };

        checkOnboarding();
    }, [navigate, search, setAuth]);

    return null;
}
