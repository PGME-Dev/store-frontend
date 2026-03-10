import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="animate-fade-in-up">
      {/* ── Hero ── */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 pb-20 sm:pb-28 lg:pb-36">

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-text-tertiary mb-6 sm:mb-8">
            About PGME
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-text leading-[1.05] tracking-tight mb-6 sm:mb-8">
            We're Building the Future of{' '}
            <span className="gradient-text">Medical Education</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            PGME empowers MD/DNB candidates with realistic mock examinations, expert-led revision lectures, and a community of 3,000+ postgraduate medical professionals.
          </p>
        </div>
      </section>

      {/* ── Stats — giant typography ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-y border-border/40">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
          <div className="text-center">
            <div className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight gradient-text leading-none">159</div>
            <div className="text-xs sm:text-sm text-text-tertiary mt-3 font-medium uppercase tracking-wider">Sessions Conducted</div>
          </div>
          <div className="text-center">
            <div className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight gradient-text leading-none">217+</div>
            <div className="text-xs sm:text-sm text-text-tertiary mt-3 font-medium uppercase tracking-wider">Hours of Content</div>
          </div>
          <div className="text-center">
            <div className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight gradient-text leading-none">3.1K</div>
            <div className="text-xs sm:text-sm text-text-tertiary mt-3 font-medium uppercase tracking-wider">PG Registrations</div>
          </div>
          <div className="text-center">
            <div className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight gradient-text leading-none">60+</div>
            <div className="text-xs sm:text-sm text-text-tertiary mt-3 font-medium uppercase tracking-wider">Expert Examiners</div>
          </div>
        </div>
      </section>

      {/* ── What We Do — editorial alternating sections ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <div className="text-center mb-16 sm:mb-20">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-text-tertiary mb-4 block">
              What We Do
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text tracking-tight">
              Two pillars of preparation
            </h2>
          </div>

          {/* Feature 1 — Mock Exams */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center mb-20 sm:mb-28">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[11px] sm:text-xs font-semibold text-primary uppercase tracking-wider">Mock Examinations</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text leading-tight tracking-tight mb-5">
                PGME National Level Online Mock Practical Exams
              </h3>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6">
                Experience the intensity of real postgraduate exams through our meticulously designed mock practicals. Each exam mirrors the actual assessment pattern, evaluating your practical skills and clinical knowledge through realistic scenarios crafted by experienced examiners.
              </p>
              <div className="flex gap-8 sm:gap-12">
                <div>
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-text">106</div>
                  <div className="text-xs text-text-tertiary mt-1 font-medium">Mock Sessions</div>
                </div>
                <div className="w-px bg-border/60" />
                <div>
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-text">91.67</div>
                  <div className="text-xs text-text-tertiary mt-1 font-medium">Hours</div>
                </div>
              </div>
            </div>
            {/* Visual block */}
            <div className="relative">
              <div className="aspect-4/3 rounded-3xl bg-linear-to-br from-primary/6 via-primary/3 to-transparent border border-border/40 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-[0.3]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                  backgroundSize: '128px 128px',
                }} />
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/20">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-primary/5 border border-primary/10 -z-10" />
            </div>
          </div>

          {/* Feature 2 — Revision Series (reversed) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            {/* Visual block (left on desktop) */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-4/3 rounded-3xl bg-linear-to-br from-accent/6 via-accent/3 to-transparent border border-border/40 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-[0.3]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                  backgroundSize: '128px 128px',
                }} />
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent/20">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl bg-accent/5 border border-accent/10 -z-10" />
            </div>
            {/* Text (right on desktop) */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/10 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-[11px] sm:text-xs font-semibold text-accent-dark uppercase tracking-wider">Revision Series</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text leading-tight tracking-tight mb-5">
                Structured Revision Lectures for Every Specialty
              </h3>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6">
                Our revision lecture series covers high-yield topics with detailed explanations of core concepts, interactive Q&A sessions, and flexible access to both live and recorded content. Designed to strengthen both theoretical knowledge and practical application.
              </p>
              <div className="flex gap-8 sm:gap-12">
                <div>
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-text">53</div>
                  <div className="text-xs text-text-tertiary mt-1 font-medium">Lecture Sessions</div>
                </div>
                <div className="w-px bg-border/60" />
                <div>
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-text">126</div>
                  <div className="text-xs text-text-tertiary mt-1 font-medium">Hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why PGME — numbered list ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 bg-white border-y border-border/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 sm:mb-20">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-text-tertiary mb-4 block">
              Why PGME
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text tracking-tight">
              What sets us apart
            </h2>
          </div>

          <div className="space-y-0">
            <div className="group grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4 sm:gap-8 py-10 sm:py-12 border-t border-border/40">
              <div className="font-display text-5xl sm:text-6xl font-extrabold text-border/60 group-hover:text-primary/20 transition-colors duration-500 leading-none">01</div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-text mb-3 tracking-tight">Expert Faculty Network</h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
                  Learn from 60+ experienced examiners and subject matter experts who bring decades of clinical and academic excellence to every session.
                </p>
              </div>
            </div>

            <div className="group grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4 sm:gap-8 py-10 sm:py-12 border-t border-border/40">
              <div className="font-display text-5xl sm:text-6xl font-extrabold text-border/60 group-hover:text-primary/20 transition-colors duration-500 leading-none">02</div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-text mb-3 tracking-tight">Realistic Exam Simulation</h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
                  Our mock practicals replicate the exact pressure and format of real postgraduate exams. Practice under conditions that matter, so exam day feels familiar.
                </p>
              </div>
            </div>

            <div className="group grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4 sm:gap-8 py-10 sm:py-12 border-t border-border/40">
              <div className="font-display text-5xl sm:text-6xl font-extrabold text-border/60 group-hover:text-primary/20 transition-colors duration-500 leading-none">03</div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-text mb-3 tracking-tight">Comprehensive & Flexible</h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
                  Over 217 hours of curated content with both live sessions and recorded lectures. Study at your pace, on any device, with 24/7 access via the PGME app.
                </p>
              </div>
            </div>

            <div className="group grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4 sm:gap-8 py-10 sm:py-12 border-t border-border/40 border-b">
              <div className="font-display text-5xl sm:text-6xl font-extrabold text-border/60 group-hover:text-primary/20 transition-colors duration-500 leading-none">04</div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-text mb-3 tracking-tight">Proven Track Record</h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
                  With 3,148+ registrations and 159 sessions delivered, PGME is the trusted platform for postgraduate medical professionals across India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pull quote ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto mb-6 text-border">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="currentColor"/>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="currentColor"/>
          </svg>
          <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text leading-snug tracking-tight mb-6">
            Our mission is to make quality postgraduate medical education accessible to every aspiring specialist across India.
          </blockquote>
          <p className="text-sm sm:text-base text-text-tertiary font-medium">
            PGME Medical Education LLP
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-6xl mx-auto gradient-primary rounded-3xl p-10 sm:p-14 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/3" />

          <div className="relative">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Ready to elevate your preparation?
            </h2>
            <p className="text-sm sm:text-base text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
              Join thousands of postgraduate medical professionals who trust PGME for their exam preparation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/packages"
                className="group inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-primary bg-white rounded-full no-underline transition-all duration-300 hover:shadow-[0_4px_24px_rgba(255,255,255,0.3)] hover:scale-105"
              >
                Browse Packages
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white! border border-white/30 rounded-full no-underline transition-all duration-300 hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
