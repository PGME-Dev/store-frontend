import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface-dim">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight no-underline text-white">
            PGME Store
          </Link>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-purchases"
                  className="text-sm text-white/90 hover:text-white no-underline"
                >
                  My Purchases
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-white/70 hover:text-white bg-transparent border-0 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 no-underline text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-text-secondary py-8 border-t border-border">
        <p>&copy; {new Date().getFullYear()} PGME. All rights reserved.</p>
      </footer>
    </div>
  );
}
