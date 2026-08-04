/**
 * Wire solo/educational HUD Score labels + finish screen chrome to locale packs.
 */
import fs from "fs";

function ensureHudKeys() {
  for (const locale of ["en", "ar-001"]) {
    const p = `content-packs/${locale}/games/burn-down-index.json`;
    const idx = JSON.parse(fs.readFileSync(p, "utf8"));
    const finish = "components__solo-games__SoloGameFinishScreen";
    const en = locale === "en";
    idx[finish] = {
      ...(idx[finish] || {}),
      score: en ? "Score:" : "النقاط:",
      level: en ? "Level:" : "المستوى:",
      win_title: en ? "Great job! 🎉" : "أحسنت! 🎉",
      lose_title: en ? "Nice try — great effort!" : "محاولة جيدة — جهد رائع!",
      coins_awarded: en ? "+{n} coins" : "+{n} عملات",
      diamonds_awarded: en ? "+{n} diamonds" : "+{n} ماسات",
    };
    idx.games__shared_runtime_hud = {
      ...(idx.games__shared_runtime_hud || {}),
      score: en ? "Score" : "النقاط",
      score_colon: en ? "Score:" : "النقاط:",
      end_score: en ? "⭐ Score: {score}" : "⭐ النقاط: {score}",
      level: en ? "Level" : "المستوى",
      coins: en ? "Coins" : "العملات",
    };
    fs.writeFileSync(p, JSON.stringify(idx, null, 2) + "\n");
  }
}

ensureHudKeys();

// Patch SoloGameFinishScreen
{
  const f = "components/solo-games/SoloGameFinishScreen.jsx";
  let t = fs.readFileSync(f, "utf8");
  const FIN = "components__solo-games__SoloGameFinishScreen";
  t = t.replace(
    '{didWin ? "Great job! 🎉" : "Nice try — great effort!"}',
    `{didWin ? gamePackCopy("${FIN}", "win_title") : gamePackCopy("${FIN}", "lose_title")}`
  );
  t = t.replace(
    "<span className={SG.finishLabel}>Score: </span>",
    `<span className={SG.finishLabel}>{gamePackCopy("${FIN}", "score")} </span>`
  );
  t = t.replace(
    "<span className={SG.finishLabel}>Level: </span>",
    `<span className={SG.finishLabel}>{gamePackCopy("${FIN}", "level")} </span>`
  );
  t = t.replace(
    "+{coinsAwarded} coins",
    `{gamePackCopy("${FIN}", "coins_awarded", { n: coinsAwarded })}`
  );
  t = t.replace(
    "+{diamondsAwarded} diamonds",
    `{gamePackCopy("${FIN}", "diamonds_awarded", { n: diamondsAwarded })}`
  );
  fs.writeFileSync(f, t);
  console.log("finish screen", f);
}

const IMPORT =
  'import { gameHudScoreColon, gameHudLabel } from "../../../lib/games/game-hud-copy.js";\n';
const IMPORT2 =
  'import { gameHudScoreColon, gameHudLabel } from "../../lib/games/game-hud-copy.js";\n';

const engineFiles = [
  "components/solo-games/engines/MleoTargetTapEngine.jsx",
  "components/solo-games/engines/MleoPicturePuzzleSlidingPlay.jsx",
  "components/solo-games/engines/MleoBalloonsEngine.jsx",
  "components/solo-games/engines/MleoFruitSliceEngine.jsx",
  "components/solo-games/engines/MleoMazeEngine.jsx",
  "components/solo-games/engines/MleoPicturePuzzlePlacementPlay.jsx",
];

for (const f of engineFiles) {
  let t = fs.readFileSync(f, "utf8");
  if (!t.includes("game-hud-copy")) {
    const idx = t.indexOf("\nexport ");
    t = t.slice(0, idx) + "\n" + IMPORT + t.slice(idx);
  }
  t = t.replaceAll(">Score: {", ">{gameHudScoreColon()} {");
  t = t.replaceAll(">Score: {won", ">{gameHudScoreColon()} {won");
  // fix double if already wrong
  t = t.replaceAll(
    '<span className="text-amber-300">Score: {score}</span>',
    '<span className="text-amber-300">{gameHudScoreColon()} {score}</span>'
  );
  t = t.replaceAll(
    '<span className="text-amber-300">Score: {won ? computeWinScore(timeLeft, moves) : 0}</span>',
    '<span className="text-amber-300">{gameHudScoreColon()} {won ? computeWinScore(timeLeft, moves) : 0}</span>'
  );
  fs.writeFileSync(f, t);
  console.log("engine", f);
}

{
  const f = "components/solo-games/SmartBlocksPlayView.jsx";
  let t = fs.readFileSync(f, "utf8");
  if (!t.includes("game-hud-copy")) {
    const idx = t.indexOf("\nexport ");
    t = t.slice(0, idx) + "\n" + IMPORT2 + t.slice(idx);
  }
  t = t.replace(
    '<span className="text-amber-300">Score: {score}</span>',
    '<span className="text-amber-300">{gameHudScoreColon()} {score}</span>'
  );
  fs.writeFileSync(f, t);
  console.log(f);
}

{
  const f = "components/solo-games/engines/MleoFlyerEngine.jsx";
  let t = fs.readFileSync(f, "utf8");
  if (!t.includes("game-hud-copy")) {
    const idx = t.indexOf("\nexport ");
    t = t.slice(0, idx) + "\n" + IMPORT + t.slice(idx);
  }
  t = t.replace(/Score: \{score\}/g, "{gameHudScoreColon()} {score}");
  fs.writeFileSync(f, t);
  console.log(f);
}

{
  const f = "components/solo-games/engines/MleoJumpEngine.jsx";
  let t = fs.readFileSync(f, "utf8");
  if (!t.includes("game-hud-copy")) {
    const idx = t.indexOf("\nexport ");
    t = t.slice(0, idx) + "\n" + IMPORT + t.slice(idx);
  }
  t = t.replace(
    /Score: \{score\} \|\| Level: \{level\} \|\| Coins: \{coinsCollected\}/g,
    "{gameHudScoreColon()} {score} || {gameHudLabel('level')}: {level} || {gameHudLabel('coins')}: {coinsCollected}"
  );
  t = t.replace(
    /Score: \{score\} \|\| Level: \{level\} \|\| 🪙 \{coinsCollected\}/g,
    "{gameHudScoreColon()} {score} || {gameHudLabel('level')}: {level} || 🪙 {coinsCollected}"
  );
  fs.writeFileSync(f, t);
  console.log(f);
}

{
  const f = "components/solo-games/engines/MleoCatcherEngine.jsx";
  let t = fs.readFileSync(f, "utf8");
  if (!t.includes("game-hud-copy")) {
    const idx = t.indexOf("\nexport ");
    t = t.slice(0, idx) + "\n" + IMPORT + t.slice(idx);
  }
  t = t.replace(
    "`Score: ${currentScoreRef.current}`",
    "`${gameHudScoreColon()} ${currentScoreRef.current}`"
  );
  fs.writeFileSync(f, t);
  console.log(f);
}

console.log("done");
