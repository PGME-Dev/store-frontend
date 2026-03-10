import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPackageById, createPackagePaymentSession, verifyPackagePayment } from '../api/packages';
import { getEbookById, createEbookPaymentSession, verifyEbookPayment } from '../api/ebooks';
import { getSessionById, createSessionPaymentSession, verifySessionPayment } from '../api/sessions';
import BillingAddressForm from '../components/BillingAddressForm';
import { formatPrice } from '../components/PriceDisplay';

export default function Checkout() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tierIndex = location.state?.tierIndex ?? 0;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        let result;
        if (type === 'packages') {
          result = await getPackageById(id);
          setProduct({ ...(result.package || result), _type: 'packages' });
        } else if (type === 'ebooks') {
          result = await getEbookById(id);
          setProduct({ ...(result.book || result), _type: 'ebooks' });
        } else if (type === 'sessions') {
          result = await getSessionById(id);
          setProduct({ ...(result.session || result), _type: 'sessions' });
        }
      } catch {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    })();
  }, [type, id]);

  const getDisplayPrice = () => {
    if (!product) return 0;
    if (product._type === 'packages') {
      const hasTiers = product.has_tiers && product.tiers?.length > 0;
      if (hasTiers) return product.tiers[tierIndex]?.effective_price || product.tiers[tierIndex]?.price;
      return product.sale_price || product.price;
    }
    if (product._type === 'ebooks') return product.effective_price || product.price;
    return product.price;
  };

  const getProductName = () => {
    if (!product) return '';
    if (product._type === 'packages') return product.name;
    if (product._type === 'ebooks') return product.title;
    return product.title;
  };

  const handleAddressSubmit = async (billingAddress) => {
    setPaying(true);
    setError('');

    try {
      let sessionData;
      if (type === 'packages') {
        sessionData = await createPackagePaymentSession(id, billingAddress, tierIndex);
      } else if (type === 'ebooks') {
        sessionData = await createEbookPaymentSession(id, billingAddress);
      } else if (type === 'sessions') {
        sessionData = await createSessionPaymentSession(id, billingAddress);
      }

      const paymentSessionId = sessionData.payment_session_id;
      const amount = sessionData.amount;

      const paymentResult = await launchZohoPayment(paymentSessionId, amount);

      if (paymentResult.status === 'success') {
        let verification;
        if (type === 'packages') {
          verification = await verifyPackagePayment(paymentResult.payment_session_id, paymentResult.payment_id, paymentResult.signature);
        } else if (type === 'ebooks') {
          verification = await verifyEbookPayment(paymentResult.payment_session_id, paymentResult.payment_id, paymentResult.signature);
        } else if (type === 'sessions') {
          verification = await verifySessionPayment(id, paymentResult.payment_session_id, paymentResult.payment_id, paymentResult.signature);
        }

        navigate('/payment/success', {
          state: {
            purchaseId: verification.purchase_id,
            productName: getProductName(),
            type,
          },
          replace: true,
        });
      } else if (paymentResult.status === 'failed') {
        setError(`Payment failed: ${paymentResult.error_message || 'Please try again'}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Payment failed';
      setError(msg);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !product) {
    return <div className="text-center py-12 text-error">{error}</div>;
  }

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-8">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/6 rounded-xl flex items-center justify-center text-primary shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-text">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {/* Billing Address Form */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-error/8 text-error text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-3 sm:mb-4 flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5 lg:p-6">
              <BillingAddressForm onSubmit={handleAddressSubmit} loading={paying} />
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5 lg:p-6 lg:sticky lg:top-24">
              <h3 className="text-sm font-semibold text-text mb-3 sm:mb-4">Order Summary</h3>
              <div className="flex items-center justify-between py-2.5 sm:py-3 border-b border-border">
                <span className="text-xs sm:text-sm text-text-secondary">{getProductName()}</span>
                <span className="text-sm sm:text-base font-bold text-text">{formatPrice(getDisplayPrice())}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-text-secondary mt-2.5 sm:mt-3">
                * GST (18%) will be added at payment
              </p>
              <div className="flex items-center gap-2 mt-3 sm:mt-4 p-2.5 sm:p-3 bg-surface-dim rounded-xl">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success shrink-0">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span className="text-[11px] sm:text-xs text-text-secondary">Secure payment powered by Zoho</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function launchZohoPayment(paymentSessionId, amount) {
  return new Promise((resolve) => {
    try {
      const zpay = new window.ZPayments({
        account_id: import.meta.env.VITE_ZOHO_ACCOUNT_ID,
        domain: 'IN',
        otherOptions: {
          api_key: import.meta.env.VITE_ZOHO_API_KEY,
        },
      });

      zpay.requestPaymentMethod({
        payments_session_id: paymentSessionId,
        amount: String(amount),
        currency_code: 'INR',
        transaction_type: 'payment',
      }).then((data) => {
        if (data && data.payment_id) {
          resolve({
            status: 'success',
            payment_id: data.payment_id,
            payment_session_id: data.payment_session_id || paymentSessionId,
            signature: data.signature || null,
          });
        } else {
          resolve({ status: 'cancelled' });
        }
      }).catch((err) => {
        if (err?.code === 'PAYMENT_CANCELLED' || err?.message?.includes('cancel')) {
          resolve({ status: 'cancelled' });
        } else {
          resolve({
            status: 'failed',
            error_message: err?.message || 'Payment failed',
          });
        }
      });
    } catch (err) {
      resolve({
        status: 'failed',
        error_message: 'Failed to initialize payment. Please try again.',
      });
    }
  });
}
