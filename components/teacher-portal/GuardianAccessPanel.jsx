import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
import { useCallback, useEffect, useState } from "react";
import {
  formatDateHe,
  guardianAccessStateHe,
  teacherAuthFetch,
} from "../../lib/teacher-portal/teacher-ui.js";
import { shouldDisplayStudentAccessCode } from "../../lib/teacher-portal/student-access-display.js";

function ShownOnceBox({ credentials, onDismiss }) {
  if (!credentials) return null;
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 space-y-3">
      <p className="text-amber-200 font-semibold text-sm">
        ⚠ Save these details — they will not be shown again.
      </p>
      {credentials.loginUsername ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-white/70">Username:</span>
          <code className="bg-black/40 px-2 py-1 rounded">{credentials.loginUsername}</code>
          <button
            type="button"
            className="text-amber-300 text-xs underline"
            onClick={() => copy(credentials.loginUsername)}
          >
            Copy username
          </button>
        </div>
      ) : null}
      {credentials.loginPinPlaintext ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-white/70">Login code:</span>
          <code className="bg-black/40 px-2 py-1 rounded">{credentials.loginPinPlaintext}</code>
          <button
            type="button"
            className="text-amber-300 text-xs underline"
            onClick={() => copy(credentials.loginPinPlaintext)}
          >
            Copy code
          </button>
        </div>
      ) : null}
      {credentials.magicLink ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-white/70">Quick login link:</span>
          <button
            type="button"
            className="text-amber-300 text-xs underline break-all text-left"
            onClick={() => copy(credentials.magicLink)}
          >
            Copy link
          </button>
        </div>
      ) : null}
      {credentials.expiresAt ? (
        <p className="text-xs text-white/60">
          The quick link is valid for 7 days. Username and code are valid until {formatDateHe(credentials.expiresAt)}.
        </p>
      ) : null}
      <button
        type="button"
        className="rounded bg-amber-500 text-black font-semibold px-4 py-2 text-sm"
        onClick={onDismiss}
      >
        Close — I've saved the details
      </button>
    </div>
  );
}

