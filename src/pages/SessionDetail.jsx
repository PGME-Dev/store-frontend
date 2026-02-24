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
    return <div className="text-center py-12 text-error">{error || 'Session not found'}</div>;
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
    <div>
      <div className="bg-gradient-to-br from-warning to-orange-400 rounded-xl p-5 text-white mb-4">
        <h1 className="text-xl font-bold mb-1">{session.title}</h1>
        {session.faculty_id?.name && (
          <p className="text-white/80 text-sm">By {session.faculty_id.name}</p>
        )}
      </div>

      {/* Schedule */}
      <div className="bg-surface rounded-xl border border-border p-4 mb-4">
        <h3 className="text-sm font-semibold text-text mb-2">Schedule</h3>
        <div className="space-y-1.5 text-sm text-text-secondary">
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
        <div className="bg-surface rounded-xl border border-border p-4 mb-4">
          <h3 className="text-sm font-semibold text-text mb-2">About this Session</h3>
          <p className="text-sm text-text-secondary">{session.description}</p>
        </div>
      )}

      {/* Topics */}
      {session.topics?.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-4 mb-4">
          <h3 className="text-sm font-semibold text-text mb-2">Topics Covered</h3>
          <ul className="space-y-1.5">
            {session.topics.map((topic, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-primary mt-0.5">•</span>
                {topic}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sticky bottom CTA */}
      {!session.is_free && (
        <>
          <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4">
            <div className="max-w-lg mx-auto flex items-center justify-between">
              <PriceDisplay price={session.price} size="lg" />
              <button
                onClick={handleBuy}
                className="px-6 py-3 bg-warning text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors cursor-pointer border-0 text-base"
              >
                Buy Now
              </button>
            </div>
          </div>
          <div className="h-24" />
        </>
      )}
    </div>
  );
}
