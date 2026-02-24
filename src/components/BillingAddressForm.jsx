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
    return <div className="text-center py-4 text-text-secondary">Loading address...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-lg font-semibold text-text">Billing Address</h3>

      <input
        name="street"
        value={address.street}
        onChange={handleChange}
        placeholder="Address Line 1 *"
        required
        className="w-full px-3 py-3 border border-border rounded-lg text-base bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />

      <input
        name="street2"
        value={address.street2}
        onChange={handleChange}
        placeholder="Address Line 2"
        className="w-full px-3 py-3 border border-border rounded-lg text-base bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          name="city"
          value={address.city}
          onChange={handleChange}
          placeholder="City *"
          required
          className="w-full px-3 py-3 border border-border rounded-lg text-base bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        <input
          name="pincode"
          value={address.pincode}
          onChange={handleChange}
          placeholder="Pincode *"
          required
          pattern="[1-9][0-9]{5}"
          inputMode="numeric"
          maxLength={6}
          className="w-full px-3 py-3 border border-border rounded-lg text-base bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      <select
        name="state"
        value={address.state}
        onChange={handleChange}
        required
        className="w-full px-3 py-3 border border-border rounded-lg text-base bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      >
        <option value="">Select State *</option>
        {STATE_NAMES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full py-3.5 bg-primary text-white text-base font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors cursor-pointer border-0"
      >
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </form>
  );
}
