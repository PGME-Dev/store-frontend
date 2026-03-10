import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginWithOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await loginWithOTP(phone);
      if (result.isNewUser) {
        navigate('/signup', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in-up">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Gradient header */}
          <div className="gradient-hero px-8 sm:px-10 pt-10 sm:pt-12 pb-8 sm:pb-10 text-center relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" />

            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-5 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <img src="/logo.png" alt="PGME" className="w-10 h-10 object-contain" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">Welcome Back</h1>
              <p className="text-white/70 text-sm">Login to purchase courses and study materials</p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 sm:px-10 py-8 sm:py-10">
            {error && (
              <div className="bg-error/8 text-error text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-text mb-2.5">Phone Number</label>
                <div className="flex items-center border border-border rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 bg-surface transition-all">
                  <span className="px-4 text-text-secondary text-sm font-medium border-r border-border bg-surface-dim py-3.5">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter your phone number"
                    className="flex-1 py-3.5 px-4 text-base bg-transparent text-text focus:outline-none border-0"
                    autoFocus
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="btn-primary w-full !py-3.5 !text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  'Login with OTP'
                )}
              </button>
            </form>

            <div className="mt-7 pt-6 border-t border-border text-center">
              <p className="text-sm text-text-secondary">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-semibold no-underline hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
