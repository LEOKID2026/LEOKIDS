/**
 * One-shot wiring patches for ar-001 audit FAIL remediations.
 * Run: node scripts/i18n/wire-ar-001-runtime-fixes.mjs
 */
import fs from "fs";
import path from "path";

function patchFile(filePath, replacements) {
  let text = fs.readFileSync(filePath, "utf8");
  let changed = 0;
  for (const [from, to] of replacements) {
    if (!text.includes(from)) {
      console.warn("MISS", filePath, JSON.stringify(from).slice(0, 80));
      continue;
    }
    text = text.split(from).join(to);
    changed += 1;
  }
  if (changed) {
    fs.writeFileSync(filePath, text);
    console.log("patched", filePath, changed);
  }
}

const IMPORT_GPC = 'import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";\n';

// Word detective
{
  const f = "components/educational-games/leo-word-detective/LeoWordDetectiveGame.jsx";
  let t = fs.readFileSync(f, "utf8");
  if (!t.includes("game-pack-copy")) {
    t = t.replace(
      'import styles from "./LeoWordDetectiveGame.module.css";\n',
      'import styles from "./LeoWordDetectiveGame.module.css";\n' + IMPORT_GPC
    );
  }
  t = t.replace(
    'const timeoutText = "Time\'s up! The case stays open.";',
    'const timeoutText = gamePackCopy("components__educational-games__leo-word-detective__LeoWordDetectiveGame", "times_up");'
  );
  t = t.replaceAll(
    "<p className={frame.endStat}>⭐ Score: {score}</p>",
    '<p className={frame.endStat}>{gamePackCopy("components__educational-games__leo-word-detective__LeoWordDetectiveGame", "end_score", { score })}</p>'
  );
  fs.writeFileSync(f, t);
  console.log("wired", f);
}

// Word train
{
  const f = "components/educational-games/leo-word-train/LeoWordTrainGame.jsx";
  let t = fs.readFileSync(f, "utf8");
  if (!t.includes("game-pack-copy")) {
    t = t.replace(
      /^(import .+;\n)/m,
      `$1${IMPORT_GPC}`
    );
    // better: after first import block end - ensure once
    if ((t.match(/game-pack-copy/g) || []).length > 1) {
      // leave
    }
  }
  if (!t.includes('from "../../../lib/games/game-pack-copy.js"')) {
    const idx = t.indexOf("\nexport default");
    t = t.slice(0, idx) + "\n" + IMPORT_GPC + t.slice(idx);
  }
  t = t.replace(
    'const timeoutText = "Time\'s up! The train stayed at the station.";',
    'const timeoutText = gamePackCopy("components__educational-games__leo-word-train__LeoWordTrainGame", "times_up");'
  );
  t = t.replaceAll(
    "<p className={frame.endStat}>⭐ Score: {score}</p>",
    '<p className={frame.endStat}>{gamePackCopy("components__educational-games__leo-word-train__LeoWordTrainGame", "end_score", { score })}</p>'
  );
  fs.writeFileSync(f, t);
  console.log("wired", f);
}

// Bakery
{
  const f = "components/educational-games/leo-bakery/LeoBakeryGame.jsx";
  let t = fs.readFileSync(f, "utf8");
  if (!t.includes("game-pack-copy")) {
    const idx = t.indexOf("\nexport default");
    t = t.slice(0, idx) + "\n" + IMPORT_GPC + t.slice(idx);
  }
  t = t.replace(
    "if (task) revealAndAdvance(`Time's up. Here's the solution:\\n${bakerySolutionText(task)}`);",
    'if (task) revealAndAdvance(gamePackCopy("components__educational-games__leo-bakery__LeoBakeryGame", "times_up_solution", { solution: bakerySolutionText(task) }));'
  );
  t = t.replaceAll(
    "<p className={styles.endStat}>⭐ Score: {score}</p>",
    '<p className={styles.endStat}>{gamePackCopy("components__educational-games__leo-bakery__LeoBakeryGame", "end_score", { score })}</p>'
  );
  fs.writeFileSync(f, t);
  console.log("wired", f);
}

// Gifts
{
  const f = "components/educational-games/leo-gifts/LeoGiftsGame.jsx";
  let t = fs.readFileSync(f, "utf8");
  if (!t.includes("game-pack-copy")) {
    const idx = t.indexOf("\nexport default");
    t = t.slice(0, idx) + "\n" + IMPORT_GPC + t.slice(idx);
  }
  t = t.replace(
    "revealAndAdvance(`Time's up! ${giftsSolutionText(task)}`);",
    'revealAndAdvance(gamePackCopy("components__educational-games__leo-gifts__LeoGiftsGame", "times_up_solution", { solution: giftsSolutionText(task) }));'
  );
  t = t.replaceAll(
    "<p className={styles.endStat}>⭐ Score: {score}</p>",
    '<p className={styles.endStat}>{gamePackCopy("components__educational-games__leo-gifts__LeoGiftsGame", "end_score", { score })}</p>'
  );
  fs.writeFileSync(f, t);
  console.log("wired", f);
}

