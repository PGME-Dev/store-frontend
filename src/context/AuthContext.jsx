import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyWebToken, verifyWidget } from '../api/auth';
import { sendOTP as msg91SendOTP, verifyOTP as msg91VerifyOTP } from '../utils/msg91';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!user && !!localStorage.getItem('access_token');

  // Handle magic link token from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      handleWebToken(token);
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleWebToken = async (token) => {
    try {
      const result = await verifyWebToken(token);

      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('refresh_token', result.refresh_token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setUser(result.user);

      // Strip token from URL and navigate to the current path
      const params = new URLSearchParams(location.search);
      params.delete('token');
      const cleanPath = location.pathname + (params.toString() ? `?${params.toString()}` : '');
      navigate(cleanPath, { replace: true });
    } catch (err) {
      console.error('Web token verification failed:', err);
      navigate('/login', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  // Send OTP via MSG91 widget
  const sendOTP = useCallback((phoneNumber) => {
    msg91SendOTP(phoneNumber);
  }, []);

  // Verify OTP via MSG91 widget, then exchange access token with backend
  const loginWithOTP = useCallback(async (otp) => {
    // MSG91 widget verifies the OTP and returns an access token
    const msg91AccessToken = await msg91VerifyOTP(otp);

    // Exchange MSG91 access token for our JWT tokens (no device info sent)
    const result = await verifyWidget(msg91AccessToken);

    // If this is a new user, don't log them in — they need to sign up via the app
    if (result.user.is_new_user) {
      return { isNewUser: true };
    }

    localStorage.setItem('access_token', result.access_token);
    localStorage.setItem('refresh_token', result.refresh_token);
    localStorage.setItem('user', JSON.stringify(result.user));
    setUser(result.user);

    return { isNewUser: false };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const value = {
    user,
    isAuthenticated,
    loading,
    sendOTP,
    loginWithOTP,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
