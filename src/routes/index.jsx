import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthDonePage from '../Pages/Auth/AuthCallbackPage';
import OnboardingPage from '../pages/Onboarding/OnboardingPage';
import CardRegisterPage from '../pages/CardRegister/CardRegisterPage';
import HomePage from '../Pages/HomePage';
import PayRegisterPage from '../pages/Register/PayRegisterPage';
import TelcoRegisterPage from '../pages/Register/TelcoRegisterPage';
import BenefitDetailPage from '../pages/BenefitDetailPage';
import MyPage from '../pages/MyPage/MyPage.jsx';
import ManagePaymentPage from '../pages/MyPage/ManagePaymentPage';
import RecommendedBenefitPage from '../Pages/RecommendedBenefitPage';
import FavoriteBenefitPage from '../Pages/FavoriteBenefitPage';
import RegisteredBenefitPage from '../Pages/RegisteredBenefitPage';
import CardBenefitPage from '../pages/CardBenefitPage';
import SimplePayBenefitPage from '../pages/SimplePayBenefitPage';
import TelcoBenefitPage from '../pages/TelcoBenefitPage';
import FirstPage from '../pages/Onboarding/FirstPage.jsx';
import BrandBenefitPage from '../Pages/BrandBenefitPage';
import FavoriteBrandPage from '../Pages/FavoriteBrandPage';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/auth/callback" element={<AuthDonePage />} />

        {/* 등록 */}
        <Route path="/register/card" element={<CardRegisterPage isManageMode={false} />} />
        <Route path="/register/simple-pay" element={<PayRegisterPage isManageMode={false} />} />
        <Route path="/register/telco" element={<TelcoRegisterPage isManageMode={false} />} />

        {/* 홈/혜택 리스트 */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/benefit/recommended" element={<RecommendedBenefitPage />} />
        <Route path="/benefit/registered" element={<RegisteredBenefitPage />} />
        <Route path="/benefit/favorites" element={<FavoriteBenefitPage />} />
        <Route path="/benefit/cards" element={<CardBenefitPage />} />
        <Route path="/benefit/simplepay" element={<SimplePayBenefitPage />} />
        <Route path="/benefit/telco" element={<TelcoBenefitPage />} />

        {/* 브랜드 별 리스트 & 상세 */}
        <Route path="/benefit/:brand" element={<BrandBenefitPage />} />
        <Route path="/benefit/:brand/:discountId" element={<BenefitDetailPage />} /> {/* ✅ :discountId로 통일 */}

        {/* 관심 브랜드 */}
        <Route path="/favorite-brand" element={<FavoriteBrandPage />} />

        {/* 마이페이지 & 관리 */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/manage-payment" element={<ManagePaymentPage />} />
        <Route path="/manage-card" element={<CardRegisterPage isManageMode={true} />} />
        <Route path="/manage-simplepay" element={<PayRegisterPage isManageMode={true} />} /> {/* ✅ 슬래시 추가 */}
        <Route path="/manage-telco" element={<TelcoRegisterPage isManageMode={true} />} />   {/* ✅ 슬래시 추가 */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
