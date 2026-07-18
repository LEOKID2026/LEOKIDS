import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import shop from "./educational-game-shop-layout.module.css";

/**
 * @param {{ text: string, onReplay: (text: string) => void, className?: string }} props
 */
export default function EducationalGameInstructionReplay({ text, onReplay, className = "" }) {
  if (!text?.trim()) return null;
  return (
    <button
      type="button"
      className={`${shop.instructionReplayBtn} ${className}`.trim()}
      onClick={() => onReplay(text)}
      aria-label={gamePackCopy("components__educational-games__shared__EducationalGameInstructionReplay", "replay_instruction")}
      title={gamePackCopy("components__educational-games__shared__EducationalGameInstructionReplay", "replay_instruction")}
    >
      🔊
    </button>
  );
}
