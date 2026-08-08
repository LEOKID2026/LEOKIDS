import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import { useCallback, useState } from "react";
import { displayArcadeGameTitle } from "./arcadeGameTitles.js";

const SLUG = "components__arcade__club__ArcadeInviteBanner";

/** @param {{ invite: object|null, onDismiss?: () => void, className?: string }} props */
export default function ArcadeInviteBanner({ invite, onDismiss, className = "" }) {
  const [busy, setBusy] = useState(false);

  const respond = useCallback(
    async (accept) => {
      if (!invite?.inviteId) return;
      setBusy(true);
      try {
        const res = await fetch("/api/arcade/invites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "respond", inviteId: invite.inviteId, accept }),
        });
        const json = await res.json().catch(() => ({}));
        if (json.ok && accept && json.room?.id) {
          const gk = json.room.game_key || invite.gameKey || "fourline";
          const routes = {
            fourline: "/student/games/fourline",
            ludo: "/student/games/ludo",
            "snakes-and-ladders": "/student/games/snakes-and-ladders",
            checkers: "/student/games/checkers",
            chess: "/student/games/chess",
            dominoes: "/student/games/dominoes",
            bingo: "/student/games/bingo",
          };
          const base = routes[gk] || routes.fourline;
          window.location.href = `${base}?roomId=${encodeURIComponent(String(json.room.id))}`;
        }
        onDismiss?.();
      } finally {
        setBusy(false);
      }
    },
    [invite, onDismiss]
  );

  if (!invite?.inviteId) return null;

  const fromName = invite.fromDisplayName || gamePackCopy(SLUG, "friend");
  const inviteLine = invite.gameKey
    ? gamePackCopy(SLUG, "invites_you_to_game", {
        name: fromName,
        game: displayArcadeGameTitle(invite.gameKey),
      })
    : gamePackCopy(SLUG, "invites_you_to_a_game", { name: fromName });

  return (
    <div className={`rounded-xl border border-sky-400/35 bg-sky-500/10 p-3 text-left ${className}`} dir="ltr">
      <p className="text-sm font-semibold text-sky-100">{inviteLine}</p>
      <div className="mt-2 flex flex-wrap gap-2 justify-start">
        <button type="button" disabled={busy} onClick={() => void respond(true)} className="rounded-lg bg-emerald-500 px-3 py-1 text-sm font-bold text-black">
          {gamePackCopy(SLUG, "accept")}
        </button>
        <button type="button" disabled={busy} onClick={() => void respond(false)} className="rounded-lg border border-white/25 px-3 py-1 text-sm">
          {gamePackCopy(SLUG, "decline")}
        </button>
      </div>
    </div>
  );
}
