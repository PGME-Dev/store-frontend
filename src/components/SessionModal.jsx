import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessionById } from '../api/sessions';
import { useAuth } from '../context/AuthContext';
import { usePurchase } from '../context/PurchaseContext';
import { formatPrice } from './PriceDisplay';

// Background illustration for modal (large, faded DNA helix)
function ModalBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        width="320" height="400" viewBox="0 0 320 400"
        fill="none"
        className="absolute -right-10 -bottom-10 text-primary/[0.03]"
      >
        <path d="M120 20c0 50 80 75 80 125s-80 75-80 125s80 75 80 125" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M200 20c0 50-80 75-80 125s80 75 80 125s-80 75-80 125" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <line x1="130" y1="55" x2="190" y2="55" stroke="currentColor" strokeWidth="2"/>
        <line x1="120" y1="95" x2="200" y2="95" stroke="currentColor" strokeWidth="2"/>
        <line x1="120" y1="145" x2="200" y2="145" stroke="currentColor" strokeWidth="2"/>
        <line x1="130" y1="185" x2="190" y2="185" stroke="currentColor" strokeWidth="2"/>
        <line x1="120" y1="225" x2="200" y2="225" stroke="currentColor" strokeWidth="2"/>
        <line x1="120" y1="275" x2="200" y2="275" stroke="currentColor" strokeWidth="2"/>
        <line x1="130" y1="315" x2="190" y2="315" stroke="currentColor" strokeWidth="2"/>
        <line x1="120" y1="355" x2="200" y2="355" stroke="currentColor" strokeWidth="2"/>
        <circle cx="160" cy="145" r="4" fill="currentColor" opacity="0.5"/>
        <circle cx="160" cy="275" r="4" fill="currentColor" opacity="0.5"/>
      </svg>
    </div>
  );
}

export default function SessionModal({ session: listSession, onClose }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isSessionPurchased } = usePurchase();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sessionId = listSession?.session_id || listSession?._id;

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    (async () => {
      try {
        const result = await getSessionById(sessionId);
        setSession(result.session || result);
      } catch {
        setError('Failed to load session details');
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const purchased = isSessionPurchased(sessionId);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  const handleBuy = () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/login', { state: { from: { pathname: `/sessions/${sessionId}` } } });
      return;
    }
    onClose();
    navigate(`/checkout/sessions/${sessionId}`);
  };

  // Use list data as fallback while detail loads
  const s = session || listSession;
  const facultyName = s?.faculty?.name || s?.faculty_name || s?.faculty_id?.name;
  const facultyPhoto = s?.faculty?.photo_url || s?.faculty_photo_url || s?.faculty_id?.photo_url;
  const facultySpec = s?.faculty?.specialization || s?.faculty_specialization || s?.faculty_id?.specialization;
  const facultyBio = s?.faculty?.bio;
  const facultyQualifications = s?.faculty?.qualifications;
  const facultyExpYears = s?.faculty?.experience_years;
  const subjectName = s?.subject?.name || s?.subject_name;
  const startTime = s?.scheduled_start_time || s?.scheduled_start;
  const endTime = s?.scheduled_end_time || s?.scheduled_end;
  const isFree = s?.is_free;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 md:p-6 pt-8 sm:pt-12 md:pt-16 overflow-y-auto" onClick={onClose}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalBackground />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer border-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Header */}
        <div className="relative bg-linear-to-br from-warning to-orange-400 px-5 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-5 sm:pb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <span className="text-[11px] sm:text-xs font-medium text-white/70">Live Session</span>
            {subjectName && (
              <>
                <span className="text-white/40">·</span>
                <span className="text-[11px] sm:text-xs font-medium text-white/70">{subjectName}</span>
              </>
            )}
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug pr-8">{s?.title}</h2>
          {facultyName && (
            <p className="text-white/75 text-xs sm:text-sm mt-1">By {facultyName}</p>
          )}
        </div>

        {/* Body */}
        <div className="relative px-5 sm:px-6 md:px-8 py-5 sm:py-6 space-y-4 sm:space-y-5">
          {loading && !session ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-6 text-error text-sm">{error}</div>
          ) : (
            <>
              {/* Schedule row */}
              {startTime && (
                <div className="flex items-start gap-3 bg-surface-dim/60 rounded-xl p-3.5 sm:p-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-warning/10 rounded-xl flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text">
                      {formatDate(startTime)} at {formatTime(startTime)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-secondary mt-0.5">
                      {s.duration_minutes && <span>{s.duration_minutes} minutes</span>}
                      {endTime && (
                        <>
                          <span>·</span>
                          <span>Ends {formatTime(endTime)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {s.description && (
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-text mb-1.5 sm:mb-2">About this Session</h4>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{s.description}</p>
                </div>
              )}

              {/* Topics */}
              {s.topics?.length > 0 && (
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-text mb-2 sm:mb-3">Topics Covered</h4>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {s.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-text-secondary">
                        <div className="w-4 h-4 bg-primary/6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                        </div>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Faculty card */}
              {facultyName && (
                <div className="flex items-start gap-3 sm:gap-4 bg-surface-dim/60 rounded-xl p-3.5 sm:p-4">
                  {facultyPhoto ? (
                    <img
                      src={facultyPhoto}
                      alt={facultyName}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                      <span className="text-sm sm:text-base font-semibold text-primary">
                        {facultyName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-text">{facultyName}</div>
                    {facultySpec && (
                      <div className="text-xs text-text-secondary">{facultySpec}</div>
                    )}
                    {facultyQualifications && (
                      <div className="text-[11px] text-text-secondary mt-0.5">{facultyQualifications}</div>
                    )}
                    {facultyExpYears && (
                      <div className="text-[11px] text-text-secondary">{facultyExpYears} years experience</div>
                    )}
                    {facultyBio && (
                      <p className="text-[11px] sm:text-xs text-text-secondary mt-1.5 leading-relaxed line-clamp-3">{facultyBio}</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer CTA */}
        <div className="relative border-t border-border px-5 sm:px-6 md:px-8 py-4 sm:py-5 bg-white">
          {purchased ? (
            <div className="flex items-center justify-center gap-2.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-success">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <span className="text-sm font-semibold text-success">Purchased</span>
                <p className="text-xs text-text-secondary">Open the PGME app to access this session</p>
              </div>
            </div>
          ) : isFree ? (
            <div className="flex items-center justify-center gap-2.5">
              <span className="text-sm font-semibold text-success bg-success/8 px-3 py-1.5 rounded-full">FREE</span>
              <p className="text-xs text-text-secondary">Open the PGME app to join this session</p>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-lg sm:text-xl font-bold text-text">{formatPrice(s?.price)}</div>
                {s?.compare_at_price && s.compare_at_price > s.price && (
                  <div className="text-xs text-text-secondary line-through">{formatPrice(s.compare_at_price)}</div>
                )}
              </div>
              <button
                onClick={handleBuy}
                className="px-6 sm:px-8 py-3 bg-warning text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors cursor-pointer border-0 text-sm sm:text-base"
              >
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
