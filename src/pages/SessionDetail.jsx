import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById } from '../api/sessions';
import { useAuth } from '../context/AuthContext';
import { usePurchase } from '../context/PurchaseContext';
import PriceDisplay from '../components/PriceDisplay';

export default function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isSessionPurchased } = usePurchase();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const result = await getSessionById(id);
        setSession(result.session || result);
      } catch {
        setError('Failed to load session');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !session) {
    return <div className="text-center py-12 text-error text-sm">{error || 'Session not found'}</div>;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const purchased = isSessionPurchased(session.session_id || session._id);

  const handleBuy = () => {
    if (session.is_free || purchased) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/sessions/${id}` } } });
      return;
    }
    navigate(`/checkout/sessions/${id}`);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-5xl 2xl:max-w-6xl mx-auto">
        {/* Header */}
        <div className="gradient-hero rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 text-white mb-6 sm:mb-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white opacity-[0.06]" />
          <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-white opacity-[0.06] -translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white opacity-[0.06]" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              <span className="text-sm font-medium text-white/80">Live Session</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold font-display mb-1">{session.title}</h1>
            {session.faculty_id?.name && (
              <p className="text-white/70 text-sm">By {session.faculty_id.name}</p>
            )}
          </div>
        </div>

        {/* Thumbnail Banner */}
        {session.thumbnail_url && (
          <div className="rounded-2xl overflow-hidden mb-6 sm:mb-8">
            <img
              src={session.thumbnail_url}
              alt={session.title}
              className="w-full h-auto max-h-80 object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 2xl:gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Schedule */}
              <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <h3 className="text-base font-semibold text-text">Schedule</h3>
                </div>
                <div className="space-y-2 text-sm text-text-secondary">
                  {session.scheduled_start && (
                    <div>Starts: {formatDate(session.scheduled_start)}</div>
                  )}
                  {session.duration_minutes && (
                    <div>Duration: {session.duration_minutes} minutes</div>
                  )}
                </div>
              </div>

              {/* Description */}
              {session.description && (
                <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                  <h3 className="text-base font-semibold text-text mb-3 pb-2 border-b border-border">About this Session</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{session.description}</p>
                </div>
              )}
            </div>

            {/* Topics */}
            {session.topics?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h3 className="text-base font-semibold text-text mb-4 pb-2 border-b border-border">Topics Covered</h3>
                <ul className="space-y-3">
                  {session.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar - Desktop sticky CTA */}
          {!session.is_free && (
            <div className="hidden lg:block">
              <div className="sticky top-24 bg-white rounded-xl border border-border p-6 shadow-md">
                {purchased ? (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-success">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-success">Purchased</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">You already own this session. Open the PGME app to access it.</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-semibold text-text mb-4 pb-2 border-b border-border">Purchase Session</h3>
                    <PriceDisplay price={session.price} size="lg" />
                    <button onClick={handleBuy} className="btn-primary w-full mt-5 !py-3.5">
                      Buy Now
                    </button>
                    <p className="text-xs text-text-tertiary mt-3 text-center">Secure payment via Zoho</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky bottom CTA */}
      {!session.is_free && (
        <>
          {purchased ? (
            <div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-border p-4 safe-area-inset-bottom lg:hidden z-40">
              <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-success">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm font-semibold text-success">Purchased -- Open the PGME app to access</span>
              </div>
            </div>
          ) : (
            <div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-border p-4 safe-area-inset-bottom lg:hidden z-40">
              <div className="max-w-7xl mx-auto flex items-center gap-4">
                <PriceDisplay price={session.price} size="lg" />
                <button onClick={handleBuy} className="btn-primary flex-1 !py-3">
                  Buy Now
                </button>
              </div>
            </div>
          )}
          <div className="h-20 sm:h-24 lg:hidden" />
        </>
      )}
    </div>
  );
}
