import { useState, useEffect, useRef } from 'react';
import { getEbooks } from '../api/ebooks';
import { useSubject } from '../context/SubjectContext';
import { usePurchase } from '../context/PurchaseContext';
import EbookCard from '../components/EbookCard';
import EbookModal from '../components/EbookModal';

export default function EbookList() {
  const { subjects } = useSubject();
  const { isEbookPurchased } = usePurchase();
  const [filterSubjectId, setFilterSubjectId] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [specialtyOpen, setSpecialtyOpen] = useState(false);
  const specialtyRef = useRef(null);

  const selectedSubjectName = filterSubjectId
    ? subjects.find((s) => (s._id || s.subject_id) === filterSubjectId)?.name
    : null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (specialtyRef.current && !specialtyRef.current.contains(e.target)) setSpecialtyOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <div className="mb-6 sm:mb-10 lg:mb-12">
        <div className="mb-5">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Library</p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-extrabold text-text tracking-tight">
            eBooks
          </h1>
          <p className="text-text-secondary text-sm sm:text-base mt-2">
            Digital books for your medical preparation
          </p>
        </div>

        {/* Subject Selector Dropdown */}
        <div className="relative" ref={specialtyRef}>
          <button
            type="button"
            onClick={() => setSpecialtyOpen(!specialtyOpen)}
            className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 bg-white rounded-2xl border border-border/60 hover:border-primary/30 transition-all duration-200 cursor-pointer text-left"
          >
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Filter by Subject</p>
              <p className="text-base sm:text-lg font-semibold text-text truncate">{selectedSubjectName || 'All Subjects'}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 transition-transform duration-200 ${specialtyOpen ? 'rotate-180' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </button>

          {specialtyOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-border/60 shadow-xl z-50 animate-slide-down">
              <div className="px-5 sm:px-6 pt-4 pb-3 border-b border-border/40">
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Choose a subject</p>
              </div>
              <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 max-h-80 overflow-y-auto" data-lenis-prevent>
                {/* All Subjects option */}
                <button
                  type="button"
                  onClick={() => { setFilterSubjectId(null); setSpecialtyOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-xl text-left transition-all duration-150 cursor-pointer border ${
                    !filterSubjectId
                      ? 'bg-primary/5 border-primary/20 text-primary'
                      : 'bg-transparent border-transparent hover:bg-surface-dim text-text-secondary hover:text-text'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    !filterSubjectId ? 'bg-primary text-white' : 'bg-surface-dim text-text-tertiary'
                  }`}>
                    A
                  </div>
                  <span className="text-sm font-medium">All Subjects</span>
                  {!filterSubjectId && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0 text-primary">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                {subjects.map((subject) => {
                  const id = subject._id || subject.subject_id;
                  const isActive = filterSubjectId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => { setFilterSubjectId(id); setSpecialtyOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-xl text-left transition-all duration-150 cursor-pointer border ${
                        isActive
                          ? 'bg-primary/5 border-primary/20 text-primary'
                          : 'bg-transparent border-transparent hover:bg-surface-dim text-text-secondary hover:text-text'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        isActive ? 'bg-primary text-white' : 'bg-surface-dim text-text-tertiary'
                      }`}>
                        {subject.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium truncate">{subject.name}</span>
                      {isActive && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0 text-primary">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-9 h-9 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16 text-error text-sm">{error}</div>
      ) : books.length === 0 ? (
        <div className="text-center py-16 sm:py-24">
          <div className="w-18 h-18 sm:w-20 sm:h-20 bg-surface-dim rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <p className="text-text-secondary text-sm sm:text-base font-medium mb-1">No eBooks found</p>
          <p className="text-text-tertiary text-xs sm:text-sm">Try selecting a different subject to see available eBooks</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 lg:gap-6 2xl:gap-7">
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
