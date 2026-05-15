import { Routes, Route } from 'react-router-dom';
import Dashboard from '../merchant/pages/Dashboard';
import Menu from '../merchant/pages/Menu';
import Orders from '../merchant/pages/Orders';
import Profile from '../merchant/pages/Profile';

const MerchantRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
);

export default MerchantRoutes;
