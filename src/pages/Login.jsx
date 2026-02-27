import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { sendOTP, loginWithOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendOTP(phone);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError('Enter a valid 4-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await loginWithOTP(phone, otp);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center pt-4 sm:pt-8 lg:pt-16 animate-fade-in-up">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl border border-border p-5 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4">
              <img src="/logo.png" alt="PGME" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-text mb-1">Welcome to PGME</h1>
            <p className="text-text-secondary text-xs sm:text-sm">
              Login with your phone number to purchase courses and ebooks
            </p>
          </div>

          {error && (
            <div className="bg-error/8 text-error text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5 sm:mb-2">Phone Number</label>
                <div className="flex items-center border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary bg-surface transition-all">
                  <span className="px-3 sm:px-4 text-text-secondary text-sm sm:text-base border-r border-border">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter phone number"
                    className="flex-1 py-3 sm:py-3.5 px-3 sm:px-4 text-base bg-transparent text-text focus:outline-none border-0"
                    autoFocus
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full py-3 sm:py-3.5 bg-primary text-white text-sm sm:text-base font-semibold rounded-xl disabled:opacity-50 hover:bg-primary-dark transition-colors cursor-pointer border-0"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4 sm:space-y-5">
              <p className="text-sm text-text-secondary">
                OTP sent to +91 {phone}{' '}
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                  className="text-primary font-medium bg-transparent border-0 cursor-pointer underline p-0"
                >
                  Change
                </button>
              </p>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5 sm:mb-2">Enter OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="4-digit OTP"
                  maxLength={4}
                  className="w-full px-4 py-3 sm:py-3.5 border border-border rounded-xl text-base text-center text-text tracking-widest bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 4}
                className="w-full py-3 sm:py-3.5 bg-primary text-white text-sm sm:text-base font-semibold rounded-xl disabled:opacity-50 hover:bg-primary-dark transition-colors cursor-pointer border-0"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
