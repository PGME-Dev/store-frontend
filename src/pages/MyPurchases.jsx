import { useState, useEffect } from 'react';
import { getAllPurchases } from '../api/purchases';
import { formatPrice } from '../components/PriceDisplay';

export default function MyPurchases() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const result = await getAllPurchases();
        setData(result);
      } catch {
        setError('Failed to load purchases');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-error">{error}</div>;
  }

  const packages = data?.packages || [];
  const sessions = data?.session_purchases || [];
  const ebooks = data?.ebook_purchases || [];

  const isEmpty = packages.length === 0 && sessions.length === 0 && ebooks.length === 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

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
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text">My Purchases</h1>
        </div>

        {isEmpty ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl border border-border">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-surface-dim rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-secondary">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <p className="text-text-secondary text-sm mb-1">No purchases yet</p>
            <p className="text-xs sm:text-sm text-text-secondary">Browse our catalog to get started</p>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-8">
            {/* Package Subscriptions */}
            {packages.length > 0 && (
              <section>
                <h2 className="text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2.5 sm:mb-3">
                  Packages
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                  {packages.map((p) => (
                    <div key={p.purchase_id || p._id} className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-semibold text-text truncate">
                            {p.package_id?.name || 'Package'}
                          </h3>
                          {p.tier_name && (
                            <span className="text-[11px] sm:text-xs text-text-secondary">{p.tier_name}</span>
                          )}
                        </div>
                        <span className={`text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0 ${
                          p.is_active ? 'bg-success/8 text-success' : 'bg-error/8 text-error'
                        }`}>
                          {p.is_active ? 'Active' : 'Expired'}
                        </span>
                      </div>
                      <div className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs text-text-secondary flex flex-wrap gap-3 sm:gap-4">
                        <span>{formatPrice(p.amount_paid)}</span>
                        {p.expires_at && <span>Expires: {formatDate(p.expires_at)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Ebooks */}
            {ebooks.length > 0 && (
              <section>
                <h2 className="text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2.5 sm:mb-3">
                  eBooks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                  {ebooks.map((e) => (
                    <div key={e.purchase_id || e._id} className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-text truncate min-w-0">
                          {e.book_id?.title || 'eBook'}
                        </h3>
                        <span className="text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-success/8 text-success shrink-0">
                          Purchased
                        </span>
                      </div>
                      <div className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs text-text-secondary flex flex-wrap gap-3 sm:gap-4">
                        <span>{formatPrice(e.amount_paid)}</span>
                        <span>{formatDate(e.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Sessions */}
            {sessions.length > 0 && (
              <section>
                <h2 className="text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2.5 sm:mb-3">
                  Live Sessions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                  {sessions.map((s) => (
                    <div key={s.purchase_id || s._id} className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-text truncate min-w-0">
                          {s.session_id?.title || 'Session'}
                        </h3>
                        <span className="text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-success/8 text-success shrink-0">
                          Purchased
                        </span>
                      </div>
                      <div className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs text-text-secondary flex flex-wrap gap-3 sm:gap-4">
                        <span>{formatPrice(s.amount_paid)}</span>
                        <span>{formatDate(s.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
