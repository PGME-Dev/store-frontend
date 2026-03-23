import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPackageById, createPackagePaymentSession, verifyPackagePayment } from '../api/packages';
import { getEbookById, createEbookPaymentSession, verifyEbookPayment } from '../api/ebooks';
import { getSessionById, createSessionPaymentSession, verifySessionPayment } from '../api/sessions';
import { getFormById, createFormPaymentSession, verifyFormPayment } from '../api/forms';
import BillingAddressForm from '../components/BillingAddressForm';
import { formatPrice } from '../components/PriceDisplay';

export default function Checkout() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tierIndex = location.state?.tierIndex ?? 0;
  // Form checkout passes submission details via navigation state
  const submissionId = location.state?.submissionId;
  const formTitle = location.state?.formTitle;
  const formPaymentAmount = location.state?.paymentAmount;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  // [TAX BREAKDOWN CHANGE - 2026-03-23]
  // Added taxInfo state to store the base_amount and total (amount) returned by
  // the create-order API. Previously only showed "* GST (18%) will be added at payment"
  // as a disclaimer, causing confusion when users saw a higher amount on the Zoho widget.
  // Now we show an actual breakdown (base + GST = total) after address submission.
  // To rollback: remove taxInfo state, remove the setTaxInfo call in handleAddressSubmit,
  // and revert the Order Summary JSX to the old static disclaimer.
  const [taxInfo, setTaxInfo] = useState(null);

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
        } else if (type === 'forms') {
          // Form checkout requires submissionId (passed via navigation state from FormModal)
          if (!submissionId) {
            setError('Missing submission details. Please fill the form again.');
            setLoading(false);
            return;
          }
          // Fetch form details from API (survives page refresh)
          const form = await getFormById(id);
          if (form) {
            setProduct({
              _type: 'forms',
              title: form.title || 'Form Registration',
              price: form.payment_amount || formPaymentAmount || 0,
            });
          } else {
            setError('Form not found');
          }
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
    if (product._type === 'forms') return product.price;
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
      } else if (type === 'forms') {
        sessionData = await createFormPaymentSession(id, submissionId, billingAddress);
      }

      if (!sessionData?.payment_session_id) {
        throw new Error('Failed to create payment session. Please try again.');
      }

      const paymentSessionId = sessionData.payment_session_id;
      const amount = sessionData.amount;

      // [TAX BREAKDOWN] Capture base_amount and total from the create-order response
      // so we can show the GST breakdown in the order summary while Zoho widget is open.
      if (sessionData.base_amount != null && sessionData.amount != null) {
        setTaxInfo({
          base: sessionData.base_amount,
          total: sessionData.amount,
          tax: Math.round((sessionData.amount - sessionData.base_amount) * 100) / 100,
        });
      }

      const paymentResult = await launchZohoPayment(paymentSessionId, amount);

      if (paymentResult.status === 'success') {
        let verification;
        if (type === 'packages') {
          verification = await verifyPackagePayment(paymentResult.payment_session_id, paymentResult.payment_id, paymentResult.signature);
        } else if (type === 'ebooks') {
          verification = await verifyEbookPayment(paymentResult.payment_session_id, paymentResult.payment_id, paymentResult.signature);
        } else if (type === 'sessions') {
          verification = await verifySessionPayment(id, paymentResult.payment_session_id, paymentResult.payment_id, paymentResult.signature);
        } else if (type === 'forms') {
          verification = await verifyFormPayment(paymentResult.payment_session_id, paymentResult.payment_id, paymentResult.signature);
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
      } else if (paymentResult.status === 'cancelled') {
        // User closed the payment dialog — reset silently, finally block handles setPaying
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
        {/* Page header with left accent border */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
          <div className="w-1 sm:w-1.5 h-8 sm:h-10 bg-primary rounded-full" />
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-text">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6 lg:gap-8 2xl:gap-10">
          {/* Billing Address Form */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-error/6 text-error text-xs sm:text-sm px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg mb-4 sm:mb-5 flex items-start gap-2.5 border border-error/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span>{error}</span>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-sm border border-border p-5 sm:p-6 lg:p-8">
              <BillingAddressForm onSubmit={handleAddressSubmit} loading={paying} />
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-border p-5 sm:p-6 lg:p-7 lg:sticky lg:top-24">
              <h3 className="text-sm sm:text-base font-bold text-text mb-4 sm:mb-5">Order Summary</h3>

              {/* [TAX BREAKDOWN CHANGE - 2026-03-23]
                * Previously showed only the base price and a disclaimer "* GST (18%) will be added at payment".
                * Now, once the payment session is created (after address submit), we show a proper breakdown:
                * base price + GST (18%) = total. Before address submission, we still show the base price
                * with the disclaimer since we don't know the exact tax amount yet (Zoho calculates it).
                * To rollback: replace this entire block with the old static markup:
                *   <div className="space-y-3">
                *     <div className="flex items-start justify-between gap-3 py-3 sm:py-3.5 border-b border-border">
                *       <span className="text-xs sm:text-sm text-text-secondary leading-snug">{getProductName()}</span>
                *       <span className="text-sm sm:text-base font-bold text-primary whitespace-nowrap">{formatPrice(getDisplayPrice())}</span>
                *     </div>
                *   </div>
                *   <p className="text-[11px] sm:text-xs text-text-tertiary mt-3 sm:mt-4">
                *     * GST (18%) will be added at payment
                *   </p>
                */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3 py-3 sm:py-3.5 border-b border-border">
                  <span className="text-xs sm:text-sm text-text-secondary leading-snug">{getProductName()}</span>
                  <span className="text-sm sm:text-base font-bold text-primary whitespace-nowrap">{formatPrice(getDisplayPrice())}</span>
                </div>

                {taxInfo ? (
                  <>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs sm:text-sm text-text-tertiary">Base Price</span>
                      <span className="text-xs sm:text-sm text-text-secondary">{formatPrice(taxInfo.base)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs sm:text-sm text-text-tertiary">GST (18%)</span>
                      <span className="text-xs sm:text-sm text-text-secondary">{formatPrice(taxInfo.tax)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 sm:py-2.5 border-t border-dashed border-border">
                      <span className="text-sm sm:text-base font-bold text-text">Total</span>
                      <span className="text-sm sm:text-base font-bold text-primary">{formatPrice(taxInfo.total)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-[11px] sm:text-xs text-text-tertiary mt-1">
                    * GST (18%) will be added at payment
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2.5 mt-4 sm:mt-5 p-3 sm:p-3.5 bg-surface-dim rounded-lg">
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

async function launchZohoPayment(paymentSessionId, amount) {
  let zpay;
  try {
    zpay = new window.ZPayments({
      account_id: import.meta.env.VITE_ZOHO_ACCOUNT_ID,
      domain: 'IN',
      otherOptions: {
        api_key: import.meta.env.VITE_ZOHO_API_KEY,
      },
    });

    const data = await zpay.requestPaymentMethod({
      payments_session_id: paymentSessionId,
      amount: String(amount),
      currency_code: 'INR',
    });

    if (data && data.payment_id) {
      return {
        status: 'success',
        payment_id: data.payment_id,
        payment_session_id: data.payment_session_id || paymentSessionId,
        signature: data.signature || null,
      };
    }
    return { status: 'cancelled' };
  } catch (err) {
    if (err?.code === 'widget_closed') {
      return { status: 'cancelled' };
    }
    return {
      status: 'failed',
      error_message: err?.message || 'Payment failed',
    };
  } finally {
    try {
      if (zpay) await zpay.close();
    } catch {
      // Widget may already be closed
    }
  }
}
