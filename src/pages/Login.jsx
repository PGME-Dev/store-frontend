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
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Minimal top bar */}
      <div className="px-6 sm:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
            <img src="/logo.png" alt="PGME" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-base sm:text-lg font-bold text-gray-900 font-display tracking-tight">PGME</span>
        </Link>
        <Link
          to="/"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors"
        >
          Back to Home
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-16">
        <div className="w-full max-w-[1100px] 2xl:max-w-[1300px] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 2xl:gap-20 items-center">

          {/* Left — Big typography */}
          <div className="hidden lg:block">
            <h1 className="font-display font-extrabold text-gray-900 leading-[0.95] tracking-tighter">
              <span className="block text-[clamp(2.5rem,5vw,4.5rem)] uppercase">Welcome</span>
              <span className="block text-[clamp(2.5rem,5vw,4.5rem)] uppercase mt-1">Back to</span>
              <span className="block text-[clamp(2.5rem,5vw,4.5rem)] uppercase text-[#0000C8] mt-1">Learning</span>
            </h1>
            <div className="w-12 h-0.5 bg-gray-900/20 mt-6 mb-5" />
            <p className="text-base text-gray-500 leading-relaxed max-w-sm">
              Sign in to access your courses, eBooks, and live sessions. Your journey to PG medical excellence continues here.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-200">
              <div>
                <div className="text-2xl font-extrabold text-gray-900 font-display">500+</div>
                <div className="text-xs text-gray-400 mt-0.5">Students</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <div className="text-2xl font-extrabold text-gray-900 font-display">98%</div>
                <div className="text-xs text-gray-400 mt-0.5">Pass Rate</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <div className="text-2xl font-extrabold text-gray-900 font-display">50+</div>
                <div className="text-xs text-gray-400 mt-0.5">Courses</div>
              </div>
            </div>
          </div>

          {/* Right — Login card */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Card header */}
              <div className="bg-[#0000C8] px-7 sm:px-9 pt-8 sm:pt-10 pb-7 sm:pb-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-15">
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-5 shadow-sm">
                    <img src="/logo.png" alt="PGME" className="w-7 h-7 object-contain" />
                  </div>
                  {/* Mobile heading */}
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">Sign In</h1>
                  <p className="text-sm text-white/60 mt-1.5">Enter your phone number to continue</p>
                </div>
              </div>

              {/* Form */}
              <div className="px-7 sm:px-9 py-7 sm:py-9">
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2.5 border border-red-100">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2.5">Phone Number</label>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0000C8] focus-within:ring-2 focus-within:ring-[#0000C8]/10 bg-white transition-all">
                      <span className="px-4 text-gray-400 text-sm font-medium border-r border-gray-200 bg-gray-50 py-3.5 select-none">+91</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter your phone number"
                        className="flex-1 py-3.5 px-4 text-base bg-transparent text-gray-900 focus:outline-none border-0 placeholder:text-gray-300"
                        autoFocus
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || phone.length !== 10}
                    className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-[#0000C8] rounded-xl border-0 cursor-pointer transition-all duration-300 hover:bg-[#0000a0] hover:shadow-[0_4px_20px_rgba(0,0,200,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:bg-[#0000C8]"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Continue with OTP
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[#0000C8] font-semibold no-underline hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom note */}
            <p className="text-center text-xs text-gray-400 mt-5">
              By continuing, you agree to our{' '}
              <Link to="/terms-and-conditions" className="text-gray-500 underline hover:text-gray-700">Terms</Link>
              {' '}&{' '}
              <Link to="/privacy-policy" className="text-gray-500 underline hover:text-gray-700">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
