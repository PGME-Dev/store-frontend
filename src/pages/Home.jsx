import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../api/packages';
import { getEbooks } from '../api/ebooks';
import { getSessions } from '../api/sessions';
import { useSubject } from '../context/SubjectContext';
import { usePurchase } from '../context/PurchaseContext';
import SubjectSelector from '../components/SubjectSelector';
import PackageCard from '../components/PackageCard';
import PackageModal from '../components/PackageModal';
import EbookCard from '../components/EbookCard';
import EbookModal from '../components/EbookModal';
import { formatPrice } from '../components/PriceDisplay';

function SectionHeader({ title, viewAllTo, icon, iconBg, iconColor }) {
  return (
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 sm:w-9 sm:h-9 ${iconBg} rounded-lg sm:rounded-xl flex items-center justify-center ${iconColor} shrink-0`}>
          {icon}
        </div>
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-text">{title}</h2>
      </div>
      {viewAllTo && (
        <Link to={viewAllTo} className="text-xs sm:text-sm font-medium text-primary no-underline hover:underline shrink-0">
          View All
        </Link>
      )}
    </div>
  );
}

function SectionSpinner() {
  return (
    <div className="flex justify-center py-10">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Home() {
  const { subjectId, selectedSubject, loading: subjectLoading } = useSubject();
  const { isPackagePurchased, isEbookPurchased, isSessionPurchased } = usePurchase();

  const [packages, setPackages] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loadingPkgs, setLoadingPkgs] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  // Fetch packages and ebooks when subject changes
  useEffect(() => {
    if (!subjectId) return;
    setLoadingPkgs(true);
    setLoadingBooks(true);
    getPackages(subjectId)
      .then((r) => setPackages(r.packages || r || []))
      .catch(() => setPackages([]))
      .finally(() => setLoadingPkgs(false));
    getEbooks(subjectId)
      .then((r) => setEbooks(r.books || r || []))
      .catch(() => setEbooks([]))
      .finally(() => setLoadingBooks(false));
  }, [subjectId]);

  // Fetch sessions once (no subject filter, matching app behavior)
  useEffect(() => {
    setLoadingSessions(true);
    getSessions()
      .then((r) => setSessions(r.sessions || r || []))
      .catch(() => setSessions([]))
      .finally(() => setLoadingSessions(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  if (subjectLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Subject Selector */}
      <div className="mb-6 sm:mb-8">
        <p className="text-xs sm:text-sm text-text-secondary mb-2.5">Select Subject</p>
        <SubjectSelector />
      </div>

      {/* Packages Section */}
      <section className="mb-8 sm:mb-10 lg:mb-12">
        <SectionHeader
          title="Course Packages"
          viewAllTo="/packages"
          iconBg="bg-primary/6"
          iconColor="text-primary"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          }
        />
        {loadingPkgs ? <SectionSpinner /> : packages.length === 0 ? (
          <p className="text-sm text-text-secondary py-6 text-center">No packages available for {selectedSubject?.name}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {packages.slice(0, 6).map((pkg, index) => (
              <PackageCard
                key={pkg.package_id}
                pkg={pkg}
                purchased={pkg.is_purchased || isPackagePurchased(pkg.package_id)}
                illustrationIndex={index}
                onClick={() => setSelectedPackage(pkg)}
              />
            ))}
          </div>
        )}
      </section>

      {/* eBooks Section */}
      <section className="mb-8 sm:mb-10 lg:mb-12">
        <SectionHeader
          title="eBooks"
          viewAllTo="/ebooks"
          iconBg="bg-accent/6"
          iconColor="text-accent"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <line x1="9" y1="7" x2="17" y2="7"/>
              <line x1="9" y1="11" x2="14" y2="11"/>
            </svg>
          }
        />
        {loadingBooks ? <SectionSpinner /> : ebooks.length === 0 ? (
          <p className="text-sm text-text-secondary py-6 text-center">No ebooks available for {selectedSubject?.name}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3 md:gap-5">
            {ebooks.slice(0, 5).map((book, index) => (
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
      </section>

      {/* Sessions Section (no subject filter) */}
      <section className="mb-8 sm:mb-10 lg:mb-12">
        <SectionHeader
          title="Live Sessions"
          viewAllTo="/sessions"
          iconBg="bg-warning/6"
          iconColor="text-warning"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          }
        />
        {loadingSessions ? <SectionSpinner /> : sessions.length === 0 ? (
          <p className="text-sm text-text-secondary py-6 text-center">No sessions available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {sessions.slice(0, 3).map((session) => {
              const purchased = isSessionPurchased(session.session_id);
              return (
                <Link
                  key={session.session_id}
                  to={`/sessions/${session.session_id}`}
                  className="group block bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5 lg:p-6 hover:shadow-md hover:border-primary/15 transition-all duration-300 no-underline"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5 sm:mb-3">
                    <h3 className="text-sm sm:text-base font-semibold text-text group-hover:text-primary transition-colors">{session.title}</h3>
                    <div className="shrink-0">
                      {purchased ? (
                        <span className="text-[10px] sm:text-xs font-semibold text-success bg-success/8 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">Purchased</span>
                      ) : session.is_free ? (
                        <span className="text-[10px] sm:text-xs font-semibold text-success bg-success/8 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">FREE</span>
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-text">{formatPrice(session.price)}</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    {session.scheduled_start && (
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-text-secondary">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span className="truncate">{formatDate(session.scheduled_start)}</span>
                      </div>
                    )}
                    {session.faculty_id?.name && (
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-text-secondary">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        {session.faculty_id.name}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Package detail modal */}
      {selectedPackage && (
        <PackageModal
          package={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
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
