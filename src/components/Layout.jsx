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
        className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-surface-dim transition-colors bg-transparent border-0 cursor-pointer"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
          <span className="text-xs sm:text-sm font-semibold text-primary">{initials}</span>
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-xs sm:text-sm font-medium text-text leading-tight truncate max-w-28">{displayName}</div>
          {phone && <div className="text-[10px] sm:text-[11px] text-text-secondary leading-tight">{phone}</div>}
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-text-secondary hidden sm:block">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-border shadow-lg py-2 animate-fade-in z-50">
          {/* User info (visible on mobile since header hides it) */}
          <div className="px-4 py-2.5 border-b border-border sm:hidden">
            <div className="text-sm font-medium text-text truncate">{displayName}</div>
            {phone && <div className="text-xs text-text-secondary">{phone}</div>}
          </div>
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
      )}
    </div>
  );
}

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/packages', label: 'Packages' },
    { to: '/ebooks', label: 'eBooks' },
    { to: '/sessions', label: 'Sessions' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-surface-dim flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
            <Link to="/" className="flex items-center gap-2 no-underline shrink-0">
              <img src="/logo.png" alt="PGME" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
              <span className="text-base sm:text-lg font-bold text-text tracking-tight">PGME Store</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                    isActive(link.to)
                      ? 'text-primary bg-primary/6'
                      : 'text-text-secondary hover:text-text hover:bg-surface-dim'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-purchases"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text no-underline transition-colors px-3 py-2 rounded-lg hover:bg-surface-dim"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  My Purchases
                </Link>
                <UserMenu user={user} logout={logout} />
              </>
            ) : (
              /* Login button commented out */
              null
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-dim transition-colors bg-transparent border-0 cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium no-underline transition-colors ${
                  isActive(link.to)
                    ? 'text-primary bg-primary/5'
                    : 'text-text-secondary hover:text-text hover:bg-surface-dim'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/my-purchases"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium no-underline text-text-secondary hover:text-text hover:bg-surface-dim transition-colors sm:hidden"
              >
                My Purchases
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 md:py-12">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.png" alt="PGME" className="w-7 h-7 object-contain" />
                <span className="text-base font-bold text-text">PGME</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Your trusted platform for medical education resources and courses.
              </p>
            </div>

            {/* Browse */}
            <div>
              <h4 className="text-sm font-semibold text-text mb-3">Browse</h4>
              <div className="space-y-2.5">
                <Link to="/packages" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Course Packages</Link>
                <Link to="/ebooks" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">eBooks</Link>
                <Link to="/sessions" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">Live Sessions</Link>
              </div>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-sm font-semibold text-text mb-3">Account</h4>
              <div className="space-y-2.5">
                <Link to="/my-purchases" className="block text-sm text-text-secondary hover:text-primary no-underline transition-colors">My Purchases</Link>
              </div>
            </div>

            {/* Support */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-sm font-semibold text-text mb-3">Support</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Access your purchases via the PGME mobile app.
              </p>
            </div>
          </div>

          <div className="border-t border-border mt-6 sm:mt-8 pt-5 sm:pt-6">
            <p className="text-xs sm:text-sm text-text-secondary text-center sm:text-left">
              &copy; {new Date().getFullYear()} PGME. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
