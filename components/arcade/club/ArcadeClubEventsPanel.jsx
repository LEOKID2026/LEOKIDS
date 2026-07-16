import { useCallback, useEffect, useState } from "react";



/** @param {{ gh: Record<string, string>, className?: string }} props */

export default function ArcadeClubEventsPanel({ gh, className = "" }) {

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

      setMessage(json.ok ? "Reward collected!" : json.message || json.error || "Error");

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

      setMessage(json.ok ? "You're registered for the tournament!" : json.message || json.error || "Error");

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

          <p className={`text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>Daily event</p>

          <p className={`font-bold ${gh.arcadePanelTitle || gh.cardTitle}`}>{event.titleHe || "Today's challenge"}</p>

          <p className={`text-sm ${gh.arcadePanelBlurb || gh.cardBlurb}`}>+{event.rewardCoins || 0} coins</p>

          {event.claimed ? (

            <p className="mt-1 text-xs font-semibold text-emerald-700">Collected ✓</p>

          ) : event.canClaim ? (

            <button type="button" disabled={busy} onClick={() => void claimEvent()} className={`mt-2 ${gh.btnJoinRoom}`}>

              Collect reward

            </button>

          ) : (

            <p className={`mt-1 text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>Play an arcade game to complete the challenge</p>

          )}

        </div>

      ) : null}

      {tournament ? (

        <div className="border-t border-violet-200 pt-3">

          <p className={`text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>Tournament</p>

          <p className={`font-bold ${gh.arcadePanelTitle || gh.cardTitle}`}>{tournament.titleHe}</p>

          {tournament.registered ? (

            <p className="mt-1 text-xs font-semibold text-emerald-700">Registered ✓</p>

          ) : tournament.registrationOpen ? (

            <button type="button" disabled={busy} onClick={() => void registerTournament()} className={`mt-2 ${gh.btnSecondary}`}>

              Register

            </button>

          ) : (

            <p className={`mt-1 text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>Registration closed</p>

          )}

        </div>

      ) : null}

      {message ? <p className={`text-sm ${gh.userMessage}`}>{message}</p> : null}

    </div>

  );

}

