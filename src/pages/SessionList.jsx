import { useState, useEffect } from 'react';
import { getSessions } from '../api/sessions';
import { Link } from 'react-router-dom';
import { formatPrice } from '../components/PriceDisplay';

export default function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const result = await getSessions();
        setSessions(result.sessions || result || []);
      } catch {
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-error">{error}</div>;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-text mb-4">Live Sessions</h1>
      {sessions.length === 0 ? (
        <p className="text-text-secondary text-center py-12">No sessions available</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Link
              key={session.session_id}
              to={`/sessions/${session.session_id}`}
              className="block bg-surface rounded-xl border border-border p-4 hover:shadow-md transition-shadow no-underline"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-text mb-1">{session.title}</h3>
                  {session.scheduled_start && (
                    <p className="text-xs text-text-secondary mb-2">
                      {formatDate(session.scheduled_start)}
                    </p>
                  )}
                  {session.faculty_id?.name && (
                    <p className="text-xs text-text-secondary">
                      By {session.faculty_id.name}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {session.is_free ? (
                    <span className="text-sm font-bold text-success">FREE</span>
                  ) : (
                    <span className="text-sm font-bold text-text">
                      {formatPrice(session.price)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
