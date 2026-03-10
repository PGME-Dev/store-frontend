import { Link } from 'react-router-dom';

// TODO: Replace with actual Play Store link
const PLAY_STORE_URL = '#';
// TODO: Replace with actual App Store link
const APP_STORE_URL = '#';

export default function Signup() {
  return (
    <div className="flex items-start justify-center pt-4 sm:pt-8 lg:pt-16 animate-fade-in-up">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {/* Gradient Header */}
          <div className="gradient-hero px-5 sm:px-8 py-6 sm:py-8 text-center relative overflow-hidden">
            <div className="absolute top-4 right-6 w-16 h-16 bg-white/5 rounded-full" />
            <div className="absolute bottom-2 left-8 w-24 h-24 bg-white/5 rounded-full" />
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <img src="/logo.png" alt="PGME" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">Create Your Account</h1>
              <p className="text-white/70 text-xs sm:text-sm">
                Download the PGME app to sign up and get started
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
          {/* Download buttons */}
          <div className="space-y-3 sm:space-y-4">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full !py-3 sm:!py-3.5 justify-center no-underline text-sm sm:text-base"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z" />
              </svg>
              Download for Android
            </a>

            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full !py-3 sm:!py-3.5 justify-center no-underline text-sm sm:text-base !bg-text !text-white hover:!opacity-90"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download for iOS
            </a>
          </div>

          {/* Login link */}
          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium underline">
                Login
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