// Other educational end scores
for (const [f, slug, cls] of [
  ["components/educational-games/leo-lab/LeoLabGame.jsx", "components__educational-games__leo-lab__LeoLabGame", "frame.endStat"],
  ["components/educational-games/leo-number-path/LeoNumberPathGame.jsx", "components__educational-games__leo-number-path__LeoNumberPathGame", "frame.endStat"],
  ["components/educational-games/leo-pizzeria/LeoPizzeriaGame.jsx", "components__educational-games__leo-pizzeria__LeoPizzeriaGame", "frame.endStat"],
]) {
  let t = fs.readFileSync(f, "utf8");
  if (!t.includes("game-pack-copy")) {
    const idx = t.indexOf("\nexport default");
    t = t.slice(0, idx) + "\n" + IMPORT_GPC + t.slice(idx);
  }
  t = t.replaceAll(
    `<p className={${cls}}>⭐ Score: {score}</p>`,
    `<p className={${cls}}>{gamePackCopy("${slug}", "end_score", { score })}</p>`
  );
  fs.writeFileSync(f, t);
  console.log("wired end score", f);
}

{
  const f = "components/educational-games/leo-supermarket/LeoSupermarketGame.jsx";
  let t = fs.readFileSync(f, "utf8");
  if (!t.includes("game-pack-copy")) {
    const idx = t.indexOf("\nexport default");
    t = t.slice(0, idx) + "\n" + IMPORT_GPC + t.slice(idx);
  }
  t = t.replace(
    "<p>⭐ Score: {score}</p>",
    '<p>{gamePackCopy("components__educational-games__leo-supermarket__LeoSupermarketGame", "end_score", { score })}</p>'
  );
  fs.writeFileSync(f, t);
  console.log("wired", f);
}

// Solo finish screen RTL
{
  const f = "components/solo-games/SoloGameFinishScreen.jsx";
  let t = fs.readFileSync(f, "utf8");
  if (!t.includes("useI18n")) {
    t = t.replace(
      'import SoloGameNavButtons from "./SoloGameNavButtons.jsx";\n',
      'import SoloGameNavButtons from "./SoloGameNavButtons.jsx";\nimport { useI18n } from "../../lib/i18n/I18nProvider.jsx";\n'
    );
  }
  t = t.replace(
    "  const { SG } = useSoloGameShellUi();\n\n  return (\n    <div\n      className=\"flex h-full min-h-0 flex-col items-center justify-center overflow-hidden overflow-x-hidden px-2 py-2 landscape:py-1 sm:px-4 sm:py-3\"\n      dir=\"ltr\"\n    >",
    "  const { SG } = useSoloGameShellUi();\n  const { direction } = useI18n();\n\n  return (\n    <div\n      className=\"flex h-full min-h-0 flex-col items-center justify-center overflow-hidden overflow-x-hidden px-2 py-2 landscape:py-1 sm:px-4 sm:py-3\"\n      dir={direction === \"rtl\" ? \"rtl\" : \"ltr\"}\n    >"
  );
  fs.writeFileSync(f, t);
  console.log("wired", f);
}

// Math book shells → useI18n direction
for (const grade of [1, 2, 3, 4, 5, 6]) {
  const f = `components/learning-book/MathG${grade}BookShell.js`;
  let t = fs.readFileSync(f, "utf8");
  if (!t.includes("useI18n")) {
    t = t.replace(
      'import { useState } from "react";\n',
      'import { useState } from "react";\nimport { useI18n } from "../../lib/i18n/I18nProvider.jsx";\n'
    );
  }
  if (!t.includes("const { direction } = useI18n()")) {
    t = t.replace(
      "  const router = useRouter();\n",
      "  const router = useRouter();\n  const { direction } = useI18n();\n"
    );
  }
  t = t.replaceAll(
    'dir={typeof document !== "undefined" && document.documentElement?.dir === "rtl" ? "rtl" : "ltr"}',
    'dir={direction === "rtl" ? "rtl" : "ltr"}'
  );
  fs.writeFileSync(f, t);
  console.log("wired book", f);
}

console.log("done");
