import { useState, useEffect } from 'react';
import { getEbooks } from '../api/ebooks';
import { usePurchase } from '../context/PurchaseContext';
import SubjectSelector from '../components/SubjectSelector';
import EbookCard from '../components/EbookCard';
import EbookModal from '../components/EbookModal';

export default function EbookList() {
  const { isEbookPurchased } = usePurchase();
  const [filterSubjectId, setFilterSubjectId] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    (async () => {
      try {
        const result = await getEbooks(filterSubjectId);
        setBooks(result.books || result || []);
      } catch {
        setError('Failed to load ebooks');
      } finally {
        setLoading(false);
      }
    })();
  }, [filterSubjectId]);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-5 sm:mb-8 lg:mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-accent/6 rounded-xl flex items-center justify-center text-accent shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <line x1="9" y1="7" x2="17" y2="7"/>
              <line x1="9" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-text">eBooks</h1>
            <p className="text-text-secondary text-xs sm:text-sm">Digital books for your medical preparation</p>
          </div>
        </div>
        <SubjectSelector showAll value={filterSubjectId} onChange={setFilterSubjectId} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-error text-sm">{error}</div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-surface-dim rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-secondary">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <p className="text-text-secondary text-sm">No ebooks available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3 md:gap-5">
          {books.map((book, index) => (
            <EbookCard
              key={book.book_id}
              book={book}
              purchased={isEbookPurchased(book.book_id)}
              illustrationIndex={index}
              onClick={() => setSelectedBook(book)}
            />
          ))}
        </div>
      )}

      {/* Ebook detail modal */}
      {selectedBook && (
        <EbookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}
