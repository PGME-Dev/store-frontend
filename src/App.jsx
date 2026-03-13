import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SmoothScroll from './components/SmoothScroll';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PackageList from './pages/PackageList';
import PackageDetail from './pages/PackageDetail';
import EbookList from './pages/EbookList';
import EbookDetail from './pages/EbookDetail';
import SessionList from './pages/SessionList';
import SessionDetail from './pages/SessionDetail';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import MyPurchases from './pages/MyPurchases';
import Invoices from './pages/Invoices';
import About from './pages/About';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import TermsAndConditions from './pages/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
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
    <SmoothScroll>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
        <Route path="packages" element={<PackageList />} />
        <Route path="packages/:id" element={<PackageDetail />} />
        <Route path="ebooks" element={<EbookList />} />
        <Route path="ebooks/:id" element={<EbookDetail />} />
        <Route path="sessions" element={<SessionList />} />
        <Route path="sessions/:id" element={<SessionDetail />} />
        <Route path="checkout/:type/:id" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="careers" element={<Careers />} />
        <Route path="terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="refund-policy" element={<RefundPolicy />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="my-purchases" element={<ProtectedRoute><MyPurchases /></ProtectedRoute>} />
        <Route path="invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
        </Route>
      </Routes>
    </SmoothScroll>
  );
}
