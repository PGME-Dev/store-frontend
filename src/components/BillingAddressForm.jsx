import { useState, useEffect } from 'react';
import { getUserProfile } from '../api/auth';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

export default function BillingAddressForm({ onSubmit, loading }) {
  const [address, setAddress] = useState({
    street: '',
    street2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const profile = await getUserProfile();
        if (profile?.billing_address) {
          setAddress((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(profile.billing_address).filter(([_, v]) => v)
            ),
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
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(address);
  };

  const isValid = address.street && address.city && address.state && address.pincode;

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
          pattern="[0-9]{6}"
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
        {INDIAN_STATES.map((s) => (
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
