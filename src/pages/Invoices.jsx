import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllPurchases, downloadInvoicePdf } from '../api/purchases';
import { formatPrice } from '../components/PriceDisplay';

const TYPE_CONFIG = {
  package: { label: 'Package', color: 'bg-primary/10 text-primary' },
  session: { label: 'Session', color: 'bg-accent/10 text-accent' },
  book:    { label: 'eBook',   color: 'bg-success/10 text-success' },
  ebook:   { label: 'eBook',   color: 'bg-success/10 text-success' },
  form:    { label: 'Form Registration', color: 'bg-amber-500/10 text-amber-600' },
};

const STATUS_CONFIG = {
  paid:            { label: 'Paid',         color: 'bg-success/10 text-success' },
  unpaid:          { label: 'Unpaid',       color: 'bg-error/10 text-error' },
  partially_paid:  { label: 'Partial',      color: 'bg-warning/10 text-warning' },
  void:            { label: 'Void',         color: 'bg-text-secondary/10 text-text-secondary' },
};

function DownloadButton({ invoiceId, invoiceNumber }) {
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
      alert('Failed to download invoice. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      title="Download PDF"
      className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer bg-primary/5 hover:bg-primary/10 border-0 px-3 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      {downloading ? 'Downloading…' : 'Download'}
    </button>
  );
}