export default function GuardianAccessPanel({ accessToken, studentId }) {
  const [accesses, setAccesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [shownOnce, setShownOnce] = useState(null);
  const [confirmRevoke, setConfirmRevoke] = useState(null);

  const load = useCallback(async () => {
    if (!accessToken || !studentId) return;
    setLoading(true);
    setError("");
    const res = await teacherAuthFetch(
      accessToken,
      `/api/teacher/student-access?studentId=${encodeURIComponent(studentId)}&state=all`
    );
    const body = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.status !== 200) {
      setError("Could not load the access list.");
      return;
    }
    setAccesses(body?.data?.accesses || []);
  }, [accessToken, studentId]);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async () => {
    setBusy(true);
    setError("");
    const res = await teacherAuthFetch(accessToken, "/api/teacher/student-access/create", {
      method: "POST",
      body: JSON.stringify({
        studentId,
        expiresInDays,
        deliveryChannel: "magic_link",
      }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.status !== 201) {
      if (body?.error?.code === "active_access_exists") {
        setError("An active access already exists for this student.");
      } else {
        setError("Something went wrong creating access.");
      }
      return;
    }
    setShowCreate(false);
    setShownOnce(body?.data || null);
    load();
  };

  const onRevoke = async (accessId) => {
    setBusy(true);
    const res = await teacherAuthFetch(
      accessToken,
      `/api/teacher/student-access/${encodeURIComponent(accessId)}/revoke`,
      { method: "POST" }
    );
    setBusy(false);
    setConfirmRevoke(null);
    if (res.status === 200) load();
    else setError("Could not revoke access.");
  };

  const onRotatePin = async (accessId) => {
    if (!window.confirm(globalBurnDownCopy("components__teacher-portal__GuardianAccessPanel", "the_current_code_will_be_revoked_and_a_new_one_generated_save_the_new_co"))) {
      return;
    }
    setBusy(true);
    const res = await teacherAuthFetch(
      accessToken,
      `/api/teacher/student-access/${encodeURIComponent(accessId)}/rotate-pin`,
      { method: "POST" }
    );
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.status === 200 && body?.data) {
      setShownOnce({
        loginUsername: accesses.find((a) => a.accessId === accessId)?.loginUsername,
        loginPinPlaintext: body.data.loginPinPlaintext,
        expiresAt: body.data.expiresAt,
      });
      load();
    } else {
      setError("Could not renew the code.");
    }
  };

  const onRotateUsername = async (accessId) => {
    if (!window.confirm(globalBurnDownCopy("components__teacher-portal__GuardianAccessPanel", "the_current_username_will_be_revoked_the_new_username_will_be_shown_only"))) {
      return;
    }
    setBusy(true);
    const res = await teacherAuthFetch(
      accessToken,
      `/api/teacher/student-access/${encodeURIComponent(accessId)}/rotate-username`,
      { method: "POST" }
    );
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.status === 200 && body?.data) {
      setShownOnce({
        loginUsername: body.data.loginUsername,
        loginPinPlaintext: null,
        expiresAt: body.data.expiresAt,
      });
      load();
    } else {
      setError("Could not change the username.");
    }
  };

  const activeAccess = accesses.find((a) => a.state === "active");

  return (
    <section className="mt-8 rounded-xl border border-white/15 bg-black/25 p-5">
      <h2 className="text-lg font-semibold mb-3">Parent access</h2>

      {loading ? <p className="text-white/60 text-sm">Loading…</p> : null}
      {error ? (
        <p className="text-red-300 text-sm mb-3" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && accesses.length === 0 ? (
        <p className="text-white/70 text-sm mb-4">No parent access has been set up for this student.</p>
      ) : null}

      <ul className="space-y-3 mb-4">
        {accesses.map((row) => {
          const visibleUsername = shouldDisplayStudentAccessCode(row.loginUsername)
            ? row.loginUsername
            : null;
          return (
          <li
            key={row.accessId}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
          >
            <div>
              {visibleUsername ? (
                <span className="text-white/80">Login: {visibleUsername}</span>
              ) : (
                <span className="text-white/80">
                  {row.state === "active" ? "Login active" : "Login"}
                </span>
              )}
              <span className="mx-2 text-white/40">·</span>
              <span
                className={
                  row.state === "active"
                    ? "text-emerald-300"
                    : row.state === "expired"
                      ? "text-amber-300"
                      : "text-white/50"
                }
              >
                {guardianAccessStateHe(row.state)}
                {row.state === "active" && row.expiresAt
                  ? ` - expired ${formatDateHe(row.expiresAt)}`
                  : ""}
              </span>
            </div>
            {row.state === "active" ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border border-white/20 hover:bg-white/10"
                  disabled={busy}
                  onClick={() => onRotatePin(row.accessId)}
                >
                  Renew code
                </button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border border-white/20 hover:bg-white/10"
                  disabled={busy}
                  onClick={() => onRotateUsername(row.accessId)}
                >
                  Change username
                </button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border border-red-400/40 text-red-200 hover:bg-red-500/10"
                  disabled={busy}
                  onClick={() => setConfirmRevoke(row.accessId)}
                >
                  Revoke access
                </button>
              </div>
            ) : null}
          </li>
          );
        })}
      </ul>

      {confirmRevoke ? (
        <div className="mb-4 p-4 rounded-lg border border-red-400/30 bg-red-500/10">
          <p className="font-semibold mb-2">Revoke parent access</p>
          <p className="text-sm text-white/80 mb-3">
            After revocation, the parent will not be able to sign in. This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded bg-red-600 text-white px-3 py-1.5 text-sm font-semibold"
              disabled={busy}
              onClick={() => onRevoke(confirmRevoke)}
            >
              Yes, revoke access
            </button>
            <button
              type="button"
              className="rounded border border-white/20 px-3 py-1.5 text-sm"
              onClick={() => setConfirmRevoke(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <ShownOnceBox credentials={shownOnce} onDismiss={() => setShownOnce(null)} />

      {!activeAccess && !showCreate ? (
        <button
          type="button"
          className="rounded bg-amber-500 text-black font-semibold px-4 py-2 text-sm"
          onClick={() => setShowCreate(true)}
        >
          Create new parent access
        </button>
      ) : null}

      {showCreate ? (
        <div className="mt-4 p-4 rounded-lg border border-white/15 bg-black/40 space-y-3">
          <h3 className="font-semibold">Create parent access</h3>
          <label className="block text-sm">
            <span className="text-white/70">Access validity</span>
            <select
              className="mt-1 w-full rounded bg-black/40 border border-white/20 px-3 py-2"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(Number(e.target.value))}
            >
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded bg-amber-500 text-black font-semibold px-4 py-2 text-sm disabled:opacity-60"
              disabled={busy}
              onClick={onCreate}
            >
              Create access
            </button>
            <button
              type="button"
              className="rounded border border-white/20 px-4 py-2 text-sm"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
