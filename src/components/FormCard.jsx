export default function FormCard({ form, onClick }) {
  const template = form.template;
  const isExaminer = template?.slug === 'examiner';

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col w-full text-left bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer"
    >
      {/* Header accent / Banner */}
      {form.banner_url ? (
        <div className="w-full" style={{ aspectRatio: '18/7' }}>
          <img
            src={form.banner_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className={`w-full flex items-center justify-center ${isExaminer ? 'bg-purple-500/5' : 'bg-primary/5'}`} style={{ aspectRatio: '18/7' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={isExaminer ? 'text-purple-400/40' : 'text-primary/30'}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Template badge */}
        <span className={`self-start text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full mb-2.5 ${
          isExaminer
            ? 'text-purple-600 bg-purple-500/10'
            : 'text-primary bg-primary/6'
        }`}>
          {template?.name || 'Form'}
        </span>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-semibold text-text group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
          {form.title}
        </h3>

        {/* Description */}
        {form.description && (
          <p className="text-xs sm:text-sm text-text-secondary line-clamp-3 mb-4 leading-relaxed">
            {form.description}
          </p>
        )}

        {/* Field count + payment badge */}
        <div className="mt-auto flex items-center gap-2 text-xs text-text-tertiary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span>{template?.fields?.length || 0} fields</span>
          {form.payment_amount > 0 && (
            <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
              {'\u20B9'}{form.payment_amount}
            </span>
          )}
        </div>

        {/* Fill Form CTA */}
        <div className="mt-4 pt-3 border-t border-border/40">
          <span className="flex items-center justify-between text-sm font-semibold text-primary group-hover:text-primary/80 transition-colors">
            Fill Form
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>
      </div>
    </button>
  );
}
