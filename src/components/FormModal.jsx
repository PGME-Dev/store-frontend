import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { submitForm } from '../api/forms';

export default function FormModal({ form, onClose }) {
  const { user } = useAuth();
  const bodyRef = useRef(null);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const template = form?.template;
  const fields = template?.fields || [];
  const isExaminer = template?.slug === 'examiner';

  // Reset state when form changes (handles re-open with same/different form)
  useEffect(() => {
    setSubmitted(false);
    setErrors({});
    setSubmitError('');
    setSubmitting(false);

    // Build pre-fill from user profile
    const prefill = {};
    if (user && fields.length) {
      for (const field of fields) {
        if (field.type === 'email' && user.email) {
          prefill[field.field_key] = user.email;
        }
        if (field.field_key === 'full_name' && user.name) {
          prefill[field.field_key] = user.name;
        }
        if (field.field_key === 'examiner_name' && user.name) {
          prefill[field.field_key] = user.name;
        }
        if (field.field_key === 'whatsapp_contact' && user.phone_number) {
          prefill[field.field_key] = user.phone_number;
        }
      }
    }
    setResponses(prefill);
  }, [form?._id, user]);

  // Lock body scroll & close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    const blockScroll = (e) => e.preventDefault();
    document.addEventListener('keydown', handleKey);
    document.addEventListener('wheel', blockScroll, { passive: false });
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('wheel', blockScroll);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleModalWheel = (e) => {
    e.stopPropagation();
    if (bodyRef.current) bodyRef.current.scrollTop += e.deltaY;
  };

  const handleChange = (fieldKey, value) => {
    setResponses((prev) => ({ ...prev, [fieldKey]: value }));
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

    setSubmitting(true);
    setSubmitError('');
    try {
      await submitForm(form._id, responses);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const modal = (
    <div className="fixed inset-0 z-999">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-modal-backdrop"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full flex items-center justify-center">
          <div
            className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-clip animate-modal-content flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleModalWheel}
          >
            {/* Close button */}
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

            {/* Header */}
            <div className={`px-5 sm:px-6 pt-6 pb-4 ${isExaminer ? 'bg-purple-500/5' : 'bg-primary/5'}`}>
              <span className={`inline-block text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${
                isExaminer ? 'text-purple-600 bg-purple-500/10' : 'text-primary bg-primary/10'
              }`}>
                {template?.name || 'Form'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-text">{form.title}</h2>
              {form.description && (
                <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">{form.description}</p>
              )}
            </div>

            {/* Body */}
            <div ref={bodyRef} className="flex-1 overflow-y-auto px-5 sm:px-6 py-5" data-lenis-prevent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2">Form Submitted!</h3>
                  <p className="text-sm text-text-secondary mb-6">Thank you for your submission. We will get back to you soon.</p>
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

                        {field.type === 'radio' ? (
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

                  {/* Payment link */}
                  {form.payment_link && (
                    <div className="pt-2 border-t border-border/40">
                      <p className="text-xs text-text-tertiary mb-1">Payment details (Non-refundable)</p>
                      <a
                        href={form.payment_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary font-medium hover:underline"
                      >
                        Click here for Payment Link
                      </a>
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
