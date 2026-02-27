import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById } from '../api/sessions';
import { useAuth } from '../context/AuthContext';
import PriceDisplay from '../components/PriceDisplay';

export default function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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

  const handleBuy = () => {
    if (session.is_free) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/sessions/${id}` } } });
      return;
    }
    navigate(`/checkout/sessions/${id}`);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-linear-to-br from-warning to-orange-400 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 text-white mb-5 sm:mb-8">
          <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <span className="text-xs sm:text-sm font-medium text-white/80">Live Session</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1">{session.title}</h1>
          {session.faculty_id?.name && (
            <p className="text-white/80 text-xs sm:text-sm">By {session.faculty_id.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Schedule */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <h3 className="text-sm font-semibold text-text">Schedule</h3>
                </div>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-text-secondary">
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
                <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5 lg:p-6">
                  <h3 className="text-sm font-semibold text-text mb-2.5 sm:mb-3">About this Session</h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{session.description}</p>
                </div>
              )}
            </div>

            {/* Topics */}
            {session.topics?.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5 lg:p-6">
                <h3 className="text-sm font-semibold text-text mb-3 sm:mb-4">Topics Covered</h3>
                <ul className="space-y-2.5 sm:space-y-3">
                  {session.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-text-secondary">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary/6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full" />
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
              <div className="sticky top-24 bg-white rounded-2xl border border-border p-6">
                <h3 className="text-sm font-semibold text-text mb-4">Purchase Session</h3>
                <PriceDisplay price={session.price} size="lg" />
                <button
                  onClick={handleBuy}
                  className="w-full mt-5 px-6 py-3.5 bg-warning text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors cursor-pointer border-0 text-base"
                >
                  Buy Now
                </button>
                <p className="text-xs text-text-secondary mt-3 text-center">Secure payment via Zoho</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky bottom CTA */}
      {!session.is_free && (
        <>
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-3 sm:p-4 safe-area-inset-bottom lg:hidden z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <PriceDisplay price={session.price} size="lg" />
              <button
                onClick={handleBuy}
                className="px-5 sm:px-8 py-2.5 sm:py-3 bg-warning text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors cursor-pointer border-0 text-sm sm:text-base shrink-0"
              >
                Buy Now
              </button>
            </div>
          </div>
          <div className="h-20 sm:h-24 lg:hidden" />
        </>
      )}
    </div>
  );
}
