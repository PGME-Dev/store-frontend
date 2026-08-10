import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  getPackageById,
  createPackagePaymentSession,
  verifyPackagePayment,
  createComboUpgradeOrder,
  createTierUpgradeOrder,
} from '../api/packages';
import { getEbookById, createEbookPaymentSession, verifyEbookPayment } from '../api/ebooks';
import { getSessionById, createSessionPaymentSession, verifySessionPayment } from '../api/sessions';
import { getWorkshopById, createWorkshopPaymentSession, verifyWorkshopPayment } from '../api/workshops';
import { getFormById, createFormPaymentSession } from '../api/forms';
import { validateCoupon, listVisibleCoupons } from '../api/coupons';
import BillingAddressForm from '../components/BillingAddressForm';
import TermsGateModal from '../components/TermsGateModal';
import RecommendationRail from '../components/RecommendationRail';
import { formatPrice } from '../components/PriceDisplay';

const PURCHASE_TYPE = { packages: 'package', ebooks: 'ebook', sessions: 'session', workshops: 'workshop', forms: 'form' };

export default function Checkout() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tierIndex = location.state?.tierIndex ?? 0;
  // 'combo' = complete-your-set upgrade, 'tier' = longer tier of a package
  // already owned. Both credit the customer's existing purchase(s).
  const upgradeMode = location.state?.upgradeMode || null;
  const upgradeQuote = location.state?.upgradeQuote || null;
  // Form checkout: read from URL search params (survives page reload / bank redirects)
  // Falls back to location.state for backward compat
  const submissionId = searchParams.get('submission_id') || location.state?.submissionId;
  const formTitle = searchParams.get('form_title') || location.state?.formTitle;
  const formPaymentAmount = searchParams.get('payment_amount') || location.state?.paymentAmount;

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
  // [TAX BREAKDOWN CHANGE - 2026-03-24]
  // Added paymentSession state to split checkout into two visible steps:
  // Step 1: Address submit → create session → show tax breakdown with "Proceed to Pay" button
  // Step 2: User reviews breakdown, clicks "Proceed to Pay" → launches Zoho widget
  // Previously the Zoho widget launched immediately after address submit, so the user
  // never got to see the tax breakdown (it appeared for <1 second behind the Zoho modal).
  // To rollback: remove paymentSession state, merge handleProceedToPay back into
  // handleAddressSubmit (launch Zoho right after setTaxInfo), remove the "Proceed to Pay" button JSX.
  const [paymentSession, setPaymentSession] = useState(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount, total }
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [visibleCoupons, setVisibleCoupons] = useState([]);

  // Terms & Conditions acceptance (required before "Proceed to Payment", Step 1)
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

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
        } else if (type === 'workshops') {
          result = await getWorkshopById(id);
          setProduct({ ...(result.workshop || result), _type: 'workshops' });
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

  // Fetch admin-marked-visible coupons for this product, shown as suggestion
  // chips so customers don't need to already know a code.
  useEffect(() => {
    const purchaseType = PURCHASE_TYPE[type];
    if (!purchaseType || (type === 'forms' && !submissionId)) return;
    (async () => {
      try {
        const payload = { purchase_type: purchaseType, product_id: id };
        if (type === 'packages') payload.tier_index = tierIndex;
        const coupons = await listVisibleCoupons(payload);
        setVisibleCoupons(coupons);
      } catch {
        setVisibleCoupons([]);
      }
    })();
  }, [type, id, tierIndex, submissionId]);

  const applyVisibleCoupon = (code) => {
    setCouponInput(code);
    setCouponError('');
    handleApplyCoupon(code);
  };

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

  // [TAX BREAKDOWN CHANGE - 2026-03-24]
  // Split into two functions: handleAddressSubmit (creates session, shows breakdown)
  // and handleProceedToPay (launches Zoho widget). Previously this was a single function
  // that launched Zoho immediately, so the breakdown was never visible to the user.
  // To rollback: merge handleProceedToPay back into handleAddressSubmit (remove the
  // paymentSession state, call launchZohoPayment right after setTaxInfo).
  // Apply a coupon (preview) before create-order. Only sets appliedCoupon when
  // the coupon is valid AND actually beneficial (beats any existing sale price).
  const handleApplyCoupon = async (explicitCode) => {
    const code = (typeof explicitCode === 'string' ? explicitCode : couponInput).trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const payload = { code, purchase_type: PURCHASE_TYPE[type], product_id: id };
      if (type === 'packages') payload.tier_index = tierIndex;
      const res = await validateCoupon(payload);
      if (res.valid && res.beneficial) {
        setAppliedCoupon({ code: res.code, discount: res.coupon_discount, total: res.estimated_total });
        setCouponError('');
      } else {
        setAppliedCoupon(null);
        setCouponError(res.reason || 'This coupon cannot be applied');
      }
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.response?.data?.message || 'Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const handleAddressSubmit = async (billingAddress) => {
    setPaying(true);
    setError('');

    try {
      const couponCode = appliedCoupon?.code || undefined;
      let sessionData;
      if (upgradeMode) {
        // Upgrade flows credit what the customer already paid, so they can
        // come out free — in which case there is no Zoho session at all and
        // the purchase is already complete server-side.
        sessionData =
          upgradeMode === 'combo'
            ? await createComboUpgradeOrder(id, billingAddress, tierIndex, couponCode, termsAccepted)
            : await createTierUpgradeOrder(id, billingAddress, tierIndex, couponCode, termsAccepted);

        if (sessionData?.free_upgrade) {
          navigate('/payment/success', {
            state: {
              purchaseId: sessionData.purchase_id,
              productName: getProductName(),
              type,
              productType: PURCHASE_TYPE[type],
              productId: id,
            },
            replace: true,
          });
          return;
        }
      } else if (type === 'packages') {
        sessionData = await createPackagePaymentSession(id, billingAddress, tierIndex, couponCode);
      } else if (type === 'ebooks') {
        sessionData = await createEbookPaymentSession(id, billingAddress, couponCode);
      } else if (type === 'sessions') {
        sessionData = await createSessionPaymentSession(id, billingAddress, couponCode);
      } else if (type === 'workshops') {
        sessionData = await createWorkshopPaymentSession(id, billingAddress, couponCode);
      } else if (type === 'forms') {
        sessionData = await createFormPaymentSession(id, submissionId, billingAddress, couponCode);
      }

      if (!sessionData?.payment_session_id) {
        throw new Error('Failed to create payment session. Please try again.');
      }

      // Store session so handleProceedToPay can use it later
      setPaymentSession(sessionData);

      // Show the tax breakdown in Order Summary (coupon-aware).
      // GST is charged on the discounted base, so tax = total − (base − discount).
      if (sessionData.base_amount != null && sessionData.amount != null) {
        const discount = sessionData.coupon_discount || 0;
        setTaxInfo({
          base: sessionData.base_amount,
          discount,
          total: sessionData.amount,
          tax: Math.round((sessionData.amount - (sessionData.base_amount - discount)) * 100) / 100,
        });
      }
      // Don't launch Zoho yet — let the user review the breakdown first
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Payment failed';
      setError(msg);
    } finally {
      setPaying(false);
    }
  };

  // Step 2: User has reviewed the tax breakdown and clicks "Proceed to Pay"
  const handleProceedToPay = async () => {
    if (!paymentSession) return;
    setPaying(true);
    setError('');

    try {
      const paymentResult = await launchZohoPayment(
        paymentSession.payment_session_id,
        paymentSession.amount,
      );

      // Forms: webhook is the sole authority for payment confirmation.
      // Navigate to a processing page that polls for webhook completion.
      if (type === 'forms') {
        const processingParams = new URLSearchParams({
          submission_id: submissionId,
          form_title: getProductName(),
          outcome: paymentResult.status === 'success' ? 'success' : paymentResult.status,
        });
        navigate(`/forms/payment-processing?${processingParams.toString()}`, { replace: true });
        return;
      }

      // Non-form products: frontend verification (existing flow)
      if (paymentResult.status === 'success') {
        let verification;
        if (type === 'packages') {
          verification = await verifyPackagePayment(paymentResult.payment_session_id, paymentResult.payment_id, paymentResult.signature, termsAccepted);
        } else if (type === 'ebooks') {
          verification = await verifyEbookPayment(paymentResult.payment_session_id, paymentResult.payment_id, paymentResult.signature, termsAccepted);
        } else if (type === 'sessions') {
          verification = await verifySessionPayment(id, paymentResult.payment_session_id, paymentResult.payment_id, paymentResult.signature, termsAccepted);
        } else if (type === 'workshops') {
          verification = await verifyWorkshopPayment(id, paymentResult.payment_session_id, paymentResult.payment_id, paymentResult.signature, termsAccepted);
        }

        navigate('/payment/success', {
          state: {
            purchaseId: verification.purchase_id,
            productName: getProductName(),
            type,
            // Singular type + product id let the success page ask for
            // recommendations related to what was actually just bought.
            productType: PURCHASE_TYPE[type],
            productId: id,
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

        {/* [TAX BREAKDOWN CHANGE - 2026-03-24]
          * Two-step layout: Step 1 shows billing form + base price sidebar.
          * Step 2 (after address submit) replaces billing form with a review card showing
          * the full tax breakdown + "Proceed to Pay" button, so the user sees exact amounts
          * BEFORE the Zoho widget opens.
          * To rollback: remove the paymentSession ternary, always show the billing form,
          * and launch Zoho directly from handleAddressSubmit.
          */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6 lg:gap-8 2xl:gap-10">
          {/* Left column: Billing form (step 1) OR Review & Pay (step 2) */}
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

            {paymentSession ? (
              /* Step 2: Payment session created — show review card with breakdown + pay button */
              <div className="bg-white rounded-xl shadow-sm border border-border p-5 sm:p-6 lg:p-8 animate-fade-in-up">
                <h3 className="text-base sm:text-lg font-bold text-text mb-5 sm:mb-6">Review & Pay</h3>

                {/* Item details */}
                <div className="flex items-start gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-border">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary sm:w-6 sm:h-6">
                      {type === 'ebooks' ? (
                        <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>
                      ) : type === 'sessions' || type === 'workshops' ? (
                        <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>
                      ) : (
                        <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>
                      )}
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-text truncate">{getProductName()}</p>
                    <p className="text-xs sm:text-sm text-text-tertiary mt-0.5 capitalize">
                      {type === 'ebooks'
                        ? 'E-Book'
                        : type === 'sessions'
                          ? 'Live Session'
                          : type === 'workshops'
                            ? `Workshop · ${product?.day_count || 0} days`
                            : type === 'forms'
                              ? 'Registration'
                              : 'Package'}
                    </p>
                  </div>
                </div>

                {/* Price breakdown */}
                {taxInfo && (
                  <div className="mt-4 sm:mt-5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Subtotal</span>
                      <span className="text-sm text-text">{formatPrice(taxInfo.base)}</span>
                    </div>
                    {taxInfo.discount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-success">Discount{appliedCoupon ? ` (${appliedCoupon.code})` : ''}</span>
                        <span className="text-sm text-success">−{formatPrice(taxInfo.discount)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">GST (18%)</span>
                      <span className="text-sm text-text">{formatPrice(taxInfo.tax)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-dashed border-border">
                      <span className="text-base sm:text-lg font-bold text-text">Total</span>
                      <span className="text-base sm:text-lg font-bold text-primary">{formatPrice(taxInfo.total)}</span>
                    </div>
                  </div>
                )}

                {/* Proceed to Pay button — Terms already accepted on Step 1 */}
                <button
                  onClick={handleProceedToPay}
                  disabled={paying}
                  className="w-full mt-6 sm:mt-8 btn-primary py-3 sm:py-3.5 text-sm sm:text-base font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {paying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Proceed to Pay {taxInfo ? formatPrice(taxInfo.total) : ''}
                    </>
                  )}
                </button>

                {/* Change address link */}
                <button
                  onClick={() => { setPaymentSession(null); setTaxInfo(null); }}
                  disabled={paying}
                  className="w-full mt-3 text-xs sm:text-sm text-text-tertiary hover:text-primary transition-colors disabled:opacity-40"
                >
                  Change billing address
                </button>
              </div>
            ) : (
              /* Step 1: Billing address form */
              <div className="bg-white rounded-xl shadow-sm border border-border p-5 sm:p-6 lg:p-8">
                <BillingAddressForm
                  onSubmit={handleAddressSubmit}
                  loading={paying}
                  termsAccepted={termsAccepted}
                  onOpenTerms={() => setShowTermsModal(true)}
                />
              </div>
            )}
          </div>

          <TermsGateModal
            open={showTermsModal}
            onClose={() => setShowTermsModal(false)}
            onAgree={() => { setTermsAccepted(true); setShowTermsModal(false); }}
          />

          {/* Order summary sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-border p-5 sm:p-6 lg:p-7 lg:sticky lg:top-24">
              <h3 className="text-sm sm:text-base font-bold text-text mb-4 sm:mb-5">Order Summary</h3>

              {/* [TAX BREAKDOWN CHANGE - 2026-03-24]
                * Order Summary sidebar now reflects two states:
                * Before address submit: base price + GST disclaimer
                * After address submit: full breakdown (base + GST = total)
                * To rollback: revert to the old static disclaimer markup (see comments in state declarations above)
                */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3 py-3 sm:py-3.5 border-b border-border">
                  <span className="text-xs sm:text-sm text-text-secondary leading-snug">{getProductName()}</span>
                  <span className="text-sm sm:text-base font-bold text-primary whitespace-nowrap">
                    {formatPrice(upgradeQuote ? upgradeQuote.combo?.price ?? getDisplayPrice() : getDisplayPrice())}
                  </span>
                </div>

                {/* Upgrade credit — make it obvious why the price dropped */}
                {upgradeQuote && !taxInfo && (
                  <div className="py-2 border-b border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-success">Credit for what you own</span>
                      <span className="text-xs sm:text-sm text-success">−{formatPrice(upgradeQuote.credit)}</span>
                    </div>
                    {(upgradeQuote.credit_breakdown || []).map((c) => (
                      <p key={c.purchase_id} className="text-[11px] text-text-tertiary pl-1">
                        {c.package_name} · {formatPrice(c.credit)}
                      </p>
                    ))}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs sm:text-sm font-semibold text-text">You pay</span>
                      <span className="text-xs sm:text-sm font-bold text-primary">
                        {formatPrice(upgradeQuote.upgrade_base_price)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Coupon input (step 1 — before the payment session is created) */}
                {!paymentSession && (
                  <div className="py-3 border-b border-border">
                    {!appliedCoupon && visibleCoupons.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {visibleCoupons.map((c) => (
                          <div
                            key={c.code}
                            className="relative flex items-center gap-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2.5 overflow-hidden"
                          >
                            {/* Ticket notches */}
                            <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border border-dashed border-primary/40" />
                            <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border border-dashed border-primary/40" />

                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
                              <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2.59 12.58V2.58h10z"/>
                              <line x1="7" y1="7" x2="7.01" y2="7"/>
                            </svg>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-baseline gap-x-1.5">
                                <span className="text-xs font-mono font-bold text-primary tracking-wide break-all">{c.code}</span>
                                <span className="text-[11px] font-semibold text-success whitespace-nowrap">
                                  {c.discount_type === 'percentage' ? `${c.discount_value}% off` : `₹${c.discount_value} off`}
                                </span>
                              </div>
                              {c.description && (
                                <p className="text-[11px] text-text-tertiary truncate">{c.description}</p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => applyVisibleCoupon(c.code)}
                              disabled={couponLoading}
                              className="text-xs font-semibold text-primary border border-primary rounded-full px-3 py-1.5 hover:bg-primary hover:text-white transition-colors disabled:opacity-50 shrink-0"
                            >
                              {couponLoading ? '...' : 'Apply'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {appliedCoupon ? (
                      <div className="relative flex items-center gap-3 rounded-lg border border-success/30 bg-success/5 px-3 py-2.5 overflow-hidden">
                        <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border border-success/30" />
                        <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border border-success/30" />

                        <div className="w-7 h-7 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-1.5">
                            <span className="text-xs font-mono font-bold text-success tracking-wide break-all">{appliedCoupon.code}</span>
                            <span className="text-[11px] font-semibold text-success/80">applied</span>
                          </div>
                          <p className="text-[11px] text-text-tertiary">You saved {formatPrice(appliedCoupon.discount)}</p>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          aria-label="Remove coupon"
                          className="w-6 h-6 rounded-full flex items-center justify-center text-text-tertiary hover:text-error hover:bg-error/10 transition-colors shrink-0"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } }}
                          placeholder="Coupon code"
                          className="flex-1 min-w-0 px-3 py-2 text-xs uppercase border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponInput.trim()}
                          className="px-3.5 py-2 text-xs font-semibold text-primary border border-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/5 transition-colors shrink-0"
                        >
                          {couponLoading ? '...' : 'Apply'}
                        </button>
                      </div>
                    )}
                    {couponError && <p className="text-[11px] text-error mt-1.5">{couponError}</p>}
                  </div>
                )}

                {taxInfo ? (
                  <>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs sm:text-sm text-text-tertiary">Base Price</span>
                      <span className="text-xs sm:text-sm text-text-secondary">{formatPrice(taxInfo.base)}</span>
                    </div>
                    {taxInfo.discount > 0 && (
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-xs sm:text-sm text-success">Discount{appliedCoupon ? ` (${appliedCoupon.code})` : ''}</span>
                        <span className="text-xs sm:text-sm text-success">−{formatPrice(taxInfo.discount)}</span>
                      </div>
                    )}
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

        {/* Placed below the fold, after the pay action — a rail here navigates
            away, so it must not compete with completing the purchase. */}
        <RecommendationRail
          context="product_detail"
          productType={PURCHASE_TYPE[type]}
          productId={id}
          className="mt-5 sm:mt-6"
        />
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
