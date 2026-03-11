import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPackageTypes } from '../api/packages';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [packageTypes, setPackageTypes] = useState([]);
  const [playingTrailer, setPlayingTrailer] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    getPackageTypes()
      .then((types) => setPackageTypes(types.filter((t) => t.trailer_video_url)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/packages', label: 'Packages' },
    { to: '/ebooks', label: 'eBooks' },
    { to: '/sessions', label: 'Sessions' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">

      {/* ── Header ── */}
      <header className={`sticky top-0 z-50 pt-4 sm:pt-5 px-4 sm:px-6 lg:px-10 pb-3 pointer-events-none transition-transform duration-300 ${navHidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="max-w-[1400px] mx-auto pointer-events-auto">
          <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 lg:px-8 rounded-full bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <img src="/logo.png" alt="PGME" className="w-5 h-5 object-contain" />
              </div>
              <span className="text-base sm:text-lg font-bold text-gray-900 font-display tracking-tight">PGME</span>
            </Link>

            {/* Nav links (center) */}
            <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 no-underline transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link
                to={isAuthenticated ? '/home' : '/login'}
                className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#0000C8] rounded-full no-underline transition-all duration-300 hover:bg-[#0000a0] hover:shadow-[0_4px_20px_rgba(0,0,200,0.3)] hover:scale-105"
              >
                {isAuthenticated ? 'Dashboard' : 'Get Started'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 transition-all duration-200 bg-transparent border-0 cursor-pointer"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {mobileMenuOpen ? (
                    <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>
                  ) : (
                    <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 animate-slide-down">
              <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl no-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-gray-200 mx-2 my-2" />
                <Link
                  to={isAuthenticated ? '/home' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold text-[#0000C8] no-underline"
                >
                  {isAuthenticated ? 'Dashboard' : 'Get Started'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative px-4 sm:px-6 lg:px-10 pt-8 sm:pt-12 lg:pt-16 pb-6">
        <div className="max-w-[1400px] mx-auto">

          {/* Large Hero Typography */}
          <div className="relative flex flex-row items-start md:block">
            {/* Text + circle wrapper for mobile row layout */}
            <h1 className="font-display font-extrabold text-gray-900 leading-[0.95] tracking-tighter text-left">
              <span className="block text-[clamp(2.5rem,8vw,7rem)] uppercase">Revolutionize</span>
              <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
                <span className="text-[clamp(2.5rem,8vw,7rem)] uppercase">Learning</span>
                <span className="inline-flex items-center px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border-2 border-gray-300 text-base sm:text-lg font-medium text-gray-500 uppercase tracking-wide normal-case font-sans">with</span>
              </div>
              <div className="flex items-start gap-4 sm:gap-6 flex-wrap mt-1">
                <div>
                  <span className="block text-[clamp(2.5rem,8vw,7rem)] uppercase leading-[0.95]">Expert-Led</span>
                  <span className="block text-[clamp(2.5rem,8vw,7rem)] uppercase leading-[0.95] ml-0 md:ml-[10vw] sm:ml-[15vw]">Education</span>
                </div>
              </div>
            </h1>

            {/* Circular badge — visible on mobile (right of text) and md+ (absolute positioned) */}
            <div className="flex md:hidden shrink-0 items-center justify-center self-end -ml-8 -mb-1">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <defs>
                    <path id="circlePathMobile" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                  </defs>
                  <text className="text-[9px] fill-gray-500 uppercase tracking-[0.25em]">
                    <textPath href="#circlePathMobile">
                      with our personalized approach · don't just study, excel ·
                    </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-800">
                    <path d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Welcome Card (positioned top-right, stretches full height of hero text) */}
            <div className="hidden lg:flex absolute top-0 right-0 bottom-0 w-[380px]">
              <div className="bg-[#0000C8] rounded-3xl p-10 text-white relative overflow-hidden w-full flex flex-col">
                {/* Decorative streaks */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-full h-full" style={{
                    background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                  }} />
                </div>
                <div className="relative z-10 flex flex-col justify-between h-full flex-1">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex px-5 py-2 rounded-full bg-white/20 text-sm font-medium">Welcome</span>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5L12 2Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed opacity-80 mb-5">
                      Discover a new way of learning with our expert-led PG medical courses. Achieve your goals and succeed with PGME.
                    </p>
                    <div className="flex items-center gap-5 pt-4 border-t border-white/15">
                      <div>
                        <div className="text-xl font-bold">98%</div>
                        <div className="text-[11px] text-white/50 mt-0.5">Pass Rate</div>
                      </div>
                      <div className="w-px h-8 bg-white/15" />
                      <div>
                        <div className="text-xl font-bold">500+</div>
                        <div className="text-[11px] text-white/50 mt-0.5">Students</div>
                      </div>
                      <div className="w-px h-8 bg-white/15" />
                      <div>
                        <div className="text-xl font-bold">20+</div>
                        <div className="text-[11px] text-white/50 mt-0.5">Faculty</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Circular badge element — desktop (md+) */}
            <div className="hidden md:flex absolute left-[5%] top-[90%] -translate-y-1/2 items-center justify-center">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <defs>
                    <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                  </defs>
                  <text className="text-[9px] fill-gray-500 uppercase tracking-[0.25em]">
                    <textPath href="#circlePath">
                      with our personalized approach · don't just study, excel ·
                    </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-800">
                    <path d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom Grid (bento layout) ── */}
          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">

            {/* Video card */}
            <div className="md:col-span-5 lg:col-span-4 rounded-3xl overflow-hidden min-h-[220px] sm:min-h-[260px] relative">
              <video
                src="https://pgmeessentials.com/wp-content/uploads/2025/01/Website-2-1.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50" />
              {/* Text overlay */}
              <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-end h-full">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display leading-tight mb-1">
                  Post Graduate Medical Essentials
                </h2>
                <span className="text-lg sm:text-xl font-bold text-[#00BEFA] mb-3">(PGME)</span>
                <p className="text-xs sm:text-sm text-white/70 font-medium">
                  Empowering Excellence In Postgraduate Medical Education
                </p>
              </div>
            </div>

            {/* Stats boxes */}
            <div className="md:col-span-3 lg:col-span-2 flex flex-row md:flex-col gap-4 sm:gap-5">
              <div className="flex-1 rounded-3xl bg-white border border-gray-200 p-5 sm:p-6 flex flex-col items-center justify-center text-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display">50+</span>
                <span className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Courses</span>
              </div>
              <div className="flex-1 rounded-3xl bg-[#d6e4ff] p-5 sm:p-6 flex flex-col items-center justify-center text-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0000C8] font-display">500+</span>
                <span className="text-xs sm:text-sm text-[#0000C8]/60 mt-1 font-medium">Students</span>
              </div>
            </div>

            {/* Video Trailers Card */}
            <div className="md:col-span-4 lg:col-span-6 rounded-3xl bg-[#d6e4ff] p-2.5 sm:p-3 relative overflow-hidden">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {packageTypes.slice(0, 2).map((pt) => {
                  const route = pt.name?.toLowerCase().includes('theory') ? '/packages' : pt.name?.toLowerCase().includes('practical') ? '/packages' : '/packages';
                  return (
                    <div key={pt.type_id || pt._id} className="relative rounded-2xl overflow-hidden group">
                      {/* Thumbnail */}
                      {pt.thumbnail_url ? (
                        <img src={pt.thumbnail_url} alt={pt.name} className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
                      ) : (
                        <div className="w-full bg-[#0000C8]/20" style={{ aspectRatio: '4/3' }} />
                      )}
                      {/* Black overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                      {/* Play button — opens popup */}
                      <button
                        onClick={() => setPlayingTrailer(pt)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 border border-white/40 flex items-center justify-center backdrop-blur-md cursor-pointer hover:bg-white/30 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                      {/* Bottom text + arrow link */}
                      <div className="absolute bottom-0 inset-x-0 p-3 flex items-end justify-between">
                        <div>
                          <span className="text-white text-sm sm:text-base font-bold block">{pt.name}</span>
                          <span className="text-white/50 text-[10px] sm:text-xs">Watch Trailer</span>
                        </div>
                        <Link to={route} className="no-underline flex-shrink-0">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 border border-white/40 flex items-center justify-center hover:bg-white/30 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M7 17L17 7" />
                              <path d="M7 7H17V17" />
                            </svg>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why PGME Section ── */}
      <section className="px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0000C8]/5 border border-[#0000C8]/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0000C8]" />
              <span className="text-xs sm:text-sm font-medium text-gray-600">Why Choose PGME</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 font-display tracking-tight">
              Everything You Need to
              <span className="text-[#0000C8]"> Excel</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div
              onClick={() => setActiveFeature('ebooks')}
              className="group rounded-3xl bg-white border border-gray-200 p-7 sm:p-8 hover:shadow-lg hover:border-[#0000C8]/20 transition-all duration-300 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0000C8]/5 flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0000C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <line x1="9" y1="7" x2="15" y2="7" />
                  <line x1="9" y1="11" x2="15" y2="11" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-display mb-3">Comprehensive eBooks</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                In-depth study materials covering all PG medical specialties. Curated by experts with years of teaching experience.
              </p>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => setActiveFeature('sessions')}
              className="group rounded-3xl bg-[#0000C8] p-7 sm:p-8 text-white hover:shadow-lg hover:shadow-[#0000C8]/20 transition-all duration-300 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Live Sessions</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Interactive live classes with expert faculty. Ask questions, clear doubts, and learn in real-time with peers.
              </p>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => setActiveFeature('packages')}
              className="group rounded-3xl bg-white border border-gray-200 p-7 sm:p-8 hover:shadow-lg hover:border-[#0000C8]/20 transition-all duration-300 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0000C8]/5 flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0000C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-display mb-3">Course Packages</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Bundled course packages tailored for MD/DNB exams. Get everything you need in one place at the best price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0000C8]/5 border border-[#0000C8]/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0000C8]" />
                <span className="text-xs sm:text-sm font-medium text-gray-600">How It Works</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display tracking-tight mb-6">
                Start Your Journey in
                <span className="text-[#0000C8]"> 3 Simple Steps</span>
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-10 max-w-lg">
                Get started with PGME and unlock your potential for PG medical exam success.
              </p>

              <div className="space-y-8">
                {[
                  { step: '01', title: 'Create Your Account', desc: 'Sign up in seconds and explore our catalog of courses, eBooks, and live sessions.' },
                  { step: '02', title: 'Choose Your Package', desc: 'Select from curated course packages designed for your specific specialty and exam.' },
                  { step: '03', title: 'Start Learning', desc: 'Access all your materials anytime, anywhere. Track progress and ace your exams.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-5">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#0000C8]/5 flex items-center justify-center">
                      <span className="text-sm font-bold text-[#0000C8]">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 font-display mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - decorative card */}
            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-[#0000C8] to-[#0000a0] p-8 sm:p-10 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 translate-y-1/3 -translate-x-1/3" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5L12 2Z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-white/70">PGME Platform</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-display mb-4">98% Pass Rate</h3>
                  <p className="text-sm text-white/70 leading-relaxed mb-8">
                    Our students consistently achieve outstanding results in MD/DNB examinations across all specialties.
                  </p>
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-2xl font-bold">20+</div>
                      <div className="text-xs text-white/60 mt-0.5">Expert Faculty</div>
                    </div>
                    <div className="w-px h-10 bg-white/20" />
                    <div>
                      <div className="text-2xl font-bold">15+</div>
                      <div className="text-xs text-white/60 mt-0.5">Specialties</div>
                    </div>
                    <div className="w-px h-10 bg-white/20" />
                    <div>
                      <div className="text-2xl font-bold">24/7</div>
                      <div className="text-xs text-white/60 mt-0.5">Access</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="rounded-3xl bg-[#d6e4ff] p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            {/* Decorative dots */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle, #0000C8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }} />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a0a2e] font-display tracking-tight mb-5">
                Ready to Ace Your Exams?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto mb-8 sm:mb-10">
                Join 500+ students who are already preparing smarter with PGME. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/home"
                  className="group inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white bg-[#0000C8] rounded-full no-underline transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,200,0.2)] hover:scale-105"
                >
                  Explore Courses
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white border border-white/20 rounded-full no-underline transition-all duration-300 hover:bg-white/10 hover:border-white/40"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-gray-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <img src="/logo.png" alt="PGME" className="w-6 h-6 object-contain" />
                </div>
                <span className="text-lg font-bold text-gray-900 font-display">PGME</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Your trusted platform for postgraduate medical education resources, courses, and exam preparation.
              </p>
            </div>

            {/* Browse */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-5">Browse</h4>
              <div className="space-y-3.5">
                <Link to="/packages" className="block text-sm text-gray-500 hover:text-[#0000C8] no-underline transition-colors">Course Packages</Link>
                <Link to="/ebooks" className="block text-sm text-gray-500 hover:text-[#0000C8] no-underline transition-colors">eBooks</Link>
                <Link to="/sessions" className="block text-sm text-gray-500 hover:text-[#0000C8] no-underline transition-colors">Live Sessions</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-5">Legal</h4>
              <div className="space-y-3.5">
                <Link to="/terms-and-conditions" className="block text-sm text-gray-500 hover:text-[#0000C8] no-underline transition-colors">Terms & Conditions</Link>
                <Link to="/refund-policy" className="block text-sm text-gray-500 hover:text-[#0000C8] no-underline transition-colors">Refund Policy</Link>
                <Link to="/privacy-policy" className="block text-sm text-gray-500 hover:text-[#0000C8] no-underline transition-colors">Privacy Policy</Link>
              </div>
            </div>

            {/* Company */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-5">Company</h4>
              <div className="space-y-3.5">
                <Link to="/about" className="block text-sm text-gray-500 hover:text-[#0000C8] no-underline transition-colors">About Us</Link>
                <Link to="/contact" className="block text-sm text-gray-500 hover:text-[#0000C8] no-underline transition-colors">Contact Us</Link>
                <Link to="/my-purchases" className="block text-sm text-gray-500 hover:text-[#0000C8] no-underline transition-colors">My Purchases</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} PGME Medical Education LLP. All rights reserved.
            </p>
            <p className="text-xs text-gray-400">
              Access purchased content via the PGME mobile app
            </p>
          </div>
        </div>
      </footer>
      {/* Feature Modal */}
      {activeFeature && (() => {
        const features = {
          ebooks: {
            title: 'Comprehensive eBooks',
            route: '/ebooks',
            icon: (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0000C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <line x1="9" y1="7" x2="15" y2="7" />
                <line x1="9" y1="11" x2="15" y2="11" />
              </svg>
            ),
            description: 'In-depth study materials covering all PG medical specialties. Curated by experts with years of teaching experience.',
            points: [
              'Covers all major PG medical specialties',
              'Written and reviewed by subject matter experts',
              'Regularly updated with latest exam patterns',
              'Available for instant digital access',
            ],
          },
          sessions: {
            title: 'Live Sessions',
            route: '/sessions',
            icon: (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0000C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            ),
            description: 'Interactive live classes with expert faculty. Ask questions, clear doubts, and learn in real-time with peers.',
            points: [
              'Live interactive classes with Q&A',
              'Expert faculty with years of experience',
              'Recorded sessions for later revision',
              'Learn alongside peers in real-time',
            ],
          },
          packages: {
            title: 'Course Packages',
            route: '/packages',
            icon: (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0000C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            ),
            description: 'Bundled course packages tailored for MD/DNB exams. Get everything you need in one place at the best price.',
            points: [
              'Comprehensive bundles for MD/DNB preparation',
              'Includes videos, notes, and practice tests',
              'Flexible pricing tiers to suit your needs',
              'Best value compared to individual purchases',
            ],
          },
        };
        const f = features[activeFeature];
        return (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setActiveFeature(null)}
          >
            <div
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#d6e4ff] p-6 sm:p-8">
                <button
                  onClick={() => setActiveFeature(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/60 flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a2e" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                  </svg>
                </button>
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-5 shadow-sm">
                  {f.icon}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a0a2e] font-display">{f.title}</h2>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{f.description}</p>
              </div>
              {/* Body */}
              <div className="p-6 sm:p-8">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">What you get</h4>
                <ul className="space-y-3">
                  {f.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#0000C8]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0000C8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={f.route}
                  onClick={() => setActiveFeature(null)}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0000C8] text-white text-sm font-semibold rounded-full no-underline hover:bg-[#0000a0] transition-colors"
                >
                  Explore {f.title}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Video Trailer Popup */}
      {playingTrailer && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setPlayingTrailer(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setPlayingTrailer(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
            {/* Title */}
            <div className="absolute top-3 left-4 z-10">
              <span className="text-white text-sm font-semibold">{playingTrailer.name} — Trailer</span>
            </div>
            <video
              src={playingTrailer.trailer_video_url}
              autoPlay
              controls
              className="w-full aspect-video"
            />
          </div>
        </div>
      )}
    </div>
  );
}
