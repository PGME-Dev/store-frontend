import { useState } from 'react';
import { sendInquiry } from '../api/contact';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await sendInquiry(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text mb-1.5">Contact Us</h1>
        <p className="text-sm sm:text-base text-text-secondary">Please fill out the form to help us assist you better</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

        {/* Contact Info Cards - Left column on desktop */}
        <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-4">
          {/* Address Card */}
          <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 hover:shadow-md hover:border-primary/15 transition-all duration-300">
            <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center text-primary mb-3.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-text mb-1.5">Address</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Office: 19-1-27/A, New Adarsh Colony, Bidar, Karnataka: 585401
            </p>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 hover:shadow-md hover:border-accent/15 transition-all duration-300">
            <div className="w-10 h-10 bg-accent/8 rounded-xl flex items-center justify-center text-accent mb-3.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-text mb-1.5">Email</h3>
            <a href="mailto:pgmeessentials@gmail.com" className="text-sm text-primary no-underline hover:underline break-all">
              pgmeessentials@gmail.com
            </a>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 hover:shadow-md hover:border-success/15 transition-all duration-300">
            <div className="w-10 h-10 bg-success/8 rounded-xl flex items-center justify-center text-success mb-3.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-text mb-1.5">Phone</h3>
            <a href="tel:8827741255" className="text-sm text-primary no-underline hover:underline">
              8827741255
            </a>
          </div>
        </div>

        {/* Inquiry Form - Right side, spans 2 cols on desktop */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 lg:p-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center">
              <div className="w-14 h-14 bg-success/8 rounded-2xl flex items-center justify-center text-success mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text mb-1.5">Message Sent!</h3>
              <p className="text-sm text-text-secondary mb-5 max-w-sm">Thank you for reaching out. We'll get back to you as soon as possible.</p>
              <button
                onClick={() => setSuccess(false)}
                className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl border-0 cursor-pointer hover:bg-primary-dark transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-text mb-1">Send us a message</h2>
                <p className="text-xs sm:text-sm text-text-secondary">We'll respond to your inquiry as soon as possible.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Name <span className="text-error">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-secondary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Email <span className="text-error">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-secondary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-secondary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-secondary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Message <span className="text-error">*</span></label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-y min-h-[120px] placeholder:text-text-secondary/50"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-error bg-error/5 px-4 py-2.5 rounded-xl">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl border-0 cursor-pointer hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="mt-4 sm:mt-5 bg-white rounded-2xl sm:rounded-3xl border border-border overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary/8 rounded-xl flex items-center justify-center text-primary shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text">Our Location</h3>
              <p className="text-xs text-text-secondary">New Adarsh Colony, Bidar, Karnataka</p>
            </div>
          </div>
          <a
            href="https://maps.app.goo.gl/u4EQgYH7pozHSsK36"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-primary bg-primary/5 rounded-lg no-underline hover:bg-primary/10 transition-colors shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Open in Google Maps
          </a>
        </div>
        <div className="relative w-full h-56 sm:h-72 lg:h-80">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1167.7878962949494!2d77.4985210190857!3d17.92107425261561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcec6cc0630eb39%3A0x1328e22c89004b1f!2sWFCX%2B9JR%2C%2019-1-36%2F1%2C%20New%20Adarsh%20Colony%203rd%20Phase%2C%203rd%20Phase%2C%20Adarsh%20Colony%2C%20Bidar%2C%20Karnataka%20585401!5e1!3m2!1sen!2sin!4v1772221778888!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="PGME Office Location"
            className="absolute inset-0"
          />
        </div>
      </div>
    </div>
  );
}
