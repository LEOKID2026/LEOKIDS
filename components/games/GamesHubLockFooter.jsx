import {
  GUEST_GAME_LOCK_HINT_KEY,
  GUEST_GAME_LOCK_LABEL_KEY,
} from "../../lib/guest/constants.js";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

/**
 * Child-friendly lock label for guest-locked hub games.
 */
export default function GamesHubLockFooter({
  ctaClass = "",
  label,
  hint,
}) {
  const t = useT();
  const resolvedLabel = label || t(GUEST_GAME_LOCK_LABEL_KEY);
  const resolvedHint = hint === undefined ? t(GUEST_GAME_LOCK_HINT_KEY) : hint;

  return (
    <div className="mt-3 text-right">
      <span className={`${ctaClass} inline-flex items-center gap-1 opacity-90 cursor-not-allowed`}>
        🔒 {resolvedLabel}
      </span>
      {resolvedHint ? <p className="mt-1 text-xs opacity-70">{resolvedHint}</p> : null}
    </div>
  );
}
