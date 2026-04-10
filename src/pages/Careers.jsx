import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubject } from '../context/SubjectContext';
import { submitCareerApplication, submitCareerApplicationGuest } from '../api/careers';

const ROLES = [
  'Lecturer',
  'Medical Editor',
  'Examiner',
  'Subject Coordinator',
  'Marketing & Growth',
  'Operations & Support',
];

export default function Careers() {
  const { user, isAuthenticated } = useAuth();
  const { subjects } = useSubject();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    wished_role: '',
    subject: '',
    portfolio_link: '',
    representative_work: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim() || form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!form.email.trim() || !emailRegex.test(form.email.trim())) errors.email = 'Please enter a valid email';
    if (!form.phone_number.trim()) errors.phone_number = 'Phone number is required';
    if (!form.wished_role) errors.wished_role = 'Please select a role';
    if (!form.subject) errors.subject = 'Please select a subject';
    if (!form.portfolio_link.trim()) errors.portfolio_link = 'Portfolio link is required';
    else if (!/^https?:\/\/.+/.test(form.portfolio_link.trim())) errors.portfolio_link = 'Please enter a valid URL';
    if (!form.representative_work.trim()) errors.representative_work = 'Representative work link is required';
    else if (!/^https?:\/\/.+/.test(form.representative_work.trim())) errors.representative_work = 'Please enter a valid URL';
    if (!form.message.trim()) errors.message = 'Additional remarks are required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone_number: form.phone_number.trim(),
        wished_role: form.wished_role,
        subject: form.subject,
        portfolio_link: form.portfolio_link.trim(),
        representative_work: form.representative_work.trim(),
        message: form.message.trim(),
      };

      await (isAuthenticated ? submitCareerApplication(payload) : submitCareerApplicationGuest(payload));
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Careers</p>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-extrabold text-text mb-3 tracking-tight">Join PGME</h1>
        <p className="text-sm sm:text-base text-text-secondary max-w-lg">Be part of our mission to shape how the next generation of doctors learn.</p>
      </div>

      {/* Hero Banner */}
      <div className="gradient-primary rounded-2xl p-8 sm:p-10 lg:p-12 mb-8 sm:mb-10">
        <div className="max-w-2xl">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/15 rounded-xl flex items-center justify-center mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
              <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
            Build the Future of<br />Medical Education
          </h2>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-md">
            Join our passionate team and help shape how the next generation of doctors learn.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-text mb-1.5">Apply Now</h2>
          <p className="text-sm text-text-secondary">Fill in the details below and we'll get back to you.</p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-success/8 rounded-2xl flex items-center justify-center text-success mx-auto mb-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Application Submitted!</h3>
            <p className="text-sm text-text-secondary max-w-sm mx-auto">
              Thank you for your interest in joining PGME. We'll review your application and get back to you soon.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 lg:p-10">
            {error && (
              <div className="flex items-center gap-2 text-sm text-error bg-error/5 px-4 py-2.5 rounded-lg mb-6">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Full Name <span className="text-error">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-secondary/50"
                  />
                  {fieldErrors.name && <p className="text-xs text-error mt-1.5">{fieldErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Email Address <span className="text-error">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-secondary/50"
                  />
                  {fieldErrors.email && <p className="text-xs text-error mt-1.5">{fieldErrors.email}</p>}
                </div>
              </div>

              {/* Phone & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Contact Number (WhatsApp) <span className="text-error">*</span></label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    placeholder="+91 00000-00000"
                    className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-secondary/50"
                  />
                  {fieldErrors.phone_number && <p className="text-xs text-error mt-1.5">{fieldErrors.phone_number}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Role Selection <span className="text-error">*</span></label>
                  <select
                    name="wished_role"
                    value={form.wished_role}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5' stroke-linecap='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                  >
                    <option value="" disabled>Select a role</option>
                    {ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {fieldErrors.wished_role && <p className="text-xs text-error mt-1.5">{fieldErrors.wished_role}</p>}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">Subject <span className="text-error">*</span></label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5' stroke-linecap='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                >
                  <option value="" disabled>Select a subject</option>
                  {subjects.map((s) => (
                    <option key={s._id || s.subject_id} value={s.name}>{s.name}</option>
                  ))}
                </select>
                {fieldErrors.subject && <p className="text-xs text-error mt-1.5">{fieldErrors.subject}</p>}
              </div>

              {/* Portfolio & Representative Work */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Portfolio Link <span className="text-error">*</span></label>
                  <input
                    type="url"
                    name="portfolio_link"
                    value={form.portfolio_link}
                    onChange={handleChange}
                    placeholder="Link to your Drive, CV, or Profile"
                    className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-secondary/50"
                  />
                  {fieldErrors.portfolio_link && <p className="text-xs text-error mt-1.5">{fieldErrors.portfolio_link}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Representative Work <span className="text-error">*</span></label>
                  <input
                    type="url"
                    name="representative_work"
                    value={form.representative_work}
                    onChange={handleChange}
                    placeholder="Link to a lecture, paper, or project"
                    className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-secondary/50"
                  />
                  {fieldErrors.representative_work && <p className="text-xs text-error mt-1.5">{fieldErrors.representative_work}</p>}
                </div>
              </div>

              {/* Additional Remarks */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">Additional Remarks <span className="text-error">*</span></label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Share your achievements or skills"
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-y min-h-[100px] placeholder:text-text-secondary/50"
                />
                {fieldErrors.message && <p className="text-xs text-error mt-1.5">{fieldErrors.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Submit Application
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
