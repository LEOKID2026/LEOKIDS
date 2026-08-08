import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { studentAvatarFromHomeSummary } from "../../../lib/learning-client/studentHomeAvatarFromSummary.js";
import {
  DEMO_ARCADE_AVATAR,
  DEMO_ARCADE_HISTORY,
  buildDemoArcadeProfile,
} from "../../demo/demo-display-fixtures.js";
import { isDemoMode } from "../../../lib/demo/demo-mode.client.js";
import { demoPackCopyForLocale } from "../../../lib/demo/demo-pack-copy.js";
import { useI18n } from "../../../lib/i18n/I18nProvider.jsx";
import StudentLearningAvatar from "./StudentLearningAvatar.jsx";
import { resolveStudentApiErrorMessage } from "../../../lib/student-client/student-api-legacy-errors.js";

const SLUG = "components__arcade__club__ArcadeClubProfilePanel";

function applyDemoProfileState(locale, setters) {
  const profile = buildDemoArcadeProfile(locale);
  setters.setProfile(profile);
  setters.setDisplayName(profile.displayName);
  setters.setHistory([...DEMO_ARCADE_HISTORY]);
  setters.setAvatarEmoji(DEMO_ARCADE_AVATAR.avatarEmoji);
  setters.setAvatarCustomDataUrl(DEMO_ARCADE_AVATAR.avatarCustomDataUrl);
  setters.setAvatarBackgroundKey(DEMO_ARCADE_AVATAR.avatarBackgroundKey);
}

