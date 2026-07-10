import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import PartnerLayout from './components/partner/PartnerLayout';
import SessionManager from './components/auth/SessionManager';

import HomePage from './pages/Home/HomePage';
import Login from './pages/Auth/Login';
import UserSignup from './pages/Auth/UserSignup';
import PartnerSignup from './pages/Auth/PartnerSignup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import ContactUs from './pages/ContactUs/ContactUs';

import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminPartners from './pages/Admin/AdminPartners';
import AdminAdvertisements from './pages/Admin/AdminAdvertisements';

import PartnerDashboard from './pages/Partner/PartnerDashboard';
import PartnerOrders from './pages/Partner/PartnerOrders';

export default function App() {
  return (
    <Router>
      <SessionManager>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route path="/partner/login" element={<Login />} />
            <Route path="/partner/signup" element={<PartnerSignup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact" element={<ContactUs />} />
          </Route>
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="advertisements" element={<AdminAdvertisements />} />
        </Route>

        <Route path="/partner" element={<PartnerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PartnerDashboard />} />
          <Route path="orders" element={<PartnerOrders />} />
          {/* Placeholders for future pages */}
          <Route path="earnings" element={<PartnerDashboard />} />
          <Route path="settings" element={<PartnerDashboard />} />
        </Route>
      </Routes>
      </SessionManager>
    </Router>
  );
}