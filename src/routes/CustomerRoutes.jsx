import { Routes, Route } from 'react-router-dom';
import Home from '../customer/pages/Home';
import Restaurant from '../customer/pages/Restaurant';
import Cart from '../customer/pages/Cart';
import Payment from '../customer/pages/Payment';
import PaymentStatus from '../customer/pages/PaymentStatus';
import Checkout from '../customer/pages/Checkout';

const CustomerRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/restaurant/:id" element={<Restaurant />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/payment" element={<Payment />} />
    <Route path="/payment/status/:paymentId" element={<PaymentStatus />} />
    <Route path="/checkout" element={<Checkout />} />
  </Routes>
);

export default CustomerRoutes;
