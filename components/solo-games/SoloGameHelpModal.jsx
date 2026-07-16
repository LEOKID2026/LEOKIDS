import { useEffect, useRef } from "react";
import { resolveSoloGameHelp } from "../../lib/solo-games/solo-game-help.js";

/**
 * @param {{
 *   game: { titleHe: string, help?: object } | null,
 *   onClose: () => void,
 * }} props
 */
export default function SoloGameHelpModal({ game, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!game) return undefined;
    closeBtnRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [game, onClose]);

  if (!game) return null;

  const help = resolveSoloGameHelp(game);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-4"
      dir="ltr"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="relative max-h-[min(85dvh,32rem)] w-full max-w-md overflow-y-auto rounded-2xl border-2 border-sky-200 bg-white p-5 shadow-xl sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="solo-game-help-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <h2
          id="solo-game-help-title"
          className="mb-4 pr-8 text-lg font-extrabold leading-snug text-slate-900 sm:text-xl"
        >
          How to play {game.titleHe}?
        </h2>

        <div className="space-y-3 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          <section>
            <p className="font-bold text-slate-900">🎮 How to play?</p>
            <p className="mt-1">{help.howToPlay}</p>
          </section>
          <section>
            <p className="font-bold text-slate-900">⭐ How do you score?</p>
            <p className="mt-1">{help.scoring}</p>
          </section>
          <section>
            <p className="font-bold text-slate-900">💎 Rewards & diamonds</p>
            <p className="mt-1">{help.rewards}</p>
          </section>
          <section>
            <p className="font-bold text-slate-900">💡 Quick tip</p>
            <p className="mt-1">{help.tip}</p>
          </section>
        </div>

        <button
          type="button"
          className="mt-5 w-full min-h-[44px] rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700"
          onClick={onClose}
        >
          Got it, let's play
        </button>
      </div>
    </div>
  );
}
