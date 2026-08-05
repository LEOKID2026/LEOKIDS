import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import { assertGuestArcadeFeature } from "../../guest/guest-feature-permissions.server.js";

function todayDateStr() {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULT_MISSIONS = [
  { game_key: "fourline", description: "Play 3 games of Four in a Row", goal_type: "play", goal_count: 3, reward_coins: 50 },
  { game_key: "ludo", description: "Win twice at Ludo", goal_type: "win", goal_count: 2, reward_coins: 75 },
  { game_key: null, description: "Join a public room", goal_type: "join", goal_count: 1, reward_coins: 30 },
];

function missionDescription(m) {
  const match = DEFAULT_MISSIONS.find(
    (d) => d.goal_type === m.goal_type && (d.game_key || null) === (m.game_key || null)
  );
  if (match) return match.description;
  return `${m.goal_type || "mission"} ${m.goal_count || ""}`.trim();
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 */
export async function ensureDefaultMissions(supabase) {
  const { count } = await supabase
    .from("arcade_daily_missions")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  // GLOBAL does not write legacy Hebrew-named columns into arcade_daily_missions.
  void DEFAULT_MISSIONS;
  void count;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} studentId
 */
export async function getTodayMissions(supabase, studentId) {
  const feature = await assertGuestArcadeFeature(supabase, studentId, "missions");
  if (!feature.ok) return { ok: true, missions: [], featureLocked: true };

  await ensureDefaultMissions(supabase);
  const date = todayDateStr();

  const { data: missions } = await supabase
    .from("arcade_daily_missions")
    .select("id, game_key, goal_type, goal_count, reward_coins")
    .eq("active", true)
    .limit(3);

  const out = [];
  for (const m of missions || []) {
    const { data: prog } = await supabase
      .from("arcade_player_mission_progress")
      .select("progress, completed_at")
      .eq("student_id", studentId)
      .eq("mission_id", m.id)
      .eq("date", date)
      .maybeSingle();

    out.push({
      missionId: m.id,
      description: missionDescription(m),
      gameKey: m.game_key,
      goalType: m.goal_type,
      goalCount: m.goal_count,
      rewardCoins: m.reward_coins,
      progress: prog?.progress ?? 0,
      completed: Boolean(prog?.completed_at),
    });
  }

  return { ok: true, missions: out, featureLocked: false };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} studentId
 * @param {{ goalType: string, gameKey?: string, increment?: number }} params
 */
export async function bumpMissionProgress(supabase, studentId, params) {
  const feature = await assertGuestArcadeFeature(supabase, studentId, "missions");
  if (!feature.ok) return;

  await ensureDefaultMissions(supabase);
  const date = todayDateStr();
  const goalType = String(params.goalType || "").trim();
  const gameKey = params.gameKey ? String(params.gameKey).trim() : null;
  const increment = Math.max(1, Number(params.increment) || 1);

  let query = supabase
    .from("arcade_daily_missions")
    .select("id, goal_count, reward_coins")
    .eq("active", true)
    .eq("goal_type", goalType);
  if (gameKey) query = query.eq("game_key", gameKey);
  else query = query.is("game_key", null);

  const { data: missions } = await query;
  for (const m of missions || []) {
    const { data: existing } = await supabase
      .from("arcade_player_mission_progress")
      .select("*")
      .eq("student_id", studentId)
      .eq("mission_id", m.id)
      .eq("date", date)
      .maybeSingle();

    if (existing?.completed_at) continue;

    const progress = (existing?.progress || 0) + increment;
    const completed = progress >= m.goal_count;
    const row = {
      student_id: studentId,
      mission_id: m.id,
      date,
      progress,
      completed_at: completed ? new Date().toISOString() : null,
    };

    await supabase.from("arcade_player_mission_progress").upsert(row, {
      onConflict: "student_id,mission_id,date",
    });

    if (completed && m.reward_coins > 0) {
      const { applyArcadeCoinMove } = await import("../server/arcade-coins.js");
      await applyArcadeCoinMove(supabase, {
        studentId,
        direction: "earn",
        amount: m.reward_coins,
        idempotencyKey: `mission:${m.id}:${studentId}:${date}`,
        sourceType: "arcade_mission",
        sourceId: m.id,
        metadata: { missionId: m.id, date },
        reason: "arcade_mission_reward",
      });
    }
  }
}

const DEFAULT_ACHIEVEMENTS = [
  {
    key: "first_game",
    name: gamePackCopy("lib__arcade__club__missions.server", "first_player"),
    description: gamePackCopy("lib__arcade__club__missions.server", "play_one_arcade_game"),
    condition_type: "games_played",
    condition_value: 1,
  },
  {
    key: "ten_wins",
    name: "10 wins",
    description: gamePackCopy("lib__arcade__club__missions.server", "win_10_times"),
    condition_type: "wins",
    condition_value: 10,
  },
  {
    key: "fifty_games",
    name: "50 games",
    description: gamePackCopy("lib__arcade__club__missions.server", "play_50_arcade_games"),
    condition_type: "games_played",
    condition_value: 50,
  },
];

const ACHIEVEMENT_COPY_BY_KEY = Object.fromEntries(
  DEFAULT_ACHIEVEMENTS.map((a) => [a.key, { name: a.name, description: a.description }])
);

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 */
export async function ensureDefaultAchievements(supabase) {
  const { count } = await supabase
    .from("arcade_achievements")
    .select("*", { count: "exact", head: true });

  // GLOBAL does not write legacy Hebrew-named columns into arcade_achievements.
  void DEFAULT_ACHIEVEMENTS;
  void count;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} studentId
 */
export async function unlockArcadeAchievements(supabase, studentId) {
  const feature = await assertGuestArcadeFeature(supabase, studentId, "missions");
  if (!feature.ok) return;

  await ensureDefaultAchievements(supabase);

  const { data: profile } = await supabase
    .from("arcade_player_profiles")
    .select("total_wins, total_games")
    .eq("student_id", studentId)
    .maybeSingle();

  const totalWins = profile?.total_wins ?? 0;
  const totalGames = profile?.total_games ?? 0;

  const { data: achievements } = await supabase
    .from("arcade_achievements")
    .select("id, key, condition_type, condition_value");
  const { data: unlocked } = await supabase
    .from("arcade_player_achievements")
    .select("achievement_id")
    .eq("student_id", studentId);

  const unlockedSet = new Set((unlocked || []).map((u) => u.achievement_id));

  for (const a of achievements || []) {
    if (unlockedSet.has(a.id)) continue;
    let met = false;
    if (a.condition_type === "wins") met = totalWins >= a.condition_value;
    if (a.condition_type === "games_played") met = totalGames >= a.condition_value;
    if (!met) continue;

    await supabase.from("arcade_player_achievements").insert({
      student_id: studentId,
      achievement_id: a.id,
      unlocked_at: new Date().toISOString(),
    });
  }
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} studentId
 */
export async function listAchievements(supabase, studentId) {
  await ensureDefaultAchievements(supabase);
  const { data: achievements } = await supabase
    .from("arcade_achievements")
    .select("id, key, condition_type, condition_value");
  const { data: unlocked } = await supabase
    .from("arcade_player_achievements")
    .select("achievement_id, unlocked_at")
    .eq("student_id", studentId);

  const unlockedSet = new Set((unlocked || []).map((u) => u.achievement_id));

  return {
    ok: true,
    achievements: (achievements || []).map((a) => {
      const copy = ACHIEVEMENT_COPY_BY_KEY[a.key] || {
        name: a.key,
        description: a.key,
      };
      return {
        id: a.id,
        key: a.key,
        name: copy.name,
        description: copy.description,
        unlocked: unlockedSet.has(a.id),
      };
    }),
  };
}
