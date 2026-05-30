import { Routes, Route } from 'react-router-dom';
import Login from '../merchant/pages/Login';
import LoginForm from '../merchant/pages/Login/components/LoginForm';
import Dashboard from '../merchant/pages/Dashboard';
import Kontrol from '../merchant/pages/Kontrol';
import Menu from '../merchant/pages/Menu';
import Orders from '../merchant/pages/Orders';
import Profile from '../merchant/pages/Profile';
import Register from '../merchant/pages/Register';

const MerchantRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/kontrol" element={<Kontrol />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/register" element={<Register />} />
  </Routes>
);

export default MerchantRoutes;