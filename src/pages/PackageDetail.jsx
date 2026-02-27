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
    return <div className="text-center py-12 text-error text-sm">{error || 'Package not found'}</div>;
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
    <div className="animate-fade-in-up">
      <div className="max-w-5xl mx-auto">
        {/* Header card */}
        <div className="bg-linear-to-br from-primary to-primary-light rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 text-white mb-5 sm:mb-8">
          <span className="text-[10px] sm:text-xs font-medium bg-white/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
            {pkg.type}
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mt-2.5 sm:mt-3 mb-1">{pkg.name}</h1>
          {durationDays && (
            <p className="text-white/80 text-xs sm:text-sm">{durationDays} days access</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* Tier selection */}
            {hasTiers && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5 lg:p-6">
                <h3 className="text-sm font-semibold text-text mb-3 sm:mb-4">Select Duration</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {pkg.tiers.map((tier, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTier(idx)}
                      className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        selectedTier === idx
                          ? 'border-primary bg-primary/4 shadow-sm'
                          : 'border-border bg-white hover:border-primary/30'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold text-text">{tier.name}</div>
                      <div className="text-[11px] sm:text-xs text-text-secondary mt-0.5">{tier.duration_days} days</div>
                      <div className="text-sm sm:text-base font-bold text-primary mt-1.5 sm:mt-2">
                        {'\u20B9'}{Number(tier.effective_price || tier.price).toLocaleString('en-IN')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {pkg.description && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5 lg:p-6">
                <h3 className="text-sm font-semibold text-text mb-2.5 sm:mb-3">Description</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{pkg.description}</p>
              </div>
            )}

            {/* Features */}
            {pkg.features?.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5 lg:p-6">
                <h3 className="text-sm font-semibold text-text mb-3 sm:mb-4">What's Included</h3>
                <ul className="space-y-2.5 sm:space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-text-secondary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-success mt-0.5 shrink-0">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar - Desktop sticky CTA */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl border border-border p-6">
              <h3 className="text-sm font-semibold text-text mb-4">Order Summary</h3>
              <PriceDisplay price={price} originalPrice={originalPrice} isOnSale={isOnSale} size="lg" />
              {durationDays && (
                <p className="text-xs text-text-secondary mt-2">{durationDays} days access</p>
              )}
              <button
                onClick={handleBuy}
                className="w-full mt-5 px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors cursor-pointer border-0 text-base"
              >
                Buy Now
              </button>
              <p className="text-xs text-text-secondary mt-3 text-center">Secure payment via Zoho</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-3 sm:p-4 safe-area-inset-bottom lg:hidden z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <PriceDisplay price={price} originalPrice={originalPrice} isOnSale={isOnSale} size="lg" />
          <button
            onClick={handleBuy}
            className="px-5 sm:px-8 py-2.5 sm:py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors cursor-pointer border-0 text-sm sm:text-base shrink-0"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Spacer for mobile fixed bottom bar */}
      <div className="h-20 sm:h-24 lg:hidden" />
    </div>
  );
}
