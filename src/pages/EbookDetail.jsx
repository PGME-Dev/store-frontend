import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEbookById } from '../api/ebooks';
import { useAuth } from '../context/AuthContext';
import PriceDisplay from '../components/PriceDisplay';

export default function EbookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const result = await getEbookById(id);
        setBook(result.book || result);
      } catch {
        setError('Failed to load ebook');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !book) {
    return <div className="text-center py-12 text-error text-sm">{error || 'eBook not found'}</div>;
  }

  const price = book.effective_price || book.price;

  const handleBuy = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/ebooks/${id}` } } });
      return;
    }
    navigate(`/checkout/ebooks/${id}`);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
          {/* Book cover + Details */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6">
              {/* Book cover */}
              {book.thumbnail_url && (
                <div className="flex justify-center sm:justify-start shrink-0">
                  <img
                    src={book.thumbnail_url}
                    alt={book.title}
                    className="h-48 sm:h-56 md:h-72 lg:h-80 rounded-xl shadow-lg object-cover"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5 lg:p-6">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-text mb-1">{book.title}</h1>
                  {book.author && <p className="text-xs sm:text-sm text-text-secondary mb-3 sm:mb-4">by {book.author}</p>}
                  {book.description && <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{book.description}</p>}
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5 lg:p-6">
              <h3 className="text-sm font-semibold text-text mb-3 sm:mb-4">Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {book.pages && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/6 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[11px] sm:text-xs text-text-secondary">Pages</div>
                      <div className="text-xs sm:text-sm font-semibold text-text">{book.pages}</div>
                    </div>
                  </div>
                )}
                {book.ebook_file_format && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-accent/6 rounded-xl flex items-center justify-center text-accent shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                        <polyline points="13 2 13 9 20 9"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[11px] sm:text-xs text-text-secondary">Format</div>
                      <div className="text-xs sm:text-sm font-semibold text-text">{book.ebook_file_format.toUpperCase()}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-success/6 rounded-xl flex items-center justify-center text-success shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-xs text-text-secondary">Delivery</div>
                    <div className="text-xs sm:text-sm font-semibold text-text">Instant digital</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Desktop sticky CTA */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl border border-border p-6">
              <h3 className="text-sm font-semibold text-text mb-4">Purchase</h3>
              <PriceDisplay
                price={price}
                originalPrice={book.original_price || book.price}
                isOnSale={book.is_on_sale}
                size="lg"
              />
              <button
                onClick={handleBuy}
                className="w-full mt-5 px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors cursor-pointer border-0 text-base"
              >
                Buy Now
              </button>
              <p className="text-xs text-text-secondary mt-3 text-center">Instant digital delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-3 sm:p-4 safe-area-inset-bottom lg:hidden z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <PriceDisplay
            price={price}
            originalPrice={book.original_price || book.price}
            isOnSale={book.is_on_sale}
            size="lg"
          />
          <button
            onClick={handleBuy}
            className="px-5 sm:px-8 py-2.5 sm:py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors cursor-pointer border-0 text-sm sm:text-base shrink-0"
          >
            Buy Now
          </button>
        </div>
      </div>

      <div className="h-20 sm:h-24 lg:hidden" />
    </div>
  );
}
