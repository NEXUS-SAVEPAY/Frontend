// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthDonePage from '../Pages/Auth/AuthCallbackPage';
import OnboardingPage from '../Pages/Onboarding/OnboardingPage';
import CardRegisterPage from '../Pages/CardRegister/CardRegisterPage';
import HomePage from '../Pages/HomePage';
import PayRegisterPage from '../Pages/Register/PayRegisterPage';
import TelcoRegisterPage from '../Pages/Register/TelcoRegisterPage';
import BenefitDetailPage from '../Pages/BenefitDetailPage';
import MyPage from '../Pages/MyPage/MyPage.jsx';
import ManagePaymentPage from '../Pages/MyPage/ManagePaymentPage';
import RecommendedBenefitPage from '../Pages/RecommendedBenefitPage';
import FavoriteBenefitPage from '../Pages/FavoriteBenefitPage';
import RegisteredBenefitPage from '../Pages/RegisteredBenefitPage';
import CardBenefitPage from '../Pages/CardBenefitPage';
import SimplePayBenefitPage from '../Pages/SimplePayBenefitPage';
import TelcoBenefitPage from '../Pages/TelcoBenefitPage';
import FirstPage from '../Pages/Onboarding/FirstPage.jsx';
import BrandBenefitPage from '../Pages/BrandBenefitPage';
import FavoriteBrandPage from '../Pages/FavoriteBrandPage';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 온보딩/인증 */}
        <Route path="/" element={<FirstPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/auth/callback" element={<AuthDonePage />} />

        {/* 등록 */}
        <Route path="/register/card" element={<CardRegisterPage isManageMode={false} />} />
        <Route path="/register/simple-pay" element={<PayRegisterPage isManageMode={false} />} />
        <Route path="/register/telco" element={<TelcoRegisterPage isManageMode={false} />} />

        {/* 홈/혜택 리스트(정적 탭 경로는 먼저 선언해서 동적 brand와 충돌 방지) */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/benefit/recommended" element={<RecommendedBenefitPage />} />
        <Route path="/benefit/registered" element={<RegisteredBenefitPage />} />
        <Route path="/benefit/favorites" element={<FavoriteBenefitPage />} />
        <Route path="/benefit/cards" element={<CardBenefitPage />} />
        <Route path="/benefit/simplepay" element={<SimplePayBenefitPage />} />
        <Route path="/benefit/telco" element={<TelcoBenefitPage />} />

        {/* 상세 → 브랜드 순서 (더 구체적인 경로를 위에 둠) */}
        <Route path="/benefit/:brand/:discountId" element={<BenefitDetailPage />} />
        <Route path="/benefit/:brand" element={<BrandBenefitPage />} />

        {/* 관심 브랜드 */}
        <Route path="/favorite-brand" element={<FavoriteBrandPage />} />

        {/* 마이페이지 & 관리 */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/manage-payment" element={<ManagePaymentPage />} />
        <Route path="/manage-card" element={<CardRegisterPage isManageMode={true} />} />
        <Route path="/manage-simplepay" element={<PayRegisterPage isManageMode={true} />} />
        <Route path="/manage-telco" element={<TelcoRegisterPage isManageMode={true} />} />

        {/* 404 페이지가 있다면 마지막에 추가 */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
