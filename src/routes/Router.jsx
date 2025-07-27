import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import OnboardingPage from '../pages/OnboardingPage';
import LoginPage from '../pages/LoginPage';
import CardRegisterPage from '../pages/Register/CardRegisterPage';
import PayRegisterPage from '../pages/Register/PayRegisterPage';
import TelcoRegisterPage from '../pages/Register/TelcoRegisterPage';
import BenefitDetailPage from '../Pages/BenefitDetailPage';
import ExternalBenefitPage from '../pages/ExternalBenefitPage';
import MyPage from '../pages/MyPage';
import NotificationPage from '../pages/NotificationPage';

const AppRouter = () => (
<Router>
    <Routes>
    {/*
    <Route path="/onboarding" element={<OnboardingPage />} />
    <Route path="/login" element={<LoginPage />} />
    */}
    <Route path="/register/card" element={<CardRegisterPage />} />
    <Route path="/register/simple-pay" element={<PayRegisterPage />} />
    <Route path="/register/telco" element={<TelcoRegisterPage />} />
    <Route path="/" element={<HomePage />} />
    <Route path="/benefit/:id" element={<BenefitDetailPage />} />
    <Route path="/external-benefits" element={<ExternalBenefitPage />} />
    <Route path="/mypage" element={<MyPage />} />
    <Route path="/notifications" element={<NotificationPage />} />
    </Routes>
</Router>
);

export default AppRouter;
