import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitForm } from '../api/forms';

export default function FormModal({ form, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [examProcessExpanded, setExamProcessExpanded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const template = form?.template;
  const fields = template?.fields || [];
  const isExaminer = template?.slug === 'examiner';
  const hasDescription = !!form.description;
  const hasExamProcess = !!form.exam_process;

  // Reset state when form changes
  useEffect(() => {
    setSubmitted(false);
    setErrors({});
    setSubmitError('');
    setSubmitting(false);
    setExamProcessExpanded(false);
    setDescExpanded(false);

    const prefill = {};
    if (user && fields.length) {
      for (const field of fields) {
        if (field.type === 'email' && user.email) prefill[field.field_key] = user.email;
        if (field.field_key === 'full_name' && user.name) prefill[field.field_key] = user.name;
        if (field.field_key === 'examiner_name' && user.name) prefill[field.field_key] = user.name;
        if (field.field_key === 'whatsapp_contact' && user.phone_number) prefill[field.field_key] = user.phone_number;
      }
    }
    setResponses(prefill);
  }, [form?._id, user]);

  // Lock body scroll & close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Multi-select slot detection
  const examSlots = form?.exam_slots || [];
  const isMultiSelectField = (field) => {
    if (!isExaminer || field.type !== 'radio' || !field.options?.length) return false;
    if (examSlots.length === 0) return false;
    return examSlots.length === field.options.length && examSlots.every((s, i) => s === field.options[i]);
  };

  const handleChange = (fieldKey, value) => {
    setResponses((prev) => ({ ...prev, [fieldKey]: value }));
    if (errors[fieldKey]) {
      setErrors((prev) => { const next = { ...prev }; delete next[fieldKey]; return next; });
    }
  };

  const handleCheckboxToggle = (fieldKey, option) => {
    setResponses((prev) => {
      const current = prev[fieldKey] ? prev[fieldKey].split(',').map(s => s.trim()).filter(Boolean) : [];
      const updated = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      return { ...prev, [fieldKey]: updated.join(', ') };
    });
    if (errors[fieldKey]) {
      setErrors((prev) => { const next = { ...prev }; delete next[fieldKey]; return next; });
    }
  };

  const validate = () => {
    const newErrors = {};
    for (const field of fields) {
      const rawValue = responses[field.field_key];
      const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
      if (field.required && !value) {
        newErrors[field.field_key] = `${field.label} is required`;
        continue;
      }
      if (value && field.type === 'email') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field.field_key] = 'Please enter a valid email';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // All forms require login
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname + window.location.search } });
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const result = await submitForm(form._id, responses);
      const submission = result?.submission;

      if (!submission?._id) {
        throw new Error('Form submission failed. Please try again.');
      }

      // Paid form: redirect to checkout
      if (submission.payment_required) {
        onClose();
        navigate(`/checkout/forms/${form._id}`, {
          state: { submissionId: submission._id, formTitle: form.title, paymentAmount: submission.payment_amount },
        });
        return;
      }

      // Free form: show success
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Accordion toggle row ── */
  const AccordionToggle = ({ label, expanded, onToggle, accentColor = 'text-text' }) => (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 text-left cursor-pointer group/acc"
    >
      <span className={`text-sm font-semibold ${accentColor}`}>{label}</span>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
        expanded ? 'bg-primary/10' : 'bg-surface-dim group-hover/acc:bg-primary/5'
      }`}>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`text-text-tertiary transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </button>
  );

  const modal = (
    <div className="fixed inset-0 z-999">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-modal-backdrop"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div
          className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-modal-content flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Close button ── */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm transition-colors cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* ── Single scroll container for everything ── */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
            {/* Banner */}
            {form.banner_url && (
              <div className="w-full flex-shrink-0" style={{ aspectRatio: '18/7' }}>
                <img src={form.banner_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Compact header: badge + title only */}
            <div className={`px-5 sm:px-6 pt-5 pb-3 ${isExaminer ? 'bg-purple-500/5' : 'bg-primary/5'}`}>
              <span className={`inline-block text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${
                isExaminer ? 'text-purple-600 bg-purple-500/10' : 'text-primary bg-primary/10'
              }`}>
                {template?.name || 'Form'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-text leading-snug pr-8">{form.title}</h2>
            </div>

            {/* ── Info accordions (description + exam process) ── */}
            {(hasDescription || hasExamProcess) && (
              <div className="px-5 sm:px-6 border-b border-border/40 divide-y divide-border/30">
                {/* Description accordion */}
                {hasDescription && (
                  <div>
                    <AccordionToggle
                      label="About this Exam"
                      expanded={descExpanded}
                      onToggle={() => setDescExpanded((p) => !p)}
                    />
                    {descExpanded && (
                      <div className="pb-3 -mt-1">
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                          {form.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Exam Process accordion */}
                {hasExamProcess && (
                  <div>
                    <AccordionToggle
                      label="Exam Process"
                      expanded={examProcessExpanded}
                      onToggle={() => setExamProcessExpanded((p) => !p)}
                    />
                    {examProcessExpanded && (
                      <div className="pb-3 -mt-1">
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                          {form.exam_process}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Form body ── */}
            <div className="px-5 sm:px-6 py-5">
              {!isAuthenticated ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2">Login Required</h3>
                  <p className="text-sm text-text-secondary mb-4">Please log in to fill out this form.</p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/login', { state: { from: window.location.pathname + window.location.search } });
                    }}
                    className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    Log In
                  </button>
                </div>
              ) : submitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2">Form Submitted!</h3>
                  <p className="text-sm text-text-secondary mb-4">Thank you for your submission. We will get back to you soon.</p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {fields
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((field) => (
                      <div key={field.field_key}>
                        <label
                          htmlFor={field.type === 'radio' ? undefined : field.field_key}
                          className="block text-sm font-medium text-text mb-1.5"
                        >
                          {field.label}
                          {field.required && <span className="text-red-500 ml-0.5">*</span>}
                        </label>

                        {/* Multi-select checkboxes for examiner slot fields */}
                        {isMultiSelectField(field) ? (
                          <div className="space-y-2" role="group" aria-label={field.label}>
                            {field.options.map((option) => {
                              const selected = responses[field.field_key]
                                ? responses[field.field_key].split(',').map(s => s.trim()).includes(option)
                                : false;
                              return (
                                <label
                                  key={option}
                                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all ${
                                    selected
                                      ? 'border-purple-500 bg-purple-500/5 text-purple-600'
                                      : 'border-border/60 hover:border-purple-300 text-text-secondary'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selected}
                                    onChange={() => handleCheckboxToggle(field.field_key, option)}
                                    className="accent-purple-500"
                                  />
                                  <span className="text-sm">{option}</span>
                                </label>
                              );
                            })}
                          </div>
                        ) : field.type === 'radio' && field.options?.length > 0 ? (
                          <div className="space-y-2" role="radiogroup" aria-label={field.label}>
                            {field.options.map((option) => (
                              <label
                                key={option}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all ${
                                  responses[field.field_key] === option
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-border/60 hover:border-primary/30 text-text-secondary'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={field.field_key}
                                  id={`${field.field_key}-${option}`}
                                  value={option}
                                  checked={responses[field.field_key] === option}
                                  onChange={() => handleChange(field.field_key, option)}
                                  className="accent-primary"
                                />
                                <span className="text-sm">{option}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <input
                            id={field.field_key}
                            type={field.type === 'email' ? 'email' : 'text'}
                            value={responses[field.field_key] || ''}
                            onChange={(e) => handleChange(field.field_key, e.target.value)}
                            placeholder={field.label}
                            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white outline-none transition-colors ${
                              errors[field.field_key]
                                ? 'border-red-400 focus:border-red-500'
                                : 'border-border/60 focus:border-primary'
                            }`}
                          />
                        )}

                        {errors[field.field_key] && (
                          <p className="text-xs text-red-500 mt-1">{errors[field.field_key]}</p>
                        )}
                      </div>
                    ))}

                  {/* Payment info */}
                  {form.payment_amount > 0 && (
                    <div className="pt-2 border-t border-border/40">
                      <p className="text-xs text-text-tertiary">
                        This form requires a non-refundable payment of <span className="font-semibold text-text-secondary">{'\u20B9'}{form.payment_amount}</span>. You will be redirected to checkout after submission.
                      </p>
                    </div>
                  )}

                  {submitError && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
