import fs from "node:fs";
import path from "node:path";

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (/\.(json|js|md)$/.test(e.name)) a.push(p);
  }
  return a;
}

const checks = [];
function add(tag, f, line) {
  checks.push({ tag, f: f.replace(/\\/g, "/"), line: line.slice(0, 160) });
}

for (const f of [...walk("locales/nl-NL"), ...walk("content-packs/nl-NL"), ...walk("docs/learning-book/nl-NL").filter(() => false)]) {
  // books scanned separately for EN leakage
  void f;
}

const files = [
  ...walk("locales/nl-NL"),
  ...walk("content-packs/nl-NL"),
];

for (const f of files) {
  if (!f.endsWith(".json") && !f.endsWith(".js")) continue;
  const lines = fs.readFileSync(f, "utf8").split(/\n/);
  for (const line of lines) {
    if (/I'm |I am een/.test(line)) add("IM", f, line);
    if (/Helpen center/.test(line)) add("HELPEN", f, line);
    if (/\{groep\}/.test(line)) add("GROEP_PH", f, line);
    if (/plural,[^\n]*\bandere\b/.test(line)) add("ICU_ANDERE", f, line);
    if (/Alstublieft sign|Alstublieft enter|sign in as een|sign in opnieuw as/.test(line)) add("GATE", f, line);
    if (/Niet quite|Volgende question|learning hub|Manage leerlingen|Children op account|Sign in naar|Understand de|Step 1:/.test(line)) {
      add("SALAD", f, line);
    }
    if (/Groep ouders|een optionele antwoorden|elementaire leerlingen/.test(line)) add("PHRASE", f, line);
    if (/gradeTitle.: .Groep |gradeLabel.: .Groep \{grade\}/.test(line)) add("GRADE_BAD", f, line);
    if (/\bKies een cijfer\b|\bonderwerp\/cijfer\b|\bonderwerp, cijfer\b|het cijfer, de moeilijk/.test(line)) add("CIJFER", f, line);
    if (/\b(je|jij|jouw)\b/.test(line) && /\b(u|uw)\b/.test(line) && !/jullie/.test(line)) add("JE_U", f, line);
    if (/\bGroep\s*[12]\b/.test(line)) add("GROEP12", f, line);
    if (/writingInstructionTrace|writingInstructionColor/.test(line)) add("ORPHAN", f, line);
  }
}

const by = {};
for (const c of checks) by[c.tag] = (by[c.tag] || 0) + 1;
console.log(JSON.stringify(by, null, 2));
for (const tag of Object.keys(by).sort()) {
  console.log("\n==", tag, "==");
  for (const c of checks.filter((x) => x.tag === tag).slice(0, 15)) {
    console.log(c.f, "|", c.line.trim());
  }
}
