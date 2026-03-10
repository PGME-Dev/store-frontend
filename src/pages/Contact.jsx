import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { sendInquiry } from '../api/contact';

const OFFICE_POSITION = [31.3636, 75.5609];

// Custom SVG marker in the primary brand color
const markerIcon = new L.DivIcon({
  className: '',
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -44],
  html: `<svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 10.512 14.112 24.372 14.745 24.98a1.71 1.71 0 0 0 2.51 0C17.888 40.372 32 26.512 32 16 32 7.163 24.837 0 16 0z" fill="#0000C8"/>
    <circle cx="16" cy="16" r="6" fill="white"/>
  </svg>`,
});

function LocationMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Fix Leaflet container size detection after mount
    const timer = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MapContainer
      center={OFFICE_POSITION}
      zoom={16}
      scrollWheelZoom={false}
      className="w-full h-full z-0"
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={OFFICE_POSITION} icon={markerIcon}>
        <Popup>
          <div style={{ fontFamily: 'Inter, sans-serif', padding: '2px 0' }}>
            <strong style={{ fontSize: '13px', color: '#0F172A' }}>PGME Office</strong>
            <br />
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              H.No. 59, Guru Ram Dass Nagar, Phase 2,<br />Near Verka Milk Plant, Jalandhar, Punjab 144008
            </span>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

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
      <div className="mb-8 sm:mb-10">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Get In Touch</p>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text mb-3 tracking-tight">Contact Us</h1>
        <p className="text-sm sm:text-base text-text-secondary max-w-lg">Have a question or need help? Fill out the form and we'll get back to you as soon as possible.</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

        {/* Contact Info Cards - Left column on desktop */}
        <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 sm:gap-5 lg:gap-5">
          {/* Address Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center text-primary shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-text">Address</h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              H.No. 59, Guru Ram Dass Nagar, Phase 2, Near Verka Milk Plant, Jalandhar, Punjab-144008
            </p>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent/8 rounded-xl flex items-center justify-center text-accent shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-text">Email</h3>
            </div>
            <a href="mailto:support@pgmemedicalteaching.com" className="text-sm text-primary no-underline hover:underline break-all">
              support@pgmemedicalteaching.com
            </a>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-success/8 rounded-xl flex items-center justify-center text-success shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-text">Phone</h3>
            </div>
            <a href="tel:8827741255" className="text-sm text-primary no-underline hover:underline">
              8827741255
            </a>
          </div>
        </div>

        {/* Inquiry Form - Right side, spans 2 cols on desktop */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 sm:p-8 lg:p-10">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <div className="w-14 h-14 bg-success/8 rounded-2xl flex items-center justify-center text-success mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text mb-1.5">Message Sent!</h3>
              <p className="text-sm text-text-secondary mb-6 max-w-sm">Thank you for reaching out. We'll get back to you as soon as possible.</p>
              <button
                onClick={() => setSuccess(false)}
                className="btn-primary"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg font-bold text-text mb-1.5">Send us a message</h2>
                <p className="text-xs sm:text-sm text-text-secondary">We'll respond to your inquiry as soon as possible.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Name <span className="text-error">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-secondary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Email <span className="text-error">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-secondary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-secondary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-secondary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Message <span className="text-error">*</span></label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-y min-h-[120px] placeholder:text-text-secondary/50"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-error bg-error/5 px-4 py-2.5 rounded-lg">
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
                  className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
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

      {/* Map Section */}
      <div className="mt-5 sm:mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold text-text mb-0.5">Our Location</h3>
            <p className="text-xs text-text-secondary">Guru Ram Dass Nagar, Jalandhar, Punjab</p>
          </div>
          <a
            href="https://maps.app.goo.gl/BY4DLXepUboN22h18"
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
        <div className="h-56 sm:h-72 lg:h-80">
          <LocationMap />
        </div>
      </div>
    </div>
  );
}
