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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomerOrder from './pages/CustomerOrder';
import EditProduct from './pages/EditProduct';
import ViewBillPage from './pages/ViewBill';
import ViewInvoice from './pages/ViewBill';
import CreateProduct from './pages/CreateProduct';
import Employees from './pages/Employees';

export default function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const { user } = useAuth();

  const authenticated = isLoggedIn || user;

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/products" element={authenticated ? <Products /> : <Navigate to="/login" />} />
          <Route path="/edit_product/:id" element={authenticated ? <EditProduct /> : <Navigate to="/login" />} />
          <Route path="/billing" element={authenticated ? <Billing /> : <Navigate to="/login" />} />
          <Route path="/bill/view/:id" element={authenticated ? <ViewInvoice /> : <Navigate to="/login" />} />
          <Route path="/cart" element={authenticated ? <CartPage /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={authenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/invoice" element={authenticated ? <InvoicePage /> : <Navigate to="/login" />} />
          <Route path="/invoice/:id" element={authenticated ? <InvoicePage /> : <Navigate to="/login" />} />
          <Route path="/addNewStock" element={authenticated ? <AddStockPage /> : <Navigate to="/login" />} />
          <Route path="/orderBill" element={authenticated ? <OrderBillPage /> : <Navigate to="/login" />} />
          <Route path="/customerOrder/:billId" element={authenticated ? <CustomerOrder /> : <Navigate to="/login" />} />
          <Route path="/createproduct" element={authenticated ? <CreateProduct /> : <Navigate to="/login" />} />
          <Route path="/employees" element={authenticated ? <Employees /> : <Navigate to="/login" />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="top-right" theme="colored" autoClose={3000} hideProgressBar newestOnTop closeOnClick />
    </>
  );
  
}
