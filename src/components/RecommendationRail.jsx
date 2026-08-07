import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendations } from '../api/recommendations';
import { formatPrice } from './PriceDisplay';

// Where each product type lives in the store.
const ROUTE_BY_TYPE = {
  package: (id) => `/packages/${id}`,
  ebook: (id) => `/ebooks/${id}`,
  book: (id) => `/ebooks/${id}`,
  session: (id) => `/sessions/${id}`,
};

const LABEL_BY_REASON = {
  complete_your_set: 'Complete your set',
  renewal: 'Renew access',
  same_subject: null,
};

/**
 * Cross-sell / upsell rail. Renders nothing at all when there's nothing
 * worth showing, so it's safe to drop onto any page unconditionally.
 */
export default function RecommendationRail({
  context,
  productType,
  productId,
  limit = 4,
  title = 'You might also like',
  className = '',
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const recs = await getRecommendations({ context, productType, productId, limit });
        if (!cancelled) setItems(recs);
      } catch {
        // Recommendations are decorative — never surface an error for them.
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [context, productType, productId, limit]);

  if (loading || items.length === 0) return null;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-border p-5 sm:p-6 ${className}`}>
      <h3 className="text-base sm:text-lg font-bold text-text mb-4 sm:mb-5">{title}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {items.map((item) => {
          const to = (ROUTE_BY_TYPE[item.product_type] || ROUTE_BY_TYPE.package)(item.product_id);
          const badge = LABEL_BY_REASON[item.reason];
          return (
            <Link
              key={`${item.product_type}:${item.product_id}`}
              to={to}
              className="group flex gap-3 rounded-lg border border-border p-3 no-underline hover:border-primary/40 hover:shadow-sm transition-all"
            >
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt=""
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0 bg-surface-dim"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-primary">
                    {(item.name || '?').charAt(0)}
                  </span>
                </div>
              )}

              <div className="min-w-0 flex-1">
                {badge && (
                  <span className="inline-block text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5 mb-1">
                    {badge}
                  </span>
                )}
                <p className="text-xs sm:text-sm font-semibold text-text leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {item.name}
                </p>
                <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-primary">
                    {item.has_tiers ? 'From ' : ''}
                    {formatPrice(item.price)}
                  </span>
                  {item.package_type && (
                    <span className="text-[10px] text-text-tertiary">{item.package_type}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
