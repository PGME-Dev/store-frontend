import { useState, useEffect } from 'react';
import { getSessions } from '../api/sessions';
import { usePurchase } from '../context/PurchaseContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../components/PriceDisplay';
import SessionModal from '../components/SessionModal';

function SessionCard({ session, purchased, onClick }) {
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
      className="group relative flex flex-col w-full text-left bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer"
    >
      {/* Cover image */}
      <div className="relative bg-surface-dim">
        {session.thumbnail_url ? (
          <div className="aspect-video overflow-hidden">
            <img
              src={session.thumbnail_url}
              alt={session.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="aspect-video flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-text-tertiary/30">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </div>
        )}
        {/* Badges */}
        {purchased && (
          <span className="absolute top-3 right-3 text-[10px] sm:text-xs font-semibold bg-success text-white px-2.5 py-1 rounded-full shadow-sm">
            Purchased
          </span>
        )}
        {!purchased && session.is_free && (
          <span className="absolute top-3 right-3 text-[10px] sm:text-xs font-semibold bg-success text-white px-2.5 py-1 rounded-full shadow-sm">
            FREE
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Subject tag */}
        {session.subject_name && (
          <span className="self-start text-[10px] sm:text-xs font-medium text-primary bg-primary/6 px-2 py-0.5 rounded-full mb-2.5">
            {session.subject_name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-sm sm:text-base font-semibold text-text group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
          {session.title}
        </h3>

        {/* Description */}
        {session.description && (
          <p className="text-[11px] sm:text-xs text-text-tertiary line-clamp-2 leading-relaxed mb-3">
            {session.description}
          </p>
        )}

        {/* Schedule info */}
        {startTime && (
          <div className="flex items-center gap-2 text-[11px] sm:text-xs mb-3 flex-wrap">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="text-text font-medium">{formatDate(startTime)}</span>
            <span className="text-text-tertiary">at</span>
            <span className="text-text font-medium">{formatTime(startTime)}</span>
            {session.duration_minutes && (
              <span className="text-text-tertiary">· {session.duration_minutes} min</span>
            )}
          </div>
        )}

        {/* Footer: faculty + price */}
        <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between gap-3">
          {/* Faculty */}
          <div className="flex items-center gap-2 min-w-0">
            {(session.faculty_name || session.faculty_id?.name) && (
              <>
                {(session.faculty_photo_url || session.faculty_id?.photo_url) ? (
                  <img
                    src={session.faculty_photo_url || session.faculty_id.photo_url}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-semibold text-primary">
                      {(session.faculty_name || session.faculty_id?.name || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-xs font-medium text-text truncate">
                  {session.faculty_name || session.faculty_id?.name}
                </span>
              </>
            )}
          </div>
          {/* Price */}
          <div className="shrink-0">
            {purchased ? (
              <span className="text-xs font-semibold text-success bg-success/8 px-2.5 py-1 rounded-full">Purchased</span>
            ) : session.is_free ? (
              <span className="text-xs font-semibold text-success bg-success/8 px-2.5 py-1 rounded-full">FREE</span>
            ) : (
              <span className="text-sm font-bold text-text">{formatPrice(session.price)}</span>
            )}
          </div>
        </div>
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
      <div className="flex justify-center py-24">
        <div className="w-9 h-9 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-16 text-error text-sm">{error}</div>;
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
      <div className="mb-6 sm:mb-10 lg:mb-12">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Live</p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-extrabold text-text tracking-tight">
            Live Sessions
          </h1>
          <p className="text-text-secondary text-sm sm:text-base mt-2">
            Interactive live classes & webinars
          </p>
        </div>
      </div>

      {totalSessions === 0 ? (
        <div className="text-center py-16 sm:py-24">
          <div className="w-18 h-18 sm:w-20 sm:h-20 bg-surface-dim rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </div>
          <p className="text-text-secondary text-sm sm:text-base font-medium mb-1">No sessions available</p>
          <p className="text-text-tertiary text-xs sm:text-sm">Check back later for upcoming live sessions</p>
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-10">
          {/* Your Sessions (purchased, not ended) */}
          {hasYourSessions && (
            <div>
              <div className="mb-5 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-text">
                  Your Sessions
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 lg:gap-6 2xl:gap-7">
                {yourSessions.map((session) => (
                  <SessionCard
                    key={session.session_id}
                    session={session}
                    purchased={true}
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
                <div className="border-t border-border pt-6 sm:pt-8 mb-5 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-text">
                    All Sessions
                  </h2>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 lg:gap-6 2xl:gap-7">
                {otherSessions.map((session) => (
                  <SessionCard
                    key={session.session_id}
                    session={session}
                    purchased={isSessionPurchased(session.session_id)}
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
