import { useEffect, useState, useRef } from 'react';
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
  const bodyRef = useRef(null);

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
    const blockAllScroll = (e) => e.preventDefault();
    document.addEventListener('keydown', handleKey);
    document.addEventListener('wheel', blockAllScroll, { passive: false });
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('wheel', blockAllScroll);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleModalWheel = (e) => {
    e.stopPropagation();
    if (bodyRef.current) {
      bodyRef.current.scrollTop += e.deltaY;
    }
  };

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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-modal-backdrop"
        onClick={onClose}
      />

      {/* Centered container */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full flex items-center justify-center">
          {/* Modal card */}
          <div
            className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-clip animate-modal-content flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleModalWheel}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-colors cursor-pointer border-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="relative gradient-hero px-5 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-5 sm:pb-6 shrink-0">
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
            <div ref={bodyRef} className="relative px-5 sm:px-6 md:px-8 py-5 sm:py-6 space-y-5 overflow-y-auto flex-1 min-h-0 overscroll-contain">
              {loading && !pkg ? (
                <div className="space-y-5">
                  {/* Info card skeleton */}
                  <div className="flex items-start gap-3 rounded-2xl p-3.5 sm:p-4 bg-surface-dim border border-border">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 skeleton rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-36 rounded-lg" />
                      <div className="skeleton h-3 w-44 rounded-lg" />
                    </div>
                  </div>
                  {/* Description skeleton */}
                  <div>
                    <div className="skeleton h-3.5 w-14 mb-2 rounded-lg" />
                    <div className="space-y-1.5">
                      <div className="skeleton h-3 w-full rounded-lg" />
                      <div className="skeleton h-3 w-full rounded-lg" />
                      <div className="skeleton h-3 w-3/4 rounded-lg" />
                    </div>
                  </div>
                  {/* Features skeleton */}
                  <div>
                    <div className="skeleton h-3.5 w-28 mb-2.5 rounded-lg" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><div className="skeleton w-5 h-5 rounded-full shrink-0" /><div className="skeleton h-3 w-3/4 rounded-lg" /></div>
                      <div className="flex items-center gap-2"><div className="skeleton w-5 h-5 rounded-full shrink-0" /><div className="skeleton h-3 w-1/2 rounded-lg" /></div>
                      <div className="flex items-center gap-2"><div className="skeleton w-5 h-5 rounded-full shrink-0" /><div className="skeleton h-3 w-2/3 rounded-lg" /></div>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-4 text-error text-sm">{error}</div>
              ) : (
                <>
                  {/* Thumbnail */}
                  {p.thumbnail_url && (
                    <div className="rounded-xl overflow-hidden">
                      <img
                        src={p.thumbnail_url}
                        alt={p.name}
                        className="w-full h-auto max-h-56 object-cover"
                      />
                    </div>
                  )}

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
                                ? 'border-primary bg-primary text-white shadow-sm'
                                : 'border-border bg-white hover:border-primary/30'
                            }`}
                          >
                            <div className={`text-xs sm:text-sm font-semibold ${selectedTier === idx ? 'text-white' : 'text-text'}`}>{tier.name}</div>
                            <div className={`text-[10px] sm:text-xs mt-0.5 ${selectedTier === idx ? 'text-white/70' : 'text-text-secondary'}`}>{tier.duration_days} days</div>
                            {/* Price commented out
                            <div className={`text-xs sm:text-sm font-bold mt-1 ${selectedTier === idx ? 'text-white' : 'text-primary'}`}>
                              {formatPrice(tier.effective_price || tier.price)}
                            </div>
                            */}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Package Info */}
                  {(durationDays || p.series_count) && (
                    <div className="flex items-start gap-3 bg-surface-dim border border-border rounded-xl p-3.5 sm:p-4">
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
                            <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer CTA - price & purchase commented out */}
            {/*
            <div className="relative border-t border-border px-5 sm:px-6 md:px-8 py-5 sm:py-6 bg-white shrink-0">
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
                    className="btn-primary py-2.5! sm:py-3! min-w-35 sm:min-w-40"
                  >
                    Buy Now
                  </button>
                </div>
              )}
            </div>
            */}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
