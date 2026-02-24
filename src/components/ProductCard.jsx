import { Link } from 'react-router-dom';
import PriceDisplay from './PriceDisplay';

export default function ProductCard({ to, title, subtitle, price, originalPrice, isOnSale, imageUrl, badge }) {
  return (
    <Link to={to} className="block bg-surface rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow no-underline">
      {imageUrl && (
        <div className="h-36 bg-surface-dim overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        {badge && (
          <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary mb-2">
            {badge}
          </span>
        )}
        <h3 className="text-base font-semibold text-text line-clamp-2 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-text-secondary line-clamp-1 mb-2">{subtitle}</p>}
        <PriceDisplay price={price} originalPrice={originalPrice} isOnSale={isOnSale} />
      </div>
    </Link>
  );
}
