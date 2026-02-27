import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSubjects, getUserSubjectSelection } from '../api/subjects';
import { useAuth } from './AuthContext';

const SubjectContext = createContext(null);

export function SubjectProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSubjects = async () => {
    try {
      const result = await getSubjects();
      const subjectList = result.subjects || result || [];
      setSubjects(subjectList);

      // Try to get user's primary subject if authenticated
      if (isAuthenticated) {
        try {
          const selectionResult = await getUserSubjectSelection();
          const selections = selectionResult.selections || selectionResult || [];
          const primary = selections.find((s) => s.is_primary);
          if (primary) {
            const match = subjectList.find(
              (s) => (s._id || s.subject_id) === (primary.subject_id?._id || primary.subject_id)
            );
            if (match) {
              setSelectedSubject(match);
              setLoading(false);
              return;
            }
          }
        } catch {
          // Silently fall through to default
        }
      }

      // Default to first subject
      if (subjectList.length > 0 && !selectedSubject) {
        setSelectedSubject(subjectList[0]);
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectSubject = useCallback((subject) => {
    setSelectedSubject(subject);
    // Local only — intentionally does NOT update the backend
  }, []);

  const subjectId = selectedSubject?._id || selectedSubject?.subject_id || null;

  const value = {
    subjects,
    selectedSubject,
    subjectId,
    selectSubject,
    loading,
  };

  return <SubjectContext.Provider value={value}>{children}</SubjectContext.Provider>;
}

export function useSubject() {
  const context = useContext(SubjectContext);
  if (!context) throw new Error('useSubject must be used within SubjectProvider');
  return context;
}
