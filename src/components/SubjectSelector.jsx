import { useSubject } from '../context/SubjectContext';

export default function SubjectSelector() {
  const { subjects, selectedSubject, selectSubject, loading } = useSubject();

  if (loading || subjects.length === 0) return null;

  const selectedId = selectedSubject?._id || selectedSubject?.subject_id;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {subjects.map((subject) => {
        const id = subject._id || subject.subject_id;
        const isSelected = id === selectedId;
        return (
          <button
            key={id}
            onClick={() => selectSubject(subject)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
              isSelected
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-text-secondary border-border hover:border-primary/30 hover:text-text'
            }`}
          >
            {subject.name}
          </button>
        );
      })}
    </div>
  );
}
