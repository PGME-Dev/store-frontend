import { useSubject } from '../context/SubjectContext';

export default function SubjectSelector({ showAll = false, value, onChange }) {
  const { subjects, selectedSubject, selectSubject, loading } = useSubject();

  if (loading || subjects.length === 0) return null;

  // Controlled mode when value + onChange are provided
  const isControlled = onChange !== undefined;
  const selectedId = isControlled
    ? (value || '')
    : (selectedSubject?._id || selectedSubject?.subject_id);

  const handleSelect = (id) => {
    if (isControlled) {
      onChange(id || null);
    } else {
      const subject = subjects.find((s) => (s._id || s.subject_id) === id);
      if (subject) selectSubject(subject);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {showAll && (
        <button
          type="button"
          onClick={() => handleSelect('')}
          className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
            !selectedId
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-white text-text-secondary border-border hover:border-primary/30 hover:text-primary'
          }`}
        >
          All Subjects
        </button>
      )}
      {subjects.map((subject) => {
        const id = subject._id || subject.subject_id;
        const isActive = selectedId === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => handleSelect(id)}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
              isActive
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-text-secondary border-border hover:border-primary/30 hover:text-primary'
            }`}
          >
            {subject.name}
          </button>
        );
      })}
    </div>
  );
}
