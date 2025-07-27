import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import OnboardingPage from '../pages/Onboarding/OnboardingPage';
import CardRegisterPage from '../pages/CardRegister/CardRegisterPage';
import CardRegisterStepOne from '../pages/CardRegister/CardRegisterStepOne';

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<OnboardingPage />} />
                <Route path="/card-register" element={<CardRegisterPage />} />
                <Route path="/card-register/step1" element={<CardRegisterStepOne />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
