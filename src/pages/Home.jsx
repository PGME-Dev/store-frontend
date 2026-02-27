import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const categories = [
  {
    to: '/packages',
    title: 'Course Packages',
    desc: 'Theory & Practical subscription packages',
    iconBg: 'bg-primary/6',
    iconColor: 'text-primary',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    to: '/ebooks',
    title: 'eBooks',
    desc: 'Digital books for your preparation',
    iconBg: 'bg-accent/6',
    iconColor: 'text-accent',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        <line x1="9" y1="7" x2="17" y2="7"/>
        <line x1="9" y1="11" x2="14" y2="11"/>
      </svg>
    ),
  },
  {
    to: '/sessions',
    title: 'Live Sessions',
    desc: 'Interactive live classes & webinars',
    iconBg: 'bg-warning/6',
    iconColor: 'text-warning',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
  },
];

const stats = [
  { value: '50+', label: 'Courses' },
  { value: '1000+', label: 'Students' },
  { value: '30+', label: 'Faculty' },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-16 mb-10 sm:mb-16 lg:mb-24 animate-fade-in-up">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
            <img src="/logo.png" alt="" className="w-4 h-4 object-contain" />
            Medical Education Platform
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-text mb-3 sm:mb-5 leading-[1.15] tracking-tight">
            Your Gateway to{' '}
            <span className="text-primary">Medical Excellence</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6 sm:mb-8">
            Purchase courses, ebooks, and live session access to advance your medical career
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 lg:gap-12">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-text">{stat.value}</div>
                <div className="text-xs sm:text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lottie Animation */}
        <div className="flex-shrink-0 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-[400px] lg:h-[400px]">
          <DotLottieReact
            src="https://assets5.lottiefiles.com/packages/lf20_tutvdkg0.json"
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* Category Grid */}
      <div className="mb-5 sm:mb-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-text mb-1.5 sm:mb-2 animate-fade-in-up">Browse Categories</h2>
        <p className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-6 animate-fade-in-up">Explore our medical education resources</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 animate-fade-in-up-delay-1">
        {categories.map((cat) => (
          <Link
            key={cat.to}
            to={cat.to}
            className="group relative bg-white rounded-xl sm:rounded-2xl border border-border p-5 sm:p-6 lg:p-8 hover:shadow-md hover:border-primary/20 transition-all duration-300 no-underline"
          >
            <div className={`w-11 h-11 sm:w-12 sm:h-12 ${cat.iconBg} rounded-xl flex items-center justify-center mb-4 sm:mb-5 ${cat.iconColor} group-hover:scale-105 transition-transform duration-300`}>
              {cat.icon}
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-text mb-1.5 sm:mb-2">{cat.title}</h2>
            <p className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-5 leading-relaxed">{cat.desc}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Browse
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300">
                <path d="M5 12h14"/>
                <path d="M12 5l7 7-7 7"/>
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
