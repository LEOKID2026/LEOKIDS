import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import { useCallback, useEffect, useState } from "react";

function friendRequestFeedback(json) {
  if (json?.ok) return "Friend request sent";
  if (json?.code === "already_friends") return "You're already friends";
  if (json?.code === "pending_exists") return "Friend request already pending";
  if (json?.code === "self") return "You can't add yourself";
  if (json?.code === "not_found") return "Player not found";
  return json?.message || json?.error || "Error";
}

/** @param {{ gh: Record<string, string>, leoNumber?: string|null, leoNumberLoading?: boolean }} props */
export default function ArcadeClubFriendsPanel({ gh, leoNumber = null, leoNumberLoading = false }) {
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
    void load();
  }, [load]);

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
      setMessage(friendRequestFeedback(json));
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
      if (json?.ok && accept) {
        setMessage("Friend added!");
      } else if (json?.ok && !accept) {
        setMessage("Request declined");
      } else {
        setMessage(json?.message || json?.error || "Error");
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
      setMessage(json.ok ? "Invite sent" : json.message || json.error || "Error");
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
      setMessage("Couldn't copy — select and copy manually");
    }
  };

  const leoDisplay = leoNumber != null && String(leoNumber).trim() !== "" ? String(leoNumber).trim() : null;

  if (locked) {
    return (
      <div className={`${gh.arcadePanelFriends || gh.card} p-4 text-left`} dir="ltr">
        <p className={gh.arcadePanelBlurb || gh.cardBlurb}>Friends — controlled via Admin. Not open to guests yet.</p>
      </div>
    );
  }

  return (
    <div className={`${gh.arcadePanelFriends || gh.card} space-y-4`} dir="ltr">
      <h3 className={gh.arcadeSectionTitle || gh.sectionTitle}>Friends</h3>

      <div className={`space-y-2 p-3 text-left ${gh.arcadeRoomItem || gh.roomItem}`}>
        <p className={`text-sm font-bold ${gh.arcadePanelTitle || gh.cardTitle}`}>My Leo number</p>
        <p className={`text-xs leading-relaxed ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
          This is the number you give a friend — they can type it below to send you a friend request.
        </p>
        {leoNumberLoading ? (
          <p className={`text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>Setting up your Leo number…</p>
        ) : leoDisplay ? (
          <div className="flex flex-wrap items-center justify-start gap-2">
            <span className="font-mono text-lg font-bold tracking-wide text-indigo-800">{leoDisplay}</span>
            <button type="button" onClick={() => void copyLeoNumber()} className={gh.btnJoinCode}>
              {copiedLeo ? "Copied!" : "Copy"}
            </button>
          </div>
        ) : (
          <p className={`text-xs ${gh.arcadeEmptyText || gh.emptyText}`}>
            Couldn't show your Leo number — try refreshing the page.
          </p>
        )}
      </div>

      <div className={`space-y-2 p-3 text-left ${gh.arcadeRoomItem || gh.roomItem}`}>
        <p className={`text-sm font-bold ${gh.arcadePanelTitle || gh.cardTitle}`}>Add friend</p>
        <p className={`text-xs leading-relaxed ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
          Enter a Leo number or display name — a friend request will be sent for them to approve.
        </p>
        <div className="flex flex-wrap gap-2 justify-start">
          <input
            className={gh.input}
            placeholder={gamePackCopy("components__arcade__club__ArcadeClubFriendsPanel", "leo_number_8_digits_or_display_name")}
            maxLength={32}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" disabled={busy} onClick={() => void sendRequest()} className={gh.btnJoinCode}>
            Add friend
          </button>
        </div>
      </div>

      {message ? <p className={`text-sm ${gh.userMessage}`}>{message}</p> : null}

      <div className="space-y-3">
        <p className={`text-sm font-bold ${gh.arcadePanelTitle || gh.cardTitle}`}>Requests & friends</p>

        {pending.length ? (
          <div className="space-y-2">
            <p className={`text-sm font-semibold ${gh.arcadePanelTitle || gh.cardTitle}`}>Friend requests</p>
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
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void respond(p.requestId, false)}
                      className={gh.btnSecondaryOutline}
                    >
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="space-y-2">
          <p className={`text-sm font-semibold ${gh.arcadePanelTitle || gh.cardTitle}`}>My friends</p>
          <ul className="space-y-2">
            {friends.map((f) => (
              <li
                key={f.studentId}
                className={`flex flex-wrap items-center justify-between gap-2 ${gh.arcadeRoomItem || gh.roomItem}`}
              >
                <span>
                  {f.displayName} {f.online ? "● Online" : "○ Offline"}
                </span>
                {confirmRemoveId === f.studentId ? (
                  <div className="flex flex-col items-end gap-1">
                    <p className={`text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>Remove this friend from your list?</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setConfirmRemoveId(null)}
                        className={gh.btnSecondaryOutline}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void removeFriend(f.studentId)}
                        className={gh.btnSecondaryOutline}
                      >
                        Delete
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
                      Invite
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirmRemoveId(f.studentId)}
                      className={gh.btnSecondaryOutline}
                    >
                      Remove friend
                    </button>
                  </div>
                )}
              </li>
            ))}
            {!friends.length ? <li className={gh.arcadeEmptyText || gh.emptyText}>No friends yet</li> : null}
          </ul>
        </div>
      </div>
    </div>
  );
}
