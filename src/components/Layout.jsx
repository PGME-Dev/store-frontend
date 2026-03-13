import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.name || 'User';
  const initials = displayName.charAt(0).toUpperCase();
  const phone = user?.phone_number ? `+91 ${user.phone_number}` : '';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-2.5 sm:px-3.5 py-2 rounded-xl hover:bg-surface-dim transition-all duration-200 bg-transparent border-0 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-xs font-bold text-white">{initials}</span>
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-text leading-tight truncate max-w-28">{displayName}</div>
          {phone && <div className="text-[11px] text-text-secondary leading-tight mt-0.5">{phone}</div>}
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={`text-text-tertiary hidden sm:block transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2.5 w-64 bg-white rounded-xl border border-border shadow-lg py-1.5 animate-slide-down z-50">
          <div className="px-4 py-3.5 border-b border-border-light">
            <div className="text-sm font-semibold text-text truncate">{displayName}</div>
            {phone && <div className="text-xs text-text-secondary mt-1">{phone}</div>}
          </div>
          <div className="py-1.5">
            <Link
              to="/my-purchases"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-surface-dim rounded-lg mx-1.5 transition-colors no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              My Purchases
            </Link>
            <Link
              to="/invoices"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-surface-dim rounded-lg mx-1.5 transition-colors no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              My Invoices
            </Link>
          </div>
          <div className="border-t border-border-light mx-3"></div>
          <div className="py-1.5">
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="w-[calc(100%-12px)] text-left mx-1.5 px-4 py-2.5 text-sm text-error hover:bg-error/5 rounded-lg transition-colors bg-transparent border-0 cursor-pointer flex items-center gap-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/packages', label: 'Packages' },
    { to: '/ebooks', label: 'eBooks' },
    { to: '/sessions', label: 'Live Sessions' },
    isAuthenticated
      ? { to: '/invoices', label: 'Invoices' }
      : { to: '/contact', label: 'Contact' },
    { to: '/careers', label: 'Careers' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="sticky top-0 z-50 pt-3 sm:pt-4 px-4 sm:px-6 lg:px-10 2xl:px-16 pb-3 sm:pb-4 pointer-events-none">
        <div className="max-w-350 2xl:max-w-[1700px] mx-auto pointer-events-auto relative">
          <div className={`flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 lg:px-8 rounded-full transition-all duration-300 ${
            scrolled
              ? 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
              : 'bg-white/40 backdrop-blur-xl border border-white/50 shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
          }`}>
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
                  className={`px-4 2xl:px-5 py-2 text-sm 2xl:text-base font-medium no-underline transition-colors duration-200 ${
                    isActive(link.to)
                      ? 'text-primary font-semibold'
                      : 'text-text-secondary hover:text-text'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <UserMenu user={user} logout={logout} />
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-white bg-primary rounded-full no-underline transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,200,0.3)] hover:scale-105"
                >
                  Login
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              )}

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
            <div className="md:hidden absolute left-0 right-0 top-full mt-3 px-4 sm:px-6 z-50 animate-slide-down">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-3 text-sm font-medium rounded-xl no-underline transition-colors ${
                      isActive(link.to)
                        ? 'text-primary bg-primary/5 font-semibold'
                        : 'text-text-secondary hover:text-text hover:bg-white/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <>
                    <div className="border-t border-border/30 mx-2 my-2" />
                    <Link
                      to="/my-purchases"
                      className="block px-4 py-3 text-sm font-medium text-text-secondary hover:text-text hover:bg-white/50 rounded-xl no-underline transition-colors"
                    >
                      My Purchases
                    </Link>
                  </>
                )}
                {!isAuthenticated && (
                  <>
                    <div className="border-t border-border/30 mx-2 my-2" />
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-sm font-semibold text-primary no-underline"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl 2xl:max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 sm:py-8 md:py-10 2xl:py-14">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto relative">
        {/* Accent bar */}
        <div className="h-0.5 bg-linear-to-r from-primary via-accent to-primary"></div>
        {/* Gradient top border */}
        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent"></div>

        <div className="bg-white">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 sm:py-16 2xl:py-20">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12 2xl:gap-16">
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
                  <Link to="/careers" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Careers</Link>
                  <Link to="/my-purchases" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">My Purchases</Link>
                </div>
              </div>
            </div>

            <div className="border-t border-border-light mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-text-secondary">
                &copy; {new Date().getFullYear()} PGME Medical Education LLP. All rights reserved.
              </p>
              <p className="text-xs text-text-tertiary">
                Access purchased content via the PGME mobile app
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
