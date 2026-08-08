import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import { useCallback, useEffect, useState } from "react";
import { isDemoMode } from "../../../lib/demo/demo-mode.client.js";
import { DEMO_ARCADE_MISSIONS } from "../../demo/demo-display-fixtures.js";

const SLUG = "components__arcade__club__ArcadeClubMissionsPanel";

/** @param {{ gh: Record<string, string>, className?: string, demoMode?: boolean }} props */
export default function ArcadeClubMissionsPanel({ gh, className = "", demoMode: demoModeProp = false }) {
  const demoMode = demoModeProp || isDemoMode();
  const [missions, setMissions] = useState(demoMode ? DEMO_ARCADE_MISSIONS.missions : []);
  const [achievements, setAchievements] = useState(demoMode ? DEMO_ARCADE_MISSIONS.achievements : []);
  const [locked, setLocked] = useState(demoMode ? DEMO_ARCADE_MISSIONS.featureLocked : false);

  const load = useCallback(async () => {
    const [mRes, aRes] = await Promise.all([
      fetch("/api/arcade/missions/today"),
      fetch("/api/arcade/achievements"),
    ]);
    const mJson = await mRes.json().catch(() => ({}));
    const aJson = await aRes.json().catch(() => ({}));
    if (mJson?.ok) {
      setMissions(mJson.missions || []);
      setLocked(mJson.featureLocked === true);
    }
    if (aJson?.ok) setAchievements(aJson.achievements || []);
  }, []);

  useEffect(() => {
    if (demoMode) {
      setMissions(DEMO_ARCADE_MISSIONS.missions);
      setAchievements(DEMO_ARCADE_MISSIONS.achievements);
      setLocked(DEMO_ARCADE_MISSIONS.featureLocked);
      return undefined;
    }
    void load();
  }, [demoMode, load]);

  if (locked) {
    return (
      <div className={`${gh.arcadePanelMissions || gh.card} text-left ${className}`} dir="ltr">
        <p className={gh.arcadePanelBlurb || gh.cardBlurb}>{gamePackCopy(SLUG, "missions_locked")}</p>
      </div>
    );
  }

  return (
    <div className={`${gh.arcadePanelMissions || gh.card} space-y-4 text-left ${className}`} dir="ltr">
      <h3 className={gh.arcadeSectionTitle || gh.sectionTitle}>{gamePackCopy(SLUG, "todays_missions")}</h3>
      <ul className="space-y-2">
        {missions.map((m) => (
          <li key={m.missionId} className={gh.arcadeRoomItem || gh.roomItem}>
            <p className={`font-medium ${gh.arcadePanelTitle || gh.cardTitle}`}>{m.description}</p>
            <p className={`text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
              {gamePackCopy(SLUG, "mission_progress", {
                progress: m.progress,
                goal: m.goalCount,
                coins: m.rewardCoins,
              })}
              {m.completed ? " ✓" : ""}
            </p>
          </li>
        ))}
        {!missions.length ? (
          <li className={gh.arcadeEmptyText || gh.emptyText}>{gamePackCopy(SLUG, "no_missions_today")}</li>
        ) : null}
      </ul>

      <div>
        <h4 className={`mb-2 font-semibold ${gh.arcadeSectionTitle || gh.sectionTitle}`}>
          {gamePackCopy(SLUG, "achievements")}
        </h4>
        <ul className="space-y-2">
          {achievements.map((a) => (
            <li key={a.achievementId || a.key} className={gh.arcadeRoomItem || gh.roomItem}>
              <span>{a.name || a.key}</span>
              {a.unlocked ? " 🏅" : ""}
            </li>
          ))}
          {!achievements.length ? (
            <li className={gh.arcadeEmptyText || gh.emptyText}>{gamePackCopy(SLUG, "no_achievements_yet")}</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
