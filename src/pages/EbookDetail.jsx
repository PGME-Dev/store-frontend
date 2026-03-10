import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEbookById } from '../api/ebooks';
import { useAuth } from '../context/AuthContext';
import { usePurchase } from '../context/PurchaseContext';
import PriceDisplay from '../components/PriceDisplay';

export default function EbookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isEbookPurchased } = usePurchase();
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
  const purchased = isEbookPurchased(book.book_id || book._id);

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
        {/* Header card */}
        <div className="gradient-hero rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 text-white mb-6 sm:mb-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white opacity-[0.06]" />
          <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-white opacity-[0.06] -translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white opacity-[0.06]" />
          <div className="relative">
            <span className="inline-flex items-center text-xs font-medium bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              eBook
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-display mb-1">{book.title}</h1>
            {book.author && <p className="text-white/70 text-sm">by {book.author}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Book cover + Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8">
              {book.thumbnail_url && (
                <div className="flex justify-center sm:justify-start shrink-0">
                  <img
                    src={book.thumbnail_url}
                    alt={book.title}
                    className="h-52 sm:h-60 md:h-72 lg:h-80 rounded-2xl shadow-lg object-cover"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                  <h3 className="text-base font-semibold text-text mb-3 pb-2 border-b border-border">About this Book</h3>
                  {book.description && <p className="text-sm text-text-secondary leading-relaxed">{book.description}</p>}
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-base font-semibold text-text mb-4 pb-2 border-b border-border">Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {book.pages && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary">Pages</div>
                      <div className="text-sm font-semibold text-text">{book.pages}</div>
                    </div>
                  </div>
                )}
                {book.ebook_file_format && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                        <polyline points="13 2 13 9 20 9"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary">Format</div>
                      <div className="text-sm font-semibold text-text">{book.ebook_file_format.toUpperCase()}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center text-success shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary">Delivery</div>
                    <div className="text-sm font-semibold text-text">Instant digital</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Desktop sticky CTA - price & purchase commented out */}
          {/*
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-xl border border-border p-6 shadow-md">
              ...
            </div>
          </div>
          */}
        </div>
      </div>

      {/* Mobile sticky bottom CTA - price & purchase commented out */}
      {/*
      {purchased ? (
        ...
      ) : (
        ...
      )}
      <div className="h-20 sm:h-24 lg:hidden" />
      */}
    </div>
  );
}
