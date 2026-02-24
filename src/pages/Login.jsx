import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
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
    <div className="flex flex-col items-center pt-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-text text-center mb-2">Welcome to PGME</h1>
        <p className="text-text-secondary text-center mb-8">
          Login with your phone number to purchase courses and ebooks
        </p>

        {error && (
          <div className="bg-error/10 text-error text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Phone Number</label>
              <div className="flex items-center border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary bg-surface">
                <span className="px-3 text-text-secondary text-base">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter phone number"
                  className="flex-1 py-3.5 pr-3 text-base bg-transparent text-text focus:outline-none border-0"
                  autoFocus
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="w-full py-3.5 bg-primary text-white text-base font-semibold rounded-xl disabled:opacity-50 hover:bg-primary-dark transition-colors cursor-pointer border-0"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
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
              <label className="block text-sm font-medium text-text mb-1.5">Enter OTP</label>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="4-digit OTP"
                maxLength={4}
                className="w-full px-4 py-3.5 border border-border rounded-xl text-base text-center text-text tracking-widest bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 4}
              className="w-full py-3.5 bg-primary text-white text-base font-semibold rounded-xl disabled:opacity-50 hover:bg-primary-dark transition-colors cursor-pointer border-0"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
