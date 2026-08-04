/**
 * Offline structural + linguistic gate for it-IT content layer.
 * No network. Exit 1 on hard failures.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const failures = [];
const warnings = [];

function fail(msg) {
  failures.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

function walkFiles(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, pred, out);
    else if (pred(ent.name, p)) out.push(p);
  }
  return out;
}

function rel(p) {
  return path.relative(ROOT, p).replace(/\\/g, "/");
}

function deepKeys(obj, prefix = "", out = []) {
  if (!obj || typeof obj !== "object") return out;
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => deepKeys(v, `${prefix}[${i}]`, out));
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    out.push(p);
    deepKeys(v, p, out);
  }
  return out;
}

function collectStrings(node, out = []) {
  if (typeof node === "string") {
    out.push(node);
    return out;
  }
  if (Array.isArray(node)) {
    for (const x of node) collectStrings(x, out);
    return out;
  }
  if (node && typeof node === "object") {
    for (const v of Object.values(node)) collectStrings(v, out);
  }
  return out;
}

// 1) Locale namespace file parity + parse
{
  const en = walkFiles(path.join(ROOT, "locales/en"), (n) => n.endsWith(".json")).map((p) => path.basename(p)).sort();
  const it = walkFiles(path.join(ROOT, "locales/it-IT"), (n) => n.endsWith(".json")).map((p) => path.basename(p)).sort();
  if (JSON.stringify(en) !== JSON.stringify(it)) fail(`namespace file mismatch en=${en.length} it=${it.length}`);
  for (const f of it) {
    try {
      JSON.parse(fs.readFileSync(path.join(ROOT, "locales/it-IT", f), "utf8"));
    } catch (e) {
      fail(`locales/it-IT/${f} parse: ${e.message}`);
    }
  }
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/it-IT/common.json"), "utf8"));
  const grades = {
    grade1: "1ª primaria",
    grade2: "2ª primaria",
    grade3: "3ª primaria",
    grade4: "4ª primaria",
    grade5: "5ª primaria",
    grade6: "1ª secondaria",
  };
  for (const [k, v] of Object.entries(grades)) {
    if (common[k] !== v) fail(`common.${k} expected ${v}, got ${common[k]}`);
  }
  if (common.grade6 === "6ª primaria") fail("grade6 must not be 6ª primaria");
  if (common.brandName !== "Leo Kids") fail("brandName must remain Leo Kids");
}

// 2) Worksheets key parity + terminology
{
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en/worksheets.json"), "utf8"));
  const it = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/it-IT/worksheets.json"), "utf8"));
  const enKeys = Object.keys(en).sort();
  const itKeys = Object.keys(it).sort();
  if (JSON.stringify(enKeys) !== JSON.stringify(itKeys)) {
    const missing = enKeys.filter((k) => !(k in it));
    const extra = itKeys.filter((k) => !(k in en));
    fail(`worksheets key mismatch missing=${missing.slice(0, 10)} extra=${extra.slice(0, 10)}`);
  }
  if (itKeys.some((k) => k.includes(" "))) fail("worksheets has broken keys with spaces");
  const blob = JSON.stringify(it);
  if (/foglio di calcolo/i.test(blob)) fail("worksheets contains foglio di calcolo");
  if (!/scheda didattica|schede didattiche|scheda di esercizi/i.test(blob)) {
    fail("worksheets missing scheda didattica terminology");
  }
  if (it.createWorksheet !== "Crea una scheda didattica") {
    fail(`createWorksheet unexpected: ${it.createWorksheet}`);
  }
  if (it.answerKey !== "Soluzioni") fail(`answerKey unexpected: ${it.answerKey}`);
}

// 3) Content-pack path parity + JSON parse + no key corruption
{
  const enFiles = walkFiles(path.join(ROOT, "content-packs/en"), (n) => n.endsWith(".json")).map((p) =>
    rel(p).replace(/^content-packs\/en\//, ""),
  );
  const itFiles = walkFiles(path.join(ROOT, "content-packs/it-IT"), (n) => n.endsWith(".json")).map((p) =>
    rel(p).replace(/^content-packs\/it-IT\//, ""),
  );
  const enSet = new Set(enFiles);
  const itSet = new Set(itFiles);
  const missing = enFiles.filter((f) => !itSet.has(f));
  const extra = itFiles.filter((f) => !enSet.has(f));
  if (missing.length) fail(`content-pack missing files: ${missing.length} e.g. ${missing.slice(0, 5)}`);
  if (extra.length) warn(`content-pack extra files: ${extra.length}`);
  let parseFails = 0;
  let badKeys = 0;
  for (const f of itFiles) {
    const p = path.join(ROOT, "content-packs/it-IT", f);
    try {
      const obj = JSON.parse(fs.readFileSync(p, "utf8"));
      const keys = deepKeys(obj);
      if (keys.some((k) => /scheda didattica/i.test(k.split(".").pop() || ""))) {
        badKeys += 1;
        if (badKeys <= 5) fail(`corrupted pack key in ${f}`);
      }
    } catch (e) {
      parseFails += 1;
      if (parseFails <= 5) fail(`pack parse ${f}: ${e.message}`);
    }
  }
  if (parseFails) fail(`pack parse failures total ${parseFails}`);
}

// 4) Science ID/field/option-length parity
{
  const en = (await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href))
    .SCIENCE_EN_OVERLAY;
  const it = (await import(pathToFileURL(path.join(ROOT, "data/science-questions-it-IT-overlay.js")).href))
    .SCIENCE_IT_IT_OVERLAY;
  const enIds = Object.keys(en).sort();
  const itIds = Object.keys(it).sort();
  if (JSON.stringify(enIds) !== JSON.stringify(itIds)) fail(`science ID parity fail en=${enIds.length} it=${itIds.length}`);
  let optMismatch = 0;
  let fieldMismatch = 0;
  let emptyStem = 0;
  for (const id of enIds) {
    const a = en[id];
    const b = it[id];
    const ak = Object.keys(a).sort().join(",");
    const bk = Object.keys(b).sort().join(",");
    if (ak !== bk) {
      fieldMismatch += 1;
      if (fieldMismatch <= 3) fail(`science fields ${id}: ${ak} vs ${bk}`);
    }
    if (Array.isArray(a.options) && Array.isArray(b.options) && a.options.length !== b.options.length) {
      optMismatch += 1;
      if (optMismatch <= 3) fail(`science options length ${id}`);
    }
    if (!String(b.stem || "").trim()) emptyStem += 1;
  }
  if (emptyStem) fail(`science empty stems: ${emptyStem}`);
  // correctIndex must not exist as changed field — overlays shouldn't invent it
  for (const id of itIds.slice(0, 50)) {
    if ("correctIndex" in (it[id] || {}) && !("correctIndex" in (en[id] || {}))) {
      fail(`science invented correctIndex on ${id}`);
      break;
    }
  }
}

// 5) Word meanings ID parity + polysemy
{
  const en = (await import(pathToFileURL(path.join(ROOT, "data/english-questions/word-meanings/en.js")).href))
    .WORD_MEANINGS_EN;
  const it = (await import(pathToFileURL(path.join(ROOT, "data/english-questions/word-meanings/it-IT.js")).href))
    .WORD_MEANINGS_IT_IT;
  for (const cat of Object.keys(en)) {
    if (!it[cat]) fail(`word-meanings missing category ${cat}`);
    for (const id of Object.keys(en[cat])) {
      if (typeof it[cat]?.[id] !== "string" || !it[cat][id].trim()) fail(`word-meanings missing ${cat}.${id}`);
    }
  }
  if (it.travel?.port !== "porto") fail("polysemy travel.port");
  if (it.community?.bank !== "banca") fail("polysemy community.bank");
  if (it.travel?.ticket !== "biglietto") fail("polysemy travel.ticket");
  if (it.school?.grade !== "voto") fail("polysemy school.grade");
  if (it.actions?.watch !== "guardare") fail("polysemy actions.watch");
  if (it.health?.cold === it.weather?.cold) fail("polysemy cold collision");
}

// 6) Books path parity
{
  const en = walkFiles(path.join(ROOT, "docs/learning-book/en"), (n) => n.endsWith(".md")).map((p) =>
    rel(p).replace(/^docs\/learning-book\/en\//, ""),
  );
  const it = walkFiles(path.join(ROOT, "docs/learning-book/it-IT"), (n) => n.endsWith(".md")).map((p) =>
    rel(p).replace(/^docs\/learning-book\/it-IT\//, ""),
  );
  const enSet = new Set(en);
  const itSet = new Set(it);
  const missing = en.filter((f) => !itSet.has(f));
  const extra = it.filter((f) => !enSet.has(f));
  if (en.length < 450) fail(`en books unexpected count ${en.length}`);
  if (it.length !== en.length) fail(`book count parity en=${en.length} it=${it.length}`);
  if (missing.length) fail(`books missing ${missing.length} e.g. ${missing.slice(0, 5)}`);
  if (extra.length) fail(`books extra ${extra.length}`);
}

// 7) Math/geometry samples + locks
{
  const math = await import(pathToFileURL(path.join(ROOT, "utils/learning-content-it-IT/math.js")).href);
  const geo = await import(pathToFileURL(path.join(ROOT, "utils/learning-content-it-IT/geometry.js")).href);
  const money = math.rebuildMathStemItIt({ params: { kind: "wp_pocket_money", money: 10, toy: 3 } });
  if (!/euro/i.test(money) || /dollar/i.test(money)) fail(`money stem bad: ${money}`);
  const disc = math.localizeMathQuestionItIt({
    id: "x",
    correctIndex: 2,
    options: ["1", "2", "3"],
    params: { kind: "wp_shop_discount", price: 40, discPerc: 10 },
  });
  if (disc.id !== "x" || disc.correctIndex !== 2 || JSON.stringify(disc.options) !== JSON.stringify(["1", "2", "3"])) {
    fail("math localize mutated id/options/correctIndex");
  }
  const circ = geo.rebuildGeometryStemItIt({ params: { kind: "circle_perimeter", radius: 5 } });
  const area = geo.rebuildGeometryStemItIt({ params: { kind: "circle_area", radius: 5 } });
  if (!/circonferenza/i.test(circ) || !/cerchio/i.test(circ)) fail(`geometry circumference stem: ${circ}`);
  if (!/area/i.test(area) || !/cerchio/i.test(area)) fail(`geometry area stem: ${area}`);
  if (/circonferenza/i.test(area) && /area/i.test(area) === false) fail("geometry area/circumference confusion");
}

// 8) Help slug/section parity
{
  const enStudents = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/students.js")).href);
  const it = await import(pathToFileURL(path.join(ROOT, "data/help-center/it-IT/index.js")).href);
  const enSlugs = enStudents.STUDENT_ARTICLES.map((a) => a.slug).sort();
  const itSlugs = it.BY_SECTION_IT_IT.students.map((a) => a.slug).sort();
  if (JSON.stringify(enSlugs) !== JSON.stringify(itSlugs)) fail("help student slug parity");
  if (!it.ALL_ARTICLES_IT_IT?.length) fail("help ALL_ARTICLES empty");
  for (const a of it.ALL_ARTICLES_IT_IT) {
    if (!a.slug || !a.section) fail(`help article missing slug/section`);
  }
}

// 9) Hard forbidden scans on product trees (exclude english-subject book drafts for Grade English examples carefully)
{
  const trees = [
    "locales/it-IT",
    "content-packs/it-IT",
    "data/help-center/it-IT",
    "utils/learning-content-it-IT",
    "data/science-questions-it-IT-overlay.js",
    "data/english-questions/word-meanings/it-IT.js",
  ];
  const hard = [
    [/foglio di calcolo/i, "foglio di calcolo"],
    [/\b6ª primaria\b/i, "6ª primaria"],
    [/\bnatel\b/i, "natel"],
    [/\b(télécharger|fichier|élève)\b/i, "french"],
    [/\b(Schüler|Arbeitsblatt)\b/, "german"],
    [/\b(leerling|werkblad)\b/i, "dutch"],
    [/\b(ученик|тетрадь)\b/i, "russian"],
    [/\bhoja de cálculo\b/i, "spanish spreadsheet"],
  ];
  for (const tree of trees) {
    const p = path.join(ROOT, tree);
    const files = fs.existsSync(p) && fs.statSync(p).isDirectory()
      ? walkFiles(p, (n) => /\.(json|js|mjs|md)$/.test(n))
      : fs.existsSync(p)
        ? [p]
        : [];
    for (const file of files) {
      const text = fs.readFileSync(file, "utf8");
      for (const [re, label] of hard) {
        if (re.test(text)) fail(`${label} in ${rel(file)}`);
      }
      // Detect worksheet→scheda key corruption vs EN authority when counterpart exists
      if (file.endsWith(".json") && rel(file).startsWith("locales/it-IT/")) {
        const enFile = path.join(ROOT, "locales/en", path.basename(file));
        if (fs.existsSync(enFile)) {
          try {
            const itObj = JSON.parse(text);
            const enObj = JSON.parse(fs.readFileSync(enFile, "utf8"));
            const itLeaves = new Set(deepKeys(itObj).map((k) => k.split(".").pop()));
            const enLeaves = new Set(deepKeys(enObj).map((k) => k.split(".").pop()));
            for (const leaf of itLeaves) {
              if (/scheda didattica/i.test(leaf) && !enLeaves.has(leaf)) {
                fail(`corrupted locale key leaf '${leaf}' in ${rel(file)}`);
              }
            }
            for (const leaf of enLeaves) {
              if (/worksheet/i.test(leaf) && !itLeaves.has(leaf)) {
                // only fail if an it leaf looks like a mangled replacement of it
                const mangled = [...itLeaves].find((l) => /scheda didattica/i.test(l) && l.replace(/scheda didattica/gi, "worksheet").toLowerCase() === leaf.toLowerCase());
                if (mangled) fail(`locale key mangled ${leaf}→${mangled} in ${rel(file)}`);
                else if (!itLeaves.has(leaf)) fail(`locale missing EN key leaf '${leaf}' in ${rel(file)}`);
              }
            }
          } catch {
            /* parse covered elsewhere */
          }
        }
      }
    }
  }
}

