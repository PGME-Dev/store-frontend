import { useState, useEffect } from 'react';
import { getSessions } from '../api/sessions';
import { usePurchase } from '../context/PurchaseContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../components/PriceDisplay';
import SessionModal from '../components/SessionModal';

// Subtle decorative SVG illustrations for card corners (5 medical-themed, cycling)
const illustrations = [
  // Molecular / atoms
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="16" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="40" cy="40" r="3.5" fill="currentColor"/>
      <circle cx="40" cy="24" r="2.5" fill="currentColor"/>
      <circle cx="54" cy="48" r="2.5" fill="currentColor"/>
      <circle cx="26" cy="48" r="2.5" fill="currentColor"/>
      <circle cx="56" cy="28" r="9" stroke="currentColor" strokeWidth="0.8"/>
      <circle cx="24" cy="58" r="7" stroke="currentColor" strokeWidth="0.8"/>
    </svg>
  ),
  // Brain / neural
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M40 18c-7 0-14 5-16 12s0 16 7 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M40 18c7 0 14 5 16 12s0 16-7 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M31 50c-2 3-1 8 2 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M49 50c2 3 1 8-2 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="40" y1="18" x2="40" y2="60" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3"/>
      <circle cx="40" cy="35" r="2.5" fill="currentColor"/>
      <circle cx="33" cy="42" r="2" fill="currentColor"/>
      <circle cx="47" cy="42" r="2" fill="currentColor"/>
    </svg>
  ),
  // Stethoscope
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M28 22v18a14 14 0 0 0 28 0V22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="28" cy="20" r="3" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="56" cy="20" r="3" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M56 40v5a9 9 0 0 1-9 9h0a9 9 0 0 1-9-9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="56" cy="48" r="5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="56" cy="48" r="2" fill="currentColor"/>
    </svg>
  ),
  // DNA helix
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M30 12c0 10 20 15 20 25s-20 15-20 25s20 15 20 25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M50 12c0 10-20 15-20 25s20 15 20 25s-20 15-20 25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="33" y1="20" x2="47" y2="20" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="30" y1="30" x2="50" y2="30" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="30" y1="45" x2="50" y2="45" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="33" y1="55" x2="47" y2="55" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="30" y1="70" x2="50" y2="70" stroke="currentColor" strokeWidth="0.8"/>
    </svg>
  ),
  // Heartbeat / pulse
  (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M10 46h14l5-14 7 28 7-20 5 6h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M40 24c-4-7-14-9-18-3s-2 16 18 30c20-14 22-24 18-30s-14-4-18 3z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
    </svg>
  ),
];

const illustrationColors = [
  'text-primary',
  'text-warning',
  'text-success',
  'text-accent',
  'text-error',
];

function SessionCard({ session, purchased, illustrationIndex, onClick }) {
  const illustration = illustrations[illustrationIndex % illustrations.length];
  const colorClass = illustrationColors[illustrationIndex % illustrationColors.length];

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

  const startTime = session.scheduled_start_time || session.scheduled_start;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block w-full text-left bg-white rounded-2xl border border-border overflow-hidden card-hover cursor-pointer"
    >
      {/* Cover image or illustration fallback */}
      {session.thumbnail_url ? (
        <div className="aspect-[16/9] bg-surface-dim overflow-hidden relative">
          <img
            src={session.thumbnail_url}
            alt={session.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
          {purchased && (
            <span className="absolute top-2 right-2 text-[10px] sm:text-xs font-semibold bg-success text-white px-2 py-0.5 rounded-full">
              Purchased
            </span>
          )}
          {!purchased && session.is_free && (
            <span className="absolute top-2 right-2 text-[10px] sm:text-xs font-semibold bg-success text-white px-2 py-0.5 rounded-full">
              FREE
            </span>
          )}
        </div>
      ) : (
        <div className={`absolute -bottom-1 -right-1 pointer-events-none opacity-[0.08] group-hover:opacity-[0.12] transition-opacity ${colorClass}`}>
          {illustration}
        </div>
      )}

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
        {startTime && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs mb-3 flex-wrap">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning shrink-0">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="text-text font-medium">{formatDate(startTime)}</span>
            <span className="text-text-secondary">at</span>
            <span className="text-text font-medium">{formatTime(startTime)}</span>
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
    </button>
  );
}

export default function SessionList() {
  const { isSessionPurchased } = usePurchase();
  const { isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);

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

  // Client-side safety: exclude sessions past their end time
  const activeSessions = sessions.filter((s) => {
    const endTime = s.scheduled_end_time || s.scheduled_end;
    if (!endTime) return true; // No end time = keep it
    return new Date(endTime) > now;
  });

  // Split: purchased (not ended) go to "Your Sessions"
  const yourSessions = [];
  const otherSessions = [];

  activeSessions.forEach((session) => {
    const purchased = isSessionPurchased(session.session_id);
    if (purchased) {
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
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-text">Live Sessions</h1>
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
                    onClick={() => setSelectedSession(session)}
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
                    onClick={() => setSelectedSession(session)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Session detail modal */}
      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}
