import { useCallback, useEffect, useState } from "react";
import { adminAuthFetch } from "../../../lib/admin-portal/use-admin-session.js";
import { ADMIN_LOADING, ADMIN_LOAD_ERROR, apiErrorMessageHe } from "../../../lib/admin-portal/admin-ui.js";
import {
  adminRewardsCardsUrl,
  eventCardDisplayStatusHe,
  filterAdminEventCards,
} from "../../../lib/admin-portal/admin-rewards-catalog.client.js";
import AdminModal, { AdminModalButton } from "../AdminModal.jsx";
import AdminCatalogArchiveToggle from "./AdminCatalogArchiveToggle.jsx";

const inputClass =
  "block w-full mt-1 rounded bg-black/30 border border-white/15 px-2 py-1 text-white text-sm";

function EventEditFields({ draft, setDraft }) {
  return (
    <div className="space-y-3 text-sm">
      <label className="block">

        <input
          className={inputClass}
          value={draft.name || ""}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
        />
      </label>
      <label className="block">

        <input
          type="datetime-local"
          className={inputClass}
          value={draft.starts_at || ""}
          onChange={(e) => setDraft((d) => ({ ...d, starts_at: e.target.value }))}
        />
      </label>
      <label className="block">

        <input
          type="datetime-local"
          className={inputClass}
          value={draft.ends_at || ""}
          onChange={(e) => setDraft((d) => ({ ...d, ends_at: e.target.value }))}
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={draft.is_active !== false}
          onChange={(e) => setDraft((d) => ({ ...d, is_active: e.target.checked }))}
        />

      </label>
    </div>
  );
}

export default function AdminEventsTab({ accessToken }) {
  const [cards, setCards] = useState([]);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [phase, setPhase] = useState("loading");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState({});

  const load = useCallback(async () => {
    if (!accessToken) return;
    setPhase("loading");
    const res = await adminAuthFetch(accessToken, adminRewardsCardsUrl(includeInactive));
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(apiErrorMessageHe(body?.error, ADMIN_LOAD_ERROR));
      setPhase("error");
      return;
    }
    setCards(filterAdminEventCards(body.cards));
    setPhase("ok");
  }, [accessToken, includeInactive]);

  useEffect(() => {
    void load();
  }, [load]);

  const closeEdit = () => {
    setEditId(null);
    setDraft({});
  };

  const startEdit = (card) => {
    setMessage("");
    setEditId(card.id);
    setDraft({
      name: card.name || "",
      is_active: card.is_active !== false,
      can_be_purchased: !!card.can_be_purchased,
      starts_at: card.starts_at ? card.starts_at.slice(0, 16) : "",
      ends_at: card.ends_at ? card.ends_at.slice(0, 16) : "",
    });
  };

  const save = async () => {
    if (!editId) return;
    setBusy(editId);
    setMessage("");
    const payload = {
      name: draft.name,
      is_active: draft.is_active !== false,
      starts_at: draft.starts_at ? new Date(draft.starts_at).toISOString() : null,
      ends_at: draft.ends_at ? new Date(draft.ends_at).toISOString() : null,
      can_be_purchased: !!draft.can_be_purchased,
    };
    const res = await adminAuthFetch(accessToken, `/api/admin/rewards/cards/${editId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) {
      setMessage(apiErrorMessageHe(body?.error, " "));
      return;
    }
    setMessage("  .");
    closeEdit();
    void load();
  };

  if (phase === "loading") return <p className="text-white/60 text-sm text-right">{ADMIN_LOADING}</p>;
  if (phase === "error") return <p className="text-red-300 text-sm text-right">{error}</p>;

  const editingCard = cards.find((c) => c.id === editId);
  const editTitle = editingCard?.name
    ? ` : ${editingCard.name}`
    : " ";
  const modalMessage = message && editId;
  const pageMessage = message && !editId;

  return (
    <div className="text-right overflow-x-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="text-xs text-white/60">
          {cards.length}   ·  / ,
        </p>
        <AdminCatalogArchiveToggle checked={includeInactive} onChange={setIncludeInactive} />
      </div>
      {pageMessage ? <p className="text-sm text-emerald-300 mb-3">{pageMessage}</p> : null}
      {cards.length === 0 ? (
        <p className="text-white/50 text-sm">   .</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right min-w-[640px]">
            <thead>
              <tr className="text-white/60 border-b border-white/10">
                <th className="py-2 px-2"></th>
                <th className="py-2 px-2"></th>
                <th className="py-2 px-2"></th>
                <th className="py-2 px-2"></th>
                <th className="py-2 px-2"></th>
                <th className="py-2 px-2"></th>
                <th className="py-2 px-2" />
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => (
                <tr key={card.id} className="border-b border-white/5">
                  <td className="py-2 px-2">{card.name || "-"}</td>
                  <td className="py-2 px-2 whitespace-nowrap">
                    {card.reward_card_series?.name || "-"}
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap text-amber-200/90">
                    {eventCardDisplayStatusHe(card)}
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap">
                    {card.starts_at ? card.starts_at.slice(0, 16).replace("T", " ") : "-"}
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap">
                    {card.ends_at ? card.ends_at.slice(0, 16).replace("T", " ") : "-"}
                  </td>
                  <td className="py-2 px-2">{card.is_active !== false ? "" : ""}</td>
                  <td className="py-2 px-2">
                    <button
                      type="button"
                      onClick={() => startEdit(card)}
                      className="rounded border border-white/15 px-2 py-1 hover:bg-white/5"
                    >

                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal
        open={!!editId}
        onClose={closeEdit}
        title={editTitle}
        size="md"
        footer={
          <>
            <AdminModalButton onClick={closeEdit} disabled={busy === editId}>

            </AdminModalButton>
            <AdminModalButton
              variant="primary"
              onClick={() => void save()}
              disabled={busy === editId}
              busy={busy === editId}
              busyLabel="..."
            >

            </AdminModalButton>
          </>
        }
      >
        {modalMessage ? (
          <p className={`text-sm mb-3 ${message.includes("") ? "text-red-300" : "text-emerald-300"}`}>
            {message}
          </p>
        ) : null}
        <EventEditFields draft={draft} setDraft={setDraft} />
      </AdminModal>
    </div>
  );
}
