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
    <div>
      <h1 className="text-xl font-bold text-text mb-4">My Purchases</h1>

      {isEmpty ? (
        <div className="text-center py-12">
          <p className="text-text-secondary mb-4">No purchases yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Package Subscriptions */}
          {packages.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
                Packages
              </h2>
              <div className="space-y-2">
                {packages.map((p) => (
                  <div key={p.purchase_id || p._id} className="bg-surface rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-text">
                          {p.package_id?.name || 'Package'}
                        </h3>
                        {p.tier_name && (
                          <span className="text-xs text-text-secondary">{p.tier_name}</span>
                        )}
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        p.is_active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      }`}>
                        {p.is_active ? 'Active' : 'Expired'}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-text-secondary flex gap-4">
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
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
                eBooks
              </h2>
              <div className="space-y-2">
                {ebooks.map((e) => (
                  <div key={e.purchase_id || e._id} className="bg-surface rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-base font-semibold text-text">
                        {e.book_id?.title || 'eBook'}
                      </h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
                        Purchased
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-text-secondary flex gap-4">
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
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">
                Live Sessions
              </h2>
              <div className="space-y-2">
                {sessions.map((s) => (
                  <div key={s.purchase_id || s._id} className="bg-surface rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-base font-semibold text-text">
                        {s.session_id?.title || 'Session'}
                      </h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
                        Purchased
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-text-secondary flex gap-4">
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
  );
}
