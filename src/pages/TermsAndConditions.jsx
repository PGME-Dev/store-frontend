import TermsAndConditionsContent from '../components/TermsAndConditionsContent';

export default function TermsAndConditions() {
  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        {/* Header */}
        <div className="gradient-hero px-6 sm:px-8 lg:px-10 py-8 sm:py-10">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-2 font-display">Terms and Conditions</h1>
          <p className="text-sm text-white/70">PGME (PGME Medical Education LLP)</p>
          <p className="text-sm text-white/60 mt-1">Effective Date: February 23, 2026 &bull; Last Updated: February 23, 2026</p>
        </div>

        <div className="px-6 sm:px-8 lg:px-10 py-8 sm:py-10">
          <TermsAndConditionsContent />
        </div>
      </div>
    </div>
  );
}
