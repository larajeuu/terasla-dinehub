import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerRoutes from './routes/CustomerRoutes';
import MerchantRoutes from './routes/MerchantRoutes';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/merchant/*" element={<MerchantRoutes />} />
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
