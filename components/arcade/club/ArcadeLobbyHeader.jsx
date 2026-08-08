import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import StudentLearningAvatar from "./StudentLearningAvatar.jsx";

const SLUG = "components__arcade__club__ArcadeLobbyHeader";

/** @param {{ displayName: string, coinBalance: string|number, diamondBalance?: string|number, isGuest?: boolean, leoNumber?: string|null, avatarEmoji?: string, avatarCustomDataUrl?: string, avatarBackgroundKey?: string, className?: string, gh?: Record<string, string>, onAvatarClick?: () => void }} props */
export default function ArcadeLobbyHeader({
  displayName,
  coinBalance,
  diamondBalance = "-",
  isGuest = false,
  leoNumber = null,
  avatarEmoji = "👤",
  avatarCustomDataUrl = "",
  avatarBackgroundKey = "sky",
  className = "",
  gh = {},
  onAvatarClick,
}) {
  const shell = gh.arcadeHeader || "rounded-xl border border-sky-300 bg-sky-100 p-3 sm:p-4 shadow-sm";
  const title = gh.arcadeHeaderTitle || "text-lg font-bold text-blue-900 sm:text-xl";
  const guest = gh.arcadeHeaderGuest || "mt-1 text-xs text-amber-800";
  const coinShell = gh.arcadeCoinBadge || "min-w-[4.75rem] rounded-lg border border-amber-300 bg-amber-100 px-2.5 py-1.5 text-left shadow-sm";
  const diamondShell = gh.arcadeDiamondBadge || "min-w-[4.75rem] rounded-lg border border-sky-300 bg-blue-50 px-2.5 py-1.5 text-left shadow-sm";
  const coinLabel = gh.arcadeCoinLabel || "text-[10px] font-semibold text-amber-800";
  const coinValue = gh.arcadeCoinValue || "text-sm font-bold text-amber-900 sm:text-base";
  const diamondLabel = gh.arcadeDiamondLabel || gh.arcadeCoinLabel || "text-[10px] font-semibold text-sky-800";
  const diamondValue = gh.arcadeDiamondValue || gh.arcadeCoinValue || "text-sm font-bold text-blue-900 sm:text-base";

  const guestLine = `${gamePackCopy(SLUG, "guest_player")}${
    leoNumber ? gamePackCopy(SLUG, "leo_number_part", { leoNumber }) : ""
  }${gamePackCopy(SLUG, "guest_link_hint")}`;

  return (
    <div className={`${shell} ${className}`} dir="ltr">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
          <StudentLearningAvatar
            avatarEmoji={avatarEmoji}
            avatarCustomDataUrl={avatarCustomDataUrl}
            avatarBackgroundKey={avatarBackgroundKey}
            onClick={onAvatarClick}
          />
          <div className="min-w-0 text-left">
            <h1 className={`${title} truncate`}>{displayName || gamePackCopy(SLUG, "player")}</h1>
            {isGuest ? <p className={guest}>{guestLine}</p> : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-stretch justify-start gap-2">
          <div className={coinShell}>
            <p className={coinLabel}>{gamePackCopy(SLUG, "coins")}</p>
            <p className={coinValue}>🪙 {coinBalance}</p>
          </div>
          <div className={diamondShell}>
            <p className={diamondLabel}>{gamePackCopy(SLUG, "diamonds")}</p>
            <p className={diamondValue}>💎 {diamondBalance}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
