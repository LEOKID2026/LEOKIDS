import { useEffect, useRef } from "react";
import { gamePackCopy } from "../../lib/games/game-pack-copy.js";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";

const DEFAULT_DURATION_MS = 5000;
const PACK = "components__solo-games__SoloGameEndInterstitialOverlay";

/**
 * Brief end-of-game overlay before the shell opens the existing result flow.
 *
 * @param {{
 *   didWin: boolean,
 *   onDone: () => void,
 *   durationMs?: number,
 * }} props
 */
export default function SoloGameEndInterstitialOverlay({
  didWin,
  onDone,
  durationMs = DEFAULT_DURATION_MS,
}) {
  const finishedRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const { direction, locale } = useI18n();

  useEffect(() => {
    finishedRef.current = false;
    const timer = window.setTimeout(() => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onDoneRef.current();
    }, durationMs);
    return () => window.clearTimeout(timer);
  }, [didWin, durationMs]);

  const handleSkip = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onDone();
  };

  const title = didWin
    ? gamePackCopy(PACK, "win_title")
    : gamePackCopy(PACK, "lose_title");
  const ariaLabel = didWin
    ? gamePackCopy(PACK, "aria_win")
    : gamePackCopy(PACK, "aria_lose");

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/55 px-4 py-6 text-center"
      dir={direction === "rtl" ? "rtl" : "ltr"}
      lang={locale || undefined}
      role="dialog"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <h2
        className={`text-3xl font-extrabold sm:text-4xl ${
          didWin ? "text-emerald-300" : "text-amber-100"
        }`}
      >
        {title}
      </h2>
      <p className="text-sm font-semibold text-white/85 sm:text-base">
        {gamePackCopy(PACK, "calculating")}
      </p>
      <button
        type="button"
        onClick={handleSkip}
        className="mt-1 min-h-[44px] rounded-xl border-2 border-white/40 bg-white/10 px-8 py-2 text-sm font-bold text-white"
        style={{ touchAction: "manipulation" }}
      >
        {gamePackCopy(PACK, "skip")}
      </button>
    </div>
  );
}
