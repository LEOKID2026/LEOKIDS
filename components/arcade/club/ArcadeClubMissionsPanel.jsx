import { useCallback, useEffect, useState } from "react";
import { isDemoMode } from "../../../lib/demo/demo-mode.client.js";
import { DEMO_ARCADE_MISSIONS } from "../../demo/demo-display-fixtures.js";

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
        <p className={gh.arcadePanelBlurb || gh.cardBlurb}>Daily missions — controlled via Admin. Not open to guests yet.</p>
      </div>
    );
  }

  return (
    <div className={`${gh.arcadePanelMissions || gh.card} space-y-4 text-left ${className}`} dir="ltr">
      <h3 className={gh.arcadeSectionTitle || gh.sectionTitle}>Today's missions</h3>
      <ul className="space-y-2">
        {missions.map((m) => (
          <li key={m.missionId} className={gh.arcadeRoomItem || gh.roomItem}>
            <p className={`font-medium ${gh.arcadePanelTitle || gh.cardTitle}`}>{m.descriptionHe}</p>
            <p className={`text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
              {m.progress}/{m.goalCount} · +{m.rewardCoins} coins {m.completed ? "✓" : ""}
            </p>
          </li>
        ))}
        {!missions.length ? <li className={gh.arcadeEmptyText || gh.emptyText}>No missions today</li> : null}
      </ul>

      <div>
        <h4 className={`mb-2 font-semibold ${gh.arcadeSectionTitle || gh.sectionTitle}`}>Achievements</h4>
        <ul className="space-y-2">
          {achievements.map((a) => (
            <li key={a.achievementId || a.key} className={gh.arcadeRoomItem || gh.roomItem}>
              <span>{a.nameHe || a.key}</span>
              {a.unlocked ? " 🏅" : ""}
            </li>
          ))}
          {!achievements.length ? <li className={gh.arcadeEmptyText || gh.emptyText}>No achievements yet</li> : null}
        </ul>
      </div>
    </div>
  );
}
