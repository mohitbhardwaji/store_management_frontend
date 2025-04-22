import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Products from './pages/Products';
import Billing from './pages/Billing';
import Layout from './components/Layout';
import CartPage from './pages/CartPage';
import { useSelector } from 'react-redux';
import { useAuth } from './context/AuthContext';
import InvoicePage from './pages/InvoicePage';
import Dashboard from './pages/Dashboard';
import AddStockPage from './pages/StockIn';
import OrderBillPage from './pages/OrderBill';

export default function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const { user } = useAuth();

  const authenticated = isLoggedIn || user;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/products" element={authenticated ? <Products /> : <Navigate to="/login" />} />
        <Route path="/billing" element={authenticated ? <Billing /> : <Navigate to="/login" />} />
        <Route path="/cart" element={authenticated ? <CartPage /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={authenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/invoice" element={authenticated ? <InvoicePage /> : <Navigate to="/login" />} />
        <Route path="/invoice/:id" element={authenticated ? <InvoicePage /> : <Navigate to="/login" />} />
        <Route path="/stock" element={authenticated ? <AddStockPage /> : <Navigate to="/login" />} />
        <Route path="/orderBill" element={authenticated ? <OrderBillPage /> : <Navigate to="/login" />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
