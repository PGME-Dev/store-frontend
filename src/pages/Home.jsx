import { Link } from 'react-router-dom';

const categories = [
  {
    to: '/packages',
    icon: '📚',
    title: 'Course Packages',
    desc: 'Theory & Practical subscription packages',
  },
  {
    to: '/ebooks',
    icon: '📖',
    title: 'eBooks',
    desc: 'Digital books for your preparation',
  },
  {
    to: '/sessions',
    icon: '🎥',
    title: 'Live Sessions',
    desc: 'Interactive live classes & webinars',
  },
];

export default function Home() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">PGME Store</h1>
        <p className="text-text-secondary">
          Purchase courses, ebooks, and live session access
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <Link
            key={cat.to}
            to={cat.to}
            className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-border hover:shadow-md transition-shadow no-underline"
          >
            <span className="text-3xl">{cat.icon}</span>
            <div>
              <h2 className="text-base font-semibold text-text">{cat.title}</h2>
              <p className="text-sm text-text-secondary">{cat.desc}</p>
            </div>
            <span className="ml-auto text-text-secondary">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
