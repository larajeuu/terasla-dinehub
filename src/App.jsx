import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerRoutes from './routes/CustomerRoutes';
import MerchantRoutes from './routes/MerchantRoutes';
import DesktopOverlay from './shared/components/DesktopOverlay';

const App = () => {
  return (
    <BrowserRouter>
      <DesktopOverlay />
      <Routes>
        <Route path="/merchant/*" element={<MerchantRoutes />} />
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
