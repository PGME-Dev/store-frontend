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

function SectionHeader({ title, subtitle, viewAllTo, icon, iconBg }) {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 sm:w-11 sm:h-11 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-text font-display">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-text-secondary mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {viewAllTo && (
        <Link to={viewAllTo} className="btn-secondary !py-1.5 !px-4 !text-xs sm:!text-sm no-underline shrink-0">
          View All
        </Link>
      )}
    </div>
  );
}

function SectionSpinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-7 h-7 border-3 border-primary border-t-transparent rounded-full animate-spin" />
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
      {/* Hero Section */}
      <div className="gradient-hero rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white/3 -translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-6 right-20 w-2 h-2 rounded-full bg-white/20 animate-float" />
        <div className="absolute bottom-8 left-1/3 w-1.5 h-1.5 rounded-full bg-white/15 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-white/10 animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-white/80 text-xs sm:text-sm font-medium">Postgraduate Medical Education</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display leading-tight mb-3">
            Elevate Your Medical
            <span className="block text-accent">Exam Preparation</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
            Access curated course packages, eBooks, and live sessions designed for MD/DNB postgraduate success.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/packages" className="btn-primary !bg-white !text-primary hover:!bg-white/90 !shadow-lg no-underline">
              Browse Packages
            </Link>
            <Link to="/about" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 no-underline">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Subject Selector */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-primary/8 rounded-xl flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text">Filter by Subject</h2>
            <p className="text-xs text-text-secondary">Choose your medical specialty</p>
          </div>
        </div>
        <SubjectSelector />
      </div>

      {/* Packages Section */}
      <section className="mb-10 sm:mb-12">
        <SectionHeader
          title="Course Packages"
          subtitle={`Top picks for ${selectedSubject?.name || 'you'}`}
          viewAllTo="/packages"
          iconBg="gradient-primary"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          }
        />
        {loadingPkgs ? <SectionSpinner /> : packages.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-border">
            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-secondary">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <p className="text-sm text-text-secondary">No packages available for {selectedSubject?.name}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
      <section className="mb-10 sm:mb-12">
        <SectionHeader
          title="eBooks"
          subtitle="Digital study materials"
          viewAllTo="/ebooks"
          iconBg="bg-accent"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          }
        />
        {loadingBooks ? <SectionSpinner /> : ebooks.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-border">
            <p className="text-sm text-text-secondary">No ebooks available for {selectedSubject?.name}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
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

      {/* Sessions Section */}
      <section className="mb-10 sm:mb-12">
        <SectionHeader
          title="Live Sessions"
          subtitle="Interactive classes & webinars"
          viewAllTo="/sessions"
          iconBg="bg-warning"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          }
        />
        {loadingSessions ? <SectionSpinner /> : sessions.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-border">
            <p className="text-sm text-text-secondary">No sessions available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {sessions.slice(0, 3).map((session) => {
              const purchased = isSessionPurchased(session.session_id);
              return (
                <Link
                  key={session.session_id}
                  to={`/sessions/${session.session_id}`}
                  className="group block bg-white rounded-2xl border border-border overflow-hidden card-hover no-underline"
                >
                  {session.thumbnail_url && (
                    <div className="aspect-[16/9] bg-surface-dim overflow-hidden relative">
                      <img
                        src={session.thumbnail_url}
                        alt={session.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                      {purchased && (
                        <span className="absolute top-2 right-2 text-[10px] sm:text-xs font-semibold bg-success text-white px-2 py-0.5 rounded-full">
                          Purchased
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-sm sm:text-base font-semibold text-text group-hover:text-primary transition-colors">{session.title}</h3>
                      <div className="shrink-0">
                        {purchased ? (
                          <span className="text-xs font-semibold text-success bg-success/8 px-2.5 py-1 rounded-full">Purchased</span>
                        ) : session.is_free ? (
                          <span className="text-xs font-semibold text-success bg-success/8 px-2.5 py-1 rounded-full">FREE</span>
                        ) : (
                          <span className="text-sm font-bold text-text">{formatPrice(session.price)}</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {session.scheduled_start && (
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-warning">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          <span>{formatDate(session.scheduled_start)}</span>
                        </div>
                      )}
                      {session.faculty_id?.name && (
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                          {session.faculty_id.name}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <div className="gradient-primary rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/3" />
        <div className="relative">
          <h2 className="text-lg sm:text-xl font-bold text-white font-display mb-2">Ready to elevate your preparation?</h2>
          <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">Browse our complete catalog of course packages, eBooks, and live sessions.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/packages" className="btn-primary !bg-white !text-primary hover:!bg-white/90 !shadow-lg no-underline">
              Browse Packages
            </Link>
            <Link to="/contact" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 no-underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedPackage && (
        <PackageModal package={selectedPackage} onClose={() => setSelectedPackage(null)} />
      )}
      {selectedBook && (
        <EbookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
