/**
 * Terminal completion + retry surface for subject masters.
 * Ready markers appear only while this panel is mounted (true completion state).
 */

/**
 * @param {{
 *   title: string,
 *   subtitle?: string,
 *   statsLine?: string,
 *   retryLabel: string,
 *   onRetry: () => void,
 *   className?: string,
 * }} props
 */
export default function LearningSessionCompletion({
  title,
  subtitle = "",
  statsLine = "",
  retryLabel,
  onRetry,
  className = "",
}) {
  return (
    <div
      className={`mx-auto w-full max-w-lg rounded-2xl border border-white/20 bg-black/40 px-4 py-6 text-center shadow-lg ${className}`}
      data-testid="learning-session-complete"
      role="status"
      aria-live="polite"
    >
      <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm font-semibold text-white/85 sm:text-base">{subtitle}</p> : null}
      {statsLine ? <p className="mt-3 text-base font-bold text-amber-200">{statsLine}</p> : null}
      <div className="mt-5 flex justify-center">
        <button
          type="button"
          data-testid="learning-session-retry"
          onClick={onRetry}
          className="min-h-[44px] rounded-xl border-2 border-emerald-300/70 bg-emerald-500/90 px-8 py-2 text-sm font-extrabold text-white shadow hover:bg-emerald-400"
        >
          {retryLabel}
        </button>
      </div>
    </div>
  );
}
