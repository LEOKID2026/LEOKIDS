import { useEffect, useRef } from "react";
import {
  useGameHelpContent,
  useGamePackCopy,
  useGameUiDisplay,
} from "../../lib/games/game-locale-context.jsx";

/**
 * @param {{
 *   game: { gameKey?: string, id?: string, titleHe?: string } | null,
 *   onClose: () => void,
 * }} props
 */
export default function SoloGameHelpModal({ game, onClose }) {
  const closeBtnRef = useRef(null);
  const copy = useGamePackCopy();
  const gameKey = String(game?.gameKey || game?.id || "").trim();
  const ui = useGameUiDisplay(gameKey);
  const help = useGameHelpContent(gameKey);

  useEffect(() => {
    if (!game) return undefined;
    closeBtnRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [game, onClose]);

  if (!game || !gameKey) return null;

  const titleLine = copy("components__solo-games__SoloGameHelpModal", "how_to_play_title").replace(
    "{title}",
    ui.title,
  );

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
          aria-label={copy("components__solo-games__SoloGameHelpModal", "close")}
          onClick={onClose}
        >
          ×
        </button>

        <h2
          id="solo-game-help-title"
          className="mb-4 pr-8 text-lg font-extrabold leading-snug text-slate-900 sm:text-xl"
        >
          {titleLine}
        </h2>

        <div className="space-y-3 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          <section>
            <p className="font-bold text-slate-900">
              🎮 {copy("components__solo-games__SoloGameHelpModal", "how_to_play_heading")}
            </p>
            <p className="mt-1">{help.howToPlay}</p>
          </section>
          {help.scoring ? (
            <section>
              <p className="font-bold text-slate-900">
                ⭐ {copy("components__solo-games__SoloGameHelpModal", "scoring_heading")}
              </p>
              <p className="mt-1">{help.scoring}</p>
            </section>
          ) : null}
          {help.rewards ? (
            <section>
              <p className="font-bold text-slate-900">
                💎 {copy("components__solo-games__SoloGameHelpModal", "rewards_heading")}
              </p>
              <p className="mt-1">{help.rewards}</p>
            </section>
          ) : null}
          {help.tip ? (
            <section>
              <p className="font-bold text-slate-900">
                💡 {copy("components__solo-games__SoloGameHelpModal", "tip_heading")}
              </p>
              <p className="mt-1">{help.tip}</p>
            </section>
          ) : null}
        </div>

        <button
          type="button"
          className="mt-5 w-full min-h-[44px] rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700"
          onClick={onClose}
        >
          {copy("components__solo-games__SoloGameHelpModal", "got_it_lets_play")}
        </button>
      </div>
    </div>
  );
}
