import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import OnboardingPage from '../pages/Onboarding/OnboardingPage';
import CardRegisterPage from '../pages/CardRegister/CardRegisterPage';

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<OnboardingPage />} />
                <Route path="/card-register" element={<CardRegisterPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
