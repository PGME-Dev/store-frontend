import { useSubject } from '../context/SubjectContext';

export default function SubjectSelector() {
  const { subjects, selectedSubject, selectSubject, loading } = useSubject();

  if (loading || subjects.length === 0) return null;

  const selectedId = selectedSubject?._id || selectedSubject?.subject_id;

  const handleChange = (e) => {
    const subject = subjects.find((s) => (s._id || s.subject_id) === e.target.value);
    if (subject) selectSubject(subject);
  };

  return (
    <div className="relative inline-block">
      <select
        value={selectedId || ''}
        onChange={handleChange}
        className="appearance-none bg-white border border-border rounded-xl px-4 py-2.5 pr-9 text-sm font-medium text-text cursor-pointer hover:border-primary/40 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
      >
        {subjects.map((subject) => (
          <option key={subject._id || subject.subject_id} value={subject._id || subject.subject_id}>
            {subject.name}
          </option>
        ))}
      </select>
      <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
