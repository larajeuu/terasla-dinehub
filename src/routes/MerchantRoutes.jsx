import { Routes, Route } from 'react-router-dom';
import Login from '../merchant/pages/Login';
import LoginForm from '../merchant/pages/Login/components/LoginForm';
import ForgotPassword from '../merchant/pages/ForgotPassword';
import ResetPassword from '../merchant/pages/ResetPassword';
import Dashboard from '../merchant/pages/Dashboard';
import Inbox from '../merchant/pages/Inbox';
import Kontrol from '../merchant/pages/Kontrol';
import PencairanDana from '../merchant/pages/Kontrol/Pencairan';
import RiwayatKeuangan from '../merchant/pages/Kontrol/Riwayat';
import Menu from '../merchant/pages/Menu';
import Profile from '../merchant/pages/Profile';
import Register from '../merchant/pages/Register';
import Settings from '../merchant/pages/Settings';
import ProtectedRoute from '../merchant/components/ProtectedRoute';

const MerchantRoutes = () => (
  <Routes>
    {/* Publik */}
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/register" element={<Register />} />

    {/* Butuh login merchant */}
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
    <Route path="/kontrol" element={<ProtectedRoute><Kontrol /></ProtectedRoute>} />
    <Route path="/kontrol/pencairan" element={<ProtectedRoute><PencairanDana /></ProtectedRoute>} />
    <Route path="/kontrol/riwayat" element={<ProtectedRoute><RiwayatKeuangan /></ProtectedRoute>} />
    <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
  </Routes>
);

export default MerchantRoutes;