export default function Invoices() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all | package | session | ebook

  useEffect(() => {
    (async () => {
      try {
        const result = await getAllPurchases();
        setData(result);
      } catch {
        setError('Failed to load invoices. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Build purchase_id -> item info map from all purchase types
  const itemMap = useMemo(() => {
    const map = {};
    (data?.packages || []).forEach((p) => {
      map[p.purchase_id] = {
        name: p.name || 'Package',
        sub: p.tier_name || p.package_type || null,
      };
    });
    (data?.ebook_purchases || []).forEach((e) => {
      map[e.purchase_id] = {
        name: e.name || 'eBook',
        sub: e.author || null,
      };
    });
    (data?.live_sessions || []).forEach((s) => {
      map[s.purchase_id] = {
        name: s.name || 'Session',
        sub: s.faculty_name ? `By ${s.faculty_name}` : null,
      };
    });
    (data?.form_registrations || []).forEach((f) => {
      map[f.purchase_id] = {
        name: f.name || 'Form Registration',
        sub: f.subject || null,
      };
    });
    return map;
  }, [data]);

  // All invoices sorted newest-first, with optional type filter
  const invoices = useMemo(() => {
    const all = [...(data?.invoices || [])].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    if (filter === 'all') return all;
    if (filter === 'ebook') return all.filter((inv) => inv.purchase_type === 'book' || inv.purchase_type === 'ebook');
    return all.filter((inv) => inv.purchase_type === filter);
  }, [data, filter]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  // Summary counts
  const counts = useMemo(() => ({
    total: (data?.invoices || []).length,
    paid:  (data?.invoices || []).filter((i) => i.payment_status === 'paid').length,
  }), [data]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12 text-error">{error}</div>
      </div>
    );
  }

  const filterOptions = [
    { value: 'all',     label: 'All' },
    { value: 'package', label: 'Packages' },
    { value: 'session', label: 'Sessions' },
    { value: 'ebook',   label: 'eBooks' },
    { value: 'form',    label: 'Forms' },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Account</p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text tracking-tight">My Invoices</h1>
          <p className="text-sm text-text-secondary mt-2">Download invoices for all your purchases</p>
        </div>

        {/* Summary strip */}
        {counts.total > 0 && (
          <div className="flex items-center gap-4 sm:gap-6 mb-6 p-4 bg-white rounded-xl border border-border shadow-sm">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-text">{counts.total}</div>
              <div className="text-[11px] text-text-secondary mt-0.5">Total</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-success">{counts.paid}</div>
              <div className="text-[11px] text-text-secondary mt-0.5">Paid</div>
            </div>
          </div>
        )}

        {counts.total === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-xl shadow-sm border border-border">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-dim rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <p className="text-text font-semibold text-base sm:text-lg mb-1.5">No invoices yet</p>
            <p className="text-sm text-text-secondary mb-6">Invoices will appear here after you make a purchase</p>
            <Link to="/home" className="btn-primary inline-flex !py-2.5 !px-6 text-sm no-underline">
              Browse Catalog
            </Link>
          </div>
        ) : (
          <>
            {/* Filter tabs */}
            <div className="flex items-center gap-1 mb-4 bg-surface-dim p-1 rounded-xl w-fit">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value)}
                  className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg border-0 cursor-pointer transition-all ${
                    filter === opt.value
                      ? 'bg-white text-text shadow-sm'
                      : 'bg-transparent text-text-secondary hover:text-text'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {invoices.length === 0 ? (
              <div className="text-center py-12 text-text-secondary text-sm bg-white rounded-xl border border-border">
                No invoices found for this filter.
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden sm:block bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-surface-dim/50">
                        <th className="text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider px-5 py-3.5">Invoice</th>
                        <th className="text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider px-5 py-3.5">Item</th>
                        <th className="text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider px-5 py-3.5">Type</th>
                        <th className="text-right text-[11px] font-semibold text-text-secondary uppercase tracking-wider px-5 py-3.5">Amount</th>
                        <th className="text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider px-5 py-3.5">Date</th>
                        <th className="text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wider px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {invoices.map((inv) => {
                        const item = itemMap[inv.purchase_id] || {};
                        const typeCfg = TYPE_CONFIG[inv.purchase_type] || { label: inv.purchase_type, color: 'bg-surface-dim text-text-secondary' };
                        const statusCfg = STATUS_CONFIG[inv.payment_status] || { label: inv.payment_status, color: 'bg-surface-dim text-text-secondary' };
                        const total = (inv.amount || 0) + (inv.gst_amount || 0);
                        return (
                          <tr key={inv.invoice_id} className="hover:bg-surface-dim/30 transition-colors">
                            <td className="px-5 py-4">
                              <span className="text-xs font-mono text-text-secondary">{inv.invoice_number || '—'}</span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="text-sm font-medium text-text leading-tight">{item.name || '—'}</div>
                              {item.sub && <div className="text-[11px] text-text-secondary mt-0.5">{item.sub}</div>}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${typeCfg.color}`}>
                                {typeCfg.label}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="text-sm font-semibold text-text">{formatPrice(total)}</div>
                              {inv.gst_amount > 0 && (
                                <div className="text-[11px] text-text-secondary mt-0.5">incl. GST {formatPrice(inv.gst_amount)}</div>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-sm text-text-secondary">{formatDate(inv.created_at)}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusCfg.color}`}>
                                {statusCfg.label}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              {inv.payment_status === 'paid' && (
                                <DownloadButton invoiceId={inv.invoice_id} invoiceNumber={inv.invoice_number} />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="sm:hidden space-y-3">
                  {invoices.map((inv) => {
                    const item = itemMap[inv.purchase_id] || {};
                    const typeCfg = TYPE_CONFIG[inv.purchase_type] || { label: inv.purchase_type, color: 'bg-surface-dim text-text-secondary' };
                    const statusCfg = STATUS_CONFIG[inv.payment_status] || { label: inv.payment_status, color: 'bg-surface-dim text-text-secondary' };
                    const total = (inv.amount || 0) + (inv.gst_amount || 0);
                    return (
                      <div key={inv.invoice_id} className="bg-white rounded-xl border border-border shadow-sm p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-text truncate">{item.name || '—'}</div>
                            {item.sub && <div className="text-[11px] text-text-secondary mt-0.5">{item.sub}</div>}
                            <div className="text-[11px] font-mono text-text-secondary mt-1">{inv.invoice_number || '—'}</div>
                          </div>
                          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusCfg.color}`}>
                            {statusCfg.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-border/60">
                          <div className="flex items-center gap-3">
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${typeCfg.color}`}>
                              {typeCfg.label}
                            </span>
                            <span className="text-xs text-text-secondary">{formatDate(inv.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-text">{formatPrice(total)}</span>
                            {inv.payment_status === 'paid' && (
                              <DownloadButton invoiceId={inv.invoice_id} invoiceNumber={inv.invoice_number} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
