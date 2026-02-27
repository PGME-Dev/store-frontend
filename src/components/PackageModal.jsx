import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { getPackageById } from '../api/packages';
import { useAuth } from '../context/AuthContext';
import { usePurchase } from '../context/PurchaseContext';
import { formatPrice } from './PriceDisplay';

export default function PackageModal({ package: listPkg, onClose }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isPackagePurchased } = usePurchase();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTier, setSelectedTier] = useState(0);

  const packageId = listPkg?.package_id || listPkg?._id;

  useEffect(() => {
    if (!packageId) return;
    setLoading(true);
    (async () => {
      try {
        const result = await getPackageById(packageId);
        setPkg(result.package || result);
      } catch {
        setError('Failed to load package details');
      } finally {
        setLoading(false);
      }
    })();
  }, [packageId]);

  // Lock body scroll & close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const purchased = listPkg?.is_purchased || isPackagePurchased(packageId);

  // Use list data as fallback while detail loads
  const p = pkg || listPkg;
  const hasTiers = p?.has_tiers && p?.tiers?.length > 0;
  const currentTier = hasTiers ? p.tiers[selectedTier] : null;
  const price = currentTier ? (currentTier.effective_price || currentTier.price) : (p?.sale_price || p?.price);
  const originalPrice = currentTier ? currentTier.original_price : p?.original_price;
  const isOnSale = currentTier ? (currentTier.original_price > (currentTier.effective_price || currentTier.price)) : p?.is_on_sale;
  const durationDays = currentTier ? currentTier.duration_days : p?.duration_days;
  const pkgType = p?.type || p?.package_type;

  const handleBuy = () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/login', { state: { from: { pathname: `/packages/${packageId}` } } });
      return;
    }
    onClose();
    navigate(`/checkout/packages/${packageId}`, { state: { tierIndex: selectedTier } });
  };

  const modal = (
    <div className="fixed inset-0 z-999">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 animate-modal-backdrop"
        onClick={onClose}
      />

      {/* Scrollable container */}
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6 py-8 sm:py-12">
          {/* Modal card */}
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background illustration (Microscope) */}
            <svg
              width="240" height="320" viewBox="0 0 240 320"
              fill="none"
              className="absolute -right-4 bottom-12 pointer-events-none text-primary opacity-[0.025]"
            >
              <path d="M96 30l32 120" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M80 24l24 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="128" cy="150" r="40" stroke="currentColor" strokeWidth="2"/>
              <circle cx="128" cy="150" r="12" fill="currentColor"/>
              <path d="M168 150h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="80" y1="210" x2="176" y2="210" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="128" y1="190" x2="128" y2="210" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M108 190h40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer border-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Header */}
            <div className="relative bg-linear-to-br from-primary to-primary-light px-5 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-5 sm:pb-6">
              <div className="flex items-center gap-2 mb-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <span className="text-[11px] sm:text-xs font-medium text-white/60">Course Package</span>
                {pkgType && (
                  <>
                    <span className="text-white/30">·</span>
                    <span className="text-[11px] sm:text-xs font-medium text-white/60">{pkgType}</span>
                  </>
                )}
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug pr-10">{p?.name}</h2>
              {durationDays && (
                <p className="text-white/70 text-xs sm:text-sm mt-1">{durationDays} days access</p>
              )}
            </div>

            {/* Body */}
            <div className="relative px-5 sm:px-6 md:px-8 py-5 sm:py-6 space-y-4 sm:space-y-5">
              {loading && !pkg ? (
                <div className="space-y-4 sm:space-y-5">
                  {/* Info card skeleton */}
                  <div className="flex items-start gap-3 rounded-xl p-3.5 sm:p-4 bg-surface-dim">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 skeleton rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-36" />
                      <div className="skeleton h-3 w-44" />
                    </div>
                  </div>
                  {/* Description skeleton */}
                  <div>
                    <div className="skeleton h-3.5 w-14 mb-2" />
                    <div className="space-y-1.5">
                      <div className="skeleton h-3 w-full" />
                      <div className="skeleton h-3 w-full" />
                      <div className="skeleton h-3 w-3/4" />
                    </div>
                  </div>
                  {/* Features skeleton */}
                  <div>
                    <div className="skeleton h-3.5 w-28 mb-2.5" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><div className="skeleton w-3.5 h-3.5 rounded-full shrink-0" /><div className="skeleton h-3 w-3/4" /></div>
                      <div className="flex items-center gap-2"><div className="skeleton w-3.5 h-3.5 rounded-full shrink-0" /><div className="skeleton h-3 w-1/2" /></div>
                      <div className="flex items-center gap-2"><div className="skeleton w-3.5 h-3.5 rounded-full shrink-0" /><div className="skeleton h-3 w-2/3" /></div>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-4 text-error text-sm">{error}</div>
              ) : (
                <>
                  {/* Tier Selector */}
                  {hasTiers && p.tiers.length > 1 && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-text mb-2">Select Duration</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                        {p.tiers.map((tier, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedTier(idx)}
                            className={`p-2.5 sm:p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                              selectedTier === idx
                                ? 'border-primary bg-primary/4 shadow-sm'
                                : 'border-border bg-white hover:border-primary/30'
                            }`}
                          >
                            <div className="text-xs sm:text-sm font-semibold text-text">{tier.name}</div>
                            <div className="text-[10px] sm:text-xs text-text-secondary mt-0.5">{tier.duration_days} days</div>
                            <div className="text-xs sm:text-sm font-bold text-primary mt-1">
                              {formatPrice(tier.effective_price || tier.price)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Package Info */}
                  {(durationDays || p.series_count) && (
                    <div className="flex items-start gap-3 bg-primary/3 border border-primary/10 rounded-xl p-3.5 sm:p-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/8 rounded-lg flex items-center justify-center shrink-0">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                      </div>
                      <div>
                        {durationDays && (
                          <div className="text-sm font-semibold text-text">{durationDays} days access</div>
                        )}
                        {p.series_count > 0 && (
                          <div className="text-xs text-text-secondary mt-0.5">{p.series_count} video series included</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {p.description && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-text mb-1.5">About</h4>
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{p.description}</p>
                    </div>
                  )}

                  {/* Features */}
                  {p.features?.length > 0 && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-text mb-2">What's Included</h4>
                      <ul className="space-y-1.5">
                        {p.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-text-secondary">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-success mt-0.5 shrink-0">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer CTA */}
            <div className="relative border-t border-border px-5 sm:px-6 md:px-8 py-4 sm:py-5 bg-white">
              {purchased ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-success/8 rounded-lg flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-success">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-success">Purchased</div>
                    <p className="text-xs text-text-secondary">Open the PGME app to access this package</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-text">{formatPrice(price)}</div>
                    {isOnSale && originalPrice > price && (
                      <div className="text-xs text-text-secondary line-through">{formatPrice(originalPrice)}</div>
                    )}
                  </div>
                  <button
                    onClick={handleBuy}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors cursor-pointer border-0 text-sm sm:text-base"
                  >
                    Buy Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
