import { useSearchParams, Link } from 'react-router-dom';

export default function FormPaymentSuccess() {
  const [params] = useSearchParams();
  const status = params.get('status'); // 'succeeded' or 'failed'
  const amount = params.get('amount');
  const isSuccess = status === 'succeeded';

  return (
    <div className="flex items-start justify-center pt-6 sm:pt-10 lg:pt-20 animate-fade-in-up">
      <div className="w-full max-w-lg text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-6 sm:p-10 lg:p-12">
          {/* Icon */}
          <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 ring-4 ${
            isSuccess ? 'ring-success/15 bg-success/8' : 'ring-red-500/15 bg-red-500/8'
          }`}>
            {isSuccess ? (
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-text mb-2 sm:mb-3">
            {isSuccess ? 'Payment Successful' : 'Payment Failed'}
          </h1>

          <p className="text-sm sm:text-base text-text-secondary mb-6 sm:mb-8">
            {isSuccess
              ? `Your payment of ₹${amount || ''} has been received. Your registration is now confirmed.`
              : 'Your payment could not be processed. Please try again or contact support.'}
          </p>

          {isSuccess && (
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
                    Your registration has been confirmed. We will contact you with further details via WhatsApp or email.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:gap-3.5 max-w-xs mx-auto">
            <Link
              to="/packages"
              className="btn-primary w-full !py-3 sm:!py-3.5 justify-center no-underline text-sm sm:text-base"
            >
              Back to Packages
            </Link>
            <Link
              to="/home"
              className="btn-outline w-full !py-3 sm:!py-3.5 justify-center no-underline text-sm sm:text-base"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
