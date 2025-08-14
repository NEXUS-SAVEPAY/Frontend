import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import OnboardingPage from '../pages/Onboarding/OnboardingPage.jsx';
import CardRegisterPage from '../pages/CardRegister/CardRegisterPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import PayRegisterPage from '../pages/Register/PayRegisterPage.jsx';
import TelcoRegisterPage from '../pages/Register/TelcoRegisterPage.jsx';
import BenefitDetailPage from '../pages/BenefitDetailPage.jsx';
import MyPage from '../pages/MyPage/MyPage.jsx';
import ManagePaymentPage from '../pages/MyPage/ManagePaymentPage.jsx';
import RecommendedBenefitPage from '../pages/RecommendedBenefitPage.jsx';
import FavoriteBenefitPage from '../pages/FavoriteBenefitPage.jsx';
import RegisteredBenefitPage from '../pages/RegisteredBenefitPage.jsx';
import CardBenefitPage from '../pages/CardBenefitPage.jsx';
import SimplePayBenefitPage from '../pages/SimplePayBenefitPage.jsx';
import TelcoBenefitPage from '../pages/TelcoBenefitPage.jsx';
import FirstPage from '../pages/Onboarding/FirstPage.jsx';
import BrandBenefitPage from '../pages/BrandBenefitPage.jsx';
import FavoriteBrandPage from '../pages/FavoriteBrandPage.jsx';

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
                <Route path="/favorite-brand" element={<FavoriteBrandPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/manage-payment" element={<ManagePaymentPage />} />
                <Route path="/manage-card" element={<CardRegisterPage isManageMode={true} />} />
                <Route path="manage-simplepay" element={<PayRegisterPage isManageMode={true} />}/>
                <Route path="manage-telco" element={<TelcoRegisterPage isManageMode={true} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
