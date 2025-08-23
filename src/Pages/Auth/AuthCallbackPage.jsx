// src/pages/Auth/AuthCallbackPage.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authAtom } from '../../recoil/atoms/authAtom';
import { setAccessToken } from '../../services/api/token';
import { authorizedFetch } from '../../services/api/https';

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

    // 1) 전역/로컬 저장
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

    // 2) 온보딩 여부 확인 후 라우팅
    const checkOnboarding = async () => {
      try {
        const res = await authorizedFetch('/api/user-telecoms/onboarding', { method: 'GET' });
        const data = await res.json();

        if (data?.result === true) {
          // 이미 등록 완료
          navigate('/home', { replace: true });
        } else {
          // 미등록 → 등록 플로우로
          navigate('/register/card', { replace: true });
        }
      } catch (err) {
        console.error('[Onboarding check error]', err);
        navigate('/onboarding', { replace: true });
      }
    };

    checkOnboarding();
  }, [navigate, search, setAuth]);

  return null;
}
