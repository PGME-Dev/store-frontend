export function formatPrice(price) {
  if (price == null) return '';
  return `₹${Number(price).toLocaleString('en-IN')}`;
}

export default function PriceDisplay({ price, originalPrice, isOnSale, size = 'md' }) {
  const textSize = size === 'lg' ? 'text-2xl' : 'text-base';
  const strikeSize = size === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`${textSize} font-bold text-text`}>
        {formatPrice(price)}
      </span>
      {isOnSale && originalPrice && originalPrice > price && (
        <>
          <span className={`${strikeSize} text-text-secondary line-through`}>
            {formatPrice(originalPrice)}
          </span>
          <span className="text-xs font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">
            {Math.round(((originalPrice - price) / originalPrice) * 100)}% off
          </span>
        </>
      )}
    </div>
  );
}
