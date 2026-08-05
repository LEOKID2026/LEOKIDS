import { useCallback, useEffect, useState } from "react";
import { adminAuthFetch } from "../../../lib/admin-portal/use-admin-session.js";
import { ADMIN_LOADING, ADMIN_LOAD_ERROR, apiErrorMessageHe } from "../../../lib/admin-portal/admin-ui.js";
import {
  formatEconomyEntityKeyHe,
  formatEconomyFieldNameHe,
  formatEconomySettingAreaHe,
} from "../../../lib/admin-portal/admin-rewards-ui.js";
import AdminModal, { AdminModalButton } from "../AdminModal.jsx";

const GRADE_BANDS = [
  { value: "g12", label: "Grades 1–2" },
  { value: "g34", label: "Grades 3–4" },
  { value: "g56", label: "Grades 5–6" },
];

const inputClass =
  "block w-full mt-1 rounded bg-black/30 border border-white/15 px-2 py-1 text-white text-sm";

function AdminSection({ title, children }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-4">
      <h3 className="text-sm font-bold text-white mb-3 text-right">{title}</h3>
      {children}
    </section>
  );
}

function AdminSaveButton({ busy, onClick, label = "Save" }) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className="rounded-lg bg-amber-500/30 border border-amber-400/40 px-4 py-2 text-sm font-semibold text-amber-100 disabled:opacity-50"
    >
      {busy ? "Saving..." : label}
    </button>
  );
}

function DailyMissionFormFields({ draft, setDraft }) {
  return (
    <div className="space-y-3 text-sm">
      <label className="block">
        Child text
        <input
          className={inputClass}
          value={draft.text || ""}
          onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
        />
      </label>
      <label className="block">
        Target
        <input
          type="number"
          className={inputClass}
          value={draft.target_value ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, target_value: e.target.value }))}
        />
      </label>
      <label className="block">
        Coins
        <input
          type="number"
          className={inputClass}
          value={draft.reward_coins ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, reward_coins: e.target.value }))}
        />
      </label>
      <label className="block">
        Display order
        <input
          type="number"
          className={inputClass}
          value={draft.display_order ?? 0}
          onChange={(e) => setDraft((d) => ({ ...d, display_order: e.target.value }))}
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={draft.is_active !== false}
          onChange={(e) => setDraft((d) => ({ ...d, is_active: e.target.checked }))}
        />
        Active
      </label>
    </div>
  );
}

function MonthlyTierFormFields({ draft, setDraft }) {
  return (
    <div className="space-y-3 text-sm">
      <label className="block">
        Minutes (threshold)
        <input
          type="number"
          className={inputClass}
          value={draft.minutes_threshold ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, minutes_threshold: e.target.value }))}
        />
      </label>
      <label className="block">
        Coins
        <input
          type="number"
          className={inputClass}
          value={draft.reward_coins ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, reward_coins: e.target.value }))}
        />
      </label>
      <label className="block">
        Child name
        <input
          className={inputClass}
          value={draft.label || ""}
          onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
        />
      </label>
      <label className="block">
        Display order
        <input
          type="number"
          className={inputClass}
          value={draft.display_order ?? 0}
          onChange={(e) => setDraft((d) => ({ ...d, display_order: e.target.value }))}
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={draft.is_active !== false}
          onChange={(e) => setDraft((d) => ({ ...d, is_active: e.target.checked }))}
        />
        Active
      </label>
    </div>
  );
}

