import { useState, useEffect, useMemo } from 'react';
import { getAllForms, getMySubmissions } from '../api/forms';
import { useAuth } from '../context/AuthContext';
import FormCard from '../components/FormCard';
import FormModal from '../components/FormModal';
import { formatPrice } from '../components/PriceDisplay';

export default function FormSubmissions() {
  const { isAuthenticated } = useAuth();
  const [forms, setForms] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedForm, setSelectedForm] = useState(null);
  const [activeTab, setActiveTab] = useState('forms'); // 'forms' | 'submissions'

  // Fetch all forms
  useEffect(() => {
    (async () => {
      try {
        const result = await getAllForms();
        setForms(result);
      } catch {
        // Silent — forms section will show empty
      } finally {
        setLoadingForms(false);
      }
    })();
  }, []);

  // Fetch user submissions
  useEffect(() => {
    if (!isAuthenticated) {
      setLoadingSubmissions(false);
      return;
    }
    (async () => {
      try {
        const result = await getMySubmissions();
        setSubmissions(result);
      } catch {
        // Silent
      } finally {
        setLoadingSubmissions(false);
      }
    })();
  }, [isAuthenticated]);

  // Refresh submissions after form modal closes (user may have submitted)
  const refreshSubmissions = async () => {
    if (!isAuthenticated) return;
    try {
      const result = await getMySubmissions();
      setSubmissions(result);
    } catch { /* silent */ }
  };

  // Filter forms by search
  const filteredForms = useMemo(() => {
    if (!search.trim()) return forms;
    const q = search.toLowerCase();
    return forms.filter(
      (f) =>
        f.title?.toLowerCase().includes(q) ||
        f.subject_id?.name?.toLowerCase().includes(q) ||
        f.template?.name?.toLowerCase().includes(q)
    );
  }, [forms, search]);

  // Group submissions by subject
  const groupedSubmissions = useMemo(() => {
    const map = {};
    submissions.forEach((s) => {
      const subject = s.form_subject || 'Other';
      if (!map[subject]) map[subject] = [];
      map[subject].push(s);
    });
    return map;
  }, [submissions]);

  const loading = loadingForms || loadingSubmissions;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-6 sm:mb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Registration</p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text tracking-tight">Exam Forms</h1>
          <p className="text-sm text-text-secondary mt-2">Browse available forms and view your past submissions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface-dim rounded-xl mb-6 sm:mb-8 max-w-xs">
          <button
            onClick={() => setActiveTab('forms')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg border-0 cursor-pointer transition-all ${
              activeTab === 'forms'
                ? 'bg-white text-text shadow-sm'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            Available Forms
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg border-0 cursor-pointer transition-all ${
              activeTab === 'submissions'
                ? 'bg-white text-text shadow-sm'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            My Submissions
            {submissions.length > 0 && (
              <span className="ml-1.5 text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                {submissions.length}
              </span>
            )}
          </button>
        </div>

        {/* ── Available Forms Tab ── */}
        {activeTab === 'forms' && (
          <div>
            {/* Search */}
            {forms.length > 0 && (
              <div className="mb-5 sm:mb-6">
                <div className="relative max-w-md">
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search forms by name or subject..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border/60 bg-white outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            )}

            {filteredForms.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-border">
                <div className="w-16 h-16 bg-surface-dim rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <p className="text-text font-semibold text-base mb-1.5">
                  {search ? 'No forms match your search' : 'No forms available'}
                </p>
                <p className="text-sm text-text-secondary">
                  {search ? 'Try a different search term' : 'Check back later for new registration forms'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredForms.map((form) => (
                  <FormCard
                    key={form._id}
                    form={form}
                    onClick={() => setSelectedForm(form)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── My Submissions Tab ── */}
        {activeTab === 'submissions' && (
          <div>
            {!isAuthenticated ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <p className="text-text font-semibold text-base mb-1.5">Login to view submissions</p>
                <p className="text-sm text-text-secondary">Sign in to see your past form submissions</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-border">
                <div className="w-16 h-16 bg-surface-dim rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <p className="text-text font-semibold text-base mb-1.5">No submissions yet</p>
                <p className="text-sm text-text-secondary mb-5">Fill out a form to see your submissions here</p>
                <button
                  onClick={() => setActiveTab('forms')}
                  className="btn-primary inline-flex !py-2.5 !px-6 text-sm border-0 cursor-pointer"
                >
                  Browse Forms
                </button>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {Object.entries(groupedSubmissions).map(([subject, subs]) => (
                  <section key={subject}>
                    <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                      <div className="w-1 h-5 bg-primary rounded-full" />
                      <h2 className="text-xs sm:text-sm font-bold text-text uppercase tracking-wide">{subject}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {subs.map((sub) => {
                        const isPaid = sub.payment_amount && sub.payment_amount > 0;
                        const statusConfig = {
                          paid: { label: 'Paid', color: 'bg-success/10 text-success' },
                          pending: { label: 'Payment Pending', color: 'bg-amber-500/10 text-amber-600' },
                          none: { label: isPaid ? 'Unpaid' : 'Submitted', color: isPaid ? 'bg-red-500/10 text-red-500' : 'bg-success/10 text-success' },
                          expired: { label: 'Expired', color: 'bg-red-500/10 text-red-500' },
                          canceled: { label: 'Cancelled', color: 'bg-text-secondary/10 text-text-secondary' },
                        };
                        const status = statusConfig[sub.payment_status] || statusConfig.none;

                        return (
                          <div
                            key={sub._id}
                            className="bg-white rounded-xl shadow-sm border border-border p-4 sm:p-5 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                    sub.form_template === 'examiner'
                                      ? 'text-purple-600 bg-purple-500/10'
                                      : 'text-primary bg-primary/10'
                                  }`}>
                                    {sub.form_template_name || 'Form'}
                                  </span>
                                </div>
                                <h3 className="text-sm sm:text-base font-semibold text-text truncate">
                                  {sub.form_title}
                                </h3>
                              </div>
                              <span className={`text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${status.color}`}>
                                {status.label}
                              </span>
                            </div>

                            <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
                              <div className="text-[11px] sm:text-xs text-text-secondary flex flex-wrap gap-3">
                                {isPaid && (
                                  <span className="font-medium text-text">{formatPrice(sub.payment_amount)}</span>
                                )}
                                <span>{formatDate(sub.submitted_at)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form modal */}
      {selectedForm && (
        <FormModal
          form={selectedForm}
          onClose={() => {
            setSelectedForm(null);
            refreshSubmissions();
          }}
        />
      )}
    </div>
  );
}
