import { useLocation, Link } from 'react-router-dom';

export default function PaymentSuccess() {
  const location = useLocation();
  const { purchaseId, productName, type } = location.state || {};

  return (
    <div className="text-center pt-12">
      <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-text mb-2">Purchase Successful!</h1>
      <p className="text-text-secondary mb-1">
        {productName ? `You now have access to "${productName}"` : 'Your purchase is complete'}
      </p>
      {purchaseId && (
        <p className="text-xs text-text-secondary mb-6">
          Purchase ID: {purchaseId}
        </p>
      )}

      <div className="bg-surface rounded-xl border border-border p-4 mb-6 text-left">
        <h3 className="text-sm font-semibold text-text mb-2">What's Next?</h3>
        <p className="text-sm text-text-secondary">
          Open the PGME app on your device to access your purchased content.
          Your purchase is already linked to your account.
        </p>
      </div>

      <div className="space-y-3">
        <Link
          to="/my-purchases"
          className="block w-full py-3 bg-primary text-white font-semibold rounded-xl text-center no-underline hover:bg-primary-dark transition-colors"
        >
          View My Purchases
        </Link>
        <Link
          to="/"
          className="block w-full py-3 bg-surface border border-border text-text font-medium rounded-xl text-center no-underline hover:bg-surface-dim transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