export default function AdminEconomyTab({ accessToken, onNavigateTab }) {
  const [band, setBand] = useState("g34");
  const [dailyRows, setDailyRows] = useState([]);
  const [monthlyRows, setMonthlyRows] = useState([]);
  const [globalRow, setGlobalRow] = useState(null);
  const [changeLog, setChangeLog] = useState([]);
  const [phase, setPhase] = useState("loading");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [editKind, setEditKind] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editDraft, setEditDraft] = useState({});

  const loadAll = useCallback(async () => {
    if (!accessToken) return;
    setPhase("loading");
    setError("");
    try {
      const [dailyRes, monthlyRes, globalRes, logRes] = await Promise.all([
        adminAuthFetch(accessToken, "/api/admin/rewards/economy/daily-missions"),
        adminAuthFetch(accessToken, "/api/admin/rewards/economy/monthly-tiers"),
        adminAuthFetch(accessToken, "/api/admin/rewards/economy/global-settings"),
        adminAuthFetch(accessToken, "/api/admin/rewards/economy/change-log?limit=20"),
      ]);
      const [daily, monthly, global, log] = await Promise.all([
        dailyRes.json().catch(() => ({})),
        monthlyRes.json().catch(() => ({})),
        globalRes.json().catch(() => ({})),
        logRes.json().catch(() => ({})),
      ]);
      if (!dailyRes.ok || !monthlyRes.ok) {
        setError(apiErrorMessageHe(daily?.error || monthly?.error, ADMIN_LOAD_ERROR));
        setPhase("error");
        return;
      }
      setDailyRows(Array.isArray(daily.rows) ? daily.rows : []);
      setMonthlyRows(Array.isArray(monthly.rows) ? monthly.rows : []);
      setGlobalRow(global.row || null);
      setChangeLog(Array.isArray(log.rows) ? log.rows : []);
      setPhase("ok");
    } catch {
      setError(ADMIN_LOAD_ERROR);
      setPhase("error");
    }
  }, [accessToken]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const filteredDaily = dailyRows.filter((r) => r.grade_band === band);

  const closeEdit = () => {
    setEditKind(null);
    setEditId(null);
    setEditDraft({});
  };

  const startDailyEdit = (row) => {
    setMessage("");
    setEditKind("daily");
    setEditId(row.id);
    setEditDraft({
      text: row.text || "",
      target_value: row.target_value ?? "",
      reward_coins: row.reward_coins ?? "",
      is_active: row.is_active !== false,
      display_order: row.display_order ?? 0,
    });
  };

  const startMonthlyEdit = (row) => {
    setMessage("");
    setEditKind("monthly");
    setEditId(row.id);
    setEditDraft({
      minutes_threshold: row.minutes_threshold ?? "",
      reward_coins: row.reward_coins ?? "",
      label: row.label || "",
      is_active: row.is_active !== false,
      display_order: row.display_order ?? 0,
    });
  };

  const saveDaily = async () => {
    if (!editId || editKind !== "daily") return;
    setBusy(`daily:${editId}`);
    setMessage("");
    const res = await adminAuthFetch(accessToken, "/api/admin/rewards/economy/daily-missions", {
      method: "PUT",
      body: JSON.stringify({
        id: editId,
        patch: {
          text: editDraft.text,
          target_value: Number(editDraft.target_value),
          reward_coins: Number(editDraft.reward_coins),
          is_active: editDraft.is_active,
          display_order: Number(editDraft.display_order),
        },
      }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) {
      setMessage(apiErrorMessageHe(body?.error, "Save failed"));
      return;
    }
    setMessage("Daily mission saved — change applies to future rewards only.");
    closeEdit();
    void loadAll();
  };

  const saveMonthly = async () => {
    if (!editId || editKind !== "monthly") return;
    setBusy(`monthly:${editId}`);
    setMessage("");
    const res = await adminAuthFetch(accessToken, "/api/admin/rewards/economy/monthly-tiers", {
      method: "PUT",
      body: JSON.stringify({
        id: editId,
        patch: {
          minutes_threshold: Number(editDraft.minutes_threshold),
          reward_coins: Number(editDraft.reward_coins),
          label: editDraft.label,
          is_active: editDraft.is_active,
          display_order: Number(editDraft.display_order),
        },
      }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) {
      setMessage(apiErrorMessageHe(body?.error, "Save failed"));
      return;
    }
    setMessage("Streak tier saved — change applies to future rewards only.");
    closeEdit();
    void loadAll();
  };

  const saveGlobal = async () => {
    if (!globalRow?.id) return;
    setBusy("global");
    setMessage("");
    const res = await adminAuthFetch(accessToken, "/api/admin/rewards/economy/global-settings", {
      method: "PUT",
      body: JSON.stringify({
        monthly_minutes_cap: Number(globalRow.monthly_minutes_cap),
        monthly_coins_cap: Number(globalRow.monthly_coins_cap),
      }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) {
      setMessage(apiErrorMessageHe(body?.error, "Save failed"));
      return;
    }
    setMessage("Global caps saved.");
    void loadAll();
  };

  if (phase === "loading") return <p className="text-white/60 text-sm text-right">{ADMIN_LOADING}</p>;
  if (phase === "error") return <p className="text-red-300 text-sm text-right">{error}</p>;

  const editingDaily = editKind === "daily" ? dailyRows.find((r) => r.id === editId) : null;
  const editingMonthly = editKind === "monthly" ? monthlyRows.find((r) => r.id === editId) : null;
  const editBusy = editKind === "daily" ? busy === `daily:${editId}` : busy === `monthly:${editId}`;
  const modalMessage = message && editId;
  const pageMessage = message && !editId;

  const editTitle =
    editKind === "daily"
      ? editingDaily?.text
        ? `Edit daily mission: ${editingDaily.text}`
        : "Edit daily mission"
      : editingMonthly?.label
        ? `Edit streak tier: ${editingMonthly.label}`
        : "Edit streak tier";

  const handleSaveEdit = () => {
    if (editKind === "daily") void saveDaily();
    else if (editKind === "monthly") void saveMonthly();
  };

  return (
    <div className="text-right">
      <p className="text-xs text-amber-200/80 mb-4">
        ItemItemItemItemItem ItemItemItemItem ItemItem ItemItemItemItemItemItemItem ItemItemItemItem - No ItemItem Coins ItemItemItemItem ItemItemItemItemItem.
      </p>
      {pageMessage ? <p className="text-sm text-emerald-300 mb-3">{pageMessage}</p> : null}

      <AdminSection title="Daily missions">
        <div className="flex flex-wrap gap-2 mb-3 justify-end">
          {GRADE_BANDS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setBand(g.value)}
              className={
                band === g.value
                  ? "rounded-lg bg-white/15 px-3 py-1 text-xs font-semibold"
                  : "rounded-lg border border-white/15 px-3 py-1 text-xs text-white/70"
              }
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right min-w-[520px]">
            <thead>
              <tr className="text-white/60 border-b border-white/10">
                <th className="py-2 px-2">Child text</th>
                <th className="py-2 px-2">Target</th>
                <th className="py-2 px-2">Coins</th>
                <th className="py-2 px-2">Active</th>
                <th className="py-2 px-2" />
              </tr>
            </thead>
            <tbody>
              {filteredDaily.map((row) => (
                <tr key={row.id} className="border-b border-white/5">
                  <td className="py-2 px-2">{row.text || "-"}</td>
                  <td className="py-2 px-2">{row.target_value ?? "-"}</td>
                  <td className="py-2 px-2">{row.reward_coins ?? "-"}</td>
                  <td className="py-2 px-2">{row.is_active !== false ? "Yes" : "No"}</td>
                  <td className="py-2 px-2">
                    <button
                      type="button"
                      onClick={() => startDailyEdit(row)}
                      className="rounded border border-white/15 px-2 py-1 hover:bg-white/5"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminSection>

      <AdminSection title="Monthly streak">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right min-w-[480px]">
            <thead>
              <tr className="text-white/60 border-b border-white/10">
                <th className="py-2 px-2">Minutes</th>
                <th className="py-2 px-2">Coins</th>
                <th className="py-2 px-2">Child name</th>
                <th className="py-2 px-2">Active</th>
                <th className="py-2 px-2" />
              </tr>
            </thead>
            <tbody>
              {monthlyRows.map((row) => (
                <tr key={row.id} className="border-b border-white/5">
                  <td className="py-2 px-2">{row.minutes_threshold ?? "-"}</td>
                  <td className="py-2 px-2">{row.reward_coins ?? "-"}</td>
                  <td className="py-2 px-2">{row.label || "-"}</td>
                  <td className="py-2 px-2">{row.is_active !== false ? "Yes" : "No"}</td>
                  <td className="py-2 px-2">
                    <button
                      type="button"
                      onClick={() => startMonthlyEdit(row)}
                      className="rounded border border-white/15 px-2 py-1 hover:bg-white/5"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminSection>

      <AdminSection title="Global caps">
        {globalRow ? (
          <div className="flex flex-wrap gap-4 items-end justify-end">
            <label className="text-xs text-white/70">
              Monthly minutes cap
              <input
                type="number"
                className="block mt-1 w-32 rounded bg-black/30 border border-white/15 px-2 py-1 text-white"
                value={globalRow.monthly_minutes_cap ?? ""}
                onChange={(e) =>
                  setGlobalRow((prev) => ({ ...prev, monthly_minutes_cap: e.target.value }))
                }
              />
            </label>
            <label className="text-xs text-white/70">
              Monthly coin cap
              <input
                type="number"
                className="block mt-1 w-32 rounded bg-black/30 border border-white/15 px-2 py-1 text-white"
                value={globalRow.monthly_coins_cap ?? ""}
                onChange={(e) =>
                  setGlobalRow((prev) => ({ ...prev, monthly_coins_cap: e.target.value }))
                }
              />
            </label>
            <AdminSaveButton busy={busy === "global"} onClick={() => void saveGlobal()} />
          </div>
        ) : (
          <p className="text-white/50 text-sm">No global settings — run the cards system database migration.</p>
        )}
      </AdminSection>

      <AdminSection title="Quick links">
        <div className="flex flex-wrap gap-2 justify-end">
          <button
            type="button"
            onClick={() => onNavigateTab?.("box")}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/5"
          >
            Surprise box settings ←
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.("shop")}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/5"
          >
            Shop settings ←
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.("duplicates")}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/5"
          >
            Duplicate settings ←
          </button>
        </div>
      </AdminSection>

      <AdminSection title="Change log">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right min-w-[600px]">
            <thead>
              <tr className="text-white/60 border-b border-white/10">
                <th className="py-2 px-2">When</th>
                <th className="py-2 px-2">Area</th>
                <th className="py-2 px-2">Entity</th>
                <th className="py-2 px-2">Field</th>
              </tr>
            </thead>
            <tbody>
              {changeLog.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-white/50 text-center">
                    No records yet
                  </td>
                </tr>
              ) : (
                changeLog.map((row) => (
                  <tr key={row.id} className="border-b border-white/5">
                    <td className="py-2 px-2 whitespace-nowrap">
                      {row.created_at ? new Date(row.created_at).toLocaleString("he-IL") : "-"}
                    </td>
                    <td className="py-2 px-2">{formatEconomySettingAreaHe(row.setting_area)}</td>
                    <td className="py-2 px-2">{formatEconomyEntityKeyHe(row.entity_key)}</td>
                    <td className="py-2 px-2">{formatEconomyFieldNameHe(row.field_name)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminSection>

      <AdminModal
        open={!!editId}
        onClose={closeEdit}
        title={editTitle}
        size="md"
        footer={
          <>
            <AdminModalButton onClick={closeEdit} disabled={editBusy}>
              Cancel
            </AdminModalButton>
            <AdminModalButton
              variant="primary"
              onClick={handleSaveEdit}
              disabled={editBusy}
              busy={editBusy}
              busyLabel="Saving..."
            >
              Save
            </AdminModalButton>
          </>
        }
      >
        {modalMessage ? (
          <p className={`text-sm mb-3 ${message.includes("failed") ? "text-red-300" : "text-emerald-300"}`}>
            {message}
          </p>
        ) : null}
        {editKind === "daily" ? (
          <DailyMissionFormFields draft={editDraft} setDraft={setEditDraft} />
        ) : editKind === "monthly" ? (
          <MonthlyTierFormFields draft={editDraft} setDraft={setEditDraft} />
        ) : null}
      </AdminModal>
    </div>
  );
}
