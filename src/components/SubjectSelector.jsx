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
    <div className="flex gap-2.5 sm:gap-3 overflow-x-auto sm:flex-wrap scrollbar-hide pb-1">
      {showAll && (
        <button
          type="button"
          onClick={() => handleSelect('')}
          className={`py-2.5 px-5 sm:px-6 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out cursor-pointer border whitespace-nowrap shrink-0 ${
            !selectedId
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-white text-text-secondary border-border hover:border-primary/30 hover:text-primary hover:bg-primary/3'
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
            className={`py-2.5 px-5 sm:px-6 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out cursor-pointer border whitespace-nowrap shrink-0 ${
              isActive
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-text-secondary border-border hover:border-primary/30 hover:text-primary hover:bg-primary/3'
            }`}
          >
            {subject.name}
          </button>
        );
      })}
    </div>
  );
}
