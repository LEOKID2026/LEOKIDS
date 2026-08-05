import { useCallback, useEffect, useState } from "react";
import { adminAuthFetch } from "../../../lib/admin-portal/use-admin-session.js";
import { ADMIN_LOADING, ADMIN_LOAD_ERROR, apiErrorMessageHe } from "../../../lib/admin-portal/admin-ui.js";
import {
  formatCardTypeHe,
  formatRarityHe,
  formatVisibilityModeHe,
  CARD_RARITY_OPTIONS,
  CARD_TYPE_OPTIONS,
} from "../../../lib/admin-portal/admin-rewards-ui.js";
import {
  adminRewardsCardsUrl,
  adminRewardsSeriesUrl,
  countCardsByType,
} from "../../../lib/admin-portal/admin-rewards-catalog.client.js";
import AdminModal, { AdminModalButton } from "../AdminModal.jsx";
import AdminCatalogArchiveToggle from "./AdminCatalogArchiveToggle.jsx";
import AdminCardRulesPanel from "./AdminCardRulesPanel.jsx";
import AdminCardGrantByParent from "./AdminCardGrantByParent.jsx";

const inputClass =
  "block w-full mt-1 rounded bg-black/30 border border-white/15 px-2 py-1 text-white text-xs";

const EMPTY_CREATE = {
  card_key: "",
  name: "",
  description: "",
  image_url: "",
  series_id: "",
  rarity: "regular",
  card_type: "shop",
  event_reward_mode: "achievement",
  visibility_mode: "visible_locked",
  requirementText: "",
  use_default_price: true,
  price_coins: null,
  is_active: true,
  can_be_purchased: true,
  can_appear_in_surprise_box: true,
};

const EDIT_TABS = [
  { id: "details", label: "Card details" },
  { id: "rules", label: "Earn rules" },
];

