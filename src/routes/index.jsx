import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import OnboardingPage from '../pages/Onboarding/OnboardingPage';
import CardRegisterPage from '../pages/CardRegister/CardRegisterPage';
import HomePage from '../Pages/HomePage';
import PayRegisterPage from '../pages/Register/PayRegisterPage';
import TelcoRegisterPage from '../pages/Register/TelcoRegisterPage';
import BenefitDetailPage from '../Pages/BenefitDetailPage';
import ExternalBenefitPage from '../pages/ExternalBenefitPage';
import MyPage from '../pages/MyPage';
import NotificationPage from '../pages/NotificationPage';
import RecommendedBenefitPage from '../Pages/RecommendedBenefitPage';
import FavoriteBenefitPage from '../Pages/FavoriteBenefitPage';

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<OnboardingPage />} />
                <Route path="/register/card" element={<CardRegisterPage />} />
                <Route path="/register/simple-pay" element={<PayRegisterPage />} />
                <Route path="/register/telco" element={<TelcoRegisterPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/benefit/recommended" element={<RecommendedBenefitPage />} />
                <Route path="/benefit/favorites" element={<FavoriteBenefitPage />} />
                <Route path="/benefit/:id" element={<BenefitDetailPage />} /> 
                <Route path="/external-benefits" element={<ExternalBenefitPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/notifications" element={<NotificationPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
