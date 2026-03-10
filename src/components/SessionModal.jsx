import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { getSessionById } from '../api/sessions';
import { useAuth } from '../context/AuthContext';
import { usePurchase } from '../context/PurchaseContext';
import { formatPrice } from './PriceDisplay';

export default function SessionModal({ session: listSession, onClose }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isSessionPurchased } = usePurchase();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const bodyRef = useRef(null);

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

  // Lock body scroll & close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const blockAllScroll = (e) => e.preventDefault();
    document.addEventListener('keydown', handleKey);
    document.addEventListener('wheel', blockAllScroll, { passive: false });
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('wheel', blockAllScroll);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleModalWheel = (e) => {
    e.stopPropagation();
    if (bodyRef.current) {
      bodyRef.current.scrollTop += e.deltaY;
    }
  };

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

  const modal = (
    <div className="fixed inset-0 z-999">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-modal-backdrop"
        onClick={onClose}
      />

      {/* Centered container */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full flex items-center justify-center">
          {/* Modal card */}
          <div
            className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-clip animate-modal-content flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleModalWheel}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-colors cursor-pointer border-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="relative gradient-hero px-5 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-5 sm:pb-6 shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
                <span className="text-[11px] sm:text-xs font-medium text-white/60">Live Session</span>
                {subjectName && (
                  <>
                    <span className="text-white/30">·</span>
                    <span className="text-[11px] sm:text-xs font-medium text-white/60">{subjectName}</span>
                  </>
                )}
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug pr-10">{s?.title}</h2>
              {facultyName && (
                <p className="text-white/70 text-xs sm:text-sm mt-1">By {facultyName}</p>
              )}
            </div>

            {/* Body */}
            <div ref={bodyRef} className="relative px-5 sm:px-6 md:px-8 py-5 sm:py-6 space-y-5 overflow-y-auto flex-1 min-h-0 overscroll-contain">
              {loading && !session ? (
                <div className="space-y-5">
                  {/* Schedule card skeleton */}
                  <div className="flex items-start gap-3 rounded-2xl p-3.5 sm:p-4 bg-surface-dim border border-border">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 skeleton rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-3/4 rounded-lg" />
                      <div className="skeleton h-3 w-1/2 rounded-lg" />
                    </div>
                  </div>
                  {/* Description skeleton */}
                  <div>
                    <div className="skeleton h-3.5 w-16 mb-2 rounded-lg" />
                    <div className="space-y-1.5">
                      <div className="skeleton h-3 w-full rounded-lg" />
                      <div className="skeleton h-3 w-full rounded-lg" />
                      <div className="skeleton h-3 w-2/3 rounded-lg" />
                    </div>
                  </div>
                  {/* Faculty card skeleton */}
                  <div className="flex items-start gap-3 sm:gap-4 rounded-2xl p-3.5 sm:p-4 bg-surface-dim border border-border">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 skeleton rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-32 rounded-lg" />
                      <div className="skeleton h-3 w-24 rounded-lg" />
                      <div className="skeleton h-3 w-40 rounded-lg" />
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-4 text-error text-sm">{error}</div>
              ) : (
                <>
                  {/* Thumbnail */}
                  {s.thumbnail_url && (
                    <div className="rounded-xl overflow-hidden">
                      <img
                        src={s.thumbnail_url}
                        alt={s.title}
                        className="w-full h-auto max-h-56 object-cover"
                      />
                    </div>
                  )}

                  {/* Schedule */}
                  {startTime && (
                    <div className="flex items-start gap-3 bg-surface-dim border border-border rounded-xl p-3.5 sm:p-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/8 rounded-lg flex items-center justify-center shrink-0">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
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
                        <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                          {s.duration_minutes && <span>{s.duration_minutes} min</span>}
                          {endTime && (
                            <>
                              <span className="text-border">·</span>
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
                      <h4 className="text-xs sm:text-sm font-semibold text-text mb-1.5">About</h4>
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{s.description}</p>
                    </div>
                  )}

                  {/* Topics */}
                  {s.topics?.length > 0 && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-text mb-2">Topics</h4>
                      <ul className="space-y-1.5">
                        {s.topics.map((topic, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-text-secondary">
                            <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Faculty */}
                  {facultyName && (
                    <div className="flex items-start gap-3 sm:gap-4 bg-surface-dim border border-border rounded-xl p-3.5 sm:p-4">
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

            {/* Footer CTA - price & purchase commented out */}
            {/*
            <div className="relative border-t border-border px-5 sm:px-6 md:px-8 py-5 sm:py-6 bg-white shrink-0">
              {purchased ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-success/8 rounded-lg flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-success">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-success">Purchased</div>
                    <p className="text-xs text-text-secondary">Open the PGME app to access this session</p>
                  </div>
                </div>
              ) : isFree ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-success bg-success/8 px-3 py-1.5 rounded-full">FREE</span>
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
                    className="btn-primary py-2.5! sm:py-3! min-w-35 sm:min-w-40"
                  >
                    Buy Now
                  </button>
                </div>
              )}
            </div>
            */}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
