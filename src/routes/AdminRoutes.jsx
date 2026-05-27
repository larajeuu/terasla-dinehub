import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../admin/components/AdminLayout';
import Login from '../admin/pages/Login';
import Dashboard from '../admin/pages/Dashboard';
import Transactions from '../admin/pages/Transactions';
import TransactionDetail from '../admin/pages/TransactionDetail';
import Merchants from '../admin/pages/Merchants';
import Withdrawals from '../admin/pages/Withdrawals';
import Customers from '../admin/pages/Customers';
import CustomerDetail from '../admin/pages/CustomerDetail';
import Reports from '../admin/pages/Reports';
import System from '../admin/pages/System';
import Logs from '../admin/pages/Logs';

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route element={<AdminLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/transactions/:orderId" element={<TransactionDetail />} />
      <Route path="/merchants" element={<Merchants />} />
      <Route path="/withdrawals" element={<Withdrawals />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/customers/:customerId" element={<CustomerDetail />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/system" element={<System />} />
      <Route path="/logs" element={<Logs />} />
    </Route>
    <Route path="*" element={<Navigate to="/admin" replace />} />
  </Routes>
);

export default AdminRoutes;
