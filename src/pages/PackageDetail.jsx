import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById } from '../api/packages';
import { useAuth } from '../context/AuthContext';
import { usePurchase } from '../context/PurchaseContext';
import PriceDisplay from '../components/PriceDisplay';

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isPackagePurchased } = usePurchase();
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
  const purchased = pkg.is_purchased || isPackagePurchased(pkg.package_id || pkg._id);

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
        <div className="gradient-hero rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-white mb-6 sm:mb-8 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/3 -translate-x-1/3 translate-y-1/3" />
          <div className="relative">
            <span className="inline-flex items-center text-xs font-medium bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
              {pkg.type}
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-display mb-1">{pkg.name}</h1>
            {durationDays && (
              <p className="text-white/70 text-sm">{durationDays} days access</p>
            )}
          </div>
        </div>

        {/* Thumbnail Banner */}
        {pkg.thumbnail_url && (
          <div className="rounded-2xl overflow-hidden mb-6 sm:mb-8">
            <img
              src={pkg.thumbnail_url}
              alt={pkg.name}
              className="w-full h-auto max-h-80 object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tier selection */}
            {hasTiers && pkg.tiers.length > 1 && (
              <div className="bg-white rounded-2xl border border-border p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-text mb-3 sm:mb-4">Select Duration</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                      <div className="text-xs text-text-secondary mt-0.5">{tier.duration_days} days</div>
                      <div className="text-sm sm:text-base font-bold text-primary mt-2">
                        {'\u20B9'}{Number(tier.effective_price || tier.price).toLocaleString('en-IN')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {pkg.description && (
              <div className="bg-white rounded-2xl border border-border p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-text mb-3">Description</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{pkg.description}</p>
              </div>
            )}

            {/* Features */}
            {pkg.features?.length > 0 && (
              <div className="bg-white rounded-2xl border border-border p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-text mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary">
                      <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar - Desktop sticky CTA */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl border border-border p-6 shadow-sm">
              {purchased ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-success">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-success">Purchased</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">You already own this package. Open the PGME app to access it.</p>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-semibold text-text mb-4">Order Summary</h3>
                  <PriceDisplay price={price} originalPrice={originalPrice} isOnSale={isOnSale} size="lg" />
                  {durationDays && (
                    <p className="text-xs text-text-secondary mt-2">{durationDays} days access</p>
                  )}
                  <button
                    onClick={handleBuy}
                    className="btn-primary w-full mt-5 !py-3.5"
                  >
                    Buy Now
                  </button>
                  <p className="text-xs text-text-tertiary mt-3 text-center">Secure payment via Zoho</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom CTA */}
      {purchased ? (
        <div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-border p-3 sm:p-4 safe-area-inset-bottom lg:hidden z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-success">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-semibold text-success">Purchased -- Open the PGME app to access</span>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-border p-3 sm:p-4 safe-area-inset-bottom lg:hidden z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <PriceDisplay price={price} originalPrice={originalPrice} isOnSale={isOnSale} size="lg" />
            <button onClick={handleBuy} className="btn-primary !py-2.5 sm:!py-3 shrink-0">
              Buy Now
            </button>
          </div>
        </div>
      )}
      <div className="h-20 sm:h-24 lg:hidden" />
    </div>
  );
}
