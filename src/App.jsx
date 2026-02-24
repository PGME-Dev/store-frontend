import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import PackageList from './pages/PackageList';
import PackageDetail from './pages/PackageDetail';
import EbookList from './pages/EbookList';
import EbookDetail from './pages/EbookDetail';
import SessionList from './pages/SessionList';
import SessionDetail from './pages/SessionDetail';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import MyPurchases from './pages/MyPurchases';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-dim">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="packages" element={<PackageList />} />
        <Route path="packages/:id" element={<PackageDetail />} />
        <Route path="ebooks" element={<EbookList />} />
        <Route path="ebooks/:id" element={<EbookDetail />} />
        <Route path="sessions" element={<SessionList />} />
        <Route path="sessions/:id" element={<SessionDetail />} />
        <Route path="checkout/:type/:id" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="my-purchases" element={<ProtectedRoute><MyPurchases /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
