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
    return <div className="text-center py-12 text-error">{error || 'eBook not found'}</div>;
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
    <div>
      {/* Book cover */}
      {book.thumbnail_url && (
        <div className="flex justify-center mb-4">
          <img
            src={book.thumbnail_url}
            alt={book.title}
            className="h-56 rounded-lg shadow-md object-cover"
          />
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border p-4 mb-4">
        <h1 className="text-xl font-bold text-text mb-1">{book.title}</h1>
        {book.author && <p className="text-sm text-text-secondary mb-3">by {book.author}</p>}
        {book.description && <p className="text-sm text-text-secondary">{book.description}</p>}
      </div>

      {/* Details */}
      <div className="bg-surface rounded-xl border border-border p-4 mb-4">
        <h3 className="text-sm font-semibold text-text mb-2">Details</h3>
        <div className="space-y-1.5 text-sm text-text-secondary">
          {book.pages && <div>Pages: {book.pages}</div>}
          {book.ebook_file_format && <div>Format: {book.ebook_file_format.toUpperCase()}</div>}
          <div>Instant digital delivery after purchase</div>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <PriceDisplay
            price={price}
            originalPrice={book.original_price || book.price}
            isOnSale={book.is_on_sale}
            size="lg"
          />
          <button
            onClick={handleBuy}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors cursor-pointer border-0 text-base"
          >
            Buy Now
          </button>
        </div>
      </div>

      <div className="h-24" />
    </div>
  );
}
