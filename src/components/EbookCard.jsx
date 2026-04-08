import { formatPrice } from './PriceDisplay';

export default function EbookCard({ book, purchased, illustrationIndex = 0, onClick }) {
  const price = book.effective_price || book.price;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col w-full text-left bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer"
    >
      {/* Cover image */}
      <div className="relative bg-surface-dim">
        {book.thumbnail_url ? (
          <div className="aspect-3/4 overflow-hidden">
            <img
              src={book.thumbnail_url}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="aspect-3/4 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary/30">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <path d="M8 7h6" />
              <path d="M8 11h8" />
            </svg>
          </div>
        )}
        {/* Badges */}
        {/* TEMP HIDDEN: owned & discount badges
        {purchased && (
          <span className="absolute top-2.5 right-2.5 text-[10px] sm:text-xs font-semibold bg-success text-white px-2 py-0.5 rounded-full shadow-sm">
            Owned
          </span>
        )}
        {!purchased && book.is_on_sale && book.original_price && book.original_price > price && (
          <span className="absolute top-2.5 left-2.5 text-[10px] sm:text-xs font-semibold bg-white text-accent-dark px-2 py-0.5 rounded-full shadow-sm">
            {Math.round(((book.original_price - price) / book.original_price) * 100)}% off
          </span>
        )}
        */}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        {/* Subject tag */}
        {book.subject && (
          <span className="self-start text-[9px] sm:text-[10px] font-medium text-primary bg-primary/6 px-1.5 py-0.5 rounded-full mb-2">
            {book.subject.name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-semibold text-text group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1.5">
          {book.title}
        </h3>

        {/* Author */}
        {book.author && (
          <p className="text-[10px] sm:text-xs text-text-tertiary line-clamp-1 mb-2">
            by {book.author}
          </p>
        )}

        {/* Price — pushed to bottom */}
        {/* TEMP HIDDEN: price & owned state
        <div className="mt-auto pt-2.5 border-t border-border/40">
          {purchased ? (
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-success">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Owned
            </span>
          ) : (
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-text">{formatPrice(price)}</span>
              {book.is_on_sale && book.original_price && book.original_price > price && (
                <span className="text-[10px] sm:text-xs text-text-tertiary line-through">{formatPrice(book.original_price)}</span>
              )}
            </div>
          )}
        </div>
        */}
      </div>
    </button>
  );
}
