import { useState, useEffect } from 'react';
import { getEbooks } from '../api/ebooks';
import ProductCard from '../components/ProductCard';

export default function EbookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const result = await getEbooks();
        setBooks(result.books || result || []);
      } catch {
        setError('Failed to load ebooks');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-error">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-text mb-4">eBooks</h1>
      {books.length === 0 ? (
        <p className="text-text-secondary text-center py-12">No ebooks available</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {books.map((book) => (
            <ProductCard
              key={book._id}
              to={`/ebooks/${book._id}`}
              title={book.title}
              subtitle={book.author}
              price={book.actual_price || book.price}
              originalPrice={book.price}
              isOnSale={book.is_on_sale}
              imageUrl={book.thumbnail_url}
            />
          ))}
        </div>
      )}
    </div>
  );
}
