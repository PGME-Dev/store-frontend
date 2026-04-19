import { Link } from 'react-router-dom';
import PriceDisplay from './PriceDisplay';

export default function ProductCard({ to, title, subtitle, price, originalPrice, isOnSale, imageUrl, badge, purchased }) {
  return (
    <Link to={to} className="group block bg-white rounded-xl sm:rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/15 transition-all duration-300 no-underline">
      {imageUrl && (
        <div className="aspect-[4/3] bg-surface-dim overflow-hidden relative">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
          {purchased && (
            <span className="absolute top-2 right-2 text-[10px] sm:text-xs font-semibold bg-success text-white px-2 py-0.5 rounded-full">
              Purchased
            </span>
          )}
        </div>
      )}
      <div className="p-3 sm:p-4 lg:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {badge && (
              <span className="inline-block text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-primary/6 text-primary mb-2">
                {badge}
              </span>
            )}
          </div>
          {purchased && !imageUrl && (
            <span className="shrink-0 text-[10px] sm:text-xs font-semibold bg-success/10 text-success px-2 py-0.5 rounded-full">
              Purchased
            </span>
          )}
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-text line-clamp-2 mb-0.5 sm:mb-1 group-hover:text-primary transition-colors">{title}</h3>
        {subtitle && <p className="text-xs sm:text-sm text-text-secondary line-clamp-1 mb-2 sm:mb-3">{subtitle}</p>}
        {purchased ? (
          <span className="text-xs sm:text-sm font-medium text-success">Owned</span>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <PriceDisplay price={price} originalPrice={originalPrice} isOnSale={isOnSale} />
            <span className="shrink-0 text-xs sm:text-sm font-semibold text-white bg-primary px-3.5 py-1.5 rounded-lg group-hover:bg-primary/90 transition-colors">
              Buy
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
