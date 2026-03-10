import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { usePurchase } from '../context/PurchaseContext';

// Detect if the user is on a mobile device (iOS or Android)
function isMobileDevice() {
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}

// Deep link that opens the PGME app's success screen.
// Format: pgme://host/path — uri.path = '/success', matched by GoRouter.
const APP_DEEP_LINK = 'pgme://app/success';

export default function PaymentSuccess() {
  const location = useLocation();
  const { refreshPurchases } = usePurchase();
  const { purchaseId, productName, type } = location.state || {};
  const onMobile = isMobileDevice();

  useEffect(() => {
    refreshPurchases();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-start justify-center pt-4 sm:pt-8 lg:pt-16 animate-fade-in-up">
      <div className="w-full max-w-lg text-center">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-5 sm:p-8 lg:p-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-success/8 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="font-display text-xl sm:text-2xl font-bold text-text mb-1.5 sm:mb-2">Purchase Successful</h1>
          <p className="text-xs sm:text-sm text-text-secondary mb-1">
            {productName ? `You now have access to "${productName}"` : 'Your purchase is complete'}
          </p>
          {purchaseId && (
            <p className="text-[11px] sm:text-xs text-text-secondary mb-4 sm:mb-6">
              Purchase ID: {purchaseId}
            </p>
          )}

          <div className="bg-surface-dim rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-left">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-text mb-0.5 sm:mb-1">What's Next?</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {onMobile
                    ? 'Tap "Open in App" below to return to the PGME app and access your purchased content.'
                    : 'Open the PGME app on your device to access your purchased content. Your purchase is already linked to your account.'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {onMobile && (
              <a
                href={APP_DEEP_LINK}
                className="btn-primary w-full !py-3 sm:!py-3.5 justify-center no-underline text-sm sm:text-base"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Open in App
              </a>
            )}
            <Link
              to="/my-purchases"
              className="btn-secondary w-full !py-3 sm:!py-3.5 justify-center no-underline text-sm sm:text-base"
            >
              View My Purchases
            </Link>
            <Link
              to="/"
              className="btn-outline w-full !py-3 sm:!py-3.5 justify-center no-underline text-sm sm:text-base"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
