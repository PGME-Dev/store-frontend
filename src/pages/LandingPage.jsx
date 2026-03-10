import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

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

      {/* ── Header - commented out
      <header>
        ...
      </header>
      */}

      {/* ── Hero Section ── */}
      <section className="relative px-4 sm:px-6 lg:px-10 pt-8 sm:pt-12 lg:pt-16 pb-6">
        <div className="max-w-[1400px] mx-auto">

          {/* Large Hero Typography */}
          <div className="relative">
            <h1 className="font-display font-extrabold text-gray-900 leading-[0.95] tracking-tighter">
              <span className="block text-[clamp(2.5rem,8vw,7rem)] uppercase">Revolutionize</span>
              <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
                <span className="text-[clamp(2.5rem,8vw,7rem)] uppercase">Learning</span>
                <span className="inline-flex items-center px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border-2 border-gray-300 text-base sm:text-lg font-medium text-gray-500 uppercase tracking-wide normal-case font-sans">with</span>
              </div>
              <div className="flex items-start gap-4 sm:gap-6 flex-wrap mt-1">
                <div>
                  <span className="block text-[clamp(2.5rem,8vw,7rem)] uppercase leading-[0.95]">Expert-Led</span>
                  <span className="block text-[clamp(2.5rem,8vw,7rem)] uppercase leading-[0.95] ml-[10vw] sm:ml-[15vw]">Education</span>
                </div>
              </div>
            </h1>

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

            {/* Circular badge element */}
            <div className="hidden md:flex absolute left-[5%] top-[90%] -translate-y-1/2 items-center justify-center">
              <div className="relative w-28 h-28">
                {/* Rotating text */}
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
                {/* Center icon */}
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

            {/* Medical image card */}
            <div className="md:col-span-5 lg:col-span-4 rounded-3xl overflow-hidden bg-gradient-to-br from-[#d6e4ff] to-[#e8f0ff] min-h-[220px] sm:min-h-[260px] flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, #0000C8 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }} />
              <div className="relative z-10 p-6 text-center">
                {/* Medical icon/illustration */}
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none" className="mx-auto mb-3 opacity-60">
                  <circle cx="50" cy="40" r="25" stroke="#0000C8" strokeWidth="2" fill="none" />
                  <path d="M35 40 Q42 20 50 35 Q58 50 65 30 Q72 20 75 40" stroke="#0000C8" strokeWidth="2" fill="none" />
                  <path d="M30 55 Q40 60 50 55 Q60 50 70 55 Q65 70 50 75 Q35 70 30 55Z" stroke="#0000C8" strokeWidth="1.5" fill="none" opacity="0.5" />
                </svg>
                <p className="text-sm text-[#0000C8]/60 font-medium">PG Medical Excellence</p>
              </div>
            </div>

            {/* Stats boxes */}
            <div className="md:col-span-3 lg:col-span-2 flex flex-row md:flex-col gap-4 sm:gap-5">
              <div className="flex-1 rounded-3xl bg-white border border-gray-200 p-5 sm:p-6 flex flex-col items-center justify-center text-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display">50+</span>
                <span className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Courses</span>
              </div>
              <div className="flex-1 rounded-3xl bg-[#0a0a2e] p-5 sm:p-6 flex flex-col items-center justify-center text-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-display">500+</span>
                <span className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">Students</span>
              </div>
            </div>

            {/* Feature card (blue version of the lime green card) */}
            <div className="md:col-span-4 lg:col-span-6 rounded-3xl bg-[#d6e4ff] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
              {/* Tag pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex px-4 py-1.5 rounded-full border border-[#0000C8]/20 text-xs sm:text-sm font-medium text-[#0000C8] bg-white/50">Personalized learning</span>
                <span className="inline-flex px-4 py-1.5 rounded-full border border-[#0000C8]/20 text-xs sm:text-sm font-medium text-[#0000C8] bg-white/50">Expert Faculty</span>
                <span className="inline-flex px-4 py-1.5 rounded-full border border-[#0000C8]/20 text-xs sm:text-sm font-medium text-[#0000C8] bg-white/50">PG Medical</span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 font-display mb-3">Flexible</h2>
                <div className="w-12 h-0.5 bg-gray-900/20 mb-4" />
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-md">
                  Our cutting-edge platform adapts to your needs and provides a tailored curriculum that helps you succeed. Experience the future of PG medical education today.
                </p>
              </div>

              {/* Arrow icon (bottom right) */}
              <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7">
                <Link to="/packages" className="no-underline">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-gray-900">
                    <path d="M14 34L34 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 14H34V34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
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
            <div className="group rounded-3xl bg-white border border-gray-200 p-7 sm:p-8 hover:shadow-lg hover:border-[#0000C8]/20 transition-all duration-300">
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
            <div className="group rounded-3xl bg-[#0000C8] p-7 sm:p-8 text-white hover:shadow-lg hover:shadow-[#0000C8]/20 transition-all duration-300">
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
            <div className="group rounded-3xl bg-white border border-gray-200 p-7 sm:p-8 hover:shadow-lg hover:border-[#0000C8]/20 transition-all duration-300">
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
          <div className="rounded-3xl bg-[#0a0a2e] p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            {/* Decorative dots */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }} />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight mb-5">
                Ready to Ace Your Exams?
              </h2>
              <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto mb-8 sm:mb-10">
                Join 500+ students who are already preparing smarter with PGME. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/home"
                  className="group inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-[#0a0a2e] bg-white rounded-full no-underline transition-all duration-300 hover:shadow-[0_4px_24px_rgba(255,255,255,0.2)] hover:scale-105"
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

      {/* ── Footer - commented out
      <footer>
        ...
      </footer>
      */}
    </div>
  );
}
