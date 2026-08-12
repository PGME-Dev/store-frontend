import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getWorkshopById,
  getWorkshopCapacity,
  getWorkshopRecordings,
  enrollInWorkshop,
  cancelWorkshopEnrollment,
  joinWorkshopDay,
  getCertificateStatus,
  claimCertificate,
} from '../api/workshops';
import { useAuth } from '../context/AuthContext';
import { usePurchase } from '../context/PurchaseContext';
import PriceDisplay from '../components/PriceDisplay';
import RecommendationRail from '../components/RecommendationRail';
import { formatDateRange } from './WorkshopList';

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function formatDayHeading(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(value) {
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** "Starts in 2d 4h" / "Starts in 12m" — null once the moment has passed. */
function countdownLabel(target, now) {
  const diff = new Date(target).getTime() - now;
  if (diff <= 0) return null;
  const minutes = Math.floor(diff / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

const dayStatusStyles = {
  live: 'bg-error text-white',
  scheduled: 'bg-primary/8 text-primary',
  completed: 'bg-surface-dim text-text-tertiary',
  cancelled: 'bg-error/10 text-error',
};

// ---------------------------------------------------------------------------

export default function WorkshopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { refreshPurchases } = usePurchase();

  const [workshop, setWorkshop] = useState(null);
  const [capacity, setCapacity] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [actionError, setActionError] = useState('');
  const [joiningDayId, setJoiningDayId] = useState(null);
  const [claimingCertificate, setClaimingCertificate] = useState(false);

  // Drives the per-day countdown and "join opens in…" copy without refetching.
  const [now, setNow] = useState(() => Date.now());
  const tickRef = useRef(null);

  useEffect(() => {
    tickRef.current = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(tickRef.current);
  }, []);

  const load = useCallback(async () => {
    try {
      const result = await getWorkshopById(id);
      const loaded = result.workshop || result;
      setWorkshop(loaded);
      setError('');

      // These are all non-critical — a failure shouldn't blank the page.
      getWorkshopCapacity(id).then(setCapacity).catch(() => setCapacity(null));
      getWorkshopRecordings(id)
        .then((r) => setRecordings(r.recordings || []))
        .catch(() => setRecordings([]));

      if (isAuthenticated && loaded?.certificate_enabled) {
        getCertificateStatus(id).then(setCertificate).catch(() => setCertificate(null));
      }
    } catch {
      setError('Failed to load workshop');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => { load(); }, [load]);

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  const requireLogin = () => {
    navigate('/login', { state: { from: { pathname: `/workshops/${id}` } } });
  };

  const handleBook = () => {
    if (!isAuthenticated) return requireLogin();
    navigate(`/checkout/workshops/${id}`);
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) return requireLogin();
    setIsEnrolling(true);
    setActionError('');
    try {
      await enrollInWorkshop(id);
      await load();
      refreshPurchases?.();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!window.confirm('Cancel your registration for this workshop?')) return;
    setIsEnrolling(true);
    setActionError('');
    try {
      await cancelWorkshopEnrollment(id);
      await load();
      refreshPurchases?.();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Could not cancel your registration.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleJoinDay = async (day) => {
    setJoiningDayId(day.session_id);
    setActionError('');
    try {
      const result = await joinWorkshopDay(day.session_id);
      const link = result?.meeting_link;
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer');
        // Reflect the new attendance mark without a full reload flash.
        load();
      } else {
        setActionError('No meeting link is available for this day yet. Please try again shortly.');
      }
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Could not join this day.');
    } finally {
      setJoiningDayId(null);
    }
  };

  const handleClaimCertificate = async () => {
    setClaimingCertificate(true);
    setActionError('');
    try {
      const result = await claimCertificate(id);
      if (result?.url) window.open(result.url, '_blank', 'noopener,noreferrer');
      const status = await getCertificateStatus(id);
      setCertificate(status);
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Could not generate your certificate.');
    } finally {
      setClaimingCertificate(false);
    }
  };

  // -------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !workshop) {
    return <div className="text-center py-12 text-error text-sm">{error || 'Workshop not found'}</div>;
  }

  const days = workshop.days || [];
  const activeDays = days.filter((d) => d.status !== 'cancelled');
  const hasAccess = workshop.has_access === true;
  const isEnrolled = workshop.is_enrolled === true;
  const isWaitlisted = workshop.enrollment_status === 'waitlisted';
  const isPaid = !workshop.is_free && workshop.price > 0;
  const registrationOpen = workshop.registration_open !== false;
  const isCancelled = workshop.status === 'cancelled';
  const isFinished = workshop.status === 'completed';
  const readyRecordings = recordings.filter((r) => !r.is_locked && r.video_url);

  /** The primary CTA state — one place, so desktop and mobile never disagree. */
  const cta = (() => {
    if (isCancelled) return { kind: 'cancelled' };
    if (hasAccess) return { kind: 'enrolled' };
    if (isWaitlisted) return { kind: 'waitlisted' };
    if (!registrationOpen) return { kind: 'closed' };
    if (capacity?.is_full && !capacity?.allow_waitlist) return { kind: 'full' };
    if (isPaid) return { kind: 'buy' };
    return { kind: 'register' };
  })();

  const seatsLine = (() => {
    if (!capacity || capacity.is_unlimited) return null;
    if (capacity.available_seats > 0) {
      return `${capacity.available_seats} of ${capacity.effective_capacity} seats left`;
    }
    return capacity.allow_waitlist ? 'Sold out — join the waitlist' : 'Sold out';
  })();

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-5xl 2xl:max-w-6xl mx-auto">
        {/* Hero */}
        <div className="gradient-hero rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 text-white mb-6 sm:mb-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white opacity-[0.06]" />
          <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-white opacity-[0.06] -translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white opacity-[0.06]" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Workshop
              </span>
              <span className="text-xs font-semibold bg-white/15 px-2.5 py-1 rounded-full">
                {workshop.day_count} day{workshop.day_count === 1 ? '' : 's'}
              </span>
              {workshop.status === 'live' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-error px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE NOW
                </span>
              )}
              {isCancelled && (
                <span className="text-xs font-semibold bg-error px-2.5 py-1 rounded-full">CANCELLED</span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold font-display mb-1">
              {workshop.title}
            </h1>
            <p className="text-white/70 text-sm">
              {formatDateRange(workshop.start_date, workshop.end_date)}
              {workshop.faculty?.length > 0 && ` · ${workshop.faculty.map((f) => f.name).join(', ')}`}
            </p>
          </div>
        </div>

        {isCancelled && (
          <div className="mb-6 rounded-xl border border-error/20 bg-error/5 px-5 py-4">
            <p className="text-sm font-semibold text-error">This workshop has been cancelled.</p>
            <p className="text-xs text-text-secondary mt-1">
              If you had paid for it, our team will be in touch about your refund.
            </p>
          </div>
        )}

        {workshop.thumbnail_url && (
          <div className="rounded-2xl overflow-hidden mb-6 sm:mb-8">
            <img src={workshop.thumbnail_url} alt={workshop.title} className="w-full h-auto max-h-80 object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 2xl:gap-10">
          {/* ------------------------- Main column ------------------------- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress strip for enrolled students */}
            {isEnrolled && activeDays.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-border p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-text">Your attendance</h3>
                  <span className="text-sm font-semibold text-primary">
                    {workshop.days_attended} / {activeDays.length} days
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface-dim overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (workshop.days_attended / activeDays.length) * 100)}%` }}
                  />
                </div>
                {workshop.certificate_enabled && (
                  <p className="text-xs text-text-tertiary mt-2.5">
                    Attend at least {workshop.certificate_min_days_attended} day
                    {workshop.certificate_min_days_attended === 1 ? '' : 's'} to earn a completion certificate.
                  </p>
                )}
              </div>
            )}

            {/* Agenda */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-5 sm:p-6">
              <h3 className="text-base font-semibold text-text mb-4 pb-2 border-b border-border">
                Day-by-day agenda
              </h3>

              <div className="space-y-3">
                {days.length === 0 && (
                  <p className="text-sm text-text-tertiary">The agenda will be published shortly.</p>
                )}

                {days.map((day) => {
                  const cancelled = day.status === 'cancelled';
                  const opensIn = countdownLabel(day.join_opens_at, now);
                  const joinable = day.can_join && !cancelled;
                  const joining = joiningDayId === day.session_id;

                  return (
                    <div
                      key={day.session_id}
                      className={`rounded-xl border p-4 transition-colors ${
                        cancelled
                          ? 'border-border/50 bg-surface-dim/40'
                          : day.status === 'live'
                            ? 'border-error/30 bg-error/[0.03]'
                            : 'border-border/60'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/8 px-2 py-0.5 rounded-full">
                              Day {day.day_number}
                            </span>
                            <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${dayStatusStyles[day.status] || ''}`}>
                              {day.status === 'live' ? 'Live now' : day.status}
                            </span>
                            {day.attended && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success bg-success/8 px-2 py-0.5 rounded-full">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Attended
                              </span>
                            )}
                          </div>

                          <p className={`text-sm font-semibold text-text ${cancelled ? 'line-through text-text-tertiary' : ''}`}>
                            {day.title}
                          </p>

                          <p className="text-xs text-text-tertiary mt-1">
                            {formatDayHeading(day.scheduled_start_time)} ·{' '}
                            {formatTime(day.scheduled_start_time)} – {formatTime(day.scheduled_end_time)}
                            {day.duration_minutes ? ` · ${day.duration_minutes} min` : ''}
                            {day.faculty_name ? ` · ${day.faculty_name}` : ''}
                          </p>

                          {day.description && (
                            <p className="text-xs text-text-secondary mt-2 leading-relaxed">{day.description}</p>
                          )}
                        </div>

                        {/* Per-day action */}
                        <div className="shrink-0">
                          {cancelled ? (
                            <span className="text-xs font-medium text-error">Cancelled</span>
                          ) : joinable ? (
                            <button
                              onClick={() => handleJoinDay(day)}
                              disabled={joining}
                              className="btn-primary px-4 py-2! text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {joining ? 'Opening…' : 'Join'}
                            </button>
                          ) : day.status === 'completed' ? (
                            <span className="text-xs text-text-tertiary">Ended</span>
                          ) : !hasAccess ? (
                            <span className="text-xs text-text-tertiary">
                              {isPaid ? 'Book to join' : 'Register to join'}
                            </span>
                          ) : opensIn ? (
                            <span className="text-xs text-text-tertiary whitespace-nowrap">Opens in {opensIn}</span>
                          ) : (
                            <span className="text-xs text-text-tertiary">Opening soon</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* About */}
            {workshop.description && (
              <div className="bg-white rounded-xl shadow-sm border border-border p-5 sm:p-6">
                <h3 className="text-base font-semibold text-text mb-3 pb-2 border-b border-border">
                  About this workshop
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {workshop.description}
                </p>
              </div>
            )}

            {/* Brochure — public marketing PDF, shown whether or not the user
                has enrolled. Opens in a new tab rather than downloading, so
                mobile browsers preview it inline instead of dumping a file. */}
            {workshop.brochure_url && (
              <div className="bg-white rounded-xl shadow-sm border border-border p-5 sm:p-6">
                <h3 className="text-base font-semibold text-text mb-3 pb-2 border-b border-border">
                  Brochure
                </h3>
                <a
                  href={workshop.brochure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 hover:border-primary hover:bg-primary/5 transition-colors group"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-text truncate">
                      {workshop.brochure_filename || 'Workshop brochure'}
                    </span>
                    <span className="block text-xs text-text-tertiary">PDF · opens in a new tab</span>
                  </span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary group-hover:text-primary shrink-0">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </a>
              </div>
            )}

            {/* Faculty */}
            {workshop.faculty?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-border p-5 sm:p-6">
                <h3 className="text-base font-semibold text-text mb-4 pb-2 border-b border-border">Faculty</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {workshop.faculty.map((f) => (
                    <div key={f.faculty_id} className="flex items-start gap-3">
                      {f.photo_url ? (
                        <img src={f.photo_url} alt={f.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-primary">{f.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text truncate">{f.name}</p>
                        {f.specialization && (
                          <p className="text-xs text-text-tertiary truncate">{f.specialization}</p>
                        )}
                        {f.qualifications && (
                          <p className="text-[11px] text-text-tertiary mt-0.5 truncate">{f.qualifications}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recordings */}
            {recordings.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-border p-5 sm:p-6">
                <h3 className="text-base font-semibold text-text mb-1 pb-2 border-b border-border">
                  Session recordings
                </h3>
                <p className="text-xs text-text-tertiary mb-4 mt-2">
                  {hasAccess
                    ? 'Catch up on any day you missed.'
                    : `Available to registered students — ${readyRecordings.length === 0 ? recordings.length : readyRecordings.length} recording(s).`}
                </p>
                <div className="space-y-2.5">
                  {recordings.map((rec) => (
                    <div
                      key={rec.recording_id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text truncate">
                          {rec.workshop_day ? `Day ${rec.workshop_day} · ` : ''}{rec.title}
                        </p>
                        {rec.duration_seconds > 0 && (
                          <p className="text-[11px] text-text-tertiary">
                            {Math.round(rec.duration_seconds / 60)} min
                          </p>
                        )}
                      </div>
                      {rec.is_locked ? (
                        <span className="flex items-center gap-1.5 text-xs text-text-tertiary shrink-0">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          Locked
                        </span>
                      ) : rec.video_url ? (
                        <a
                          href={rec.video_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-primary no-underline hover:underline shrink-0"
                        >
                          Watch
                        </a>
                      ) : (
                        <span className="text-xs text-text-tertiary shrink-0">Processing</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificate */}
            {workshop.certificate_enabled && isEnrolled && (
              <div className="bg-white rounded-xl shadow-sm border border-border p-5 sm:p-6">
                <h3 className="text-base font-semibold text-text mb-3 pb-2 border-b border-border">
                  Completion certificate
                </h3>

                {workshop.certificate ? (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-success">Certificate issued</p>
                      <p className="text-xs text-text-tertiary mt-0.5 font-mono">
                        {workshop.certificate.certificate_number}
                      </p>
                    </div>
                    <button
                      onClick={handleClaimCertificate}
                      disabled={claimingCertificate}
                      className="btn-primary px-4 py-2! text-sm disabled:opacity-60"
                    >
                      {claimingCertificate ? 'Preparing…' : 'Download PDF'}
                    </button>
                  </div>
                ) : certificate?.eligible ? (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text">You&apos;ve earned your certificate</p>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        Attended {certificate.days_attended} of {certificate.total_days} days.
                      </p>
                    </div>
                    <button
                      onClick={handleClaimCertificate}
                      disabled={claimingCertificate}
                      className="btn-primary px-4 py-2! text-sm disabled:opacity-60"
                    >
                      {claimingCertificate ? 'Generating…' : 'Get certificate'}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary">
                    {certificate?.reason === 'workshop_not_completed'
                      ? `Your certificate unlocks once the workshop ends, provided you attend at least ${certificate.required_days} day${certificate.required_days === 1 ? '' : 's'}.`
                      : certificate?.reason === 'insufficient_attendance'
                        ? `You attended ${certificate.days_attended} of ${certificate.total_days} days — ${certificate.required_days} are required for a certificate.`
                        : `Attend at least ${workshop.certificate_min_days_attended} day${workshop.certificate_min_days_attended === 1 ? '' : 's'} to earn a certificate.`}
                  </p>
                )}
              </div>
            )}

            {actionError && (
              <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-3">
                <p className="text-sm text-error">{actionError}</p>
              </div>
            )}
          </div>

          {/* ------------------------- Sidebar CTA ------------------------- */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-xl border border-border p-6 shadow-md">
              <CtaPanel
                cta={cta}
                workshop={workshop}
                capacity={capacity}
                seatsLine={seatsLine}
                isPaid={isPaid}
                isFinished={isFinished}
                isEnrolling={isEnrolling}
                onBook={handleBook}
                onEnroll={handleEnroll}
                onCancel={handleCancelRegistration}
              />
            </div>
          </div>
        </div>

        <RecommendationRail
          context="product_detail"
          productType="workshop"
          productId={id}
          className="mt-5 sm:mt-6"
        />
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-border p-4 safe-area-inset-bottom lg:hidden z-40">
        <div className="max-w-7xl mx-auto">
          <CtaPanel
            compact
            cta={cta}
            workshop={workshop}
            capacity={capacity}
            seatsLine={seatsLine}
            isPaid={isPaid}
            isFinished={isFinished}
            isEnrolling={isEnrolling}
            onBook={handleBook}
            onEnroll={handleEnroll}
            onCancel={handleCancelRegistration}
          />
        </div>
      </div>
      <div className="h-24 lg:hidden" />
    </div>
  );
}

/**
 * The single source of truth for the booking CTA, rendered twice (sidebar +
 * mobile bar) so the two can never drift out of sync.
 */
function CtaPanel({
  cta, workshop, capacity, seatsLine, isPaid, isFinished,
  isEnrolling, onBook, onEnroll, onCancel, compact = false,
}) {
  const successIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-success">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  if (cta.kind === 'cancelled') {
    return (
      <p className={`text-sm font-semibold text-error ${compact ? 'text-center' : ''}`}>
        This workshop has been cancelled
      </p>
    );
  }

  if (cta.kind === 'enrolled') {
    const canCancel = workshop.status === 'scheduled' && !isPaid;
    if (compact) {
      return (
        <div className="flex items-center justify-center gap-2">
          {successIcon}
          <span className="text-sm font-semibold text-success">
            {isFinished ? 'Workshop completed' : "You're in — join each day above"}
          </span>
        </div>
      );
    }
    return (
      <>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">{successIcon}</div>
          <span className="text-sm font-semibold text-success">
            {workshop.enrollment_type === 'paid' ? 'Booked' : 'Registered'}
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          {isFinished
            ? 'This workshop has finished. Recordings and your certificate stay available here.'
            : 'Your place is confirmed for every day. Each day opens for joining 10 minutes before it starts.'}
        </p>
        <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-xs text-text-tertiary">
          <div className="flex justify-between">
            <span>Days</span>
            <span className="text-text font-medium">{workshop.day_count}</span>
          </div>
          <div className="flex justify-between">
            <span>Attended</span>
            <span className="text-text font-medium">{workshop.days_attended}</span>
          </div>
        </div>
        {canCancel && (
          <button
            onClick={onCancel}
            disabled={isEnrolling}
            className="w-full mt-4 text-xs text-text-tertiary hover:text-error transition-colors disabled:opacity-40 bg-transparent border-0 cursor-pointer"
          >
            Cancel my registration
          </button>
        )}
      </>
    );
  }

  if (cta.kind === 'waitlisted') {
    const position = workshop.waitlist_position;
    if (compact) {
      return (
        <p className="text-sm font-semibold text-accent-dark text-center">
          On the waitlist{position ? ` — #${position}` : ''}
        </p>
      );
    }
    return (
      <>
        <h3 className="text-base font-semibold text-text mb-2">You&apos;re on the waitlist</h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          {position ? `You're #${position} in line. ` : ''}
          We&apos;ll notify you the moment a seat opens up.
        </p>
        <button
          onClick={onCancel}
          disabled={isEnrolling}
          className="w-full mt-4 text-xs text-text-tertiary hover:text-error transition-colors disabled:opacity-40 bg-transparent border-0 cursor-pointer"
        >
          Leave the waitlist
        </button>
      </>
    );
  }

  if (cta.kind === 'closed') {
    const deadline = workshop.registration_closes_at;
    if (compact) {
      return <p className="text-sm font-semibold text-text-tertiary text-center">Registration closed</p>;
    }
    return (
      <>
        <h3 className="text-base font-semibold text-text mb-2">Registration closed</h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          {deadline
            ? `Registration for this workshop closed on ${formatDateTime(deadline)}.`
            : 'Registration for this workshop is no longer open.'}
        </p>
      </>
    );
  }

  if (cta.kind === 'full') {
    if (compact) {
      return <p className="text-sm font-semibold text-text-tertiary text-center">Sold out</p>;
    }
    return (
      <>
        <h3 className="text-base font-semibold text-text mb-2">Sold out</h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Every seat for this workshop has been taken.
        </p>
      </>
    );
  }

  // buy / register
  const isBuy = cta.kind === 'buy';
  const action = isBuy ? onBook : onEnroll;
  const label = isBuy ? 'Book Now' : capacity?.is_full ? 'Join Waitlist' : 'Register for Free';

  if (compact) {
    return (
      <div className="flex items-center gap-4">
        {isBuy ? (
          <PriceDisplay price={workshop.price} size="lg" />
        ) : (
          <span className="text-base font-bold text-success shrink-0">FREE</span>
        )}
        <button
          onClick={action}
          disabled={isEnrolling}
          className="btn-primary flex-1 py-3! disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isEnrolling ? 'Registering…' : label}
        </button>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-base font-semibold text-text mb-4 pb-2 border-b border-border">
        {isBuy ? 'Book this workshop' : 'Register for this workshop'}
      </h3>

      {isBuy ? (
        <PriceDisplay price={workshop.price} size="lg" />
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-success">FREE</span>
        </div>
      )}

      <div className="mt-4 space-y-1.5 text-xs text-text-tertiary">
        <div className="flex justify-between">
          <span>Days</span>
          <span className="text-text font-medium">{workshop.day_count}</span>
        </div>
        {workshop.total_duration_minutes > 0 && (
          <div className="flex justify-between">
            <span>Total time</span>
            <span className="text-text font-medium">
              {Math.round(workshop.total_duration_minutes / 60)} hours
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Dates</span>
          <span className="text-text font-medium">
            {formatDateRange(workshop.start_date, workshop.end_date)}
          </span>
        </div>
        {workshop.certificate_enabled && (
          <div className="flex justify-between">
            <span>Certificate</span>
            <span className="text-text font-medium">On completion</span>
          </div>
        )}
      </div>

      {seatsLine && (
        <p className={`text-xs mt-3 ${capacity?.is_full ? 'text-accent-dark' : 'text-text-secondary'}`}>
          {seatsLine}
        </p>
      )}

      <button
        onClick={action}
        disabled={isEnrolling}
        className="btn-primary w-full mt-5 !py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isEnrolling ? 'Registering…' : label}
      </button>

      <p className="text-xs text-text-tertiary mt-3 text-center">
        {isBuy ? 'Secure payment via Zoho' : 'Free · No payment required'}
      </p>

      {workshop.registration_closes_at && (
        <p className="text-[11px] text-text-tertiary mt-2 text-center">
          Registration closes {formatDateTime(workshop.registration_closes_at)}
        </p>
      )}
    </>
  );
}