/** @param {{ gh: Record<string, string>, demoMode?: boolean }} props */
export default function ArcadeClubProfilePanel({ gh, demoMode: demoModeProp = false }) {
  const { locale, t } = useI18n();
  const demoMode = demoModeProp || isDemoMode();
  const [profile, setProfile] = useState(demoMode ? buildDemoArcadeProfile(locale) : null);
  const [history, setHistory] = useState(demoMode ? [...DEMO_ARCADE_HISTORY] : []);
  const [displayName, setDisplayName] = useState(
    demoMode ? buildDemoArcadeProfile(locale).displayName : "",
  );
  const [avatarEmoji, setAvatarEmoji] = useState(demoMode ? DEMO_ARCADE_AVATAR.avatarEmoji : "👤");
  const [avatarCustomDataUrl, setAvatarCustomDataUrl] = useState(
    demoMode ? DEMO_ARCADE_AVATAR.avatarCustomDataUrl : "",
  );
  const [avatarBackgroundKey, setAvatarBackgroundKey] = useState(
    demoMode ? DEMO_ARCADE_AVATAR.avatarBackgroundKey : "sky",
  );
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [meRes, histRes, homeRes] = await Promise.all([
      fetch("/api/arcade/profile/me"),
      fetch("/api/arcade/history?limit=10"),
      fetch("/api/student/home-profile/summary"),
    ]);
    const meJson = await meRes.json().catch(() => ({}));
    const histJson = await histRes.json().catch(() => ({}));
    const homeJson = await homeRes.json().catch(() => ({}));
    if (meJson?.ok) {
      setProfile(meJson.profile);
      setDisplayName(meJson.profile?.displayName || "");
    }
    if (histJson?.ok) setHistory(histJson.history || []);
    if (homeJson?.profile) {
      const avatar = studentAvatarFromHomeSummary(homeJson);
      setAvatarEmoji(avatar.avatarEmoji);
      setAvatarCustomDataUrl(avatar.avatarCustomDataUrl);
      setAvatarBackgroundKey(avatar.avatarBackgroundKey);
    }
  }, []);

  useEffect(() => {
    if (demoMode) {
      applyDemoProfileState(locale, {
        setProfile,
        setDisplayName,
        setHistory,
        setAvatarEmoji,
        setAvatarCustomDataUrl,
        setAvatarBackgroundKey,
      });
      return undefined;
    }
    void load();
  }, [demoMode, load, locale]);

  const saveName = async () => {
    if (demoMode) return;
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/arcade/profile/display-name", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });
      const json = await res.json().catch(() => ({}));
      setMessage(json.ok ? t("games.apiSuccess") : resolveStudentApiErrorMessage(json, t) || t("games.apiFailed"));
      if (json.ok) await load();
    } finally {
      setBusy(false);
    }
  };

  if (!profile) {
    return <div className={gh.skeleton} aria-hidden />;
  }

  return (
    <div className={`${gh.arcadePanelProfile || gh.card} space-y-4 text-left`} dir="ltr">
      <h3 className={gh.arcadeSectionTitle || gh.sectionTitle}>{gamePackCopy(SLUG, "player_card")}</h3>

      {demoMode ? (
        <p className={`text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
          {demoPackCopyForLocale(locale, "display", "myRoomMessage")}
        </p>
      ) : null}

      <div className="flex items-start gap-3">
        <div className="flex shrink-0 flex-col items-center gap-1">
          <StudentLearningAvatar
            avatarEmoji={avatarEmoji}
            avatarCustomDataUrl={avatarCustomDataUrl}
            avatarBackgroundKey={avatarBackgroundKey}
            sizeClass="h-14 w-14 text-2xl"
          />
          {demoMode ? null : (
            <Link href="/student/home" className={`text-[11px] font-semibold underline ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
              {gamePackCopy(SLUG, "change_photo_on_the_home_page")}
            </Link>
          )}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className={`text-lg font-bold ${gh.arcadePanelTitle || gh.cardTitle}`}>{profile.displayName}</p>
          {!demoMode && profile.fullName ? (
            <p className={`text-xs ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
              {gamePackCopy(SLUG, "official_name_parent", { fullName: profile.fullName })}
            </p>
          ) : null}
          <p className={`mt-1 text-sm ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
            {gamePackCopy(SLUG, "wins_games", {
              wins: profile.totalWins ?? 0,
              games: profile.totalGames ?? 0,
            })}
          </p>
        </div>
      </div>

      <div className="space-y-2 border-t border-emerald-200/80 pt-4">
        <label className={`block text-sm font-semibold ${gh.arcadeEntryLabel || gh.entryLabel}`}>
          {gamePackCopy(SLUG, "game_name")}
        </label>
        {demoMode ? (
          <p className={`text-sm ${gh.arcadePanelBlurb || gh.cardBlurb}`}>{profile.displayName}</p>
        ) : (
          <>
            <p className={`text-[11px] ${gh.arcadePanelBlurb || gh.cardBlurb}`}>
              {gamePackCopy(SLUG, "display_name_for_games_only_doesn_t_change_your_official_name_or_leo_num")}
            </p>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-stretch">
              <input
                className={`${gh.input} w-full min-w-0 sm:flex-1`}
                maxLength={20}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={gamePackCopy(SLUG, "display_name")}
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => void saveName()}
                className={`${gh.btnJoinCode} w-full sm:w-auto sm:shrink-0`}
              >
                {gamePackCopy(SLUG, "save_name")}
              </button>
            </div>
            {message ? <p className={`text-sm ${gh.userMessage}`}>{message}</p> : null}
          </>
        )}
      </div>

      <div className="border-t border-emerald-200/80 pt-4">
        <h4 className={`mb-2 font-semibold ${gh.arcadeSectionTitle || gh.sectionTitle}`}>
          {gamePackCopy(SLUG, "recent_history")}
        </h4>
        {!history.length ? (
          <p className={gh.arcadeEmptyText || gh.emptyText}>{gamePackCopy(SLUG, "no_games_yet")}</p>
        ) : (
          <ul className="space-y-2">
            {history.map((h) => (
              <li key={h.id} className={gh.arcadeRoomItem || gh.roomItem}>
                <span>{h.gameKey || gamePackCopy(SLUG, "game_fallback")} · </span>
                <span>{h.resultType || gamePackCopy(SLUG, "result_dash")} · </span>
                <span>{gamePackCopy(SLUG, "coins_reward", { amount: h.rewardAmount || 0 })}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
