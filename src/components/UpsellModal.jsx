import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from './PriceDisplay';

/**
 * Pre-checkout upsell step, mirroring the app's enrollment dialog
 * (package_access_screen._showPaymentPopup -> _buildEnrollmentDialog): the
 * buyer either continues with the product they're already looking at, or
 * breaks out to the full catalogue before committing to anything.
 *
 * The store previously sent "Buy Now" straight to /checkout, so the only
 * cross-sell was the "You might also like" rail further down the page —
 * which the buyer never sees once they've clicked the CTA. This puts the
 * same decision point in front of them that the app does.
 */
export default function UpsellModal({
  open,
  onClose,
  onContinue,
  productName,
  productType,
  description,
  features = [],
  price,
  originalPrice,
  isOnSale,
  durationDays,
  continueLabel = 'Continue Purchase',
  browseLabel = 'See All Packages',
  browseTo = '/packages',
  // Callers that sit inside another modal pass this to tear their own layer
  // down as well, so browsing doesn't leave a stale sheet over the catalogue.
  onBrowse,
}) {
  const navigate = useNavigate();

  // Escape to dismiss + background scroll lock, same as PackageModal.
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = original;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleBrowse = () => {
    if (onBrowse) {
      onBrowse();
      return;
    }
    onClose();
    navigate(browseTo);
  };

  // The app caps the dialog at three bullets so both buttons stay reachable
  // without scrolling; keep the same cap here.
  const shownFeatures = features.slice(0, 3);
  const discounted = isOnSale && originalPrice && originalPrice > price;

  // Portalled to document.body: the detail pages are wrapped in
  // .animate-fade-in-up, whose transform creates a stacking context that
  // would trap this overlay under the sticky header. Same as FormModal.jsx.
  const modal = (
    <div className="fixed inset-0 z-999" data-lenis-prevent>
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-modal-backdrop"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div
          className="relative w-full max-w-md max-h-[88dvh] bg-white rounded-2xl shadow-2xl overflow-clip animate-modal-content flex flex-col"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={productName ? `Continue with ${productName}` : 'Continue your purchase'}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-colors cursor-pointer border-0"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="relative gradient-hero px-5 sm:px-6 pt-6 pb-5 shrink-0 text-center">
            <h2 className="text-lg sm:text-xl font-bold font-display text-white">
              {productType ? `Get the ${productType} Package` : 'Get this Package'}
            </h2>
            {description && (
              <p className="text-xs sm:text-sm text-white/70 mt-2 line-clamp-3 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Body */}
          <div className="overflow-y-auto overscroll-contain px-5 sm:px-6 py-5 flex-1" data-lenis-prevent>
            <div className="rounded-xl border border-border p-4 sm:p-5">
              {productName && (
                <h3 className="text-sm sm:text-base font-semibold text-text mb-3">{productName}</h3>
              )}

              {shownFeatures.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {shownFeatures.map((feature, idx) => (
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
              )}

              <div className="border-t border-border pt-3.5">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl sm:text-2xl font-bold text-text">{formatPrice(price)}</span>
                  {durationDays && (
                    <span className="text-xs sm:text-sm text-text-tertiary">
                      / {durationDays} days access
                    </span>
                  )}
                </div>
                {discounted && (
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs sm:text-sm text-text-tertiary line-through">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="text-[10px] sm:text-xs font-semibold text-accent-dark bg-accent/15 px-1.5 py-0.5 rounded-md">
                      {Math.round(((originalPrice - price) / originalPrice) * 100)}% off
                    </span>
                  </div>
                )}
                {isOnSale && !discounted && (
                  <p className="text-xs text-text-secondary mt-1">Limited Time Offer</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer — the app's two-button split: commit, or go look around. */}
          <div className="border-t border-border px-5 sm:px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shrink-0 space-y-2.5 bg-white">
            <button onClick={onContinue} className="btn-primary w-full py-3!">
              {continueLabel}
            </button>
            <button
              onClick={handleBrowse}
              className="w-full py-3 rounded-xl border border-primary bg-white text-primary text-sm sm:text-base font-semibold hover:bg-primary/5 transition-colors cursor-pointer"
            >
              {browseLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