export default function AdminCardsTab({ accessToken }) {
  const [cards, setCards] = useState([]);
  const [series, setSeries] = useState([]);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [phase, setPhase] = useState("loading");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTab, setEditTab] = useState("details");
  const [draft, setDraft] = useState({});
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState(EMPTY_CREATE);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setPhase("loading");
    const [cardsRes, seriesRes] = await Promise.all([
      adminAuthFetch(accessToken, adminRewardsCardsUrl(includeInactive)),
      adminAuthFetch(accessToken, adminRewardsSeriesUrl(includeInactive)),
    ]);
    const cardsBody = await cardsRes.json().catch(() => ({}));
    const seriesBody = await seriesRes.json().catch(() => ({}));
    if (!cardsRes.ok) {
      setError(apiErrorMessageHe(cardsBody?.error, ADMIN_LOAD_ERROR));
      setPhase("error");
      return;
    }
    setCards(Array.isArray(cardsBody.cards) ? cardsBody.cards : []);
    setSeries(Array.isArray(seriesBody.series) ? seriesBody.series : []);
    setPhase("ok");
  }, [accessToken, includeInactive]);

  useEffect(() => {
    void load();
  }, [load]);

  const closeCreate = () => {
    setCreateOpen(false);
    setCreateDraft(EMPTY_CREATE);
  };

  const closeEdit = () => {
    setEditId(null);
    setEditTab("details");
  };

  const startEdit = (card) => {
    setEditId(card.id);
    setEditTab("details");
    setCreateOpen(false);
    setDraft({
      card_key: card.card_key || "",
      name: card.name || "",
      description: card.description || "",
      image_url: card.image_url || "",
      image_asset_key: card.image_asset_key || "",
      series_id: card.series_id || "",
      rarity: card.rarity || "regular",
      card_type: card.card_type || "shop",
      event_reward_mode: card.event_reward_mode || "achievement",
      subject: card.subject || "",
      topic: card.topic || "",
      visibility_mode: card.visibility_mode || "visible_locked",
      requirementText: card.requirementText || "",
      price_coins: card.price_coins,
      use_default_price: card.use_default_price !== false,
      box_weight: card.box_weight,
      is_active: card.is_active !== false,
      can_be_purchased: !!card.can_be_purchased,
      can_appear_in_surprise_box: !!card.can_appear_in_surprise_box,
      starts_at: card.starts_at ? card.starts_at.slice(0, 16) : "",
      ends_at: card.ends_at ? card.ends_at.slice(0, 16) : "",
      grade_bands: Array.isArray(card.grade_bands) ? card.grade_bands : [],
    });
  };

  const save = async () => {
    if (!editId) return;
    setBusy(editId);
    setMessage("");
    const payload = { ...draft };
    if (!payload.starts_at) payload.starts_at = null;
    if (!payload.ends_at) payload.ends_at = null;
    const res = await adminAuthFetch(accessToken, `/api/admin/rewards/cards/${editId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) {
      setMessage(apiErrorMessageHe(body?.error, "Save failed"));
      return;
    }
    setMessage("Card saved.");
    void load();
  };

  const createCard = async () => {
    setBusy("create");
    setMessage("");
    const payload = { ...createDraft };
    if (!payload.card_key?.trim()) {
      setMessage("Card key (card_key) is required.");
      setBusy("");
      return;
    }
    const res = await adminAuthFetch(accessToken, "/api/admin/rewards/cards", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) {
      setMessage(apiErrorMessageHe(body?.error, "Create failed"));
      return;
    }
    setMessage("New card created.");
    closeCreate();
    void load();
    if (body.card?.id) startEdit(body.card);
  };

  if (phase === "loading") return <p className="text-white/60 text-sm text-right">{ADMIN_LOADING}</p>;
  if (phase === "error") return <p className="text-red-300 text-sm text-right">{error}</p>;

  const typeCounts = countCardsByType(cards);
  const editingCard = cards.find((c) => c.id === editId);
  const editModalTitle = editingCard?.name
    ? `Edit card: ${editingCard.name}`
    : "Edit card";
  const showModalMessage = message && (createOpen || editId);

  return (
    <div className="text-right overflow-x-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="text-xs text-white/60">
          Showing {cards.length} Cards
          {!includeInactive ? " (active only)" : " (including archive)"}
          {" · "}ItemItemItemItem {typeCounts.shop} · ItemItemItemItem {typeCounts.achievement} · ItemItemItem {typeCounts.event}
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            onClick={() => {
              setMessage("");
              setCreateOpen(true);
              setEditId(null);
            }}
            className="rounded bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold"
          >
            New card
          </button>
          <AdminCatalogArchiveToggle checked={includeInactive} onChange={setIncludeInactive} />
        </div>
      </div>
      {message && !createOpen && !editId ? (
        <p className="text-sm text-emerald-300 mb-3">{message}</p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-right min-w-[640px]">
          <thead>
            <tr className="text-white/60 border-b border-white/10">
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">ItemItemItem</th>
              <th className="py-2 px-2">Rarity</th>
              <th className="py-2 px-2">Display</th>
              <th className="py-2 px-2">Active</th>
              <th className="py-2 px-2" />
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card.id} className="border-b border-white/5">
                <td className="py-2 px-2">{card.name || "-"}</td>
                <td className="py-2 px-2">{formatCardTypeHe(card.card_type)}</td>
                <td className="py-2 px-2">{formatRarityHe(card.rarity)}</td>
                <td className="py-2 px-2">{formatVisibilityModeHe(card.visibility_mode)}</td>
                <td className="py-2 px-2">{card.is_active ? "Yes" : "No"}</td>
                <td className="py-2 px-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMessage("");
                      startEdit(card);
                    }}
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

      <AdminModal
        open={createOpen}
        onClose={closeCreate}
        title="New card"
        size="xl"
        footer={
          <>
            <AdminModalButton onClick={closeCreate} disabled={busy === "create"}>
              Cancel
            </AdminModalButton>
            <AdminModalButton
              variant="primary"
              onClick={() => void createCard()}
              disabled={busy === "create"}
              busy={busy === "create"}
              busyLabel="Creating..."
            >
              Create
            </AdminModalButton>
          </>
        }
      >
        {showModalMessage ? (
          <p className={`text-sm mb-3 ${message.includes("failed") || message.includes("required") ? "text-red-300" : "text-emerald-300"}`}>
            {message}
          </p>
        ) : null}
        <CardForm
          embedded
          draft={createDraft}
          setDraft={setCreateDraft}
          series={series}
        />
      </AdminModal>

      <AdminModal
        open={!!editId}
        onClose={closeEdit}
        title={editModalTitle}
        size="xl"
        footer={
          editTab === "details" ? (
            <>
              <AdminModalButton onClick={closeEdit} disabled={busy === editId}>
                Cancel
              </AdminModalButton>
              <AdminModalButton
                variant="primary"
                onClick={() => void save()}
                disabled={busy === editId}
                busy={busy === editId}
                busyLabel="Saving..."
              >
                Save
              </AdminModalButton>
            </>
          ) : (
            <AdminModalButton onClick={closeEdit}>Close</AdminModalButton>
          )
        }
      >
        {showModalMessage ? (
          <p className={`text-sm mb-3 ${message.includes("failed") || message.includes("required") ? "text-red-300" : "text-emerald-300"}`}>
            {message}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2 mb-4 border-b border-white/10 pb-2">
          {EDIT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setEditTab(tab.id)}
              className={
                editTab === tab.id
                  ? "rounded-lg bg-white/15 px-3 py-1 text-xs font-semibold"
                  : "rounded-lg border border-white/15 px-3 py-1 text-xs text-white/70"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
        {editTab === "details" ? (
          <CardForm
            embedded
            draft={draft}
            setDraft={setDraft}
            series={series}
            cardId={editId}
            accessToken={accessToken}
            showGrant
            onGrantMessage={setMessage}
            onImageUploaded={() => void load()}
          />
        ) : (
          <AdminCardRulesPanel
            embedded
            accessToken={accessToken}
            cardId={editId}
            cardName={editingCard?.name}
          />
        )}
      </AdminModal>
    </div>
  );
}

function CardForm({
  embedded = false,
  draft,
  setDraft,
  series,
  cardId,
  accessToken,
  showGrant,
  onGrantMessage,
  onImageUploaded,
}) {
  const isAchievement = draft.card_type === "achievement";
  const isEvent = draft.card_type === "event";

  const fields = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
      <label>
        Card key (card_key)
        <input className={inputClass} value={draft.card_key || ""} onChange={(e) => setDraft((d) => ({ ...d, card_key: e.target.value }))} />
      </label>
      <label>
        Display name
        <input className={inputClass} value={draft.name || ""} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
      </label>
      <label className="sm:col-span-2">
        Description
        <textarea className={inputClass} rows={2} value={draft.description || ""} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
      </label>
      <div className="sm:col-span-2">
        {cardId && accessToken ? (
          <CardImageUpload
            cardId={cardId}
            accessToken={accessToken}
            cardType={draft.card_type}
            imageUrl={draft.image_url || ""}
            imageAssetKey={draft.image_asset_key || ""}
            cardKey={draft.card_key || ""}
            seriesId={draft.series_id || ""}
            onUploaded={(card) => {
              setDraft((d) => ({
                ...d,
                image_url: card.image_url || "",
                image_asset_key: card.image_asset_key || "",
              }));
              onImageUploaded?.();
            }}
          />
        ) : (
          <p className="text-white/50 text-xs mt-1">
            ItemOther ItemItemItemItemItem ItemItemItemItem ItemItemItemItem ItemuploadItem ItemItemItemItem (PNG/WEBP). Cards ItemItemItemItemItem in public ItemItemItemItemItemItem ItemItemItemItemItem ItemNo ItemItemItemItemItem.
          </p>
        )}
      </div>
      <label>
        Series
        <select className={inputClass} value={draft.series_id || ""} onChange={(e) => setDraft((d) => ({ ...d, series_id: e.target.value }))}>
          <option value="">Select series</option>
          {series.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Card type
        <select
          className={inputClass}
          value={draft.card_type}
          onChange={(e) => {
            const card_type = e.target.value;
            setDraft((d) => ({
              ...d,
              card_type,
              can_be_purchased: card_type === "shop",
              can_appear_in_surprise_box: card_type === "shop",
            }));
          }}
        >
          {CARD_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.labelHe}
            </option>
          ))}
        </select>
      </label>
      <label>
        Rarity
        <select className={inputClass} value={draft.rarity} onChange={(e) => setDraft((d) => ({ ...d, rarity: e.target.value }))}>
          {CARD_RARITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.labelHe}
            </option>
          ))}
        </select>
      </label>
      <label>
        Visibility
        <select className={inputClass} value={draft.visibility_mode || "visible_locked"} onChange={(e) => setDraft((d) => ({ ...d, visibility_mode: e.target.value }))}>
          <option value="visible_locked">Visible (locked)</option>
          <option value="hidden_until_eligible">Hidden until eligible</option>
        </select>
      </label>
      <label className="sm:col-span-2">
        Child requirement text (override)
        <input className={inputClass} value={draft.requirementText || ""} onChange={(e) => setDraft((d) => ({ ...d, requirementText: e.target.value }))} />
      </label>
      {!isAchievement ? (
        <>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={draft.can_be_purchased} onChange={(e) => setDraft((d) => ({ ...d, can_be_purchased: e.target.checked }))} />
            In shop
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={draft.can_appear_in_surprise_box} onChange={(e) => setDraft((d) => ({ ...d, can_appear_in_surprise_box: e.target.checked }))} />
            In box
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={draft.use_default_price !== false} onChange={(e) => setDraft((d) => ({ ...d, use_default_price: e.target.checked }))} />
            Default price by rarity
          </label>
          {!draft.use_default_price ? (
            <label>
              Price in coins
              <input type="number" className={inputClass} value={draft.price_coins ?? ""} onChange={(e) => setDraft((d) => ({ ...d, price_coins: Number(e.target.value) }))} />
            </label>
          ) : null}
        </>
      ) : null}
      {isEvent ? (
        <label>
          Event mode
          <select className={inputClass} value={draft.event_reward_mode || "achievement"} onChange={(e) => setDraft((d) => ({ ...d, event_reward_mode: e.target.value }))}>
            <option value="achievement">ItemItemItemItem</option>
            <option value="shop">ItemItemItemItem</option>
          </select>
        </label>
      ) : null}
      <label>
        Available from
        <input type="datetime-local" className={inputClass} value={draft.starts_at || ""} onChange={(e) => setDraft((d) => ({ ...d, starts_at: e.target.value }))} />
      </label>
      <label>
        Available until
        <input type="datetime-local" className={inputClass} value={draft.ends_at || ""} onChange={(e) => setDraft((d) => ({ ...d, ends_at: e.target.value }))} />
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft((d) => ({ ...d, is_active: e.target.checked }))} />
        Active
      </label>
    </div>
  );

  const grantSection =
    showGrant && cardId ? (
      <AdminCardGrantByParent
        accessToken={accessToken}
        cardId={cardId}
        onMessage={onGrantMessage}
      />
    ) : null;

  if (embedded) {
    return (
      <div className="space-y-3">
        {fields}
        {grantSection}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
      {fields}
      {grantSection}
    </div>
  );
}

function CardImageUpload({ cardId, accessToken, cardType, imageUrl, imageAssetKey, cardKey, seriesId, onUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    if (!selectedFile) {
      setLocalPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(selectedFile);
    setLocalPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const previewSrc = localPreviewUrl || imageUrl || "";
  const needsSeries = cardType !== "event";

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError("");
    setUploadMessage("");
  };

  const upload = async () => {
    if (!selectedFile) {
      setUploadError("Choose an image file.");
      return;
    }
    if (!cardKey?.trim()) {
      setUploadError("Card key (card_key) is required before upload.");
      return;
    }
    if (needsSeries && !seriesId?.trim()) {
      setUploadError("Select a series before uploading an image.");
      return;
    }
    setUploadBusy(true);
    setUploadError("");
    setUploadMessage("");
    const formData = new FormData();
    formData.append("image", selectedFile);
    const res = await adminAuthFetch(accessToken, `/api/admin/rewards/cards/${cardId}/image`, {
      method: "POST",
      body: formData,
    });
    const body = await res.json().catch(() => ({}));
    setUploadBusy(false);
    if (!res.ok) {
      setUploadError(apiErrorMessageHe(body?.error, "Image upload failed"));
      return;
    }
    setUploadMessage("Image uploaded and saved.");
    setSelectedFile(null);
    if (body.card) onUploaded(body.card);
  };

  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-3">
      <p className="font-semibold text-xs">Card image</p>
      <p className="text-white/45 text-[11px]">
        ItemItemNoItemItem ItemItemItemItemItem ItemItemItemItemItemItem in Supabase Storage. Cards ItemItem ItemItemItemItem ItemItemItemItem in public ItemItemItemItemItemItem ItemItemItemItemItem ItemNo ItemItemItemItemItem.
        ItemItem ItemItemItemItemItemItem Card key or Series - ItemItemItemItem ItemItem ItemItemItemItem before ItemItemNoItem.
      </p>
      {previewSrc ? (
        <div className="flex justify-center">
          <img
            src={previewSrc}
            alt="Preview"
            className="max-h-48 w-auto rounded border border-white/15 object-contain bg-black/40"
          />
        </div>
      ) : (
        <p className="text-white/40 text-xs">No image - upload PNG or WEBP</p>
      )}
      {localPreviewUrl ? (
        <p className="text-amber-200/80 text-[11px]">Preview before Save - click &quot;Upload image&quot; ItemSave</p>
      ) : null}
      {imageUrl ? (
        <p className="text-white/40 text-[11px] break-all" dir="ltr">
          {imageUrl}
          {imageAssetKey ? ` · storage: ${imageAssetKey}` : null}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="file"
          accept="image/png,image/webp,image/jpeg"
          onChange={handleFileChange}
          className="text-xs text-white/70 max-w-full"
        />
        <button
          type="button"
          disabled={uploadBusy || !selectedFile}
          onClick={() => void upload()}
          className="rounded border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-xs font-semibold disabled:opacity-50"
        >
          {uploadBusy ? "Uploading..." : imageUrl ? "Replace image" : "Upload image"}
        </button>
      </div>
      {!cardKey?.trim() ? (
        <p className="text-amber-200/70 text-[11px]">Save card key (card_key) before ItemItemNoItem.</p>
      ) : null}
      {needsSeries && !seriesId?.trim() ? (
        <p className="text-amber-200/70 text-[11px]">Select a series before uploading an image.</p>
      ) : null}
      {uploadError ? <p className="text-red-300 text-xs">{uploadError}</p> : null}
      {uploadMessage ? <p className="text-emerald-300 text-xs">{uploadMessage}</p> : null}
    </div>
  );
}
