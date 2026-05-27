import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import CustomerRoutes from './routes/CustomerRoutes';
import MerchantRoutes from './routes/MerchantRoutes';
import AdminRoutes from './routes/AdminRoutes';
import DesktopOverlay from './shared/components/DesktopOverlay';

const AppShell = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <DesktopOverlay />}
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/merchant/*" element={<MerchantRoutes />} />
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
};

export default App;
