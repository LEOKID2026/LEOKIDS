import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
/**
 * Placeholder room mode — full game comes later (checkers / chess / dominoes / bingo).
 * Creates an active session so a full room is not locked without game state.
 */

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} roomId
 * @param {string} gameKey
 */
export async function maybeStartPlaceholderArcadeSession(supabase, roomId, gameKey) {
  const { data: room, error: rErr } = await supabase.from("arcade_rooms").select("*").eq("id", roomId).maybeSingle();
  if (rErr || !room) return { skipped: true };
  if (room.game_key !== gameKey || room.status !== "waiting") return { skipped: true };

  const { data: players, error: pErr } = await supabase
    .from("arcade_room_players")
    .select("*")
    .eq("room_id", roomId)
    .is("left_at", null)
    .order("seat_index", { ascending: true });

  if (pErr || !players || players.length < room.max_players) return { skipped: true };

  const { data: existing } = await supabase.from("arcade_game_sessions").select("id").eq("room_id", roomId).maybeSingle();
  if (existing?.id) return { skipped: true, already: true };

  const first = players[0];
  if (!first?.student_id) return { skipped: true };

  const state = {
    phase: "playing",
    placeholder: true,
    gameKey,
    winnerSeat: null,
    board: {
      message: gamePackCopy("lib__arcade__server__arcadePlaceholderGame", "arcade_build_active_room_connection_full_game_rules_come_next"),
    },
  };

  const ins = await supabase
    .from("arcade_game_sessions")
    .insert({
      room_id: roomId,
      game_key: gameKey,
      status: "active",
      current_turn_student_id: first.student_id,
      state,
      revision: 0,
    })
    .select("*")
    .single();

  if (ins.error || !ins.data) {
    return { error: { code: "session_start_failed", message: ins.error?.message || "Error" } };
  }

  const sessionRow = ins.data;

  const upd = await supabase
    .from("arcade_rooms")
    .update({
      status: "active",
      started_at: new Date().toISOString(),
    })
    .eq("id", roomId)
    .eq("status", "waiting")
    .select("id");

  const activated = Array.isArray(upd.data) ? upd.data.length > 0 : Boolean(upd.data?.id);

  if (upd.error || !activated) {
    await supabase.from("arcade_game_sessions").delete().eq("id", sessionRow.id);
    return {
      error: {
        code: "room_activate_failed",
        message: upd.error?.message || "Could not activate the room after creating the game",
      },
    };
  }

  return { ok: true, session: sessionRow };
}

/**
 * @param {Record<string, unknown>|null} gameSession
 * @param {Array<Record<string, unknown>>} players
 * @param {string} viewerStudentId
 */
export function buildPlaceholderArcadeSnapshot(gameSession, players, viewerStudentId) {
  if (!gameSession || typeof gameSession !== "object") return null;

  const state = /** @type {Record<string, unknown>} */ (
    gameSession.state && typeof gameSession.state === "object" ? gameSession.state : {}
  );
  const sessionStatus = String(gameSession.status || "");
  const phaseRaw = state.phase != null ? String(state.phase) : "";
  const phase =
    sessionStatus === "finished" || phaseRaw === "finished" ? "finished" : "playing";

  /** @type {number|null} */
  let mySeat = null;
  for (const p of players || []) {
    if (p.student_id === viewerStudentId) {
      const si = Number(p.seat_index);
      if (Number.isInteger(si) && si >= 0 && si <= 7) mySeat = si;
      break;
    }
  }

  const board = state.board && typeof state.board === "object" ? state.board : {};

  return {
    revision: gameSession.revision != null ? Number(gameSession.revision) : 0,
    sessionId: String(gameSession.id ?? ""),
    roomId: String(gameSession.room_id ?? ""),
    phase,
    placeholder: true,
    gameKey: String(state.gameKey || gameSession.game_key || ""),
    mySeat,
    board,
    boardViewReadOnly: true,
    canClientRoll: false,
    canClientMovePiece: false,
  };
}
