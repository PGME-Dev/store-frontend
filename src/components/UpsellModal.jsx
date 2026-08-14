import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from './PriceDisplay';
import { getComboOffer, calculateComboUpgrade } from '../api/packages';
import { useAuth } from '../context/AuthContext';

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
  // Set for packages: enables the credited combo offer for customers who
  // already own something this package is bundled with.
  packageId,
  // True when the package on screen IS a combo. The question flips: instead of
  // "which combo bundles this?", price THIS combo against what the customer
  // owns. Without it, a combo's own page offers nothing — and on mobile that
  // page has no other upgrade path, since the credited panel is desktop-only.
  isCombo = false,
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  // Stamped with the package it was fetched for, so a result arriving late
  // can never be shown against a different package.
  const [fetched, setFetched] = useState(null);
  const comboOffer = fetched?.packageId === packageId ? fetched.offer : null;

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

  // Ask for the credited combo the moment the modal opens. The offer is a
  // bonus, never a gate: any failure just leaves the ordinary purchase in
  // place rather than blocking or warning.
  useEffect(() => {
    if (!open || !packageId || !isAuthenticated) return;
    let cancelled = false;
    (async () => {
      try {
        // calculateComboUpgrade throws when the customer owns none of this
        // combo (or already owns it all) — that's the ordinary case, not an
        // error, and the catch below turns it into "no offer".
        const offer = isCombo
          ? await calculateComboUpgrade(packageId)
          : await getComboOffer(packageId);
        if (!cancelled) setFetched({ packageId, offer });
      } catch {
        if (!cancelled) setFetched({ packageId, offer: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, packageId, isAuthenticated, isCombo]);

  if (!open) return null;

  const handleTakeCombo = () => {
    onClose();
    // Same shape Checkout already consumes for a combo upgrade, so the credit
    // rows and the combo create-order path work with no changes there.
    navigate(`/checkout/packages/${comboOffer.combo.package_id}`, {
      state: {
        upgradeMode: 'combo',
        upgradeQuote: comboOffer,
        tierIndex: comboOffer.combo.tier_index ?? 0,
      },
    });
  };

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
  // The offer prices the package already on screen, so "continue" must go
  // through the credited checkout rather than buying it again at full price.
  const creditsThisPurchase = !!comboOffer && isCombo;

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
            {/* Credited combo offer — leads, because it's the better deal and
                this is the only moment the customer is deciding. */}
            {comboOffer && (
              <div className="mb-4 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
                    <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8-5-3.6-5 3.6 1.9-5.8L4 8.8h6.1z" />
                  </svg>
                  <span className="text-[11px] sm:text-xs font-semibold text-primary">
                    You already own {comboOffer.credit_breakdown.map((c) => c.package_name).join(', ')}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-text mb-2.5">
                  {comboOffer.combo.name}
                </h3>

                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Combo price</span>
                    <span className="text-text-secondary">{formatPrice(comboOffer.combo.price)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-success">Your credit</span>
                    <span className="text-success">−{formatPrice(comboOffer.credit)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-primary/20">
                    <span className="font-semibold text-text">You pay</span>
                    <span className="font-bold text-primary">{formatPrice(comboOffer.upgrade_base_price)}</span>
                  </div>
                </div>

                {/* On a combo's own page the credit applies to this very
                    purchase, so the footer button carries it — a second CTA
                    here would just be the same action twice. */}
                {!creditsThisPurchase && (
                  <button onClick={handleTakeCombo} className="btn-primary w-full mt-3 py-2.5!">
                    {comboOffer.is_free_upgrade ? 'Get the Combo — Free' : 'Get the Combo'}
                  </button>
                )}

                <p className="text-[11px] text-text-tertiary mt-2 text-center">
                  Credit is the unused value of what you own. Your current access is replaced
                  by the combo{comboOffer.granted_days ? `, valid ${comboOffer.granted_days} more days` : ''}.
                </p>
              </div>
            )}

            {comboOffer && !creditsThisPurchase && (
              <p className="text-[11px] sm:text-xs text-text-tertiary mb-2 text-center">
                or continue with just this package
              </p>
            )}

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
            <button
              onClick={creditsThisPurchase ? handleTakeCombo : onContinue}
              className="btn-primary w-full py-3!"
            >
              {creditsThisPurchase
                ? (comboOffer.is_free_upgrade
                    ? 'Continue — Free'
                    : `Continue — pay ${formatPrice(comboOffer.upgrade_base_price)}`)
                : continueLabel}
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
