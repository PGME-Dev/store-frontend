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
    <div className="flex items-start justify-center pt-6 sm:pt-10 lg:pt-20 animate-fade-in-up">
      <div className="w-full max-w-lg text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-6 sm:p-10 lg:p-12">
          {/* Success icon with ring */}
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 ring-4 ring-success/15 bg-success/8">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-text mb-2 sm:mb-3">Purchase Successful</h1>
          <p className="text-sm sm:text-base text-text-secondary mb-1.5">
            {productName ? `You now have access to "${productName}"` : 'Your purchase is complete'}
          </p>
          {purchaseId && (
            <p className="text-[11px] sm:text-xs text-text-tertiary mb-5 sm:mb-8">
              Purchase ID: {purchaseId}
            </p>
          )}

          {/* What's Next box with left accent border */}
          <div className="rounded-lg border-l-3 border-l-primary bg-surface-dim p-4 sm:p-5 mb-6 sm:mb-8 text-left">
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-text mb-1 sm:mb-1.5">What's Next?</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {onMobile
                    ? 'Tap "Open in App" below to return to the PGME app and access your purchased content.'
                    : 'Open the PGME app on your device to access your purchased content. Your purchase is already linked to your account.'}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons with consistent widths */}
          <div className="flex flex-col gap-3 sm:gap-3.5 max-w-xs mx-auto">
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
              to="/home"
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
