import { gamePackCopy } from "../../lib/games/game-pack-copy.js";
/**
 * @param {{ show: boolean }} props
 */
export default function SoloLandscapeGate({ show }) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-gray-950/95 px-6 text-center text-white"
      dir="ltr"
      role="dialog"
      aria-modal="true"
      aria-label={gamePackCopy("components__solo-games__SoloLandscapeGate", "rotate_your_device")}
    >
      <div className="mb-6 text-6xl animate-pulse" aria-hidden>
        📱↻
      </div>
      <h2 className="mb-3 text-2xl font-extrabold text-yellow-300 sm:text-3xl">{gamePackCopy("components__solo-games__SoloLandscapeGate", "rotate_your_device_to_landscape_to_play")}</h2>
      <p className="max-w-sm text-base text-gray-300 sm:text-lg">{gamePackCopy("components__solo-games__SoloLandscapeGate", "this_game_works_best_in_landscape_rotate_your_phone_or_tablet_then_you_c")}</p>
    </div>
  );
}
