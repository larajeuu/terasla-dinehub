import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

// Pembungkus halaman merchant yang butuh login. Bila belum ada token atau
// role bukan merchant, arahkan ke landing/login merchant.
const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token || user?.role !== 'merchant') {
    return <Navigate to="/merchant" replace />;
  }

  return children;
};

export default ProtectedRoute;
