import { formatPrice } from './PriceDisplay';

export default function PackageCard({ pkg, purchased, illustrationIndex = 0, onClick }) {
  const hasTiers = pkg.has_tiers && pkg.tiers?.length > 0;
  const price = hasTiers ? pkg.tiers[0].effective_price || pkg.tiers[0].price : (pkg.sale_price || pkg.price);
  const originalPrice = hasTiers ? pkg.tiers[0].original_price : pkg.original_price;
  const isOnSale = hasTiers ? (pkg.tiers[0].original_price > (pkg.tiers[0].effective_price || pkg.tiers[0].price)) : pkg.is_on_sale;
  const hasThumbnail = !!pkg.thumbnail_url;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col w-full text-left bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer"
    >
      {/* Cover image */}
      <div className="relative bg-surface-dim">
        {hasThumbnail ? (
          <div className="aspect-video overflow-hidden">
            <img
              src={pkg.thumbnail_url}
              alt={pkg.name}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="aspect-video flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-text-tertiary/30">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
        )}
        {/* Badges on image */}
        {/* TEMP HIDDEN: purchased & discount badges
        {purchased && (
          <span className="absolute top-3 right-3 text-[10px] sm:text-xs font-semibold bg-success text-white px-2.5 py-1 rounded-full shadow-sm">
            Purchased
          </span>
        )}
        {!purchased && isOnSale && originalPrice > price && (
          <span className="absolute top-3 left-3 text-[10px] sm:text-xs font-semibold bg-white text-accent-dark px-2 py-0.5 rounded-full shadow-sm">
            {Math.round(((originalPrice - price) / originalPrice) * 100)}% off
          </span>
        )}
        */}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Type badge */}
        {(pkg.type || pkg.package_type) && (
          <span className="self-start text-[10px] sm:text-xs font-medium text-primary bg-primary/6 px-2 py-0.5 rounded-full mb-2.5">
            {pkg.type || pkg.package_type}
          </span>
        )}

        {/* Title */}
        <h3 className="text-sm sm:text-base font-semibold text-text group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
          {pkg.name}
        </h3>

        {/* Description */}
        {pkg.description && (
          <p className="text-[11px] sm:text-xs text-text-tertiary line-clamp-2 leading-relaxed mb-3">
            {pkg.description}
          </p>
        )}

        {/* Meta row */}
        {(pkg.duration_days || pkg.features?.length > 0) && (
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-text-secondary mb-3">
            {pkg.duration_days && (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary shrink-0">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span className="font-medium">{pkg.duration_days} days</span>
              </>
            )}
            {pkg.duration_days && pkg.features?.length > 0 && (
              <span className="text-text-tertiary">·</span>
            )}
            {pkg.features?.length > 0 && (
              <span>{pkg.features.length} features</span>
            )}
          </div>
        )}

        {/* Tier options */}
        {hasTiers && pkg.tiers.length > 1 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-dim mb-3">
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-medium text-text">
                {pkg.tiers.length} duration options
              </div>
              <div className="text-[10px] sm:text-[11px] text-text-tertiary truncate">
                {pkg.tiers.map((t) => t.name).join(' · ')}
              </div>
            </div>
          </div>
        )}

        {/* Price footer — pushed to bottom */}
        {/* TEMP HIDDEN: price & purchased state
        <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between gap-2">
          {purchased ? (
            <span className="text-xs font-semibold text-success bg-success/8 px-2.5 py-1 rounded-full">Purchased</span>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-bold text-text">
                {hasTiers ? `From ${formatPrice(price)}` : formatPrice(price)}
              </span>
              {isOnSale && originalPrice > price && (
                <span className="text-[10px] sm:text-xs text-text-tertiary line-through">{formatPrice(originalPrice)}</span>
              )}
            </div>
          )}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary group-hover:text-primary transition-colors shrink-0">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        */}
      </div>
    </button>
  );
}
