import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { getPackageById, calculateTierUpgrade, getComboOffer } from '../api/packages';
import { formatPrice } from './PriceDisplay';

/**
 * Everything a customer can do with a package they already own:
 *
 *   - move up a tier on it — the backend credits the unused days pro-rata, so
 *     they pay only the difference, and it can come out free; or
 *   - take the combo that bundles it, credited the same way.
 *
 * Both are offered together because either can be the better deal, and the
 * customer cannot know which without seeing the numbers.
 *
 * Portalled to document.body: pages are wrapped in .animate-fade-in-up, whose
 * transform-based animation creates a stacking context that would otherwise
 * trap this overlay beneath the sticky header regardless of z-index.
 */
export default function TierUpgradeModal({ open, onClose, purchase }) {
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [quotes, setQuotes] = useState({});
  const [comboOffer, setComboOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !purchase?.package_id) return;
    let cancelled = false;
    setLoading(true);
    setError('');

    (async () => {
      try {
        // The combo is a bonus offer: a failure there must not take down the
        // tier options, so it resolves to null rather than throwing.
        getComboOffer(purchase.package_id)
          .then((offer) => {
            if (!cancelled) setComboOffer(offer);
          })
          .catch(() => {});

        const result = await getPackageById(purchase.package_id);
        const p = result.package || result;
        if (cancelled) return;
        setPkg(p);

        const tiers = p.tiers || [];
        // Price every tier; the endpoint rejects tiers that aren't an upgrade
        // (i.e. not more expensive than what they already paid), so a
        // rejection just means "not offerable" rather than a failure.
        const results = await Promise.all(
          tiers.map(async (_, idx) => {
            try {
              return [idx, await calculateTierUpgrade(purchase.package_id, idx)];
            } catch {
              return [idx, null];
            }
          })
        );
        if (!cancelled) setQuotes(Object.fromEntries(results));
      } catch {
        if (!cancelled) setError('Could not load upgrade options.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, purchase]);

  // Lock background scroll (Lenis handles its own via data-lenis-prevent).
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const upgradeable = Object.entries(quotes).filter(([, q]) => q);

  const choose = (tierIndex, quote) => {
    navigate(`/checkout/packages/${purchase.package_id}`, {
      state: { tierIndex: Number(tierIndex), upgradeMode: 'tier', upgradeQuote: quote },
    });
  };

  const chooseCombo = () => {
    navigate(`/checkout/packages/${comboOffer.combo.package_id}`, {
      state: {
        upgradeMode: 'combo',
        upgradeQuote: comboOffer,
        tierIndex: comboOffer.combo.tier_index ?? 0,
      },
    });
  };

  const modal = (
    <div
      className="fixed inset-0 z-999 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      data-lenis-prevent
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl shadow-xl flex flex-col max-h-[92dvh] sm:max-h-[85dvh]">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border shrink-0">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-text truncate">Upgrade Plan</h2>
            <p className="text-xs text-text-tertiary truncate">{purchase?.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-tertiary hover:text-text transition-colors p-1 -mr-1 shrink-0"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain px-5 sm:px-6 py-5 flex-1" data-lenis-prevent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <p className="text-sm text-error text-center py-6">{error}</p>
          ) : upgradeable.length === 0 && !comboOffer ? (
            <p className="text-sm text-text-secondary text-center py-6">
              You're already on the highest plan for this package, and no combo bundles it.
            </p>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-text-secondary mb-4">
                The unused days on your current plan are credited automatically — you only pay
                the difference.
              </p>

              {/* The combo leads when it applies: it covers more than a longer
                  tier of the same package, for credit calculated the same way. */}
              {comboOffer && (
                <button
                  type="button"
                  onClick={chooseCombo}
                  className="w-full text-left rounded-lg border border-primary/40 bg-primary/5 p-4 mb-3 hover:border-primary hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
                      <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8-5-3.6-5 3.6 1.9-5.8L4 8.8h6.1z" />
                    </svg>
                    <span className="text-[11px] font-semibold text-primary">
                      Best value — get everything
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text">{comboOffer.combo.name}</p>
                      <p className="text-[11px] text-text-tertiary mt-0.5">
                        Combo price {formatPrice(comboOffer.combo.price)}
                        {comboOffer.granted_days ? ` · ${comboOffer.granted_days} days access` : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">
                        {comboOffer.is_free_upgrade ? 'Free' : formatPrice(comboOffer.upgrade_base_price)}
                      </p>
                      {comboOffer.credit > 0 && (
                        <p className="text-[11px] text-success">
                          −{formatPrice(comboOffer.credit)} credit
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              )}

              {comboOffer && upgradeable.length > 0 && (
                <p className="text-[11px] text-text-tertiary mb-2">
                  or stay with this package and extend it:
                </p>
              )}

              <div className="space-y-3">
                {upgradeable.map(([idx, q]) => {
                  const tier = pkg?.tiers?.[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => choose(idx, q)}
                      className="w-full text-left rounded-lg border border-border p-4 hover:border-primary hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text">
                            {q.target_tier?.name || tier?.name || `Tier ${Number(idx) + 1}`}
                          </p>
                          <p className="text-[11px] text-text-tertiary mt-0.5">
                            {q.target_tier?.duration_days ?? tier?.duration_days} days access
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-primary">
                            {q.is_free_upgrade ? 'Free' : formatPrice(q.upgrade_base_price)}
                          </p>
                          {q.credit > 0 && (
                            <p className="text-[11px] text-success">
                              −{formatPrice(q.credit)} credit
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
