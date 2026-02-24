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
    if (product._type === 'ebooks') return product.actual_price || product.price;
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
      // Step 1: Create payment session
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

      // Step 2: Launch Zoho payment
      const paymentResult = await launchZohoPayment(paymentSessionId, amount);

      if (paymentResult.status === 'success') {
        // Step 3: Verify payment
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
      // cancelled: do nothing, user stays on checkout
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
    <div>
      <h1 className="text-xl font-bold text-text mb-4">Checkout</h1>

      {/* Order summary */}
      <div className="bg-surface rounded-xl border border-border p-4 mb-4">
        <h3 className="text-sm font-semibold text-text mb-2">Order Summary</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">{getProductName()}</span>
          <span className="text-base font-bold text-text">{formatPrice(getDisplayPrice())}</span>
        </div>
        <p className="text-xs text-text-secondary mt-2">
          * GST (18%) will be added at payment
        </p>
      </div>

      {error && (
        <div className="bg-error/10 text-error text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Billing address form */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <BillingAddressForm onSubmit={handleAddressSubmit} loading={paying} />
      </div>
    </div>
  );
}

/**
 * Launch Zoho Payments SDK in the browser
 */
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
