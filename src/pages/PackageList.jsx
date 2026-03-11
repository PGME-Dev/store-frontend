import { useState, useEffect, useRef } from 'react';
import { getPackages } from '../api/packages';
import { useSubject } from '../context/SubjectContext';
import { usePurchase } from '../context/PurchaseContext';
import PackageCard from '../components/PackageCard';
import PackageModal from '../components/PackageModal';

export default function PackageList() {
  const { subjects, subjectId, selectedSubject, selectSubject } = useSubject();
  const { isPackagePurchased } = usePurchase();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [specialtyOpen, setSpecialtyOpen] = useState(false);
  const specialtyRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (specialtyRef.current && !specialtyRef.current.contains(e.target)) setSpecialtyOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch subject-filtered packages
  useEffect(() => {
    if (!subjectId) return;
    setLoading(true);
    setError('');
    (async () => {
      try {
        const result = await getPackages(subjectId);
        setPackages(result.packages || result || []);
      } catch {
        setError('Failed to load packages');
      } finally {
        setLoading(false);
      }
    })();
  }, [subjectId]);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 sm:mb-10 lg:mb-12">
        <div className="mb-5">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Browse</p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-extrabold text-text tracking-tight">
            Course Packages
          </h1>
          <p className="text-text-secondary text-sm sm:text-base mt-2">
            Browse our collection of medical course packages
          </p>
        </div>

        {/* Subject Selector Dropdown */}
        <div className="relative" ref={specialtyRef}>
          <button
            type="button"
            onClick={() => setSpecialtyOpen(!specialtyOpen)}
            className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 bg-primary/4 rounded-2xl border border-primary/15 hover:border-primary/30 transition-all duration-200 cursor-pointer text-left"
          >
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Your Specialty</p>
              <p className="text-base sm:text-lg font-semibold text-text truncate">{selectedSubject?.name || 'Select a subject'}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 transition-transform duration-200 ${specialtyOpen ? 'rotate-180' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </button>

          {specialtyOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-border/60 shadow-xl z-50 animate-slide-down">
              <div className="px-5 sm:px-6 pt-4 pb-3 border-b border-border/40">
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Choose a specialty</p>
              </div>
              <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 max-h-80 overflow-y-auto" data-lenis-prevent>
                {subjects.map((subject) => {
                  const id = subject._id || subject.subject_id;
                  const isActive = (selectedSubject?._id || selectedSubject?.subject_id) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => { selectSubject(subject); setSpecialtyOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-xl text-left transition-all duration-150 cursor-pointer border ${
                        isActive
                          ? 'bg-primary/5 border-primary/20 text-primary'
                          : 'bg-transparent border-transparent hover:bg-surface-dim text-text-secondary hover:text-text'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        isActive ? 'bg-primary text-white' : 'bg-surface-dim text-text-tertiary'
                      }`}>
                        {subject.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium truncate">{subject.name}</span>
                      {isActive && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0 text-primary">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-9 h-9 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16 text-error text-sm">{error}</div>
      ) : packages.length === 0 ? (
        <div className="text-center py-16 sm:py-24">
          <div className="w-18 h-18 sm:w-20 sm:h-20 bg-surface-dim rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <p className="text-text-secondary text-sm sm:text-base font-medium mb-1">No packages found</p>
          <p className="text-text-tertiary text-xs sm:text-sm">Try selecting a different subject to see available packages</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 lg:gap-6 2xl:gap-7">
          {packages.map((pkg, index) => (
            <PackageCard
              key={pkg.package_id}
              pkg={pkg}
              purchased={pkg.is_purchased || isPackagePurchased(pkg.package_id)}
              illustrationIndex={index}
              onClick={() => setSelectedPackage(pkg)}
            />
          ))}
        </div>
      )}

      {/* Package detail modal */}
      {selectedPackage && (
        <PackageModal
          package={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </div>
  );
}
