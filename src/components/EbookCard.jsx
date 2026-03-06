import { formatPrice } from './PriceDisplay';

// 5 book/science-themed SVG illustrations (fallback when no cover image)
const illustrations = [
  // Closed book with bookmark
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M22 14h36a2 2 0 0 1 2 2v48a2 2 0 0 1-2 2H22a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M26 14v52" stroke="currentColor" strokeWidth="0.8"/>
      <path d="M48 14v20l-5-4-5 4V14" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
      <line x1="32" y1="42" x2="52" y2="42" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="32" y1="48" x2="48" y2="48" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="32" y1="54" x2="44" y2="54" stroke="currentColor" strokeWidth="0.8"/>
    </svg>
  ),
  // Stack of books
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="18" y="50" width="44" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="16" y="40" width="48" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="20" y="30" width="40" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M26 18h28a2 2 0 0 1 2 2v8H24v-8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="36" y1="18" x2="36" y2="28" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="30" cy="54" r="1.5" fill="currentColor"/>
      <line x1="24" y1="44" x2="28" y2="44" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="26" y1="34" x2="34" y2="34" stroke="currentColor" strokeWidth="0.8"/>
    </svg>
  ),
  // Reading glasses
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="28" cy="42" r="12" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="52" cy="42" r="12" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M40 42c0-3 2-5 4-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M40 42c0-3-2-5-4-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M16 42c-3-2-4-4-4-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M64 42c3-2 4-4 4-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="28" cy="42" r="4" stroke="currentColor" strokeWidth="0.6"/>
      <circle cx="52" cy="42" r="4" stroke="currentColor" strokeWidth="0.6"/>
    </svg>
  ),
  // Pill capsule
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="28" y="16" width="24" height="48" rx="12" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="28" y1="40" x2="52" y2="40" stroke="currentColor" strokeWidth="1"/>
      <circle cx="36" cy="28" r="2" fill="currentColor"/>
      <circle cx="44" cy="32" r="1.5" fill="currentColor"/>
      <circle cx="38" cy="52" r="1.5" fill="currentColor"/>
      <circle cx="44" cy="48" r="2" fill="currentColor"/>
      <line x1="34" y1="22" x2="38" y2="22" stroke="currentColor" strokeWidth="0.6"/>
      <line x1="42" y1="56" x2="46" y2="56" stroke="currentColor" strokeWidth="0.6"/>
    </svg>
  ),
  // Test tube with bubbles
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M32 16h16v6l8 32a10 10 0 0 1-10 12h-12a10 10 0 0 1-10-12l8-32V16z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <line x1="30" y1="16" x2="50" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M28 48h24" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="36" cy="54" r="3" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="44" cy="52" r="2" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="38" cy="42" r="1.5" fill="currentColor"/>
      <circle cx="42" cy="38" r="1" fill="currentColor"/>
      <circle cx="36" cy="34" r="1" fill="currentColor"/>
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

export default function EbookCard({ book, purchased, illustrationIndex = 0, onClick }) {
  const illustration = illustrations[illustrationIndex % illustrations.length];
  const colorClass = illustrationColors[illustrationIndex % illustrationColors.length];
  const price = book.effective_price || book.price;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block w-full text-left bg-white rounded-xl sm:rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/15 transition-all duration-300 cursor-pointer"
    >
      {/* Cover image or illustration fallback */}
      {book.thumbnail_url ? (
        <div className="aspect-[3/4] bg-surface-dim overflow-hidden relative">
          <img
            src={book.thumbnail_url}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
          {purchased && (
            <span className="absolute top-2 right-2 text-[10px] sm:text-xs font-semibold bg-success text-white px-2 py-0.5 rounded-full">
              Purchased
            </span>
          )}
        </div>
      ) : (
        <div className={`absolute -bottom-1 -right-1 pointer-events-none opacity-[0.08] group-hover:opacity-[0.12] transition-opacity ${colorClass}`}>
          {illustration}
        </div>
      )}

      <div className="relative p-3 sm:p-4">
        {/* Title */}
        <h3 className="text-xs sm:text-sm font-semibold text-text group-hover:text-primary transition-colors mb-0.5 sm:mb-1 line-clamp-2 leading-snug">
          {book.title}
        </h3>

        {/* Author */}
        {book.author && (
          <p className="text-[10px] sm:text-xs text-text-secondary line-clamp-1 mb-1.5">
            {book.author}
          </p>
        )}

        {/* Subject */}
        {book.subject && (
          <span className="inline-block text-[9px] sm:text-[10px] font-medium text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded-full mb-1.5">
            {book.subject.name}
          </span>
        )}

        {/* Price / Status */}
        {purchased ? (
          <span className="text-[10px] sm:text-xs font-medium text-success">Owned</span>
        ) : (
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-text">{formatPrice(price)}</span>
            {book.is_on_sale && book.original_price && book.original_price > price && (
              <>
                <span className="text-[10px] sm:text-xs text-text-secondary line-through">{formatPrice(book.original_price)}</span>
                <span className="text-[9px] sm:text-[10px] font-medium text-success bg-success/10 px-1 py-0.5 rounded">
                  {Math.round(((book.original_price - price) / book.original_price) * 100)}% off
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
