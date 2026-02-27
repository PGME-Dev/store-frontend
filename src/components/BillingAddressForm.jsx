import { useState, useEffect } from 'react';
import { getUserProfile } from '../api/auth';

const STATE_MAP = {
  'Andaman and Nicobar Islands': 'AN',
  'Andhra Pradesh': 'AP',
  'Arunachal Pradesh': 'AR',
  'Assam': 'AS',
  'Bihar': 'BR',
  'Chandigarh': 'CH',
  'Chhattisgarh': 'CG',
  'Dadra and Nagar Haveli and Daman and Diu': 'DD',
  'Delhi': 'DL',
  'Goa': 'GA',
  'Gujarat': 'GJ',
  'Haryana': 'HR',
  'Himachal Pradesh': 'HP',
  'Jammu and Kashmir': 'JK',
  'Jharkhand': 'JH',
  'Karnataka': 'KA',
  'Kerala': 'KL',
  'Ladakh': 'LA',
  'Lakshadweep': 'LD',
  'Madhya Pradesh': 'MP',
  'Maharashtra': 'MH',
  'Manipur': 'MN',
  'Meghalaya': 'ML',
  'Mizoram': 'MZ',
  'Nagaland': 'NL',
  'Odisha': 'OD',
  'Puducherry': 'PY',
  'Punjab': 'PB',
  'Rajasthan': 'RJ',
  'Sikkim': 'SK',
  'Tamil Nadu': 'TN',
  'Telangana': 'TG',
  'Tripura': 'TR',
  'Uttar Pradesh': 'UP',
  'Uttarakhand': 'UK',
  'West Bengal': 'WB',
};

const STATE_NAMES = Object.keys(STATE_MAP).sort();

export default function BillingAddressForm({ onSubmit, loading }) {
  const [address, setAddress] = useState({
    street: '',
    street2: '',
    city: '',
    state: '',
    state_code: '',
    pincode: '',
    country: 'India',
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const profile = await getUserProfile();
        if (profile?.billing_address) {
          const saved = profile.billing_address;
          setAddress((prev) => ({
            ...prev,
            street: saved.street || '',
            street2: saved.street2 || '',
            city: saved.city || '',
            state: saved.state || '',
            state_code: saved.state_code || (saved.state ? STATE_MAP[saved.state] || '' : ''),
            pincode: saved.pincode || '',
            country: saved.country || 'India',
          }));
        }
      } catch {
        // Profile load failed, use empty form
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setAddress((prev) => ({ ...prev, state: value, state_code: STATE_MAP[value] || '' }));
    } else {
      setAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(address);
  };

  const isValid = address.street && address.city && address.state && address.state_code && address.pincode;

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center py-8 gap-3">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-text-secondary">Loading address...</span>
      </div>
    );
  }

  const inputClass = "w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-border rounded-xl text-sm sm:text-base bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-text mb-0.5 sm:mb-1">Billing Address</h3>

      <div className="space-y-2.5 sm:space-y-3">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-text mb-1 sm:mb-1.5">Address Line 1 *</label>
          <input
            name="street"
            value={address.street}
            onChange={handleChange}
            placeholder="Street address"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-text mb-1 sm:mb-1.5">Address Line 2</label>
          <input
            name="street2"
            value={address.street2}
            onChange={handleChange}
            placeholder="Apartment, suite, etc. (optional)"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text mb-1 sm:mb-1.5">City *</label>
            <input
              name="city"
              value={address.city}
              onChange={handleChange}
              placeholder="City"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text mb-1 sm:mb-1.5">Pincode *</label>
            <input
              name="pincode"
              value={address.pincode}
              onChange={handleChange}
              placeholder="6-digit pincode"
              required
              pattern="[1-9][0-9]{5}"
              inputMode="numeric"
              maxLength={6}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-text mb-1 sm:mb-1.5">State *</label>
          <select
            name="state"
            value={address.state}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">Select State</option>
            {STATE_NAMES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full py-3 sm:py-3.5 bg-primary text-white text-sm sm:text-base font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors cursor-pointer border-0 mt-1.5 sm:mt-2"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          'Proceed to Payment'
        )}
      </button>
    </form>
  );
}
