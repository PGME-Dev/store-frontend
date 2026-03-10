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
    { to: '/packages', label: 'Packages' },
    { to: '/ebooks', label: 'eBooks' },
    { to: '/sessions', label: 'Sessions' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header - commented out
      <header className="sticky top-0 z-50 pt-3 sm:pt-4 px-4 sm:px-6 lg:px-10 pb-3 sm:pb-4 pointer-events-none">
        ...
      </header>
      */}

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <Outlet />
      </main>

      {/* Footer - commented out
      <footer className="mt-auto relative">
        ...
      </footer>
      */}
    </div>
  );
}
