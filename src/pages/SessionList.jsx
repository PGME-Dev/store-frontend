import { useState, useEffect } from 'react';
import { getSessions } from '../api/sessions';
import { usePurchase } from '../context/PurchaseContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../components/PriceDisplay';

export default function SessionList() {
  const { isSessionPurchased } = usePurchase();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        // Sessions are NOT filtered by subject (matching app behavior)
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
    return <div className="text-center py-12 text-error text-sm">{error}</div>;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-5 sm:mb-8 lg:mb-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-warning/6 rounded-xl flex items-center justify-center text-warning shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text">Live Sessions</h1>
            <p className="text-text-secondary text-xs sm:text-sm">Interactive live classes & webinars</p>
          </div>
        </div>
      </div>
      {sessions.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-surface-dim rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-secondary">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </div>
          <p className="text-text-secondary text-sm">No sessions available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {sessions.map((session) => {
            const purchased = isSessionPurchased(session.session_id);
            return (
              <Link
                key={session.session_id}
                to={`/sessions/${session.session_id}`}
                className="group block bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5 lg:p-6 hover:shadow-md hover:border-primary/15 transition-all duration-300 no-underline"
              >
                <div className="flex items-start justify-between gap-3 mb-2.5 sm:mb-3">
                  <h3 className="text-sm sm:text-base font-semibold text-text group-hover:text-primary transition-colors">{session.title}</h3>
                  <div className="shrink-0">
                    {purchased ? (
                      <span className="text-[10px] sm:text-xs font-semibold text-success bg-success/8 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">Purchased</span>
                    ) : session.is_free ? (
                      <span className="text-[10px] sm:text-xs font-semibold text-success bg-success/8 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">FREE</span>
                    ) : (
                      <span className="text-xs sm:text-sm font-bold text-text">
                        {formatPrice(session.price)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  {session.scheduled_start && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-text-secondary">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span className="truncate">{formatDate(session.scheduled_start)}</span>
                    </div>
                  )}
                  {session.faculty_id?.name && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-text-secondary">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      {session.faculty_id.name}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
