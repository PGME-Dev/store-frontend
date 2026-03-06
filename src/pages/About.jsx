import { Link } from 'react-router-dom';

function StatCard({ value, label, color }) {
  return (
    <div className={`${color} rounded-2xl p-5 sm:p-6 flex flex-col justify-between`}>
      <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text">{value}</span>
      <span className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-snug">{label}</span>
    </div>
  );
}

export default function About() {
  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-border p-6 sm:p-8 lg:p-10 mb-4 sm:mb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 sm:w-13 sm:h-13 bg-primary/8 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="PGME" className="w-7 h-7 sm:w-9 sm:h-9 object-contain" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text">About PGME</h1>
            <p className="text-xs sm:text-sm text-text-secondary">Post Graduate Medical Essentials</p>
          </div>
        </div>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
          The PGME National Level Online Mock Practical Examinations provide MD/DNB candidates with a realistic and immersive assessment experience, mirroring the intensity of postgraduate exams, with a focus on evaluating practical skills and clinical knowledge through well-designed scenarios. In addition, the Revision Lecture Series offers structured lectures on high-yield topics, detailed explanations of core concepts, and opportunities for interactive Q&A sessions. With flexible access to both live and recorded lectures, it empowers candidates to strengthen their preparation for practical and theoretical aspects of their medical training.
        </p>
      </div>

      {/* Bento Grid - Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
        {/* PGME Exams */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-border overflow-hidden group hover:shadow-md hover:border-primary/15 transition-all duration-300">
          {/* Decorative header */}
          <div className="h-32 sm:h-40 bg-gradient-to-br from-primary/8 via-primary/4 to-accent/6 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary/20">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            {/* Decorative dots */}
            <div className="absolute top-4 right-4 grid grid-cols-3 gap-1.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/10" />
              ))}
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-primary/8 rounded-lg flex items-center justify-center text-primary shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-text">PGME Exams</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              The PGME National Level Online Mock Practical Examinations provides MD/DNB postgraduates with a realistic and immersive assessment experience, mirroring the intensity of postgraduate exams, with a focus on evaluating practical skills and clinical knowledge through well-designed scenarios.
            </p>
          </div>
        </div>

        {/* PGME Revision Series */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-border overflow-hidden group hover:shadow-md hover:border-accent/15 transition-all duration-300">
          {/* Decorative header */}
          <div className="h-32 sm:h-40 bg-gradient-to-br from-accent/8 via-accent/4 to-primary/6 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent/20">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
            {/* Decorative circles */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-accent/10" />
              <div className="w-8 h-8 rounded-full border-2 border-accent/15 -ml-3" />
              <div className="w-8 h-8 rounded-full border-2 border-accent/8 -ml-3" />
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-accent/8 rounded-lg flex items-center justify-center text-accent shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-text">PGME Revision Series</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Revision Lecture Series is designed for MD/DNB postgraduates that offers structured lectures on high-yield topics, detailed explanations of core concepts, and opportunities for interactive Q&A sessions. With flexible access to both live and recorded lectures, it empowers candidates to strengthen their preparation for practical and theoretical aspects of their medical training.
            </p>
          </div>
        </div>
      </div>

      {/* Grand Total Stats - Bento Grid */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 lg:p-8 mb-4 sm:mb-5">
        <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
          <div className="w-8 h-8 bg-success/8 rounded-lg flex items-center justify-center text-success shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-text">Grand Total</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          <StatCard value="159" label="Total Sessions" color="bg-primary/4" />
          <StatCard value="217.67" label="Total Hours" color="bg-accent/4" />
          <StatCard value="3,148" label="PG Resident Registrations" color="bg-success/4" />
          <StatCard value="60+" label="Examiners" color="bg-warning/4" />
        </div>

        {/* Breakdown sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Revision Lectures */}
          <div className="rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-6 h-6 bg-accent/8 rounded-md flex items-center justify-center text-accent">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-text">Revision Lecture Sessions</h3>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="text-xl sm:text-2xl font-bold text-text">53</span>
                <p className="text-[11px] sm:text-xs text-text-secondary mt-0.5">Sessions</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <span className="text-xl sm:text-2xl font-bold text-text">126</span>
                <p className="text-[11px] sm:text-xs text-text-secondary mt-0.5">Hours</p>
              </div>
            </div>
          </div>

          {/* Mock Practical Exams */}
          <div className="rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-6 h-6 bg-primary/8 rounded-md flex items-center justify-center text-primary">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-text">Online Mock Practical Exams</h3>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="text-xl sm:text-2xl font-bold text-text">106</span>
                <p className="text-[11px] sm:text-xs text-text-secondary mt-0.5">Sessions</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <span className="text-xl sm:text-2xl font-bold text-text">91.67</span>
                <p className="text-[11px] sm:text-xs text-text-secondary mt-0.5">Hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA - commented out */}
      {/* <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Ready to elevate your preparation?</h2>
        <p className="text-sm text-white/70 mb-5 max-w-lg mx-auto">Browse our course packages, eBooks, and live sessions to start your journey.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/packages" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary text-sm font-semibold rounded-xl no-underline hover:bg-white/90 transition-colors">
            Browse Packages
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white text-sm font-semibold rounded-xl no-underline hover:bg-white/20 transition-colors border border-white/20">
            Contact Us
          </Link>
        </div>
      </div> */}
    </div>
  );
}
