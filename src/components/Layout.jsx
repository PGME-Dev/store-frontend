import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      {/* Main content */}
      <main className="flex-1 max-w-7xl 2xl:max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 sm:py-8 md:py-10 2xl:py-14">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto relative">
        <div className="h-0.5 bg-linear-to-r from-primary via-accent to-primary"></div>
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
