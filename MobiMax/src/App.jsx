import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import PartnerLayout from './components/partner/PartnerLayout';


import HomePage from './pages/Home/HomePage';
import UserLogin from './pages/Auth/UserLogin';
import UserSignup from './pages/Auth/UserSignup';
import PartnerLogin from './pages/Auth/PartnerLogin';
import PartnerSignup from './pages/Auth/PartnerSignup';


import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminPartners from './pages/Admin/AdminPartners';

import PartnerDashboard from './pages/Partner/PartnerDashboard';
import PartnerOrders from './pages/Partner/PartnerOrders';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/partner/login" element={<PartnerLogin />} />
          <Route path="/partner/signup" element={<PartnerSignup />} />
        </Route>
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="partners" element={<AdminPartners />} />
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
    </Router>
  );
}