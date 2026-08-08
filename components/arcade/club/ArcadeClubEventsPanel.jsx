import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "../../../lib/i18n/I18nProvider.jsx";
import { resolveStudentApiErrorMessage } from "../../../lib/student-client/student-api-legacy-errors.js";

const SLUG = "components__arcade__club__ArcadeClubEventsPanel";

/** @param {{ gh: Record<string, string>, className?: string }} props */
export default function ArcadeClubEventsPanel({ gh, className = "" }) {
  const { t } = useI18n();
  const [event, setEvent] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [eRes, tRes] = await Promise.all([
      fetch("/api/arcade/events"),
      fetch("/api/arcade/events?resource=tournament"),
    ]);
    const eJson = await eRes.json().catch(() => ({}));
    const tJson = await tRes.json().catch(() => ({}));
    if (eJson?.ok) setEvent(eJson.event || null);
    if (tJson?.ok) setTournament(tJson.tournament || null);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const claimEvent = async () => {
    if (!event?.id || !event.canClaim) return;
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/arcade/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "claim_event", eventId: event.id }),
      });
      const json = await res.json().catch(() => ({}));
      setMessage(json.ok ? t("games.apiSuccess") : resolveStudentApiErrorMessage(json, t) || t("games.apiFailed"));
      if (json.ok) await load();
    } finally {
      setBusy(false);
    }
  };

  const registerTournament = async () => {
    if (!tournament?.id || !tournament.registrationOpen || tournament.registered) return;
    setBusy(true);
    try {
      const res = await fetch("/api/arcade/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register_tournament", tournamentId: tournament.id }),
      });
      const json = await res.json().catch(() => ({}));
      setMessage(json.ok ? t("games.apiSuccess") : resolveStudentApiErrorMessage(json, t) || t("games.apiFailed"));
      if (json.ok) await load();
    } finally {
      setBusy(false);
    }
  };

  if (!event && !tournament) return null;

  return (
    <div className={`${gh.arcadePanelEvents || gh.card} space-y-3 p-4 text-left ${className}`} dir="ltr">
      {event ? (
        <div>
          <p className={`text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>{gamePackCopy(SLUG, "daily_event")}</p>
          <p className={`font-bold ${gh.arcadePanelTitle || gh.cardTitle}`}>
            {event.title || gamePackCopy(SLUG, "todays_challenge")}
          </p>
          <p className={`text-sm ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
            {gamePackCopy(SLUG, "coins_reward", { amount: event.rewardCoins || 0 })}
          </p>
          {event.claimed ? (
            <p className="mt-1 text-xs font-semibold text-emerald-700">{gamePackCopy(SLUG, "collected")}</p>
          ) : event.canClaim ? (
            <button type="button" disabled={busy} onClick={() => void claimEvent()} className={`mt-2 ${gh.btnJoinRoom}`}>
              {gamePackCopy(SLUG, "collect_reward")}
            </button>
          ) : (
            <p className={`mt-1 text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
              {gamePackCopy(SLUG, "play_to_complete")}
            </p>
          )}
        </div>
      ) : null}
      {tournament ? (
        <div className="border-t border-violet-200 pt-3">
          <p className={`text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>{gamePackCopy(SLUG, "tournament")}</p>
          <p className={`font-bold ${gh.arcadePanelTitle || gh.cardTitle}`}>{tournament.title}</p>
          {tournament.registered ? (
            <p className="mt-1 text-xs font-semibold text-emerald-700">{gamePackCopy(SLUG, "registered")}</p>
          ) : tournament.registrationOpen ? (
            <button type="button" disabled={busy} onClick={() => void registerTournament()} className={`mt-2 ${gh.btnSecondary}`}>
              {gamePackCopy(SLUG, "register")}
            </button>
          ) : (
            <p className={`mt-1 text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
              {gamePackCopy(SLUG, "registration_closed")}
            </p>
          )}
        </div>
      ) : null}
      {message ? <p className={`text-sm ${gh.userMessage}`}>{message}</p> : null}
    </div>
  );
}
