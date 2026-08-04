/**
 * Post-pass polish for nl-NL content: terminology + English instructional leakage.
 * Run after generate-nl-NL-layer.mjs
 *
 * node scripts/i18n/_polish-nl-NL-layer.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const REPLACEMENTS = [
  // Grades / subjects / roles
  [/\bGrade\s*1\b/g, "Groep 3"],
  [/\bGrade\s*2\b/g, "Groep 4"],
  [/\bGrade\s*3\b/g, "Groep 5"],
  [/\bGrade\s*4\b/g, "Groep 6"],
  [/\bGrade\s*5\b/g, "Groep 7"],
  [/\bGrade\s*6\b/g, "Groep 8"],
  [/\bYear\s*1\b/g, "Groep 3"],
  [/\bYear\s*2\b/g, "Groep 4"],
  [/\bYear\s*3\b/g, "Groep 5"],
  [/\bYear\s*4\b/g, "Groep 6"],
  [/\bYear\s*5\b/g, "Groep 7"],
  [/\bYear\s*6\b/g, "Groep 8"],
  [/\bWiskunde\b/g, "Rekenen"],
  [/\bwiskunde\b/g, "rekenen"],
  [/\bAll grades\b/g, "Alle groepen"],
  [/\bSelect a grade\b/g, "Kies een groep"],
  [/\bChoose grade\b/g, "Kies een groep"],
  // Worksheets
  [/\bPrintable worksheets\b/gi, "Afdrukbare werkbladen"],
  [/\bPrintable werkbladen\b/g, "Afdrukbare werkbladen"],
  [/\bprintable werkblad\b/gi, "afdrukbaar werkblad"],
  [/\bReady-to-print\b/gi, "Kant-en-klaar om af te drukken"],
  [/\bReady-naar-print\b/g, "Kant-en-klaar om af te drukken"],
  [/\bReady naar print\b/g, "Kant-en-klaar om af te drukken"],
  [/\bready sheets\b/gi, "kant-en-klare bladen"],
  [/\bAnswer key\b/g, "Antwoorden"],
  [/\bantwoordsleutel\b/g, "antwoorden"],
  [/\bAntwoordsleutel\b/g, "Antwoorden"],
  [/\bspreadsheet\b/gi, "werkblad"],
  [/\brekenblad\b/gi, "werkblad"],
  // Mixed EN leftovers (phrase-level only — avoid bare word smash)
  [/\bNumber van questions\b/g, "Aantal vragen"],
  [/\bGeen answers op de werkblad page\b/g, "Geen antwoorden op de werkbladpagina"],
  [/\bInclude antwoorden\b/g, "Antwoorden opnemen"],
  [/\bAlle subjects\b/g, "Alle vakken"],
  [/\bAlle levels\b/g, "Alle niveaus"],
  [/\bSelecteer een child\b/g, "Selecteer een kind"],
  [/\bGeen children linked naar dit account\b/g, "Geen kinderen gekoppeld aan dit account"],
  [/\bGeen recommendations yet\b/g, "Nog geen aanbevelingen"],
  [/\bRecommendations van practice\b/g, "Aanbevelingen uit oefenen"],
  [/\bRecommendations uit oefenen\b/g, "Aanbevelingen uit oefenen"],
  [/\bVan practice\b/g, "Uit oefenen"],
  [/\bCreate een new werkblad\b/g, "Maak een nieuw werkblad"],
  [/\bCreating werkblad…\b/g, "Werkblad wordt gemaakt…"],
  [/\bCreate van recommendation\b/g, "Maken vanuit aanbeveling"],
  [/\bTry de werkblad generator\b/g, "Probeer de werkbladgenerator"],
  [/\bCreate demo werkblad\b/g, "Maak demowerkblad"],
  [/\bWerkblad preview\b/g, "Voorbeeld van werkblad"],
  [/\bGo naar kids world\b/gi, "Ga naar de kinderwereld"],
  [/\bquota reached\b/gi, "quotum bereikt"],
  [/\bfrom practice\b/gi, "uit oefenen"],
  [/\bvan practice\b/g, "uit oefenen"],
  [/\blinked naar\b/g, "gekoppeld aan"],
  [/\bSelecteer alle topics\b/g, "Selecteer alle onderwerpen"],
  [/\bGeen sheets found\b/g, "Geen bladen gevonden"],
  [/\bOefenen type\b/g, "Oefentype"],
  // Roles (word-boundary)
  [/\bstudents\b/g, "leerlingen"],
  [/\bStudents\b/g, "Leerlingen"],
  [/\bstudent\b/g, "leerling"],
  [/\bStudent\b/g, "Leerling"],
  [/\bteachers\b/g, "leerkrachten"],
  [/\bTeachers\b/g, "Leerkrachten"],
  [/\bteacher\b/g, "leerkracht"],
  [/\bTeacher\b/g, "Leerkracht"],
  // Flemish / other
  [/\bgoesting\b/gi, "zin"],
  [/\bhesp\b/gi, "ham"],
  [/\bplezant\b/gi, "leuk"],
  [/\bamai[!?.]?\b/gi, ""],
  [/\bLoading……\b/g, "Laden…"],
  [/\bLaden……\b/g, "Laden…"],
  [/Leo Kids/g, "Leo Kids"],
];

function walk(dir, pred, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, pred, files);
    else if (pred(ent.name)) files.push(p);
  }
  return files;
}

function polishText(s) {
  let out = String(s);
  for (const [re, rep] of REPLACEMENTS) out = out.replace(re, rep);
  return out.replace(/\s{2,}/g, " ").replace(/\s+([,.!?])/g, "$1");
}

function polishJsonValue(node) {
  if (typeof node === "string") return polishText(node);
  if (Array.isArray(node)) return node.map(polishJsonValue);
  if (node && typeof node === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      // Keep structural keys
      if (
        [
          "id",
          "slug",
          "href",
          "src",
          "path",
          "route",
          "url",
          "key",
          "code",
          "type",
          "kind",
          "correctIndex",
        ].includes(k)
      ) {
        out[k] = v;
      } else {
        out[k] = polishJsonValue(v);
      }
    }
    return out;
  }
  return node;
}

function polishJsonFile(file) {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const polished = polishJsonValue(raw);
  fs.writeFileSync(file, `${JSON.stringify(polished, null, 2)}\n`, "utf8");
}

async function polishJsModuleStrings(file) {
  const href = pathToFileURL(file).href + `?t=${Date.now()}`;
  const mod = await import(href);
  const exportName = Object.keys(mod).find((k) => k !== "default") || "default";
  const value = mod[exportName] ?? mod.default;
  if (value == null) return;
  const polished = polishJsonValue(value);
  const header = fs.readFileSync(file, "utf8").split("\n")[0].startsWith("/**")
    ? fs.readFileSync(file, "utf8").match(/^\/\*\*[\s\S]*?\*\/\s*/)?.[0] || ""
    : "";
  // Preserve index.js hand structure
  if (path.basename(file) === "index.js") return;
  const body = `${header}export const ${exportName} = ${JSON.stringify(polished, null, 2)};\n`;
  fs.writeFileSync(file, body, "utf8");
}

