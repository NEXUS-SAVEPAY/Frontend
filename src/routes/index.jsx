import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import OnboardingPage from '../pages/Onboarding/OnboardingPage';
import CardRegisterPage from '../pages/CardRegister/CardRegisterPage';
import HomePage from '../Pages/HomePage';
import PayRegisterPage from '../pages/Register/PayRegisterPage';
import TelcoRegisterPage from '../pages/Register/TelcoRegisterPage';
import BenefitDetailPage from '../Pages/BenefitDetailPage';
import ExternalBenefitPage from '../pages/ExternalBenefitPage';
import MyPage from '../pages/MyPage/MyPage.jsx';
import ManagePaymentPage from '../pages/MyPage/ManagePaymentPage';
import NotificationPage from '../pages/NotificationPage';
import RecommendedBenefitPage from '../Pages/RecommendedBenefitPage';
import FavoriteBenefitPage from '../Pages/FavoriteBenefitPage';
import RegisteredBenefitPage from '../Pages/RegisteredBenefitPage';
import CardBenefitPage from '../Pages/CardBenefitPage';
import SimplePayBenefitPage from '../Pages/SimplePayBenefitPage';
import TelcoBenefitPage from '../Pages/TelcoBenefitPage';
import FirstPage from '../pages/Onboarding/FirstPage.jsx';
import BrandBenefitPage from '../Pages/BrandBenefitPage';
import FavoriteBrandPage from '../Pages/FavoriteBrandPage';

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FirstPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/register/card" element={<CardRegisterPage isManageMode={false} />} />
                <Route path="/register/simple-pay" element={<PayRegisterPage isManageMode={false}/>} />
                <Route path="/register/telco" element={<TelcoRegisterPage isManageMode={false}/>} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/benefit/recommended" element={<RecommendedBenefitPage />} />
                <Route path="/benefit/registered" element={<RegisteredBenefitPage />} />
                <Route path="/benefit/favorites" element={<FavoriteBenefitPage />} />
                <Route path="/benefit/cards" element={<CardBenefitPage />} />
                <Route path="/benefit/simplepay" element={<SimplePayBenefitPage />} />
                <Route path="/benefit/telco" element={<TelcoBenefitPage />} />
                <Route path="/benefit/:brand" element={<BrandBenefitPage />} />
                <Route path="/benefit/:brand/:id" element={<BenefitDetailPage />} /> 
                <Route path="/external-benefits" element={<ExternalBenefitPage />} />
                <Route path="/favorite-brand" element={<FavoriteBrandPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/manage-payment" element={<ManagePaymentPage />} />
                <Route path="/notifications" element={<NotificationPage />} />
                <Route path="/manage-card" element={<CardRegisterPage isManageMode={true} />} />
                <Route path="manage-simplepay" element={<PayRegisterPage isManageMode={true} />}/>
                <Route path="manage-telco" element={<TelcoRegisterPage isManageMode={true} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
