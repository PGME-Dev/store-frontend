import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyWebToken, verifyWidget } from '../api/auth';
import { openOTPWidget } from '../utils/msg91';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // If a magic link token is present, clear any previous session immediately
    // (before first render) so PurchaseContext never fires stale API calls
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      return null;
    }
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
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
      // Preserve the intended destination so Login can redirect back after manual login
      navigate('/login', { replace: true, state: { from: location } });
    } finally {
      setLoading(false);
    }
  };

  // Opens MSG91 OTP popup, verifies with backend, stores tokens
  const loginWithOTP = useCallback(async (phoneNumber) => {
    // Pre-fill phone with country code if provided
    const identifier = phoneNumber ? `91${phoneNumber}` : undefined;

    // MSG91 popup handles OTP send + verify, returns access token
    const msg91AccessToken = await openOTPWidget(identifier);

    // Exchange MSG91 access token for our JWT tokens (no device info sent)
    const result = await verifyWidget(msg91AccessToken);

    // If this is a new user, no account was created on the backend — they must register via the app
    if (result.registered === false || result.user?.is_new_user) {
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
