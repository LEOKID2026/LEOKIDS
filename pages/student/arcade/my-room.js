import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { useStudentTheme } from "../../../contexts/StudentThemeContext.jsx";
import { useGamesHubUi } from "../../../hooks/useGamesHubUi.js";
import GameAccessGuard from "../../../components/games/GameAccessGuard.jsx";
import { isDemoMode } from "../../../lib/demo/demo-mode.client.js";
import { buildDemoMyRoomFixture } from "../../../components/demo/demo-display-fixtures.js";
import { demoPackCopyForLocale } from "../../../lib/demo/demo-pack-copy.js";
import { useI18n } from "../../../lib/i18n/I18nProvider.jsx";

export default function ArcadeMyRoomPage() {
  const { locale } = useI18n();
  const demoMode = isDemoMode();
  const demoMyRoom = buildDemoMyRoomFixture(locale);
  const demoCopy = (group, key) => demoPackCopyForLocale(locale, group, key);
  const { theme } = useStudentTheme();
  const { GH } = useGamesHubUi();
  const [room, setRoom] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/arcade/my-room");
    const json = await res.json().catch(() => ({}));
    if (json?.featureLocked) {
      setLocked(true);
      return;
    }
    if (json?.ok && json.room) {
      setRoom(json.room);
      setRoomName(json.room.roomName || "");
    }
  }, []);

  useEffect(() => {
    if (demoMode) return undefined;
    void load();
  }, [load, demoMode]);

  const save = async () => {
    if (demoMode) {
      setMessage(demoCopy("myRoom", "saveBlocked"));
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/arcade/my-room", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName }),
      });
      const json = await res.json().catch(() => ({}));
      setMessage(json.ok ? "Saved!" : json.message || json.error || "Error");
      if (json.ok) await load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout studentTheme={theme} studentShell="home">
      <GameAccessGuard category="online">
        <Head>
          <title>{gamePackCopy("pages__student__arcade__my-room", "my_room_leo_club")}</title>
        </Head>
        <div className={GH.pageWrap} dir="ltr">
          <div className={`${GH.container} max-w-3xl space-y-4`}>
            <div className="flex items-center justify-between gap-3">
              <Link href="/student/arcade" className={GH.backBtn}>
                ← Back to club
              </Link>
            </div>

            {demoMode ? (
              <div className={`${GH.card} space-y-4 p-4 text-left`}>
                <h1 className={GH.sectionTitle}>{demoCopy("myRoom", "title")}</h1>
                <p className={`text-sm ${GH.cardBlurb}`}>{demoMyRoom.messageHe}</p>
              </div>
            ) : locked ? (
              <div className={`${GH.card} p-4 text-right`}>
                <p className={GH.cardBlurb}>Personal room — controlled via Admin. Not open to guests yet.</p>
              </div>
            ) : (
              <div className={`${GH.card} space-y-4 p-4 text-right`}>
                <h1 className={GH.sectionTitle}>My Room</h1>
                <p className={`text-sm ${GH.cardBlurb}`}>Decorations, trophies, and inviting friends — personal space only</p>

                <label className="block space-y-1">
                  <span className={`text-sm ${GH.entryLabel}`}>Room name</span>
                  <input className={GH.input} maxLength={40} value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                </label>

                <div className={`rounded-lg border border-white/10 p-4 ${GH.roomItem}`}>
                  <p className={`font-semibold ${GH.cardTitle}`}>Trophy shelf</p>
                  <p className={`mt-1 text-xs ${GH.cardBlurb}`}>
                    {(room?.decorationSlots || []).length
                      ? `${room.decorationSlots.length} items on display`
                      : "No trophies yet — complete missions and tournaments"}
                  </p>
                </div>

                <button type="button" disabled={busy} onClick={() => void save()} className={GH.btnJoinCode}>
                  Save
                </button>
                {message ? <p className={`text-sm ${GH.userMessage}`}>{message}</p> : null}
              </div>
            )}
          </div>
        </div>
      </GameAccessGuard>
    </Layout>
  );
}
