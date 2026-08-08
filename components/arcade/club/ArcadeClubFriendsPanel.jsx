import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import { useCallback, useEffect, useState } from "react";
import { demoPackCopyForLocale } from "../../../lib/demo/demo-pack-copy.js";
import { useI18n } from "../../../lib/i18n/I18nProvider.jsx";
import { resolveStudentApiErrorMessage } from "../../../lib/student-client/student-api-legacy-errors.js";

const SLUG = "components__arcade__club__ArcadeClubFriendsPanel";

/**
 * @param {unknown} json
 * @param {(key: string, params?: Record<string, unknown>) => string} t
 */
function friendRequestFeedback(json, t) {
  if (json?.ok) return t("games.apiSuccess");
  return resolveStudentApiErrorMessage(json, t) || t("games.apiFailed");
}

/** @param {{ gh: Record<string, string>, leoNumber?: string|null, leoNumberLoading?: boolean, demoDisabled?: boolean }} props */
export default function ArcadeClubFriendsPanel({ gh, leoNumber = null, leoNumberLoading = false, demoDisabled = false }) {
  const { locale, t } = useI18n();
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [locked, setLocked] = useState(false);
  const [copiedLeo, setCopiedLeo] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/arcade/friends");
    const json = await res.json().catch(() => ({}));
    if (json?.ok) {
      setFriends(json.friends || []);
      setPending(json.pendingIncoming || []);
      setLocked(json.featureLocked === true);
    }
  }, []);

  useEffect(() => {
    if (demoDisabled) return undefined;
    void load();
  }, [load, demoDisabled]);

  if (demoDisabled) {
    return (
      <div className={`${gh.arcadePanelFriends || gh.card} text-left`} dir="ltr">
        <p className={gh.arcadePanelBlurb || gh.cardBlurb}>
          {demoPackCopyForLocale(locale, "friends", "demoUnavailable")}
        </p>
      </div>
    );
  }

  const sendRequest = async () => {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/arcade/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", query }),
      });
      const json = await res.json().catch(() => ({}));
      setMessage(friendRequestFeedback(json, t));
      if (json.ok) {
        setQuery("");
        await load();
      }
    } finally {
      setBusy(false);
    }
  };

  const respond = async (requestId, accept) => {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/arcade/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "respond", requestId, accept }),
      });
      const json = await res.json().catch(() => ({}));
      if (json?.ok) {
        setMessage(t("games.apiSuccess"));
      } else {
        setMessage(resolveStudentApiErrorMessage(json, t) || t("games.apiFailed"));
      }
      await load();
    } finally {
      setBusy(false);
    }
  };

  const inviteFriend = async (toStudentId) => {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/arcade/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", toStudentId, gameKey: "fourline" }),
      });
      const json = await res.json().catch(() => ({}));
      if (json.ok && json.room?.id) {
        const gk = json.room.game_key || json.invite?.game_key || "fourline";
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
        return;
      }
      setMessage(json.ok ? t("games.apiSuccess") : resolveStudentApiErrorMessage(json, t) || t("games.apiFailed"));
    } finally {
      setBusy(false);
    }
  };

  const removeFriend = async (friendId) => {
    setBusy(true);
    try {
      await fetch(`/api/arcade/friends?friendId=${encodeURIComponent(friendId)}`, { method: "DELETE" });
      setConfirmRemoveId(null);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const copyLeoNumber = async () => {
    const value = String(leoNumber || "").trim();
    if (!value) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedLeo(true);
      window.setTimeout(() => setCopiedLeo(false), 2000);
    } catch {
      setMessage(t("games.apiFailed"));
    }
  };

  const leoDisplay = leoNumber != null && String(leoNumber).trim() !== "" ? String(leoNumber).trim() : null;

  if (locked) {
    return (
      <div className={`${gh.arcadePanelFriends || gh.card} p-4 text-left`} dir="ltr">
        <p className={gh.arcadePanelBlurb || gh.cardBlurb}>
          {gamePackCopy(SLUG, "friends_controlled_via_admin_not_open_to_guests_yet")}
        </p>
      </div>
    );
  }

  return (
    <div className={`${gh.arcadePanelFriends || gh.card} space-y-4`} dir="ltr">
      <h3 className={gh.arcadeSectionTitle || gh.sectionTitle}>{gamePackCopy(SLUG, "friends")}</h3>

      <div className={`space-y-2 p-3 text-left ${gh.arcadeRoomItem || gh.roomItem}`}>
        <p className={`text-sm font-bold ${gh.arcadePanelTitle || gh.cardTitle}`}>
          {gamePackCopy(SLUG, "my_leo_number")}
        </p>
        <p className={`text-xs leading-relaxed ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
          {gamePackCopy(SLUG, "this_is_the_number_you_give_a_friend_they_can_type_it_below_to_send_you_")}
        </p>
        {leoNumberLoading ? (
          <p className={`text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
            {gamePackCopy(SLUG, "setting_up_your_leo_number")}
          </p>
        ) : leoDisplay ? (
          <div className="flex flex-wrap items-center justify-start gap-2">
            <span className="font-mono text-lg font-bold tracking-wide text-indigo-800">{leoDisplay}</span>
            <button type="button" onClick={() => void copyLeoNumber()} className={gh.btnJoinCode}>
              {copiedLeo ? gamePackCopy(SLUG, "copied") : gamePackCopy(SLUG, "copy")}
            </button>
          </div>
        ) : (
          <p className={`text-xs ${gh.arcadeEmptyText || gh.emptyText}`}>
            {gamePackCopy(SLUG, "couldn_t_show_your_leo_number_try_refreshing_the_page")}
          </p>
        )}
      </div>

      <div className={`space-y-2 p-3 text-left ${gh.arcadeRoomItem || gh.roomItem}`}>
        <p className={`text-sm font-bold ${gh.arcadePanelTitle || gh.cardTitle}`}>
          {gamePackCopy(SLUG, "add_friend")}
        </p>
        <p className={`text-xs leading-relaxed ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
          {gamePackCopy(SLUG, "enter_a_leo_number_or_display_name_a_friend_request_will_be_sent_for_the")}
        </p>
        <div className="flex flex-wrap gap-2 justify-start">
          <input
            className={gh.input}
            placeholder={gamePackCopy(SLUG, "leo_number_8_digits_or_display_name")}
            maxLength={32}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" disabled={busy} onClick={() => void sendRequest()} className={gh.btnJoinCode}>
            {gamePackCopy(SLUG, "add_friend")}
          </button>
        </div>
      </div>

      {message ? <p className={`text-sm ${gh.userMessage}`}>{message}</p> : null}

      <div className="space-y-3">
        <p className={`text-sm font-bold ${gh.arcadePanelTitle || gh.cardTitle}`}>
          {gamePackCopy(SLUG, "requests_friends")}
        </p>

        {pending.length ? (
          <div className="space-y-2">
            <p className={`text-sm font-semibold ${gh.arcadePanelTitle || gh.cardTitle}`}>
              {gamePackCopy(SLUG, "friend_requests")}
            </p>
            <ul className="space-y-2">
              {pending.map((p) => (
                <li
                  key={p.requestId}
                  className={`flex flex-wrap items-center justify-between gap-2 ${gh.arcadeRoomItem || gh.roomItem}`}
                >
                  <span>
                    {p.displayName}
                    {p.leoNumber ? (
                      <span className={`ms-2 font-mono text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
                        ({p.leoNumber})
                      </span>
                    ) : null}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void respond(p.requestId, true)}
                      className={gh.btnJoinRoom}
                    >
                      {gamePackCopy(SLUG, "approve")}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void respond(p.requestId, false)}
                      className={gh.btnSecondaryOutline}
                    >
                      {gamePackCopy(SLUG, "decline")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="space-y-2">
          <p className={`text-sm font-semibold ${gh.arcadePanelTitle || gh.cardTitle}`}>
            {gamePackCopy(SLUG, "my_friends")}
          </p>
          <ul className="space-y-2">
            {friends.map((f) => (
              <li
                key={f.studentId}
                className={`flex flex-wrap items-center justify-between gap-2 ${gh.arcadeRoomItem || gh.roomItem}`}
              >
                <span>
                  {f.displayName} {f.online ? gamePackCopy(SLUG, "online") : gamePackCopy(SLUG, "offline")}
                </span>
                {confirmRemoveId === f.studentId ? (
                  <div className="flex flex-col items-end gap-1">
                    <p className={`text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
                      {gamePackCopy(SLUG, "remove_this_friend_from_your_list")}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setConfirmRemoveId(null)}
                        className={gh.btnSecondaryOutline}
                      >
                        {gamePackCopy(SLUG, "cancel")}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void removeFriend(f.studentId)}
                        className={gh.btnSecondaryOutline}
                      >
                        {gamePackCopy(SLUG, "delete")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void inviteFriend(f.studentId)}
                      className={gh.btnJoinRoom}
                    >
                      {gamePackCopy(SLUG, "invite")}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirmRemoveId(f.studentId)}
                      className={gh.btnSecondaryOutline}
                    >
                      {gamePackCopy(SLUG, "remove_friend")}
                    </button>
                  </div>
                )}
              </li>
            ))}
            {!friends.length ? (
              <li className={gh.arcadeEmptyText || gh.emptyText}>{gamePackCopy(SLUG, "no_friends_yet")}</li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
}
