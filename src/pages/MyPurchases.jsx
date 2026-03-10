import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllPurchases, downloadInvoicePdf } from '../api/purchases';
import { formatPrice } from '../components/PriceDisplay';

function InvoiceButton({ invoiceId, invoiceNumber }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!invoiceId || downloading) return;
    setDownloading(true);
    try {
      const blob = await downloadInvoicePdf(invoiceId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber || 'invoice'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer bg-primary/5 hover:bg-primary/10 border-0 px-2.5 py-1.5 rounded-lg disabled:opacity-50"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      {downloading ? 'Downloading...' : 'Invoice'}
    </button>
  );
}

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

  // Build purchase_id -> invoice_id map from invoices array
  const invoiceMap = useMemo(() => {
    const map = {};
    (data?.invoices || []).forEach((inv) => {
      if (inv.purchase_id && inv.payment_status === 'paid') {
        map[inv.purchase_id] = { invoice_id: inv.invoice_id, invoice_number: inv.invoice_number };
      }
    });
    return map;
  }, [data]);

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
  const sessions = data?.live_sessions || [];
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
        {/* Page header with left accent border */}
        <div className="mb-6 sm:mb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Account</p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text tracking-tight">My Purchases</h1>
          <p className="text-sm text-text-secondary mt-2">View and manage your purchased content</p>
        </div>

        {isEmpty ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-xl shadow-sm border border-border">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-dim rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <p className="text-text font-semibold text-base sm:text-lg mb-1.5">No purchases yet</p>
            <p className="text-sm sm:text-base text-text-secondary mb-6">Browse our catalog to find what you need</p>
            <Link
              to="/home"
              className="btn-primary inline-flex !py-2.5 !px-6 text-sm sm:text-base no-underline"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-10">
            {/* Package Subscriptions */}
            {packages.length > 0 && (
              <section>
                <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <h2 className="text-xs sm:text-sm font-bold text-text uppercase tracking-wide flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                    Packages
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {packages.map((p) => {
                    const inv = invoiceMap[p.purchase_id];
                    return (
                      <div key={p.purchase_id} className="bg-white rounded-xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-sm sm:text-base font-semibold text-text truncate">
                              {p.name || 'Package'}
                            </h3>
                            {p.tier_name && (
                              <span className="text-[11px] sm:text-xs text-text-secondary mt-0.5 block">{p.tier_name}</span>
                            )}
                            {p.package_type && !p.tier_name && (
                              <span className="text-[11px] sm:text-xs text-text-secondary mt-0.5 block">{p.package_type}</span>
                            )}
                          </div>
                          <span className={`text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shrink-0 ${
                            p.is_active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                          }`}>
                            {p.is_active ? 'Active' : 'Expired'}
                          </span>
                        </div>
                        <div className="mt-3 sm:mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                          <div className="text-[11px] sm:text-xs text-text-secondary flex flex-wrap gap-3 sm:gap-4">
                            {/* <span className="font-medium text-text">{formatPrice(p.amount_paid)}</span> */}
                            {p.expires_at && <span>Expires: {formatDate(p.expires_at)}</span>}
                            {p.purchased_at && <span>Purchased: {formatDate(p.purchased_at)}</span>}
                          </div>
                          {inv && (
                            <InvoiceButton invoiceId={inv.invoice_id} invoiceNumber={inv.invoice_number} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* eBooks */}
            {ebooks.length > 0 && (
              <section>
                <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <h2 className="text-xs sm:text-sm font-bold text-text uppercase tracking-wide flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    eBooks
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {ebooks.map((e) => {
                    const inv = invoiceMap[e.purchase_id];
                    return (
                      <div key={e.purchase_id} className="bg-white rounded-xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-sm sm:text-base font-semibold text-text truncate">
                              {e.name || 'eBook'}
                            </h3>
                            {e.author && (
                              <span className="text-[11px] sm:text-xs text-text-secondary mt-0.5 block">{e.author}</span>
                            )}
                          </div>
                          <span className="text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-success/10 text-success shrink-0">
                            Purchased
                          </span>
                        </div>
                        <div className="mt-3 sm:mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                          <div className="text-[11px] sm:text-xs text-text-secondary flex flex-wrap gap-3 sm:gap-4">
                            {/* <span className="font-medium text-text">{formatPrice(e.amount_paid)}</span> */}
                            {e.purchased_at && <span>{formatDate(e.purchased_at)}</span>}
                          </div>
                          {inv && (
                            <InvoiceButton invoiceId={inv.invoice_id} invoiceNumber={inv.invoice_number} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Live Sessions */}
            {sessions.length > 0 && (
              <section>
                <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <h2 className="text-xs sm:text-sm font-bold text-text uppercase tracking-wide flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <polygon points="23 7 16 12 23 17 23 7"/>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                    </svg>
                    Live Sessions
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {sessions.map((s) => {
                    const inv = invoiceMap[s.purchase_id];
                    return (
                      <div key={s.purchase_id} className="bg-white rounded-xl shadow-sm border border-border p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-sm sm:text-base font-semibold text-text truncate">
                              {s.name || 'Session'}
                            </h3>
                            {s.faculty_name && (
                              <span className="text-[11px] sm:text-xs text-text-secondary mt-0.5 block">By {s.faculty_name}</span>
                            )}
                          </div>
                          <span className={`text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shrink-0 ${
                            s.session_status === 'completed' ? 'bg-text-secondary/10 text-text-secondary' : 'bg-success/10 text-success'
                          }`}>
                            {s.session_status === 'completed' ? 'Completed' : 'Purchased'}
                          </span>
                        </div>
                        <div className="mt-3 sm:mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                          <div className="text-[11px] sm:text-xs text-text-secondary flex flex-wrap gap-3 sm:gap-4">
                            {/* <span className="font-medium text-text">{formatPrice(s.amount_paid)}</span> */}
                            {s.scheduled_start_time && <span>{formatDate(s.scheduled_start_time)}</span>}
                            {!s.scheduled_start_time && s.purchased_at && <span>{formatDate(s.purchased_at)}</span>}
                          </div>
                          {inv && (
                            <InvoiceButton invoiceId={inv.invoice_id} invoiceNumber={inv.invoice_number} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
