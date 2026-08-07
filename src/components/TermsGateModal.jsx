import { useEffect, useRef, useState } from 'react';
import TermsAndConditionsContent from './TermsAndConditionsContent';

// Forced-read gate: "I Agree" stays disabled until the user has scrolled the
// terms body to (near) the bottom, so agreement requires actually reaching
// the end of the document rather than a blind checkbox click.
export default function TermsGateModal({ open, onClose, onAgree }) {
  const [reachedBottom, setReachedBottom] = useState(false);
  const scrollRef = useRef(null);

  // On a tall viewport the content may already fit without any scrolling —
  // don't leave "I Agree" permanently stuck in that case.
  useEffect(() => {
    if (!open || reachedBottom) return;
    const el = scrollRef.current;
    if (el && el.scrollHeight <= el.clientHeight + 24) {
      setReachedBottom(true);
    }
  }, [open, reachedBottom]);

  if (!open) return null;

  const handleScroll = (e) => {
    if (reachedBottom) return;
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 24) {
      setReachedBottom(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-xl shadow-xl flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-text">Terms &amp; Conditions</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-tertiary hover:text-text transition-colors p-1 -mr-1"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto px-5 sm:px-6 py-5 flex-1"
        >
          <TermsAndConditionsContent />
        </div>

        <div className="px-5 sm:px-6 py-4 border-t border-border shrink-0 space-y-2.5">
          {!reachedBottom && (
            <p className="text-[11px] sm:text-xs text-text-tertiary text-center">
              Scroll to the bottom to continue
            </p>
          )}
          <button
            type="button"
            onClick={onAgree}
            disabled={!reachedBottom}
            className="w-full btn-primary py-3 text-sm sm:text-base font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {reachedBottom ? 'I Agree' : 'Keep reading…'}
          </button>
        </div>
      </div>
    </div>
  );
}
