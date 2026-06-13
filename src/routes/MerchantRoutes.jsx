import { Routes, Route } from 'react-router-dom';
import Login from '../merchant/pages/Login';
import LoginForm from '../merchant/pages/Login/components/LoginForm';
import Dashboard from '../merchant/pages/Dashboard';
import Inbox from '../merchant/pages/Inbox';
import Kontrol from '../merchant/pages/Kontrol';
import Menu from '../merchant/pages/Menu';
import Orders from '../merchant/pages/Orders';
import Profile from '../merchant/pages/Profile';
import Register from '../merchant/pages/Register';
import Settings from '../merchant/pages/Settings';

const MerchantRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/inbox" element={<Inbox />} />
    <Route path="/kontrol" element={<Kontrol />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/register" element={<Register />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
);

export default MerchantRoutes;