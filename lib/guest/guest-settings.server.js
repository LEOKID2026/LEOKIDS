import { parseSurpriseBoxGeneralSettings } from "../rewards/server/surprise-box-settings.server.js";
import { getServerProductId } from "../global/product-context.server.js";

const GUEST_SETTING_KEYS = Object.freeze([
  "guest_mode_enabled",
  "guest_defaults",
  "guest_economy",
  "surprise_box_guest_settings",
]);

/** @type {{ map: Map<string, unknown>, loadedAt: number, productId: string | null }} */
const cache = { map: new Map(), loadedAt: 0, productId: null };
const CACHE_TTL_MS = 30_000;

function isMissingGuestSettingsTable(error) {
  const msg = String(error?.message || error?.details || "").toLowerCase();
  return msg.includes("guest_mode_settings") && (msg.includes("does not exist") || msg.includes("relation"));
}

function isMissingProductColumn(error) {
  const msg = String(error?.message || error?.details || "").toLowerCase();
  return msg.includes("product_id") || error?.code === "42703" || error?.code === "PGRST204";
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 */
export async function loadGuestSettingsMap(supabase) {
  const productId = getServerProductId();
  const now = Date.now();
  if (cache.map.size > 0 && cache.productId === productId && now - cache.loadedAt < CACHE_TTL_MS) {
    return cache.map;
  }

  let data = null;
  let error = null;

  const scoped = await supabase
    .from("guest_mode_settings")
    .select("setting_key, setting_value_json, product_id")
    .eq("product_id", productId)
    .in("setting_key", [...GUEST_SETTING_KEYS]);
  data = scoped.data;
  error = scoped.error;

  // Pre-v2 schema: PK is setting_key only — do not leak IL settings into Global.
  // Return empty map until product-scoped rows exist (guest stays disabled).
  if (error && isMissingProductColumn(error)) {
    cache.map = new Map();
    cache.loadedAt = now;
    cache.productId = productId;
    return cache.map;
  }

  if (error) {
    if (isMissingGuestSettingsTable(error)) {
      return new Map();
    }
    throw error;
  }

  const map = new Map();
  for (const row of data || []) {
    if (row?.setting_key) map.set(row.setting_key, row.setting_value_json);
  }
  cache.map = map;
  cache.loadedAt = now;
  cache.productId = productId;
  return map;
}

/** @param {unknown} raw */
export function parseGuestModeEnabled(raw) {
  if (raw && typeof raw === "object" && "enabled" in raw) {
    return raw.enabled === true;
  }
  return false;
}

/** @param {unknown} raw */
export function parseGuestDefaults(raw) {
  const obj = raw && typeof raw === "object" ? raw : {};
  const games = Number(obj.games_per_category);
  const topics = Number(obj.topics_per_subject);
  return {
    gamesPerCategory: Number.isFinite(games) && games > 0 ? Math.min(games, 20) : 2,
    topicsPerSubject: Number.isFinite(topics) && topics > 0 ? Math.min(topics, 20) : 2,
  };
}

/** @param {unknown} raw */
export function parseGuestEconomy(raw) {
  const obj = raw && typeof raw === "object" ? raw : {};
  return {
    shopEnabled: obj.shop_enabled !== false,
    cardsEnabled: obj.cards_enabled !== false,
  };
}

/** @param {unknown} raw */
export function parseGuestSurpriseBoxSettings(raw) {
  return parseSurpriseBoxGeneralSettings(raw);
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 */
export async function loadGuestRuntimeConfig(supabase) {
  const map = await loadGuestSettingsMap(supabase);
  return {
    enabled: parseGuestModeEnabled(map.get("guest_mode_enabled")),
    defaults: parseGuestDefaults(map.get("guest_defaults")),
    economy: parseGuestEconomy(map.get("guest_economy")),
    surpriseBox: parseGuestSurpriseBoxSettings(map.get("surprise_box_guest_settings")),
  };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} settingKey
 * @param {unknown} valueJson
 */
export async function upsertGuestSetting(supabase, settingKey, valueJson) {
  const productId = getServerProductId();
  let { data, error } = await supabase
    .from("guest_mode_settings")
    .upsert(
      {
        product_id: productId,
        setting_key: settingKey,
        setting_value_json: valueJson,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "product_id,setting_key" }
    )
    .select("setting_key, setting_value_json, updated_at, product_id")
    .single();

  if (error && isMissingProductColumn(error)) {
    // Refuse to write into legacy global-key table from Global site (would collide with IL).
    const err = new Error("guest_settings_product_schema_not_ready");
    err.code = "product_schema_not_ready";
    throw err;
  }

  if (error) throw error;
  cache.loadedAt = 0;
  cache.productId = null;
  return data;
}

export function invalidateGuestSettingsCache() {
  cache.loadedAt = 0;
  cache.productId = null;
  cache.map.clear();
}
