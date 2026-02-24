import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById } from '../api/packages';
import { useAuth } from '../context/AuthContext';
import PriceDisplay from '../components/PriceDisplay';

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [selectedTier, setSelectedTier] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const result = await getPackageById(id);
        setPkg(result.package || result);
      } catch {
        setError('Failed to load package');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !pkg) {
    return <div className="text-center py-12 text-error">{error || 'Package not found'}</div>;
  }

  const hasTiers = pkg.has_tiers && pkg.tiers?.length > 0;
  const currentTier = hasTiers ? pkg.tiers[selectedTier] : null;
  const price = currentTier ? (currentTier.effective_price || currentTier.price) : (pkg.sale_price || pkg.price);
  const originalPrice = currentTier ? currentTier.original_price : pkg.original_price;
  const isOnSale = currentTier ? (currentTier.original_price > (currentTier.effective_price || currentTier.price)) : pkg.is_on_sale;
  const durationDays = currentTier ? currentTier.duration_days : pkg.duration_days;

  const handleBuy = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/packages/${id}` } } });
      return;
    }
    navigate(`/checkout/packages/${id}`, { state: { tierIndex: selectedTier } });
  };

  return (
    <div>
      {/* Header card */}
      <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-5 text-white mb-4">
        <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
          {pkg.type}
        </span>
        <h1 className="text-xl font-bold mt-2 mb-1">{pkg.name}</h1>
        {durationDays && (
          <p className="text-white/80 text-sm">{durationDays} days access</p>
        )}
      </div>

      {/* Tier selection */}
      {hasTiers && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-text mb-2">Select Duration</h3>
          <div className="grid grid-cols-2 gap-2">
            {pkg.tiers.map((tier, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTier(idx)}
                className={`p-3 rounded-xl border-2 text-left transition-colors cursor-pointer ${
                  selectedTier === idx
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-surface hover:border-primary/30'
                }`}
              >
                <div className="text-sm font-semibold text-text">{tier.name}</div>
                <div className="text-xs text-text-secondary">{tier.duration_days} days</div>
                <div className="text-base font-bold text-primary mt-1">
                  ₹{Number(tier.effective_price || tier.price).toLocaleString('en-IN')}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {pkg.description && (
        <div className="bg-surface rounded-xl border border-border p-4 mb-4">
          <h3 className="text-sm font-semibold text-text mb-2">Description</h3>
          <p className="text-sm text-text-secondary">{pkg.description}</p>
        </div>
      )}

      {/* Features */}
      {pkg.features?.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-4 mb-4">
          <h3 className="text-sm font-semibold text-text mb-2">What's Included</h3>
          <ul className="space-y-2">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-success mt-0.5">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <PriceDisplay price={price} originalPrice={originalPrice} isOnSale={isOnSale} size="lg" />
          <button
            onClick={handleBuy}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors cursor-pointer border-0 text-base"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Spacer for fixed bottom bar */}
      <div className="h-24" />
    </div>
  );
}
