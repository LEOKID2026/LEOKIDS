import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
import { useCallback, useEffect, useState } from "react";
import { formatDateHe, teacherAuthFetch } from "../../lib/teacher-portal/teacher-ui.js";

function formatMessageDateTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (!Number.isFinite(d.getTime())) return formatDateHe(iso);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return formatDateHe(iso);
  }
}

export default function TeacherParentMessagePanel({ accessToken, studentId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmHideId, setConfirmHideId] = useState(null);

  const load = useCallback(async () => {
    if (!accessToken || !studentId) return;
    setLoading(true);
    setError("");
    const res = await teacherAuthFetch(
      accessToken,
      `/api/teacher/students/${encodeURIComponent(studentId)}/parent-messages?studentId=${encodeURIComponent(studentId)}`
    );
    const body = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.status === 503 && body?.error?.code === "schema_not_ready") {
      setError("Messaging is not enabled yet. Please run the database migration.");
      return;
    }
    if (res.status !== 200) {
      setError("Could not load messages.");
      return;
    }
    setMessages(body?.data?.messages || []);
  }, [accessToken, studentId]);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    setError("");
    const res = await teacherAuthFetch(
      accessToken,
      `/api/teacher/students/${encodeURIComponent(studentId)}/parent-messages?studentId=${encodeURIComponent(studentId)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      }
    );
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.status === 503 && body?.error?.code === "schema_not_ready") {
      setError("Messaging is not enabled yet.");
      return;
    }
    if (res.status !== 201) {
      setError("Could not send the message. Please try again.");
      return;
    }
    setDraft("");
    await load();
  };

  const onHide = async (messageId) => {
    if (!messageId || busy) return;
    setBusy(true);
    setError("");
    const res = await teacherAuthFetch(
      accessToken,
      `/api/teacher/students/${encodeURIComponent(studentId)}/parent-messages/${encodeURIComponent(messageId)}/hide?studentId=${encodeURIComponent(studentId)}&messageId=${encodeURIComponent(messageId)}`,
      { method: "POST" }
    );
    setBusy(false);
    setConfirmHideId(null);
    if (res.status !== 200) {
      setError("Could not hide the message.");
      return;
    }
    await load();
  };

  const visibleHistory = messages.filter((m) => !m.isHidden);
  const hiddenHistory = messages.filter((m) => m.isHidden);

  return (
    <section
      className="rounded-xl border border-white/15 bg-black/30 p-4 md:p-5 mb-6"
      dir="ltr"
      lang="en"
      data-testid="teacher-parent-message-panel"
    >
      <h2 className="text-lg font-semibold mb-3">Message to parent</h2>
      <p className="text-sm text-white/60 mb-4">
        This message will appear on the parent report — including teacher-code access.
      </p>

      <form onSubmit={onSubmit} className="space-y-3 mb-5">
        <label className="block text-sm">
          <span className="sr-only">Message to parent</span>
          <textarea
            className="w-full min-h-[96px] rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm resize-y"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={globalBurnDownCopy("components__teacher-portal__TeacherParentMessagePanel", "write_a_short_message_to_the_parent")}
            maxLength={2000}
            disabled={busy}
          />
        </label>
        <button
          type="submit"
          disabled={busy || !draft.trim()}
          className="rounded bg-amber-500 text-black font-semibold px-4 py-2 text-sm disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send message to parent"}
        </button>
      </form>

      {error ? (
        <p className="text-sm text-red-300 mb-3" role="alert">
          {error}
        </p>
      ) : null}

      <h3 className="text-sm font-semibold text-white/80 mb-2">Previous messages</h3>
      {loading ? <p className="text-sm text-white/50">Loading…</p> : null}
      {!loading && visibleHistory.length === 0 && hiddenHistory.length === 0 ? (
        <p className="text-sm text-white/50">No messages sent yet.</p>
      ) : null}

      <ul className="space-y-3 m-0 p-0 list-none">
        {visibleHistory.map((msg) => (
          <li
            key={msg.id}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
              <p className="text-xs text-white/50 m-0">{formatMessageDateTime(msg.createdAt)}</p>
              {confirmHideId === msg.id ? (
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    className="text-red-300 underline"
                    onClick={() => onHide(msg.id)}
                    disabled={busy}
                  >
                    Confirm hide
                  </button>
                  <button
                    type="button"
                    className="text-white/60 underline"
                    onClick={() => setConfirmHideId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="text-xs text-white/50 underline hover:text-white/70"
                  onClick={() => setConfirmHideId(msg.id)}
                  disabled={busy}
                >
                  Hide from parent
                </button>
              )}
            </div>
            <p className="text-sm text-white/90 whitespace-pre-wrap break-words m-0 leading-relaxed">
              {msg.message}
            </p>
          </li>
        ))}
      </ul>

      {hiddenHistory.length > 0 ? (
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-white/45 mb-2">Hidden messages ({hiddenHistory.length})</p>
          <ul className="space-y-2 m-0 p-0 list-none">
            {hiddenHistory.map((msg) => (
              <li key={msg.id} className="text-xs text-white/40 line-through break-words">
                {formatMessageDateTime(msg.createdAt)} - {msg.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