// 10) Books: Grade N / Year N / 6ª primaria residual (all subjects)
{
  const bookFiles = walkFiles(path.join(ROOT, "docs/learning-book/it-IT"), (n) => n.endsWith(".md"));
  let gradeHits = 0;
  let sixth = 0;
  let yearHits = 0;
  const samples = [];
  for (const f of bookFiles) {
    const t = fs.readFileSync(f, "utf8");
    // title_english rows keep English authority titles (may include "Grade N")
    const prose = t
      .split(/\r?\n/)
      .filter((line) => !/\btitle_english\b/i.test(line))
      .join("\n");
    if (/\bGrade\s*[1-6]\b/.test(prose)) {
      gradeHits += 1;
      if (samples.length < 5) samples.push(rel(f));
    }
    if (/\bYear\s*[1-6]\b/.test(prose)) yearHits += 1;
    if (/\b6ª primaria\b/i.test(prose)) sixth += 1;
  }
  if (gradeHits) fail(`books still contain Grade N in ${gradeHits} files e.g. ${samples.join(", ")}`);
  if (yearHits) fail(`books still contain Year N in ${yearHits} files`);
  if (sixth) fail(`books contain 6ª primaria in ${sixth} files`);
}

// 11) Placeholder integrity sample on locales
{
  const enUi = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en/ui.json"), "utf8"));
  const itUi = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/it-IT/ui.json"), "utf8"));
  function ph(s) {
    return [...String(s).matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  }
  let phFail = 0;
  function walk(enNode, itNode, keyPath) {
    if (typeof enNode === "string" && typeof itNode === "string") {
      if (ph(enNode) !== ph(itNode)) {
        phFail += 1;
        if (phFail <= 5) fail(`placeholder mismatch ${keyPath}: en=${ph(enNode)} it=${ph(itNode)}`);
      }
      return;
    }
    if (enNode && typeof enNode === "object" && !Array.isArray(enNode)) {
      for (const k of Object.keys(enNode)) walk(enNode[k], itNode?.[k], `${keyPath}.${k}`);
    }
  }
  walk(enUi, itUi, "ui");
}

// 12) Word-meaning IDs must cover full WORD_LISTS (745) and include all EN gloss IDs
{
  const { WORD_LISTS } = await import(pathToFileURL(path.join(ROOT, "data/english-questions/word-lists.js")).href);
  const en = (await import(pathToFileURL(path.join(ROOT, "data/english-questions/word-meanings/en.js")).href))
    .WORD_MEANINGS_EN;
  const it = (await import(pathToFileURL(path.join(ROOT, "data/english-questions/word-meanings/it-IT.js")).href))
    .WORD_MEANINGS_IT_IT;
  let missing = 0;
  let total = 0;
  let orphans = 0;
  for (const [cat, words] of Object.entries(WORD_LISTS)) {
    for (const id of Object.keys(words)) {
      total += 1;
      if (typeof it[cat]?.[id] !== "string" || !it[cat][id].trim()) missing += 1;
    }
  }
  for (const [cat, words] of Object.entries(it)) {
    for (const id of Object.keys(words)) {
      if (!WORD_LISTS[cat]?.[id]) orphans += 1;
    }
  }
  if (total !== 745 || missing !== 0 || orphans !== 0) {
    fail(`word meanings vs WORD_LISTS total=${total} missing=${missing} orphans=${orphans}`);
  }
  for (const cat of Object.keys(en)) {
    for (const id of Object.keys(en[cat])) {
      if (typeof it[cat]?.[id] !== "string" || !it[cat][id].trim()) {
        fail(`word-meanings missing EN gloss id ${cat}.${id}`);
      }
    }
  }
}

// 13) Residual English ratio heuristic on child-facing common/worksheets (should be mostly Italian)
{
  const files = ["locales/it-IT/common.json", "locales/it-IT/worksheets.json", "locales/it-IT/learning.json"];
  for (const f of files) {
    const obj = JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
    const strings = collectStrings(obj).filter((s) => /[A-Za-zÀ-ÿ]/.test(s) && s.length > 12);
    let englishy = 0;
    for (const s of strings) {
      if (/\b(the|and|with|your|please|worksheet|grade|click here|try again)\b/i.test(s)) englishy += 1;
    }
    const ratio = strings.length ? englishy / strings.length : 0;
    if (ratio > 0.15) warn(`${f} englishy ratio ${(ratio * 100).toFixed(1)}% (${englishy}/${strings.length})`);
  }
}

console.log("=== it-IT offline verification ===");
console.log("failures", failures.length);
for (const f of failures) console.log("FAIL:", f);
console.log("warnings", warnings.length);
for (const w of warnings) console.log("WARN:", w);
if (failures.length) process.exit(1);
console.log("OK");