function polishMdFile(file) {
  // Skip protecting English subject learning targets inside english/
  const rel = file.replace(/\\/g, "/");
  const isEnglishSubject = rel.includes("/learning-book/nl-NL/english/");
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const out = lines.map((line) => {
    if (isEnglishSubject && !/^#{1,6}\s+/.test(line)) return line;
    if (/^\|\s*\*\*/.test(line) || line.trim().startsWith("```")) return line;
    return polishText(line);
  });
  fs.writeFileSync(file, out.join("\n"), "utf8");
}

async function main() {
  let n = 0;
  for (const f of walk(path.join(ROOT, "locales/nl-NL"), (name) => name.endsWith(".json"))) {
    polishJsonFile(f);
    n++;
  }
  for (const f of walk(path.join(ROOT, "content-packs/nl-NL"), (name) => name.endsWith(".json"))) {
    polishJsonFile(f);
    n++;
  }
  const sci = path.join(ROOT, "data/science-questions-nl-NL-overlay.js");
  if (fs.existsSync(sci)) {
    await polishJsModuleStrings(sci);
    n++;
  }
  for (const f of walk(path.join(ROOT, "data/help-center/nl-NL"), (name) => name.endsWith(".js"))) {
    if (path.basename(f) === "index.js") continue;
    await polishJsModuleStrings(f);
    n++;
  }
  for (const f of walk(path.join(ROOT, "docs/learning-book/nl-NL"), (name) => name.endsWith(".md"))) {
    polishMdFile(f);
    n++;
  }

  // Critical worksheets keys — force authority terms
  const wsPath = path.join(ROOT, "locales/nl-NL/worksheets.json");
  if (fs.existsSync(wsPath)) {
    const ws = JSON.parse(fs.readFileSync(wsPath, "utf8"));
    Object.assign(ws, {
      hubTitle: "Afdrukbare werkbladen",
      tabReady: "Kant-en-klaar om af te drukken",
      tabGenerator: "Werkblad maken",
      print: "Afdrukken",
      preview: "Voorbeeld",
      answerKey: "Antwoorden",
      answerKeyTitle: "Antwoorden",
      subjectMath: "Rekenen",
      subjectGeometry: "Meetkunde",
      subjectEnglish: "Engels",
      gradeFilterAll: "Alle groepen",
      gradeG1: "Groep 3",
      gradeG2: "Groep 4",
      gradeG3: "Groep 5",
      gradeG4: "Groep 6",
      gradeG5: "Groep 7",
      gradeG6: "Groep 8",
      createWorksheet: "Werkblad maken",
      publicReadyTitle: "Kant-en-klare werkbladen per groep",
      selectGrade: "Groep",
      writingInstructionIndependent: "Schrijf",
      writingInstructionTrace: "Trek over",
      writingInstructionColor: "Kleur",
    });
    fs.writeFileSync(wsPath, `${JSON.stringify(ws, null, 2)}\n`, "utf8");
  }

  const commonPath = path.join(ROOT, "locales/nl-NL/common.json");
  if (fs.existsSync(commonPath)) {
    const c = JSON.parse(fs.readFileSync(commonPath, "utf8"));
    Object.assign(c, {
      subjectMath: "Rekenen",
      subjectGeometry: "Meetkunde",
      subjectEnglish: "Engels",
      subjectScience: "Natuur en techniek",
      grade1: "Groep 3",
      grade2: "Groep 4",
      grade3: "Groep 5",
      grade4: "Groep 6",
      grade5: "Groep 7",
      grade6: "Groep 8",
      gradeLabel: "Groep {grade}",
      brandName: "Leo Kids",
    });
    fs.writeFileSync(commonPath, `${JSON.stringify(c, null, 2)}\n`, "utf8");
  }

  console.log("Polished files touched (approx walk count):", n);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
