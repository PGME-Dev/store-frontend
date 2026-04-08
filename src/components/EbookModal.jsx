import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { getEbookById } from '../api/ebooks';
import { useAuth } from '../context/AuthContext';
import { usePurchase } from '../context/PurchaseContext';
import { formatPrice } from './PriceDisplay';

export default function EbookModal({ book: listBook, onClose }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isEbookPurchased } = usePurchase();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const bodyRef = useRef(null);

  const bookId = listBook?.book_id || listBook?._id;

  useEffect(() => {
    if (!bookId) return;
    setLoading(true);
    (async () => {
      try {
        const result = await getEbookById(bookId);
        setBook(result.book || result);
      } catch {
        setError('Failed to load book details');
      } finally {
        setLoading(false);
      }
    })();
  }, [bookId]);

  // Lock body scroll & close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const blockAllScroll = (e) => e.preventDefault();
    document.addEventListener('keydown', handleKey);
    document.addEventListener('wheel', blockAllScroll, { passive: false });
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('wheel', blockAllScroll);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleModalWheel = (e) => {
    e.stopPropagation();
    if (bodyRef.current) {
      bodyRef.current.scrollTop += e.deltaY;
    }
  };

  const purchased = isEbookPurchased(bookId);

  // Use list data as fallback while detail loads
  const b = book || listBook;
  const price = b?.effective_price || b?.price;
  const originalPrice = b?.original_price;
  const isOnSale = b?.is_on_sale;

  const handleBuy = () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/login', { state: { from: { pathname: `/ebooks/${bookId}` } } });
      return;
    }
    onClose();
    navigate(`/checkout/ebooks/${bookId}`);
  };

  const modal = (
    <div className="fixed inset-0 z-999">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-modal-backdrop"
        onClick={onClose}
      />

      {/* Centered container */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full flex items-center justify-center">
          {/* Modal card */}
          <div
            className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-clip animate-modal-content flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleModalWheel}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-colors cursor-pointer border-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="relative gradient-hero px-5 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-5 sm:pb-6 shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <span className="text-[11px] sm:text-xs font-medium text-white/60">eBook</span>
                {b?.ebook_file_format && (
                  <>
                    <span className="text-white/30">·</span>
                    <span className="text-[11px] sm:text-xs font-medium text-white/60">{b.ebook_file_format.toUpperCase()}</span>
                  </>
                )}
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug pr-10">{b?.title}</h2>
              {b?.author && (
                <p className="text-white/70 text-xs sm:text-sm mt-1">By {b.author}</p>
              )}
              {b?.subject && (
                <span className="inline-block text-[10px] sm:text-xs font-medium text-white/50 bg-white/10 px-2 py-0.5 rounded-full mt-1.5">
                  {b.subject.name}
                </span>
              )}
            </div>

            {/* Body */}
            <div ref={bodyRef} className="relative px-5 sm:px-6 md:px-8 py-5 sm:py-6 space-y-5 overflow-y-auto flex-1 min-h-0 overscroll-contain">
              {loading && !book ? (
                <div className="space-y-5">
                  {/* Cover + Metadata skeleton */}
                  <div className="flex gap-4">
                    <div className="skeleton w-24 sm:w-28 h-32 sm:h-40 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2.5">
                      <div className="skeleton h-3 w-20 rounded-lg" />
                      <div className="skeleton h-3 w-28 rounded-lg" />
                      <div className="skeleton h-3 w-16 rounded-lg" />
                      <div className="skeleton h-3 w-32 rounded-lg" />
                      <div className="skeleton h-3 w-20 rounded-lg" />
                    </div>
                  </div>
                  {/* Description skeleton */}
                  <div>
                    <div className="skeleton h-3.5 w-28 mb-2 rounded-lg" />
                    <div className="space-y-1.5">
                      <div className="skeleton h-3 w-full rounded-lg" />
                      <div className="skeleton h-3 w-full rounded-lg" />
                      <div className="skeleton h-3 w-2/3 rounded-lg" />
                    </div>
                  </div>
                  {/* Delivery card skeleton */}
                  <div className="flex items-start gap-3 rounded-2xl p-3.5 sm:p-4 bg-surface-dim border border-border">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 skeleton rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-40 rounded-lg" />
                      <div className="skeleton h-3 w-56 rounded-lg" />
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-4 text-error text-sm">{error}</div>
              ) : (
                <>
                  {/* Cover + Metadata */}
                  {(b.thumbnail_url || b.pages || b.ebook_file_format || b.publisher) && (
                    <div className="flex gap-4">
                      {b.thumbnail_url && (
                        <img
                          src={b.thumbnail_url}
                          alt={b.title}
                          className="h-32 sm:h-40 rounded-lg shadow-md object-cover shrink-0"
                        />
                      )}
                      <div className="space-y-2 min-w-0">
                        {b.pages && (
                          <div className="text-xs text-text-secondary">
                            <span className="font-medium text-text">{b.pages}</span> pages
                          </div>
                        )}
                        {b.ebook_file_format && (
                          <div className="text-xs text-text-secondary">
                            Format: <span className="font-medium text-text">{b.ebook_file_format.toUpperCase()}</span>
                          </div>
                        )}
                        {b.ebook_file_size_mb && (
                          <div className="text-xs text-text-secondary">
                            Size: <span className="font-medium text-text">{b.ebook_file_size_mb} MB</span>
                          </div>
                        )}
                        {b.publisher && (
                          <div className="text-xs text-text-secondary">
                            Publisher: <span className="font-medium text-text">{b.publisher}</span>
                          </div>
                        )}
                        {b.publication_year && (
                          <div className="text-xs text-text-secondary">
                            Year: <span className="font-medium text-text">{b.publication_year}</span>
                          </div>
                        )}
                        {b.isbn && (
                          <div className="text-xs text-text-secondary">
                            ISBN: <span className="font-medium text-text">{b.isbn}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {b.description && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-text mb-1.5">About this eBook</h4>
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{b.description}</p>
                    </div>
                  )}

                  {/* Delivery info */}
                  <div className="flex items-start gap-3 bg-surface-dim border border-border rounded-xl p-3.5 sm:p-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/8 rounded-lg flex items-center justify-center shrink-0">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text">Instant Digital Delivery</div>
                      <div className="text-xs text-text-secondary mt-0.5">Available in the PGME app immediately after purchase</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer CTA */}
            {/* TEMP HIDDEN: purchased state, price & buy now button
            <div className="relative border-t border-border px-5 sm:px-6 md:px-8 py-5 sm:py-6 bg-white shrink-0">
              {purchased ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-success/8 rounded-lg flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-success">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-success">Purchased</div>
                    <p className="text-xs text-text-secondary">Open the PGME app to read this eBook</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-text">{formatPrice(price)}</div>
                    {isOnSale && originalPrice && originalPrice > price && (
                      <div className="text-xs text-text-secondary line-through">{formatPrice(originalPrice)}</div>
                    )}
                  </div>
                  <button
                    onClick={handleBuy}
                    className="btn-primary py-2.5! sm:py-3! min-w-35 sm:min-w-40"
                  >
                    Buy Now
                  </button>
                </div>
              )}
            </div>
            */}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
