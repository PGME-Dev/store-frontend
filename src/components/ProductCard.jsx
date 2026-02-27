import { Link } from 'react-router-dom';
import PriceDisplay from './PriceDisplay';

export default function ProductCard({ to, title, subtitle, price, originalPrice, isOnSale, imageUrl, badge }) {
  return (
    <Link to={to} className="group block bg-white rounded-xl sm:rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/15 transition-all duration-300 no-underline">
      {imageUrl && (
        <div className="aspect-[4/3] bg-surface-dim overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        </div>
      )}
      <div className="p-3 sm:p-4 lg:p-5">
        {badge && (
          <span className="inline-block text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-primary/6 text-primary mb-2">
            {badge}
          </span>
        )}
        <h3 className="text-sm sm:text-base font-semibold text-text line-clamp-2 mb-0.5 sm:mb-1 group-hover:text-primary transition-colors">{title}</h3>
        {subtitle && <p className="text-xs sm:text-sm text-text-secondary line-clamp-1 mb-2 sm:mb-3">{subtitle}</p>}
        <PriceDisplay price={price} originalPrice={originalPrice} isOnSale={isOnSale} />
      </div>
    </Link>
  );
}
