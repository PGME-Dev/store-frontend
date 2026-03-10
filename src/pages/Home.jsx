import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../api/packages';
import { getEbooks } from '../api/ebooks';
import { getSessions } from '../api/sessions';
import { useSubject } from '../context/SubjectContext';
import { usePurchase } from '../context/PurchaseContext';
import PackageCard from '../components/PackageCard';
import PackageModal from '../components/PackageModal';
import EbookCard from '../components/EbookCard';
import EbookModal from '../components/EbookModal';
import { formatPrice } from '../components/PriceDisplay';

function SectionHeader({ label, title, subtitle, viewAllTo }) {
  return (
    <div className="flex items-end justify-between mb-7 sm:mb-8">
      <div>
        {label && (
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">{label}</p>
        )}
        <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-text tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-text-secondary mt-1.5">{subtitle}</p>}
      </div>
      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="group text-sm font-semibold text-primary hover:text-primary-dark transition-colors no-underline shrink-0 flex items-center gap-1.5 pb-1"
        >
          View All
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      )}
    </div>
  );
}

function SectionSpinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function EmptyState({ icon, message }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-border/60">
      <div className="w-14 h-14 bg-surface-dim rounded-2xl flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  );
}

export default function Home() {
  const { subjects, subjectId, selectedSubject, selectSubject, loading: subjectLoading } = useSubject();
  const { isPackagePurchased, isEbookPurchased, isSessionPurchased } = usePurchase();

  const [packages, setPackages] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loadingPkgs, setLoadingPkgs] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [specialtyOpen, setSpecialtyOpen] = useState(false);
  const specialtyRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (specialtyRef.current && !specialtyRef.current.contains(e.target)) setSpecialtyOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (subjectLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-9 h-9 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <div className="gradient-hero rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 mb-10 sm:mb-14 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/3 -translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-7">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-white/80 text-xs sm:text-sm font-medium tracking-wide">Postgraduate Medical Education</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-5 tracking-tight">
            Elevate Your Medical
            <span className="block text-accent mt-1.5">Exam Preparation</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base lg:text-lg leading-relaxed mb-9 max-w-lg">
            Access curated course packages, eBooks, and live sessions designed for MD/DNB postgraduate success.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/packages"
              className="group inline-flex items-center gap-2.5 px-7 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-primary bg-white rounded-full no-underline transition-all duration-300 hover:shadow-[0_4px_20px_rgba(255,255,255,0.3)] hover:scale-105"
            >
              Browse Packages
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-white! border border-white/25 rounded-full no-underline transition-all duration-300 hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Subject Selector Dropdown */}
      <div className="mb-12 sm:mb-16 relative" ref={specialtyRef}>
        <button
          type="button"
          onClick={() => setSpecialtyOpen(!specialtyOpen)}
          className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 bg-white rounded-2xl border border-border/60 hover:border-primary/30 transition-all duration-200 cursor-pointer text-left"
        >
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Your Specialty</p>
            <p className="text-base sm:text-lg font-semibold text-text truncate">{selectedSubject?.name || 'Select a subject'}</p>
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
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Choose a specialty</p>
            </div>
            <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 max-h-80 overflow-y-auto" data-lenis-prevent>
              {subjects.map((subject) => {
                const id = subject._id || subject.subject_id;
                const isActive = (selectedSubject?._id || selectedSubject?.subject_id) === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { selectSubject(subject); setSpecialtyOpen(false); }}
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

      {/* Packages Section */}
      <section className="mb-14 sm:mb-18">
        <SectionHeader
          label="Courses"
          title="Course Packages"
          subtitle={`Top picks for ${selectedSubject?.name || 'you'}`}
          viewAllTo="/packages"
        />
        {loadingPkgs ? <SectionSpinner /> : packages.length === 0 ? (
          <EmptyState
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}
            message={`No packages available for ${selectedSubject?.name}`}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
      <section className="mb-14 sm:mb-18">
        <SectionHeader
          label="Library"
          title="eBooks"
          subtitle="Digital study materials"
          viewAllTo="/ebooks"
        />
        {loadingBooks ? <SectionSpinner /> : ebooks.length === 0 ? (
          <EmptyState
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
            message={`No ebooks available for ${selectedSubject?.name}`}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
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
      <section className="mb-14 sm:mb-18">
        <SectionHeader
          label="Live"
          title="Live Sessions"
          subtitle="Interactive classes & webinars"
          viewAllTo="/sessions"
        />
        {loadingSessions ? <SectionSpinner /> : sessions.length === 0 ? (
          <EmptyState
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>}
            message="No sessions available"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {sessions.slice(0, 3).map((session) => {
              const purchased = isSessionPurchased(session.session_id);
              const startTime = session.scheduled_start_time || session.scheduled_start;
              return (
                <Link
                  key={session.session_id}
                  to={`/sessions/${session.session_id}`}
                  className="group block bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200 no-underline"
                >
                  {session.thumbnail_url ? (
                    <div className="aspect-video bg-surface-dim overflow-hidden relative">
                      <img
                        src={session.thumbnail_url}
                        alt={session.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                      {purchased && (
                        <span className="absolute top-2.5 right-2.5 text-[10px] sm:text-xs font-semibold bg-success text-white px-2.5 py-0.5 rounded-full">
                          Purchased
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-surface-dim flex items-center justify-center relative">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-text-tertiary/40">
                        <polygon points="23 7 16 12 23 17 23 7"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
                      {purchased && (
                        <span className="absolute top-2.5 right-2.5 text-[10px] sm:text-xs font-semibold bg-success text-white px-2.5 py-0.5 rounded-full">
                          Purchased
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5 sm:p-6">
                    {/* Subject tag */}
                    {session.subject_name && (
                      <span className="inline-block text-[10px] sm:text-xs font-medium text-primary bg-primary/6 px-2.5 py-0.5 rounded-full mb-3">
                        {session.subject_name}
                      </span>
                    )}

                    <h3 className="text-sm sm:text-base font-semibold text-text group-hover:text-primary transition-colors leading-snug mb-3 line-clamp-2">
                      {session.title}
                    </h3>

                    {/* Schedule */}
                    {startTime && (
                      <div className="flex items-center gap-2 text-xs text-text-secondary mb-4">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span className="font-medium">{formatDate(startTime)}</span>
                        <span className="text-text-tertiary">at</span>
                        <span className="font-medium">{formatTime(startTime)}</span>
                      </div>
                    )}

                    {/* Footer: faculty + price */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/40">
                      <div className="min-w-0">
                        {(session.faculty_name || session.faculty_id?.name) && (
                          <div className="flex items-center gap-2">
                            {(session.faculty_photo_url || session.faculty_id?.photo_url) ? (
                              <img
                                src={session.faculty_photo_url || session.faculty_id.photo_url}
                                alt=""
                                className="w-6 h-6 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                                <span className="text-[10px] font-semibold text-primary">
                                  {(session.faculty_name || session.faculty_id?.name || '?').charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="text-xs font-medium text-text truncate">
                              {session.faculty_name || session.faculty_id?.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="shrink-0">
                        {purchased ? (
                          <span className="text-[10px] sm:text-xs font-semibold text-success bg-success/8 px-2.5 py-1 rounded-full">Purchased</span>
                        ) : session.is_free ? (
                          <span className="text-[10px] sm:text-xs font-semibold text-success bg-success/8 px-2.5 py-1 rounded-full">FREE</span>
                        ) : (
                          null /* price commented out */
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="mb-4">
        <div className="gradient-primary rounded-2xl sm:rounded-3xl p-10 sm:p-14 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/3" />
          <div className="relative">
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-4 tracking-tight">
              Ready to elevate your preparation?
            </h2>
            <p className="text-sm sm:text-base text-white/60 mb-9 max-w-md mx-auto leading-relaxed">
              Browse our complete catalog of course packages, eBooks, and live sessions.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/packages"
                className="group inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 text-sm font-semibold text-primary bg-white rounded-full no-underline transition-all duration-300 hover:shadow-[0_4px_20px_rgba(255,255,255,0.3)] hover:scale-105"
              >
                Browse Packages
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 text-sm font-semibold text-white! border border-white/25 rounded-full no-underline transition-all duration-300 hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

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
