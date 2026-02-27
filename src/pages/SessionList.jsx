import { useState, useEffect } from 'react';
import { getSessions } from '../api/sessions';
import { usePurchase } from '../context/PurchaseContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../components/PriceDisplay';

// Subtle decorative SVG illustrations for card corners (rotate through these)
const illustrations = [
  // Molecular / atoms
  (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="text-primary/4">
      <circle cx="36" cy="36" r="14" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="36" cy="36" r="3" fill="currentColor"/>
      <circle cx="36" cy="22" r="2.5" fill="currentColor"/>
      <circle cx="48" cy="43" r="2.5" fill="currentColor"/>
      <circle cx="24" cy="43" r="2.5" fill="currentColor"/>
      <circle cx="50" cy="26" r="8" stroke="currentColor" strokeWidth="1"/>
      <circle cx="22" cy="52" r="6" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  // Brain / neural
  (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="text-warning/6">
      <path d="M36 18c-6 0-12 4-14 10s0 14 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M36 18c6 0 12 4 14 10s0 14-6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M28 46c-2 3-1 7 2 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M44 46c2 3 1 7-2 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="36" y1="18" x2="36" y2="55" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3"/>
      <circle cx="36" cy="32" r="2" fill="currentColor"/>
      <circle cx="30" cy="38" r="1.5" fill="currentColor"/>
      <circle cx="42" cy="38" r="1.5" fill="currentColor"/>
    </svg>
  ),
  // Stethoscope
  (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="text-success/6">
      <path d="M24 20v16a12 12 0 0 0 24 0V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="24" cy="18" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="48" cy="18" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M48 36v4a8 8 0 0 1-8 8h0a8 8 0 0 1-8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="48" cy="42" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="48" cy="42" r="1.5" fill="currentColor"/>
    </svg>
  ),
  // DNA helix
  (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="text-accent/6">
      <path d="M28 16c0 8 16 12 16 20s-16 12-16 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M44 16c0 8-16 12-16 20s16 12 16 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="30" y1="22" x2="42" y2="22" stroke="currentColor" strokeWidth="1"/>
      <line x1="28" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="1"/>
      <line x1="28" y1="42" x2="44" y2="42" stroke="currentColor" strokeWidth="1"/>
      <line x1="30" y1="50" x2="42" y2="50" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  // Heartbeat / pulse
  (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="text-error/5">
      <path d="M12 40h12l4-12 6 24 6-18 4 6h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M36 22c-3-6-12-8-16-2s-2 14 16 26c18-12 20-20 16-26s-13-4-16 2z" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
];

function SessionCard({ session, purchased, illustrationIndex }) {
  const illustration = illustrations[illustrationIndex % illustrations.length];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <Link
      to={`/sessions/${session.session_id}`}
      className="group relative block bg-white rounded-xl sm:rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/15 transition-all duration-300 no-underline"
    >
      {/* Decorative illustration in bottom-right */}
      <div className="absolute bottom-0 right-0 pointer-events-none opacity-100 group-hover:opacity-60 transition-opacity">
        {illustration}
      </div>

      <div className="relative p-4 sm:p-5">
        {/* Top row: Subject tag + Price/Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {session.subject_name ? (
            <span className="text-[10px] sm:text-xs font-medium text-primary bg-primary/6 px-2 py-0.5 rounded-full truncate">
              {session.subject_name}
            </span>
          ) : <span />}
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

        {/* Title */}
        <h3 className="text-sm sm:text-base font-semibold text-text group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-snug">
          {session.title}
        </h3>

        {/* Description */}
        {session.description && (
          <p className="text-[11px] sm:text-xs text-text-secondary line-clamp-2 mb-3 leading-relaxed">
            {session.description}
          </p>
        )}

        {/* Schedule info */}
        {(session.scheduled_start_time || session.scheduled_start) && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs mb-3 flex-wrap">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning shrink-0">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="text-text font-medium">{formatDate(session.scheduled_start_time || session.scheduled_start)}</span>
            <span className="text-text-secondary">at</span>
            <span className="text-text font-medium">{formatTime(session.scheduled_start_time || session.scheduled_start)}</span>
            {session.duration_minutes && (
              <span className="text-text-secondary">· {session.duration_minutes} min</span>
            )}
          </div>
        )}

        {/* Faculty row */}
        {(session.faculty_name || session.faculty_id?.name) && (
          <div className="flex items-center gap-2.5 pt-3 border-t border-border/60">
            {(session.faculty_photo_url || session.faculty_id?.photo_url) ? (
              <img
                src={session.faculty_photo_url || session.faculty_id.photo_url}
                alt={session.faculty_name || session.faculty_id.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                <span className="text-[10px] sm:text-xs font-semibold text-primary">
                  {(session.faculty_name || session.faculty_id?.name || '?').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-medium text-text truncate">
                {session.faculty_name || session.faculty_id?.name}
              </div>
              {(session.faculty_specialization || session.faculty_id?.specialization) && (
                <div className="text-[10px] sm:text-[11px] text-text-secondary truncate">
                  {session.faculty_specialization || session.faculty_id.specialization}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function SessionList() {
  const { isSessionPurchased } = usePurchase();
  const { isAuthenticated } = useAuth();
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
    return <div className="text-center py-12 text-error text-sm">{error}</div>;
  }

  const now = new Date();

  // Split sessions: purchased ones (that haven't ended) go to "Your Sessions"
  const yourSessions = [];
  const otherSessions = [];

  sessions.forEach((session) => {
    const purchased = isSessionPurchased(session.session_id);
    const endTime = session.scheduled_end_time || session.scheduled_end;
    const hasEnded = endTime && new Date(endTime) < now;

    if (purchased && !hasEnded) {
      yourSessions.push(session);
    } else {
      otherSessions.push(session);
    }
  });

  const hasYourSessions = isAuthenticated && yourSessions.length > 0;
  const totalSessions = yourSessions.length + otherSessions.length;

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

      {totalSessions === 0 ? (
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
        <div className="space-y-6 sm:space-y-8">
          {/* Your Sessions (purchased, not ended) */}
          {hasYourSessions && (
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-text mb-3 sm:mb-4 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-success">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Your Sessions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                {yourSessions.map((session, index) => (
                  <SessionCard
                    key={session.session_id}
                    session={session}
                    purchased={true}
                    illustrationIndex={index}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Sessions */}
          {otherSessions.length > 0 && (
            <div>
              {hasYourSessions && (
                <h2 className="text-sm sm:text-base font-semibold text-text mb-3 sm:mb-4">
                  All Sessions
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                {otherSessions.map((session, index) => (
                  <SessionCard
                    key={session.session_id}
                    session={session}
                    purchased={isSessionPurchased(session.session_id)}
                    illustrationIndex={hasYourSessions ? index + yourSessions.length : index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
