import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/packages', label: 'Packages' },
    { to: '/ebooks', label: 'eBooks' },
    { to: '/sessions', label: 'Sessions' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── Hero (full viewport, light blue gradient top to bottom) ── */}
      <div className="relative h-screen min-h-[600px] max-h-[1200px] overflow-hidden bg-linear-to-b from-[#d6eaff] via-[#e8f4ff] to-white">

        {/* Film grain overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }} />
        </div>

        {/* ── Header (glassmorphism bar like Nexora) ── */}
        <header className="relative z-50 pt-4 sm:pt-6 px-4 sm:px-6 lg:px-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 lg:px-8 rounded-full bg-white/40 backdrop-blur-xl border border-white/50 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
              {/* Logo (left) */}
              <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
                <div className="w-8 h-8 rounded-lg bg-white border border-border/50 flex items-center justify-center shadow-sm">
                  <img src="/logo.png" alt="PGME" className="w-5 h-5 object-contain" />
                </div>
                <span className="text-base sm:text-lg font-bold text-text font-display tracking-tight">PGME</span>
              </Link>

              {/* Nav links (center) */}
              <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text no-underline transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Login button (right) */}
              <div className="flex items-center gap-3">
                <Link
                  to={isAuthenticated ? '/home' : '/login'}
                  className="hidden sm:inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-white bg-primary rounded-full no-underline transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,200,0.3)] hover:scale-105"
                >
                  {isAuthenticated ? 'Dashboard' : 'Login'}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                {/* Mobile hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text transition-all duration-200 bg-transparent border-0 cursor-pointer"
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
              <div className="md:hidden mt-3 animate-slide-down">
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg p-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-text-secondary hover:text-text hover:bg-white/50 rounded-xl no-underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-border/30 mx-2 my-2" />
                  <Link
                    to={isAuthenticated ? '/home' : '/login'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-primary no-underline"
                  >
                    {isAuthenticated ? 'Dashboard' : 'Login'}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ── Centered hero content ── */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pt-16 sm:pt-20">
          <div className="text-center px-5 sm:px-8 max-w-3xl mx-auto">
            {/* Badge */}
            <div className="animate-fade-in-up mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs sm:text-sm font-medium text-text-secondary">Trusted by 500+ PG Medical Students</span>
              </div>
            </div>

            {/* Heading */}
            <div className="animate-fade-in-up-delay-1">
              <h1 className="font-display font-extrabold text-text leading-[1.05] tracking-tight mb-5 sm:mb-6">
                <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl">Ace Your MD/DNB Exams</span>
                <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-1 sm:mt-2">With <em className="text-primary not-italic">PGME</em></span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className="animate-fade-in-up-delay-2">
              <p className="text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed max-w-lg mx-auto mb-8 sm:mb-10">
                Curated course packages, comprehensive eBooks, and expert-led live sessions — everything you need for postgraduate medical success.
              </p>
            </div>

            {/* CTA */}
            <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/home"
                className="group inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white bg-primary rounded-full no-underline transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,200,0.3)] hover:scale-105"
              >
                Explore Courses
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-text-secondary bg-white/60 backdrop-blur-sm border border-border/40 rounded-full no-underline transition-all duration-300 hover:bg-white hover:border-border hover:text-text"
              >
                Learn More
              </Link>
            </div>

            {/* Stats marquee */}
            <div className="mt-14 sm:mt-16 w-full max-w-2xl mx-auto overflow-hidden marquee-wrapper animate-fade-in-up-delay-3">
              <div className="flex animate-marquee w-max">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-10 sm:gap-14 shrink-0 px-6">
                    <div className="text-center shrink-0">
                      <div className="text-lg sm:text-xl font-bold text-text-secondary">50+</div>
                      <div className="text-[11px] sm:text-xs text-text-tertiary mt-0.5 font-medium">Courses</div>
                    </div>
                    <div className="w-px h-7 bg-border/60 shrink-0" />
                    <div className="text-center shrink-0">
                      <div className="text-lg sm:text-xl font-bold text-text-secondary">20+</div>
                      <div className="text-[11px] sm:text-xs text-text-tertiary mt-0.5 font-medium">Expert Faculty</div>
                    </div>
                    <div className="w-px h-7 bg-border/60 shrink-0" />
                    <div className="text-center shrink-0">
                      <div className="text-lg sm:text-xl font-bold text-text-secondary">24/7</div>
                      <div className="text-[11px] sm:text-xs text-text-tertiary mt-0.5 font-medium">Access</div>
                    </div>
                    <div className="w-px h-7 bg-border/60 shrink-0" />
                    <div className="text-center shrink-0">
                      <div className="text-lg sm:text-xl font-bold text-text-secondary">500+</div>
                      <div className="text-[11px] sm:text-xs text-text-tertiary mt-0.5 font-medium">Students</div>
                    </div>
                    <div className="w-px h-7 bg-border/60 shrink-0" />
                    <div className="text-center shrink-0">
                      <div className="text-lg sm:text-xl font-bold text-text-secondary">15+</div>
                      <div className="text-[11px] sm:text-xs text-text-tertiary mt-0.5 font-medium">eBooks</div>
                    </div>
                    <div className="w-px h-7 bg-border/60 shrink-0" />
                    <div className="text-center shrink-0">
                      <div className="text-lg sm:text-xl font-bold text-text-secondary">100+</div>
                      <div className="text-[11px] sm:text-xs text-text-tertiary mt-0.5 font-medium">Live Sessions</div>
                    </div>
                    <div className="w-px h-7 bg-border/60 shrink-0" />
                    <div className="text-center shrink-0">
                      <div className="text-lg sm:text-xl font-bold text-text-secondary">98%</div>
                      <div className="text-[11px] sm:text-xs text-text-tertiary mt-0.5 font-medium">Pass Rate</div>
                    </div>
                    <div className="w-px h-7 bg-border/60 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer (white) ── */}
      <footer className="relative z-10 border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center shadow-sm">
                  <img src="/logo.png" alt="PGME" className="w-6 h-6 object-contain" />
                </div>
                <span className="text-lg font-bold text-text font-display">PGME</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                Your trusted platform for postgraduate medical education resources, courses, and exam preparation.
              </p>
            </div>

            {/* Browse */}
            <div>
              <h4 className="text-xs font-semibold text-text uppercase tracking-wider mb-5">Browse</h4>
              <div className="space-y-3.5">
                <Link to="/packages" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Course Packages</Link>
                <Link to="/ebooks" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">eBooks</Link>
                <Link to="/sessions" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Live Sessions</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold text-text uppercase tracking-wider mb-5">Legal</h4>
              <div className="space-y-3.5">
                <Link to="/terms-and-conditions" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Terms & Conditions</Link>
                <Link to="/refund-policy" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Refund Policy</Link>
                <Link to="/privacy-policy" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Privacy Policy</Link>
              </div>
            </div>

            {/* Company */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-xs font-semibold text-text uppercase tracking-wider mb-5">Company</h4>
              <div className="space-y-3.5">
                <Link to="/about" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">About Us</Link>
                <Link to="/contact" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Contact Us</Link>
                <Link to="/my-purchases" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">My Purchases</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-text-secondary">
              &copy; {new Date().getFullYear()} PGME Medical Education LLP. All rights reserved.
            </p>
            <p className="text-xs text-text-tertiary">
              Access purchased content via the PGME mobile app
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
