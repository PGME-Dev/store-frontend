import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.pgme.app';
const APP_STORE_URL = 'https://apps.apple.com/in/app/pgme-medical-education/id6759380549';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNewUserModal, setShowNewUserModal] = useState(false);

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
        setShowNewUserModal(true);
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

      {/* New User Modal */}
      {showNewUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal header */}
            <div className="bg-[#0000C8] px-7 pt-8 pb-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-15">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
              </div>
              <div className="relative text-center">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0000C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
                <h2 className="text-xl font-extrabold text-white font-display tracking-tight">Account Not Found</h2>
                <p className="text-sm text-white/70 mt-1.5">This phone number is not registered yet</p>
              </div>
            </div>

            {/* Modal body */}
            <div className="px-7 py-6">
              <p className="text-sm text-gray-600 text-center leading-relaxed mb-6">
                To get started with PGME, please download our app and create your account. Once registered, you can use the web store to browse and purchase courses.
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-3.5 px-6 text-sm font-semibold text-white bg-[#0000C8] rounded-xl no-underline transition-all duration-300 hover:bg-[#0000a0] hover:shadow-[0_4px_20px_rgba(0,0,200,0.3)]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
                  Download for Android
                </a>
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-3.5 px-6 text-sm font-semibold text-gray-900 bg-gray-100 rounded-xl no-underline transition-all duration-300 hover:bg-gray-200"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Download for iOS
                </a>
              </div>

              <button
                onClick={() => setShowNewUserModal(false)}
                className="w-full mt-4 py-3 text-sm font-medium text-gray-500 bg-transparent border border-gray-200 rounded-xl cursor-pointer transition-all hover:bg-gray-50 hover:text-gray-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
