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
        className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors bg-transparent border-0 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-xs font-bold text-white">{initials}</span>
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-text leading-tight truncate max-w-28">{displayName}</div>
          {phone && <div className="text-[11px] text-text-secondary leading-tight">{phone}</div>}
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-text-secondary hidden sm:block">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl border border-border shadow-xl py-2 animate-slide-down z-50">
          <div className="px-4 py-3 border-b border-border">
            <div className="text-sm font-semibold text-text truncate">{displayName}</div>
            {phone && <div className="text-xs text-text-secondary mt-0.5">{phone}</div>}
          </div>
          <Link
            to="/my-purchases"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text hover:bg-surface-dim transition-colors no-underline"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            My Purchases
          </Link>
          <div className="border-t border-border mt-1 pt-1">
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error/4 transition-colors bg-transparent border-0 cursor-pointer flex items-center gap-2.5"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    { to: '/packages', label: 'Packages' },
    { to: '/ebooks', label: 'eBooks' },
    { to: '/sessions', label: 'Sessions' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-surface-dim flex flex-col">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-sm border-b border-border/50' : 'bg-white border-b border-border'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo + Nav */}
          <div className="flex items-center gap-6 md:gap-10">
            <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <img src="/logo.png" alt="PGME" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-lg font-bold text-text font-display tracking-tight">PGME</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-full text-sm font-medium no-underline transition-all duration-200 ${
                    isActive(link.to)
                      ? 'text-primary bg-primary/6 font-semibold'
                      : 'text-text-secondary hover:text-text hover:bg-surface-dim'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <UserMenu user={user} logout={logout} />
            ) : (
              <Link
                to="/login"
                className="btn-primary !py-2 !px-5 !text-sm no-underline"
              >
                Login
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-text-secondary hover:bg-surface-dim transition-colors bg-transparent border-0 cursor-pointer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileMenuOpen ? (
                  <>
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </>
                ) : (
                  <>
                    <path d="M4 6h16" />
                    <path d="M4 12h16" />
                    <path d="M4 18h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1 animate-slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-xl text-sm font-medium no-underline transition-colors ${
                  isActive(link.to)
                    ? 'text-primary bg-primary/5 font-semibold'
                    : 'text-text-secondary hover:text-text hover:bg-surface-dim'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/my-purchases"
                className="block px-4 py-3 rounded-xl text-sm font-medium no-underline text-text-secondary hover:text-text hover:bg-surface-dim transition-colors"
              >
                My Purchases
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
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
              <h4 className="text-sm font-semibold text-text mb-4">Browse</h4>
              <div className="space-y-3">
                <Link to="/packages" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Course Packages</Link>
                <Link to="/ebooks" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">eBooks</Link>
                <Link to="/sessions" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Live Sessions</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-text mb-4">Legal</h4>
              <div className="space-y-3">
                <Link to="/terms-and-conditions" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Terms & Conditions</Link>
                <Link to="/refund-policy" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Refund Policy</Link>
                <Link to="/privacy-policy" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Privacy Policy</Link>
              </div>
            </div>

            {/* Company */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-sm font-semibold text-text mb-4">Company</h4>
              <div className="space-y-3">
                <Link to="/about" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">About Us</Link>
                <Link to="/contact" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Contact Us</Link>
                <Link to="/my-purchases" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">My Purchases</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
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
