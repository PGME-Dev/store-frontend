import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../api/packages';
import { getEbooks } from '../api/ebooks';
import { getSessions } from '../api/sessions';
import { useSubject } from '../context/SubjectContext';
import { useAuth } from '../context/AuthContext';
import { usePurchase } from '../context/PurchaseContext';
import PackageCard from '../components/PackageCard';
import PackageModal from '../components/PackageModal';
import EbookCard from '../components/EbookCard';
import EbookModal from '../components/EbookModal';
import { formatPrice } from '../components/PriceDisplay';
import { getBanners } from '../api/banners';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { subjects, subjectId, selectedSubject, selectSubject, loading: subjectLoading } = useSubject();
  const { purchaseData, isPackagePurchased, isEbookPurchased, isSessionPurchased, purchasedPackageIds, purchasedEbookIds, purchasedSessionIds } = usePurchase();

  const [packages, setPackages] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loadingPkgs, setLoadingPkgs] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [specialtyOpen, setSpecialtyOpen] = useState(false);
  const [activeSessionSlide, setActiveSessionSlide] = useState(0);
  const [banners, setBanners] = useState([]);
  const [activeBannerSlide, setActiveBannerSlide] = useState(0);
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
    getBanners()
      .then((b) => {
        const sorted = (Array.isArray(b) ? b : []).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        setBanners(sorted);
      })
      .catch(() => setBanners([]));
  }, []);

  // Auto-slide for session carousel
  useEffect(() => {
    if (sessions.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSessionSlide((prev) => (prev + 1) % Math.min(sessions.length, 5));
    }, 4000);
    return () => clearInterval(timer);
  }, [sessions.length]);

  // Auto-slide for banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBannerSlide((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const totalPurchased = (purchasedPackageIds?.size || 0) + (purchasedEbookIds?.size || 0) + (purchasedSessionIds?.size || 0);
  const rawName = user?.name || 'Student';
  const displayName = rawName.replace(/\b\w/g, (c) => c.toUpperCase());

  // Extract unique faculty from sessions — must be before any early return (hooks rule)
  const faculty = useMemo(() => {
    const map = new Map();
    sessions.forEach((s) => {
      const name = s.faculty_name || s.faculty_id?.name;
      if (!name || map.has(name)) return;
      map.set(name, {
        name,
        photo: s.faculty_photo_url || s.faculty_id?.photo_url || null,
        specialization: s.faculty_specialization || s.faculty_id?.specialization || null,
        subject: s.subject_name || null,
      });
    });
    return Array.from(map.values());
  }, [sessions]);

  if (subjectLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-9 h-9 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const upcomingSessions = sessions.slice(0, 5);

  return (
    <div className="animate-fade-in-up -mx-4 sm:-mx-6 lg:-mx-8 2xl:-mx-12 -mt-6 sm:-mt-8 md:-mt-10 2xl:-mt-14">

      {isAuthenticated ? (
        <>
          {/* ── Hero / Welcome (Logged In) ── */}
          <section className="bg-gradient-to-br from-[#0000C8]/90 to-[#0000a0]/90 backdrop-blur-xl px-5 sm:px-8 lg:px-12 2xl:px-16 pt-10 sm:pt-14 2xl:pt-18 pb-20 sm:pb-24 2xl:pb-28 relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-white/10">
            {/* SVG Decorations */}
            <svg className="absolute top-0 right-0 w-72 h-72 opacity-[0.07]" viewBox="0 0 300 300" fill="none">
              <circle cx="200" cy="100" r="120" stroke="white" strokeWidth="1.5" />
              <circle cx="200" cy="100" r="80" stroke="white" strokeWidth="1" />
              <circle cx="200" cy="100" r="40" fill="white" opacity="0.1" />
            </svg>
            <svg className="absolute bottom-0 left-0 w-48 h-48 opacity-[0.07]" viewBox="0 0 200 200" fill="none">
              <path d="M0 200 Q100 100 200 200" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M0 170 Q100 70 200 170" stroke="white" strokeWidth="1" fill="none" />
              <path d="M0 140 Q100 40 200 140" stroke="white" strokeWidth="0.5" fill="none" />
            </svg>
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }} />

            <div className="relative max-w-7xl 2xl:max-w-[1600px] mx-auto">
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div>
                  <p className="text-white/50 text-sm font-medium mb-2">{getGreeting()}</p>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                    {displayName}
                  </h1>
                  {selectedSubject && (
                    <p className="text-white/40 text-sm mt-2">{selectedSubject.name}</p>
                  )}
                  <p className="text-white/30 text-sm mt-4 italic max-w-sm leading-relaxed">"The expert in anything was once a beginner."</p>
                </div>
                <Link
                  to="/my-purchases"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/10 text-sm font-medium text-white no-underline hover:bg-white/15 transition-all mt-1"
                >
                  My Purchases
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* ── Stats Cards (overlapping hero) ── */}
          <section className="px-5 sm:px-8 lg:px-12 2xl:px-16 -mt-10 sm:-mt-12 relative z-10 mb-8 sm:mb-10 2xl:mb-14">
            <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 2xl:gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-3.5 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0000C8]/5 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0000C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-gray-900 font-display">{totalPurchased}</div>
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Purchased</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-3.5 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0000C8]/5 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0000C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-gray-900 font-display">{packages.length}</div>
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Available Courses</div>
                {(purchasedPackageIds?.size > 0) && (
                  <div className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold mt-0.5">{purchasedPackageIds.size} purchased</div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-3.5 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0000C8]/5 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0000C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-gray-900 font-display">{ebooks.length}</div>
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Available eBooks</div>
                {(purchasedEbookIds?.size > 0) && (
                  <div className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold mt-0.5">{purchasedEbookIds.size} purchased</div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-3.5 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0000C8]/5 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0000C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                    </svg>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-gray-900 font-display">{sessions.length}</div>
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 font-medium">Live Sessions</div>
                {(purchasedSessionIds?.size > 0) && (
                  <div className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold mt-0.5">{purchasedSessionIds.size} purchased</div>
                )}
              </div>
            </div>
          </section>

          {/* ── Promotional Banners Carousel ── */}
          {banners.length > 0 && (
            <section className="px-5 sm:px-8 lg:px-12 2xl:px-16 mb-10 sm:mb-14">
              <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
                <div className="relative rounded-3xl overflow-hidden">
                  <div className="relative" style={{ aspectRatio: '21/9' }}>
                    {banners.map((b, i) => (
                      <div
                        key={b._id || i}
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{ opacity: activeBannerSlide === i ? 1 : 0, pointerEvents: activeBannerSlide === i ? 'auto' : 'none' }}
                      >
                        <Link to="/sessions" className="block w-full h-full">
                          <img src={b.imageUrl || b.image_url} alt={b.title || 'Banner'} className="w-full h-full object-cover rounded-3xl" />
                        </Link>
                      </div>
                    ))}
                  </div>
                  {/* Dots */}
                  {banners.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                      {banners.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveBannerSlide(i)}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer border-0 ${
                            activeBannerSlide === i ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        /* ── Banner (Not Logged In) ── */
        <section className="px-5 sm:px-8 lg:px-12 2xl:px-16 pt-2 pb-6 sm:pb-8">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
            <div className="rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-[#0000C8] to-[#0000a0] p-7 sm:p-10 lg:p-12 relative overflow-hidden">
              {/* SVG Decorations */}
              <svg className="absolute top-0 right-0 w-72 h-72 opacity-[0.07]" viewBox="0 0 300 300" fill="none">
                <circle cx="200" cy="100" r="120" stroke="white" strokeWidth="1.5" />
                <circle cx="200" cy="100" r="80" stroke="white" strokeWidth="1" />
                <circle cx="200" cy="100" r="40" fill="white" opacity="0.1" />
              </svg>
              <svg className="absolute bottom-0 left-0 w-48 h-48 opacity-[0.07]" viewBox="0 0 200 200" fill="none">
                <path d="M0 200 Q100 100 200 200" stroke="white" strokeWidth="1.5" fill="none" />
                <path d="M0 170 Q100 70 200 170" stroke="white" strokeWidth="1" fill="none" />
              </svg>
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }} />

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Explore PG Medical<br />Courses & Resources
                  </h1>
                  <p className="text-sm sm:text-base text-white/50 mt-3 max-w-md leading-relaxed">
                    Browse our complete catalog of course packages, eBooks, and live sessions curated by expert faculty.
                  </p>
                  <div className="flex items-center gap-5 mt-6 pt-5 border-t border-white/10">
                    <div>
                      <div className="text-xl font-bold text-white">50+</div>
                      <div className="text-[10px] text-white/40 mt-0.5">Courses</div>
                    </div>
                    <div className="w-px h-8 bg-white/15" />
                    <div>
                      <div className="text-xl font-bold text-white">500+</div>
                      <div className="text-[10px] text-white/40 mt-0.5">Students</div>
                    </div>
                    <div className="w-px h-8 bg-white/15" />
                    <div>
                      <div className="text-xl font-bold text-white">98%</div>
                      <div className="text-[10px] text-white/40 mt-0.5">Pass Rate</div>
                    </div>
                  </div>
                </div>
                <Link
                  to="/login"
                  className="shrink-0 inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-[#0000C8] bg-white rounded-full no-underline transition-all duration-300 hover:shadow-[0_4px_24px_rgba(255,255,255,0.2)] hover:scale-105"
                >
                  Get Started
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Promotional Banners (all users) ── */}
      {!isAuthenticated && banners.length > 0 && (
        <section className="px-5 sm:px-8 lg:px-12 2xl:px-16 mb-6 sm:mb-8">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="relative" style={{ aspectRatio: '21/9' }}>
                {banners.map((b, i) => (
                  <div
                    key={b._id || i}
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: activeBannerSlide === i ? 1 : 0, pointerEvents: activeBannerSlide === i ? 'auto' : 'none' }}
                  >
                    {b.linkUrl && b.linkType !== 'none' ? (
                      b.linkType === 'external' ? (
                        <a href={b.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                          <img src={b.imageUrl || b.image_url} alt={b.title || 'Banner'} className="w-full h-full object-cover rounded-3xl" />
                        </a>
                      ) : (
                        <Link to={b.linkUrl || b.link_url} className="block w-full h-full">
                          <img src={b.imageUrl || b.image_url} alt={b.title || 'Banner'} className="w-full h-full object-cover rounded-3xl" />
                        </Link>
                      )
                    ) : (
                      <img src={b.imageUrl || b.image_url} alt={b.title || 'Banner'} className="w-full h-full object-cover rounded-3xl" />
                    )}
                  </div>
                ))}
              </div>
              {banners.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveBannerSlide(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer border-0 ${
                        activeBannerSlide === i ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Content wrapper ── */}
      <div className="px-5 sm:px-8 lg:px-12 2xl:px-16 max-w-7xl 2xl:max-w-[1600px] mx-auto pb-10 2xl:pb-14">

        {/* ── Specialty Selector ── */}
        <div className="mb-10 sm:mb-14 relative" ref={specialtyRef}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">Your Specialty</h2>
              <p className="text-xs text-gray-400 mt-0.5">Browse content for your subject</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSpecialtyOpen(!specialtyOpen)}
            className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 bg-white rounded-2xl border border-gray-200 hover:border-[#0000C8]/30 transition-all duration-200 cursor-pointer text-left shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#0000C8] flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-white">{selectedSubject?.name?.charAt(0) || '?'}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{selectedSubject?.name || 'Select a subject'}</p>
                <p className="text-[11px] text-gray-400">{subjects.length} specialties available</p>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transition-transform duration-200 shrink-0 ${specialtyOpen ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {specialtyOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 animate-slide-down">
              <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-80 overflow-y-auto" data-lenis-prevent>
                {subjects.map((subject) => {
                  const id = subject._id || subject.subject_id;
                  const isActive = (selectedSubject?._id || selectedSubject?.subject_id) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => { selectSubject(subject); setSpecialtyOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150 cursor-pointer border ${
                        isActive
                          ? 'bg-[#0000C8]/5 border-[#0000C8]/20 text-[#0000C8]'
                          : 'bg-transparent border-transparent hover:bg-gray-50 text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        isActive ? 'bg-[#0000C8] text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {subject.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium truncate">{subject.name}</span>
                      {isActive && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0">
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

        {/* ── Packages ── */}
        <section className="mb-14 sm:mb-18">
          <div className="flex items-end justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="font-display text-xl sm:text-2xl 2xl:text-3xl font-extrabold text-gray-900 tracking-tight">Course Packages</h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Top picks for {selectedSubject?.name || 'you'}</p>
            </div>
            <Link to="/packages" className="group text-sm font-semibold text-[#0000C8] hover:text-[#0000a0] no-underline flex items-center gap-1.5">
              View All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {loadingPkgs ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-3 border-[#0000C8]/30 border-t-[#0000C8] rounded-full animate-spin" />
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <p className="text-sm text-gray-400">No packages for {selectedSubject?.name}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 2xl:gap-6">
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

        {/* ── eBooks ── */}
        <section className="mb-14 sm:mb-18">
          <div className="flex items-end justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="font-display text-xl sm:text-2xl 2xl:text-3xl font-extrabold text-gray-900 tracking-tight">eBooks</h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Digital study materials</p>
            </div>
            <Link to="/ebooks" className="group text-sm font-semibold text-[#0000C8] hover:text-[#0000a0] no-underline flex items-center gap-1.5">
              View All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {loadingBooks ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-3 border-[#0000C8]/30 border-t-[#0000C8] rounded-full animate-spin" />
            </div>
          ) : ebooks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <p className="text-sm text-gray-400">No ebooks for {selectedSubject?.name}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5 2xl:gap-6">
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

        {/* ── Live Sessions Grid ── */}
        <section className="mb-14 sm:mb-18">
          <div className="flex items-end justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="font-display text-xl sm:text-2xl 2xl:text-3xl font-extrabold text-gray-900 tracking-tight">Live Sessions</h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Interactive classes & webinars</p>
            </div>
            <Link to="/sessions" className="group text-sm font-semibold text-[#0000C8] hover:text-[#0000a0] no-underline flex items-center gap-1.5">
              View All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {loadingSessions ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-3 border-[#0000C8]/30 border-t-[#0000C8] rounded-full animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              </div>
              <p className="text-sm text-gray-400">No sessions available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 2xl:gap-6">
              {sessions.slice(0, 3).map((session) => {
                const purchased = isSessionPurchased(session.session_id);
                const startTime = session.scheduled_start_time || session.scheduled_start;
                return (
                  <Link
                    key={session.session_id}
                    to={`/sessions/${session.session_id}`}
                    className="group block bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#0000C8]/20 transition-all duration-200 no-underline"
                  >
                    {session.thumbnail_url ? (
                      <div className="aspect-video bg-gray-50 overflow-hidden relative">
                        <img src={session.thumbnail_url} alt={session.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                        {purchased && <span className="absolute top-2.5 right-2.5 text-[10px] sm:text-xs font-semibold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full">Purchased</span>}
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-50 flex items-center justify-center relative">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gray-200"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                        {purchased && <span className="absolute top-2.5 right-2.5 text-[10px] sm:text-xs font-semibold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full">Purchased</span>}
                      </div>
                    )}
                    <div className="p-5">
                      {session.subject_name && (
                        <span className="inline-block text-[10px] sm:text-xs font-medium text-[#0000C8] bg-[#0000C8]/5 px-2.5 py-0.5 rounded-full mb-2.5">{session.subject_name}</span>
                      )}
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-[#0000C8] transition-colors leading-snug mb-2.5 line-clamp-2">{session.title}</h3>

                      {startTime && (
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3.5">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0000C8] shrink-0">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <span className="font-medium text-gray-500">{formatDate(startTime)} at {formatTime(startTime)}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                        <div className="min-w-0">
                          {(session.faculty_name || session.faculty_id?.name) && (
                            <div className="flex items-center gap-2">
                              {(session.faculty_photo_url || session.faculty_id?.photo_url) ? (
                                <img src={session.faculty_photo_url || session.faculty_id.photo_url} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#0000C8]/8 flex items-center justify-center shrink-0">
                                  <span className="text-[10px] font-semibold text-[#0000C8]">{(session.faculty_name || session.faculty_id?.name || '?').charAt(0).toUpperCase()}</span>
                                </div>
                              )}
                              <span className="text-xs font-medium text-gray-500 truncate">{session.faculty_name || session.faculty_id?.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="shrink-0">
                          {purchased ? (
                            <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Purchased</span>
                          ) : session.is_free ? (
                            <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">FREE</span>
                          ) : (
                            <span className="text-sm font-bold text-gray-900">{formatPrice(session.price)}</span>
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

        {/* ── CTA ── */}
        <section className={isAuthenticated && faculty.length > 0 ? 'mb-14 sm:mb-18' : 'mb-4'}>
          <div className="rounded-3xl bg-[#0a0a2e] p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }} />
            <div className="relative">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-extrabold text-white tracking-tight mb-4">
                Ready to Ace Your Exams?
              </h2>
              <p className="text-sm sm:text-base text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                Browse our complete catalog of course packages, eBooks, and live sessions.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/packages"
                  className="group inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 text-sm font-semibold text-[#0a0a2e] bg-white rounded-full no-underline transition-all duration-300 hover:shadow-[0_4px_24px_rgba(255,255,255,0.2)] hover:scale-105"
                >
                  Browse Packages
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 text-sm font-semibold text-white border border-white/20 rounded-full no-underline transition-all duration-300 hover:bg-white/10 hover:border-white/40"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Faculty Section (logged in only) ── */}
        {isAuthenticated && faculty.length > 0 && (
          <section className="mb-4">
            <div className="flex items-end justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="font-display text-xl sm:text-2xl 2xl:text-3xl font-extrabold text-gray-900 tracking-tight">Our Faculty</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">Learn from the best in PG medical education</p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {faculty.map((f) => (
                <div
                  key={f.name}
                  className="shrink-0 w-[200px] sm:w-[220px] 2xl:w-[260px] bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 2xl:p-7 text-center hover:shadow-lg hover:border-[#0000C8]/20 transition-all duration-300"
                >
                  {f.photo ? (
                    <img
                      src={f.photo}
                      alt={f.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto mb-4 border-2 border-gray-100"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#0000C8] to-[#0000a0] flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl sm:text-2xl font-bold text-white">{f.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{f.name}</h3>
                  {f.specialization && (
                    <p className="text-[10px] sm:text-xs text-[#0000C8] font-medium mt-1 truncate">{f.specialization}</p>
                  )}
                  {f.subject && !f.specialization && (
                    <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-1 truncate">{f.subject}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modals */}
      {selectedPackage && <PackageModal package={selectedPackage} onClose={() => setSelectedPackage(null)} />}
      {selectedBook && <EbookModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </div>
  );
}
