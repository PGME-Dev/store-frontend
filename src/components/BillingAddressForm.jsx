import { useState, useEffect, useRef, useCallback } from 'react';
import { getUserProfile } from '../api/auth';
import client from '../api/client';

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

// Find the matching state name from our STATE_MAP for an API-returned state string
function matchStateName(apiState) {
  if (!apiState) return null;
  const lower = apiState.toLowerCase().trim();
  return STATE_NAMES.find((s) => s.toLowerCase() === lower) || null;
}

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
  const [lookingUpPincode, setLookingUpPincode] = useState(false);
  const [pincodeAutoFilled, setPincodeAutoFilled] = useState(false);
  const pincodeAbortRef = useRef(null);
  // Track whether the saved address pincode has already been loaded (skip auto-lookup for it)
  const savedPincodeRef = useRef('');

  useEffect(() => {
    (async () => {
      try {
        const profile = await getUserProfile();
        if (profile?.billing_address) {
          const saved = profile.billing_address;
          savedPincodeRef.current = saved.pincode || '';
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

  const lookupPincode = useCallback(async (pincode) => {
    // Cancel any in-flight lookup
    if (pincodeAbortRef.current) pincodeAbortRef.current.abort();
    const controller = new AbortController();
    pincodeAbortRef.current = controller;

    setLookingUpPincode(true);
    setPincodeAutoFilled(false);
    try {
      const { data } = await client.get(`/pincode/${pincode}`, {
        signal: controller.signal,
      });
      if (data?.success && data.data) {
        const { city, state: apiState } = data.data;
        const matchedState = matchStateName(apiState);
        setAddress((prev) => ({
          ...prev,
          city: prev.city || city || '',
          state: matchedState || prev.state,
          state_code: matchedState ? STATE_MAP[matchedState] : prev.state_code,
        }));
        setPincodeAutoFilled(true);
      }
    } catch (err) {
      if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
        // Silently fail — user can still manually select
      }
    } finally {
      setLookingUpPincode(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setAddress((prev) => ({ ...prev, state: value, state_code: STATE_MAP[value] || '' }));
      setPincodeAutoFilled(false);
    } else if (name === 'pincode') {
      const cleaned = value.replace(/\D/g, '').slice(0, 6);
      setAddress((prev) => ({ ...prev, pincode: cleaned }));
      setPincodeAutoFilled(false);
      // Auto-lookup when 6 digits entered and different from saved pincode
      if (cleaned.length === 6 && /^[1-9]\d{5}$/.test(cleaned) && cleaned !== savedPincodeRef.current) {
        lookupPincode(cleaned);
      }
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

  const inputClass = "w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-border rounded-lg text-sm sm:text-base bg-surface text-text placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <h3 className="text-base sm:text-lg font-bold text-text mb-1 sm:mb-2">Billing Address</h3>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-text mb-1.5 sm:mb-2">Address Line 1 *</label>
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
          <label className="block text-xs sm:text-sm font-semibold text-text mb-1.5 sm:mb-2">Address Line 2</label>
          <input
            name="street2"
            value={address.street2}
            onChange={handleChange}
            placeholder="Apartment, suite, etc. (optional)"
            className={inputClass}
          />
        </div>

        {/* Pincode first — auto-fills city & state below */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-text mb-1.5 sm:mb-2">Pincode *</label>
          <div className="relative">
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
            {lookingUpPincode && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          {pincodeAutoFilled && (
            <p className="text-[10px] sm:text-xs text-success mt-1.5 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              City & state auto-filled from pincode
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-text mb-1.5 sm:mb-2">City *</label>
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
            <label className="block text-xs sm:text-sm font-semibold text-text mb-1.5 sm:mb-2">State *</label>
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
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="btn-primary w-full !py-3.5 sm:!py-4 disabled:opacity-50 disabled:cursor-not-allowed mt-3 sm:mt-4 text-sm sm:text-base font-semibold"
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
