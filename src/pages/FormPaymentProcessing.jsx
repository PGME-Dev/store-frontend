import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getFormPaymentStatus } from '../api/forms';

const POLL_INTERVAL = 3000; // 3 seconds
const MAX_POLL_DURATION = 60000; // 60 seconds

export default function FormPaymentProcessing() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const submissionId = params.get('submission_id');
  const formTitle = params.get('form_title') || 'Form Registration';
  const outcome = params.get('outcome'); // 'success' | 'failed' | 'cancelled'

  const [status, setStatus] = useState(outcome === 'cancelled' ? 'cancelled' : outcome === 'failed' ? 'failed' : 'processing');
  const [elapsed, setElapsed] = useState(0);
  const pollingRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // Poll for payment status (webhook confirmation)
  useEffect(() => {
    if (!submissionId || status === 'cancelled' || status === 'failed') return;

    const poll = async () => {
      const elapsedMs = Date.now() - startTimeRef.current;
      setElapsed(elapsedMs);

      if (elapsedMs > MAX_POLL_DURATION) {
        stopPolling();
        setStatus('timeout');
        return;
      }

      try {
        const result = await getFormPaymentStatus(submissionId);
        if (result.payment_status === 'paid') {
          stopPolling();
          setStatus('paid');
        }
      } catch {
        // Silent — keep polling
      }
    };

    // Initial check
    poll();
    pollingRef.current = setInterval(poll, POLL_INTERVAL);

    return stopPolling;
  }, [submissionId, status, stopPolling]);

  if (!submissionId) {
    return (
      <div className="flex items-start justify-center pt-6 sm:pt-10 lg:pt-20 animate-fade-in-up">
        <div className="w-full max-w-lg text-center bg-white rounded-2xl shadow-lg border border-border p-6 sm:p-10">
          <h1 className="font-display text-xl font-bold text-text mb-3">Invalid Request</h1>
          <p className="text-sm text-text-secondary mb-6">Missing submission details.</p>
          <Link to="/forms" className="btn-primary inline-flex !py-2.5 !px-6 text-sm no-underline">
            Back to Forms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center pt-6 sm:pt-10 lg:pt-20 animate-fade-in-up">
      <div className="w-full max-w-lg text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-6 sm:p-10 lg:p-12">

          {/* ── Processing (waiting for webhook) ── */}
          {status === 'processing' && (
            <>
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 ring-4 ring-primary/15 bg-primary/8">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-text mb-2 sm:mb-3">
                Confirming Payment
              </h1>
              <p className="text-sm sm:text-base text-text-secondary mb-6">
                We're verifying your payment for <span className="font-medium text-text">{formTitle}</span>.
                This usually takes a few seconds.
              </p>
              <div className="w-full bg-surface-dim rounded-full h-1.5 mb-3 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${Math.min((elapsed / MAX_POLL_DURATION) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-text-tertiary">Please do not close this page</p>
            </>
          )}

          {/* ── Payment Confirmed ── */}
          {status === 'paid' && (
            <>
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 ring-4 ring-success/15 bg-success/8">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-text mb-2 sm:mb-3">
                Payment Successful
              </h1>
              <p className="text-sm sm:text-base text-text-secondary mb-6 sm:mb-8">
                Your registration for <span className="font-medium text-text">{formTitle}</span> is confirmed.
              </p>
              <div className="rounded-lg border-l-3 border-l-primary bg-surface-dim p-4 sm:p-5 mb-6 sm:mb-8 text-left">
                <div className="flex items-start gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5 shrink-0">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-text mb-1">What's Next?</h3>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      We will contact you with further details via WhatsApp or email.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <Link to="/forms" className="btn-primary w-full !py-3 justify-center no-underline text-sm sm:text-base">
                  Back to Forms
                </Link>
                <Link to="/home" className="btn-outline w-full !py-3 justify-center no-underline text-sm sm:text-base">
                  Go Home
                </Link>
              </div>
            </>
          )}

          {/* ── Timeout (webhook not received yet) ── */}
          {status === 'timeout' && (
            <>
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 ring-4 ring-amber-500/15 bg-amber-500/8">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-text mb-2 sm:mb-3">
                Payment Processing
              </h1>
              <p className="text-sm sm:text-base text-text-secondary mb-6">
                Your payment for <span className="font-medium text-text">{formTitle}</span> is still being processed.
                If money was deducted, your registration will be confirmed shortly.
              </p>
              <div className="rounded-lg border-l-3 border-l-amber-500 bg-amber-50 p-4 sm:p-5 mb-6 text-left">
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                  No action needed. You'll see your confirmed registration in <strong>My Submissions</strong> once the payment is verified.
                  If the issue persists for more than 10 minutes, please contact support.
                </p>
              </div>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <button
                  onClick={() => { setStatus('processing'); startTimeRef.current = Date.now(); }}
                  className="btn-primary w-full !py-3 justify-center text-sm sm:text-base border-0 cursor-pointer"
                >
                  Check Again
                </button>
                <Link to="/forms" className="btn-outline w-full !py-3 justify-center no-underline text-sm sm:text-base">
                  Back to Forms
                </Link>
              </div>
            </>
          )}

          {/* ── Payment Cancelled ── */}
          {status === 'cancelled' && (
            <>
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 ring-4 ring-text-secondary/15 bg-text-secondary/8">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-text mb-2 sm:mb-3">
                Payment Cancelled
              </h1>
              <p className="text-sm sm:text-base text-text-secondary mb-6">
                You cancelled the payment. Your form has been saved — you can complete payment anytime.
              </p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <Link to="/forms" className="btn-primary w-full !py-3 justify-center no-underline text-sm sm:text-base">
                  Back to Forms
                </Link>
              </div>
            </>
          )}

          {/* ── Payment Failed ── */}
          {status === 'failed' && (
            <>
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 ring-4 ring-red-500/15 bg-red-500/8">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-text mb-2 sm:mb-3">
                Payment Failed
              </h1>
              <p className="text-sm sm:text-base text-text-secondary mb-6">
                Your payment could not be processed. Please try again or contact support.
              </p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <Link to="/forms" className="btn-primary w-full !py-3 justify-center no-underline text-sm sm:text-base">
                  Back to Forms
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
