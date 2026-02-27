import { formatPrice } from './PriceDisplay';

// 5 education/course-themed SVG illustrations
const illustrations = [
  // Graduation cap
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M40 20L10 35l30 15 30-15-30-15z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M22 42v14c0 0 8 8 18 8s18-8 18-8V42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="10" y1="35" x2="10" y2="56" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="10" cy="58" r="2.5" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  // Open book with pages
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M40 22v36" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3"/>
      <path d="M40 22c-4-4-14-6-22-4v36c8-2 18 0 22 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M40 22c4-4 14-6 22-4v36c-8-2-18 0-22 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="24" y1="30" x2="36" y2="30" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="24" y1="36" x2="34" y2="36" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="24" y1="42" x2="35" y2="42" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="44" y1="30" x2="56" y2="30" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="44" y1="36" x2="54" y2="36" stroke="currentColor" strokeWidth="0.8"/>
    </svg>
  ),
  // Certificate / diploma scroll
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="18" y="18" width="44" height="38" rx="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M18 18c0 0-4 0-4 4v4c0 0 0 4 4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M62 18c0 0 4 0 4 4v4c0 0 0 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <line x1="28" y1="28" x2="52" y2="28" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="30" y1="34" x2="50" y2="34" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="32" y1="40" x2="48" y2="40" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="40" cy="52" r="6" stroke="currentColor" strokeWidth="1"/>
      <path d="M37 57l-2 8 5-3 5 3-2-8" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // Microscope
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M36 18l8 30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M32 16l8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="44" cy="48" r="10" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M54 48h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="44" cy="48" r="3" fill="currentColor"/>
      <line x1="24" y1="62" x2="56" y2="62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="40" y1="58" x2="40" y2="62" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M34 58h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  // Chalkboard / lecture
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="14" y="18" width="52" height="34" rx="2" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="22" y1="28" x2="46" y2="28" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="22" y1="34" x2="40" y2="34" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="22" y1="40" x2="44" y2="40" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="54" cy="36" r="5" stroke="currentColor" strokeWidth="0.8"/>
      <path d="M52 33l2 3 4-5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="30" y1="52" x2="30" y2="62" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <line x1="50" y1="52" x2="50" y2="62" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <line x1="24" y1="62" x2="56" y2="62" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
];

const illustrationColors = [
  'text-primary',
  'text-warning',
  'text-success',
  'text-accent',
  'text-error',
];

export default function PackageCard({ pkg, purchased, illustrationIndex = 0, onClick }) {
  const illustration = illustrations[illustrationIndex % illustrations.length];
  const colorClass = illustrationColors[illustrationIndex % illustrationColors.length];

  const hasTiers = pkg.has_tiers && pkg.tiers?.length > 0;
  const price = hasTiers ? pkg.tiers[0].effective_price || pkg.tiers[0].price : (pkg.sale_price || pkg.price);
  const originalPrice = hasTiers ? pkg.tiers[0].original_price : pkg.original_price;
  const isOnSale = hasTiers ? (pkg.tiers[0].original_price > (pkg.tiers[0].effective_price || pkg.tiers[0].price)) : pkg.is_on_sale;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block w-full text-left bg-white rounded-xl sm:rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/15 transition-all duration-300 cursor-pointer"
    >
      {/* Decorative illustration in bottom-right */}
      <div className={`absolute -bottom-1 -right-1 pointer-events-none opacity-[0.08] group-hover:opacity-[0.12] transition-opacity ${colorClass}`}>
        {illustration}
      </div>

      <div className="relative p-4 sm:p-5">
        {/* Top row: Type badge + Price/Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {(pkg.type || pkg.package_type) ? (
            <span className="text-[10px] sm:text-xs font-medium text-primary bg-primary/6 px-2 py-0.5 rounded-full truncate">
              {pkg.type || pkg.package_type}
            </span>
          ) : <span />}
          <div className="shrink-0">
            {purchased ? (
              <span className="text-[10px] sm:text-xs font-semibold text-success bg-success/8 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">Purchased</span>
            ) : (
              <span className="text-xs sm:text-sm font-bold text-text">
                {hasTiers ? `From ${formatPrice(price)}` : formatPrice(price)}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-semibold text-text group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-snug">
          {pkg.name}
        </h3>

        {/* Description */}
        {pkg.description && (
          <p className="text-[11px] sm:text-xs text-text-secondary line-clamp-2 mb-3 leading-relaxed">
            {pkg.description}
          </p>
        )}

        {/* Duration + Features count */}
        {(pkg.duration_days || pkg.features?.length > 0) && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs mb-3 flex-wrap">
            {pkg.duration_days && (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span className="text-text font-medium">{pkg.duration_days} days</span>
              </>
            )}
            {pkg.features?.length > 0 && (
              <span className="text-text-secondary">{pkg.duration_days ? '· ' : ''}{pkg.features.length} features</span>
            )}
          </div>
        )}

        {/* Tier info row */}
        {hasTiers && pkg.tiers.length > 1 && (
          <div className="flex items-center gap-2.5 pt-3 border-t border-border/60">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
              <span className="text-[10px] sm:text-xs font-semibold text-primary">{pkg.tiers.length}</span>
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-medium text-text truncate">
                {pkg.tiers.length} duration options
              </div>
              <div className="text-[10px] sm:text-[11px] text-text-secondary truncate">
                {pkg.tiers.map((t) => t.name).join(' · ')}
              </div>
            </div>
          </div>
        )}

        {/* Sale badge */}
        {!purchased && isOnSale && originalPrice > price && (
          <div className={`flex items-center gap-2.5 pt-3 ${hasTiers && pkg.tiers.length > 1 ? '' : 'border-t border-border/60'}`}>
            <span className="text-[10px] sm:text-xs font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">
              {Math.round(((originalPrice - price) / originalPrice) * 100)}% off
            </span>
            <span className="text-[10px] sm:text-xs text-text-secondary line-through">{formatPrice(originalPrice)}</span>
          </div>
        )}
      </div>
    </button>
  );
}
