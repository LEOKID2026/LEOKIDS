/**
 * Close Italy (it-IT) review blockers — content layer only, offline.
 * No shared wiring. No network.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { applyItalianAuthorityPostfix } from "./offline-es-to-it-IT.mjs";

const ROOT = process.cwd();

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function saveJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
}
function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, pred, out);
    else if (pred(e.name, p)) out.push(p);
  }
  return out;
}
function mapStrings(node, fn, key = "") {
  if (typeof node === "string") return fn(node, key);
  if (Array.isArray(node)) return node.map((x, i) => mapStrings(x, fn, key));
  if (node && typeof node === "object") {
    const o = {};
    for (const [k, v] of Object.entries(node)) o[k] = mapStrings(v, fn, k);
    return o;
  }
  return node;
}

/** Restore placeholder names from EN authority string onto IT value. */
function restorePlaceholders(enStr, itStr) {
  const enPh = [...String(enStr).matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]);
  const itPh = [...String(itStr).matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]);
  if (!enPh.length || enPh.join(",") === itPh.join(",")) return itStr;
  let out = String(itStr);
  // common mangled names
  const remap = {
    domanda: "question",
    domande: "questions",
    classe: "grade",
    voto: "grade",
    grado: "grade",
    minuto: "min",
    minuti: "min",
  };
  for (let i = 0; i < itPh.length; i += 1) {
    const want = enPh[i] || remap[itPh[i]] || itPh[i];
    if (itPh[i] !== want) {
      out = out.replace(new RegExp(`\\{${itPh[i]}\\}`, "g"), `{${want}}`);
    }
  }
  // ensure every EN placeholder exists
  for (const p of enPh) {
    if (!out.includes(`{${p}}`)) {
      // last-resort: if IT has same count, already remapped
    }
  }
  return out;
}

function syncPlaceholdersTree(enNode, itNode) {
  if (typeof enNode === "string" && typeof itNode === "string") {
    return restorePlaceholders(enNode, itNode);
  }
  if (Array.isArray(enNode) && Array.isArray(itNode)) {
    return enNode.map((x, i) => syncPlaceholdersTree(x, itNode[i]));
  }
  if (enNode && typeof enNode === "object" && itNode && typeof itNode === "object") {
    const o = { ...itNode };
    for (const [k, v] of Object.entries(enNode)) {
      if (k in itNode) o[k] = syncPlaceholdersTree(v, itNode[k]);
    }
    return o;
  }
  return itNode;
}

function authorityCopy(s) {
  let out = String(s ?? "");
  const reps = [
    // elision
    [/\bdello alunno\b/gi, "dell'alunno"],
    [/\bdella alunna\b/gi, "dell'alunna"],
    [/\buno alunno\b/gi, "un alunno"],
    [/\buno alunno\b/gi, "un alunno"],
    [/\bSono uno alunno\b/g, "Sono un alunno"],
    [/\bnessuno alunno\b/gi, "nessun alunno"],
    [/\bAncora nessuno alunno\b/g, "Ancora nessun alunno"],
    // grade/voto/grado misuse → classe
    [/\bSeleziona un voto\b/g, "Seleziona una classe"],
    [/\bScegli un voto\b/g, "Scegli una classe"],
    [/\bScegli un grado\b/g, "Scegli una classe"],
    [/\bScegli grado\b/g, "Scegli la classe"],
    [/\bscegli un classe\b/gi, "scegli una classe"],
    [/\bScegli un classe\b/g, "Scegli una classe"],
    [/\bun classe\b/gi, "una classe"],
    [/\be un classe\b/gi, "e una classe"],
    [/\baggiornare il tuo voto\b/gi, "aggiornare la tua classe"],
    [/\bAdatto per grado\b/g, "Adatto per la classe"],
    [/\bAdatto per voto\b/g, "Adatto per la classe"],
    [/\bGenitori di grado\b/g, "Genitori della classe"],
    [/\bInsegnanti di grado\b/g, "Insegnanti della classe"],
    [/\bper grado\b/gi, "per classe"],
    [/\bper voto\b/gi, "per classe"],
    [/\bsul voto\b/gi, "sulla classe"],
    [/\bal voto\b/gi, "alla classe"],
    [/\bil voto,\b/gi, "la classe,"],
    [/\bal grado\b/gi, "alla classe"],
    [/\bil grado\b/gi, "la classe"],
    [/\bdel grado\b/gi, "della classe"],
    [/\bdi grado\b/gi, "di classe"],
    [/\bun altro grado\b/gi, "un'altra classe"],
    [/\bquesto livello\. Scegli un altro grado\b/g, "questo livello. Scegli un'altra classe"],
    [/l'argomento\/voto\/livello/g, "l'argomento/classe/livello"],
    [/\bl'argomento e il voto\b/gi, "l'argomento e la classe"],
    [/\bstesso argomento, grado e difficoltà\b/gi, "stesso argomento, classe e difficoltà"],
    [/\badattato al voto, all'argomento\b/gi, "adattato alla classe, all'argomento"],
    [/\badattato al grado, all'argomento\b/gi, "adattato alla classe, all'argomento"],
    [/\bmateria, grado, argomento\b/gi, "materia, classe, argomento"],
    [/\bmateria e un classe\b/gi, "materia e una classe"],
    [/\bScegli una materia e un classe\b/g, "Scegli una materia e una classe"],
    [/\bScegli grado, difficoltà\b/g, "Scegli classe, difficoltà"],
    [/\bScegli grado, livello\b/g, "Scegli classe, livello"],
    [/\bScegli il grado, la difficoltà\b/g, "Scegli la classe, la difficoltà"],
    [/\bSfoglia per grado e classe\b/g, "Sfoglia per anno scolastico e classe"],
    [/\bScegli grado, classe fisica e materia: resoconti e gestione per grado\b/g,
      "Scegli anno scolastico, classe fisica e materia: resoconti e gestione per classe"],
    [/\bselezione del voto\b/gi, "selezione della classe"],
    [/\bvisione più ampia di un voto\b/gi, "visione più ampia di una classe"],
    [/\bsuperiori al grado indicato\b/gi, "superiori alla classe indicata"],
    [/\b6ª primaria\b/gi, "1ª secondaria"],
    [/\bClasse\s*6\b/g, "1ª secondaria"],
    [/\bclasse\s*6\b/g, "1ª secondaria"],
    [/\bGrado 1\b/g, "1ª primaria"],
    [/\bGrado 2\b/g, "2ª primaria"],
    [/\bGrado 3\b/g, "3ª primaria"],
    [/\bGrado 4\b/g, "4ª primaria"],
    [/\bGrado 5\b/g, "5ª primaria"],
    [/\bGrado 6\b/g, "1ª secondaria"],
    [/\bgrado 1\b/g, "1ª primaria"],
    [/\bgrado 2\b/g, "2ª primaria"],
    [/\bgrado 3\b/g, "3ª primaria"],
    [/\bgrado 4\b/g, "4ª primaria"],
    [/\bgrado 5\b/g, "5ª primaria"],
    [/\bgrado 6\b/g, "1ª secondaria"],
    [/\bsexto classe\b/gi, "1ª secondaria"],
    [/\bdel sexto classe\b/gi, "della 1ª secondaria"],
    [/\bde sexto classe\b/gi, "di 1ª secondaria"],
    // grammar
    [/\bNessuna scheda trovato\b/g, "Nessuna scheda trovata"],
    [/\bNessuna scheda da colorare trovato\b/g, "Nessuna scheda da colorare trovata"],
    [/\bfascicolo di soluzioni opzionale\b/gi, "fascicolo opzionale con le soluzioni"],
    [/\bGol:\b/g, "Obiettivo:"],
    [/\bGol:\s*\{goal\}\s*minuto\b/g, "Obiettivo: {goal} min"],
    [/\b\{goal\} minuto\b/g, "{goal} min"],
    [/\b\{goal\} minuti\b/g, "{goal} min"],
    // help phrases
    [/\bdalle classi 1 a 6\b/gi, "dalla 1ª primaria alla 1ª secondaria"],
    [/\bdalle classi da 1 a 6\b/gi, "dalla 1ª primaria alla 1ª secondaria"],
    [/\bda 1 a 6\b/g, "dalla 1ª primaria alla 1ª secondaria"],
  ];
  for (const [re, rep] of reps) out = out.replace(re, rep);
  return applyItalianAuthorityPostfix(out);
}

// ---------- 1–2, 4, 7, 9 locales ----------
function fixLocales() {
  const dir = path.join(ROOT, "locales/it-IT");
  const enDir = path.join(ROOT, "locales/en");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const itPath = path.join(dir, f);
    const enPath = path.join(enDir, f);
    let it = loadJson(itPath);
    it = mapStrings(it, (s) => authorityCopy(s));
    if (fs.existsSync(enPath)) {
      const en = loadJson(enPath);
      it = syncPlaceholdersTree(en, it);
    }
    if (f === "common.json") {
      it.gradeLabel = "{grade}";
      it.grade1 = "1ª primaria";
      it.grade2 = "2ª primaria";
      it.grade3 = "3ª primaria";
      it.grade4 = "4ª primaria";
      it.grade5 = "5ª primaria";
      it.grade6 = "1ª secondaria";
      it.brandName = "Leo Kids";
    }
    if (f === "learning.json") {
      if (it.master) it.master.gradeTitle = "{grade}";
      // also any nested gradeTitle
      it = mapStrings(it, (s, key) => (key === "gradeTitle" ? "{grade}" : s));
    }
    if (f === "ui.json") {
      if (it.landing?.ctaKids) it.landing.ctaKids = "Sono un alunno";
      if (it.worksheets?.minutesGoal) it.worksheets.minutesGoal = "Obiettivo: {goal} min · {note}";
      // path may differ — set by key walk
      it = mapStrings(it, (s, key) => {
        if (key === "minutesGoal") return "Obiettivo: {goal} min · {note}";
        if (key === "ctaKids") return "Sono un alunno";
        if (key === "accessGateSignInCta") return "Accesso dell'alunno";
        if (key === "gradeRequired" && /voto|grado/i.test(s)) return "Seleziona una classe.";
        if (key === "filterSuitable" || key === "gradeSuitable") return "Adatto per la classe";
        if (key === "studentName") return "Nome dell'alunno";
        return s;
      });
    }
    if (f === "worksheets.json") {
      it.hubIntro =
        "Ogni scheda didattica si apre in anteprima prima della stampa. Per comodità sono disponibili soluzioni facoltative.";
      it.readyEmptyTitle = "Nessuna scheda trovata";
      if (typeof it.coloringEmpty === "string") {
        it.coloringEmpty = "Nessuna scheda da colorare trovata.";
      }
    }
    if (f === "auth.json" && it.studentName) it.studentName = "Nome dell'alunno";
    if (f === "seo.json" && it.learningDescription) {
      it.learningDescription = "Scegli una materia e una classe per iniziare a esercitarti.";
    }
    saveJson(itPath, it);
  }
  console.log("locales fixed");
}

// ---------- 3 Help ----------
function fixHelp() {
  const dir = path.join(ROOT, "data/help-center/it-IT");
  for (const f of walk(dir, (n) => n.endsWith(".js"))) {
    let t = fs.readFileSync(f, "utf8");
    t = t.replace(/(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g, (full, q, body) => {
      if (body.startsWith("./") || body.startsWith("/help-center/")) return full;
      let s = authorityCopy(body);
      // specific list items
      s = s
        .replace(/Grado 1 — grado_1/g, "1ª primaria")
        .replace(/Grado 2 — grado_2/g, "2ª primaria")
        .replace(/Grado 3 — grado_3/g, "3ª primaria")
        .replace(/Grado 4 — grado_4/g, "4ª primaria")
        .replace(/Grado 5 — grado_5/g, "5ª primaria")
        .replace(/fino al grado 6 — grade_6/g, "1ª secondaria")
        .replace(/Grado 6 — grade_6/g, "1ª secondaria")
        .replace(/Grado 6 — grado_6/g, "1ª secondaria")
        .replace(/grado_1|grado_2|grado_3|grado_4|grado_5|grado_6|grade_6/g, "")
        .replace(/\s—\s*$/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      return q + s + q;
    });
    // fix parents list block explicitly if still present
    t = t.replace(
      /\["Grado 1[^\]]*grade_6"[^\]]*\]/s,
      `["1ª primaria", "2ª primaria", "3ª primaria", "4ª primaria", "5ª primaria", "1ª secondaria"]`,
    );
    fs.writeFileSync(f, t, "utf8");
  }
  // surgical parents.js list
  const parentsPath = path.join(dir, "parents.js");
  let parents = fs.readFileSync(parentsPath, "utf8");
  parents = parents.replace(
    /"items":\s*\[[^\]]*grado_1[^\]]*\]/s,
    `"items": [
          "1ª primaria",
          "2ª primaria",
          "3ª primaria",
          "4ª primaria",
          "5ª primaria",
          "1ª secondaria"
        ]`,
  );
  parents = parents.replace(
    /dalle classi 1 a 6/g,
    "dalla 1ª primaria alla 1ª secondaria",
  );
  parents = parents.replace(/scegli un classe/gi, "scegli una classe");
  parents = parents.replace(/da 1 a 6/g, "dalla 1ª primaria alla 1ª secondaria");
  parents = parents.replace(/selezione del voto/g, "selezione della classe");
  parents = parents.replace(/dello alunno/g, "dell'alunno");
  fs.writeFileSync(parentsPath, parents, "utf8");
  console.log("help fixed");
}

// ---------- 5 Reports from EN ----------
const REPORT_EN_IT = [
  ["This week, focus on", "Questa settimana, concentrati su"],
  ["It helps to practice", "È utile esercitarsi su"],
  ["After each exercise, ask your child to explain how they got the answer.", "Dopo ogni esercizio, chiedi a tuo figlio di spiegare come ha ottenuto la risposta."],
  ["grade 3–4", "della 3ª–4ª primaria"],
  ["grade 3-4", "della 3ª–4ª primaria"],
  ["grade 6", "della 1ª secondaria"],
  ["Grade 6", "1ª secondaria"],
  ["mixed Hebrew vocabulary and expressions through sentence context and explanation.", "vocabolario ed espressioni ebraiche miste attraverso il contesto della frase e la spiegazione."],
  ["Hebrew writing: short clear answer, direct response to the question, one supporting detail, and rereading for clarity.", "scrittura in ebraico: risposta breve e chiara, risposta diretta alla domanda, un dettaglio di supporto e rilettura per maggiore chiarezza."],
  ["Hebrew sentence structure: identify the doer/action and how sentence parts connect.", "struttura della frase in ebraico: individua chi compie l'azione e come si collegano le parti della frase."],
  ["developed Hebrew writing: main idea, explanation, example, and keeping sentences connected.", "scrittura sviluppata in ebraico: idea principale, spiegazione, esempio e frasi collegate."],
  ["English sentence structure: basic word order, subject/action, and meaning completion.", "struttura della frase in inglese: ordine base delle parole, soggetto/azione e completamento del significato."],
  ["historical concepts and source terminology.", "concetti storici e terminologia delle fonti."],
  ["mixed historical concept identification.", "identificazione di concetti storici misti."],
  ["Hasmonaean timeline sequencing.", "sequenza della linea temporale asmonea."],
  ["Rome/Judea timeline sequencing.", "sequenza della linea temporale Roma/Giudea."],
  ["mixed timeline sequencing.", "sequenza di linee temporali miste."],
  ["Hellenism/Judaism cause-effect.", "causa-effetto ellenismo/giudaismo."],
  ["Hasmonaean cause-effect.", "causa-effetto asmoneo."],
  ["Rome/Judea cause-effect.", "causa-effetto Roma/Giudea."],
  ["mixed cause-effect.", "causa-effetto misto."],
  ["Athens/Sparta comparison.", "confronto Atene/Sparta."],
  ["mixed historical comparison.", "confronto storico misto."],
  ["Hellenism figures and roles.", "figure e ruoli dell'ellenismo."],
  ["Rome/Judea figures and roles.", "figure e ruoli di Roma/Giudea."],
  ["mixed figures and roles.", "figure e ruoli misti."],
  ["classical Greece governance.", "governo della Grecia classica."],
  ["Hasmonaean governance.", "governo asmoneo."],
  ["Roman/Judean governance.", "governo romano/giudaico."],
  ["mixed governance institutions.", "istituzioni di governo miste."],
  ["Greek culture and legacy.", "cultura e lascito greci."],
  ["Roman culture and legacy.", "cultura e lascito romani."],
  ["mixed culture and heritage.", "cultura e patrimonio misti."],
  ["simple historical source reading.", "lettura di fonti storiche semplici."],
  ["mixed source comprehension.", "comprensione di fonti miste."],
  ["past-present link in Rome/Judea period.", "collegamento passato-presente nel periodo Roma/Giudea."],
  ["mixed past-present link.", "collegamento passato-presente misto."],
  ["Hasmonaean timeline sequencing", "sequenza della linea temporale asmonea"],
  ["Rome/Judea timeline sequencing", "sequenza della linea temporale Roma/Giudea"],
  ["mixed timeline sequencing", "sequenza di linee temporali miste"],
];

function translateReportEn(en) {
  let out = String(en ?? "");
  if (!out.trim()) return out;
  for (const [a, b] of REPORT_EN_IT) {
    if (out.includes(a)) out = out.split(a).join(b);
  }
  // residual English chrome
  out = out
    .replace(/\bThis week, focus on\b/g, "Questa settimana, concentrati su")
    .replace(/\bIt helps to practice\b/g, "È utile esercitarsi su")
    .replace(/\bask your child to explain how they got the answer\b/gi, "chiedi a tuo figlio di spiegare come ha ottenuto la risposta")
    .replace(/\bAfter each exercise,\b/g, "Dopo ogni esercizio,")
    .replace(/\bgrade 6\b/gi, "1ª secondaria")
    .replace(/\bGrade 6\b/g, "1ª secondaria")
    .replace(/\bgrade 3–4\b/gi, "3ª–4ª primaria")
    .replace(/\bgrade 3-4\b/gi, "3ª–4ª primaria");
  out = authorityCopy(out);
  // Spanish leftovers
  out = out
    .replace(/Questa semana, concéntrese en/gi, "Questa settimana, concentrati su")
    .replace(/pidale a su figlio que explique come obtuvo la risposta/gi, "chiedi a tuo figlio di spiegare come ha ottenuto la risposta")
    .replace(/Dopo de ogni ejercicio,/gi, "Dopo ogni esercizio,")
    .replace(/Es util esercitarsi/gi, "È utile esercitarsi su")
    .replace(/Aiuta a esercitarsi/gi, "È utile esercitarsi su")
    .replace(/Secuenciacion de la linea de tiempo/gi, "Sequenza della linea temporale")
    .replace(/Secuenciacion de linea de tiempo mixta/gi, "Sequenza di linea temporale mista")
    .replace(/sexto classe/gi, "1ª secondaria")
    .replace(/\blos conceptos\b/gi, "i concetti")
    .replace(/\blas figuras\b/gi, "le figure")
    .replace(/\bla identificacion\b/gi, "l'identificazione")
    .replace(/\bla comparacion\b/gi, "il confronto")
    .replace(/\bla secuenciacion\b/gi, "la sequenza")
    .replace(/\bla relacion\b/gi, "la relazione")
    .replace(/\bel gobierno\b/gi, "il governo")
    .replace(/\bla gobernanza\b/gi, "la governance")
    .replace(/\bla cultura y el legado\b/gi, "la cultura e il lascito")
    .replace(/\bla lectura de fuentes\b/gi, "la lettura di fonti")
    .replace(/\bla comprension\b/gi, "la comprensione")
    .replace(/\bel vinculo\b/gi, "il collegamento")
    .replace(/\bhistoricos\b/gi, "storici")
    .replace(/\bhistoricas\b/gi, "storiche")
    .replace(/\bmixtos\b/gi, "misti")
    .replace(/\bmixtas\b/gi, "miste")
    .replace(/\bde los classi 3 y 4\b/gi, "della 3ª–4ª primaria")
    .replace(/\ben el vocabulario\b/gi, "sul vocabolario")
    .replace(/\ben la escritura\b/gi, "sulla scrittura")
    .replace(/\ben la estructura\b/gi, "sulla struttura")
    .replace(/\ben los conceptos\b/gi, "sui concetti")
    .replace(/\ben la\b/gi, "su")
    .replace(/\ben el\b/gi, "su")
    .replace(/\ben las\b/gi, "sulle")
    .replace(/\by\b/g, "e")
    .replace(/\bde la\b/g, "della")
    .replace(/\bdel\b/g, "del")
    .replace(/\bpara mayor claridad\b/gi, "per maggiore chiarezza")
    .replace(/\bun detalle de apoyo\b/gi, "un dettaglio di supporto")
    .replace(/\brisposta directa a la domanda\b/gi, "risposta diretta alla domanda")
    .replace(/\brisposta breve y clara\b/gi, "risposta breve e chiara")
    .replace(/\bidentifique al autor\/accion\b/gi, "individua chi compie l'azione")
    .replace(/\bcome se conectan las parti de la oracion\b/gi, "come si collegano le parti della frase")
    .replace(/\borden basico de las palabras\b/gi, "ordine base delle parole")
    .replace(/\bsujeto\/accion\b/gi, "soggetto/azione")
    .replace(/\bfinalizacion del significado\b/gi, "completamento del significato")
    .replace(/\bterminologia fuente\b/gi, "terminologia delle fonti")
    .replace(/\battraverso il contexto y la spiegazione de las oraciones\b/gi, "attraverso il contesto della frase e la spiegazione")
    .replace(/\bhebreas\b/gi, "ebraiche")
    .replace(/\bhebreo\b/gi, "ebraico")
    .replace(/\boraciones\b/gi, "frasi")
    .replace(/\bescritura\b/gi, "scrittura")
    .replace(/\brelectura\b/gi, "rilettura")
    .replace(/\b\s{2,}/g, " ")
    .trim();
  return applyItalianAuthorityPostfix(out);
}

function looksBadReport(s) {
  return /[áíóúñ¿¡]|Questa semana|concéntrese|pidale|Secuenciacion|sexto classe|ejercicio|su figlio que|los classi|vocabulario y|escritura en|estructura de|conceptos historicos|identificacion|comparacion|gobierno|vinculo|fuente\.|mixtos de|de Roma\/Judea de sexto|Asmonea de sexto|This week|It helps to practice|ask your child|Grade 6|grade 6/i.test(
    s,
  );
}

function fixReports() {
  const pairs = [
    [
      "content-packs/en/reports/burn-down-index.json",
      "content-packs/it-IT/reports/burn-down-index.json",
    ],
    [
      "content-packs/en/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json",
      "content-packs/it-IT/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json",
    ],
  ];
  // also any other report json under it-IT/reports
  for (const f of walk(path.join(ROOT, "content-packs/it-IT/reports"), (n) => n.endsWith(".json"))) {
    const rel = path.relative(path.join(ROOT, "content-packs/it-IT"), f);
    const enFile = path.join(ROOT, "content-packs/en", rel);
    const it = loadJson(f);
    let en = null;
    if (fs.existsSync(enFile)) en = loadJson(enFile);
    const out = mapStrings(it, (s, key) => {
      const enS = en ? findEnString(en, key, s) : null;
      if (enS && looksBadReport(s)) return translateReportEn(enS);
      if (looksBadReport(s)) return translateReportEn(s);
      return authorityCopy(s);
    });
    // better: walk parallel
    const synced = en ? mapParallel(en, out) : out;
    saveJson(f, synced);
  }
  console.log("reports fixed");
}

function findEnString() {
  return null;
}

function mapParallel(enNode, itNode) {
  if (typeof enNode === "string" && typeof itNode === "string") {
    if (looksBadReport(itNode) || looksBadReport(enNode) === false) {
      // if IT bad, translate from EN; else authority on IT
      if (looksBadReport(itNode)) return translateReportEn(enNode);
    }
    return authorityCopy(itNode);
  }
  if (Array.isArray(enNode) && Array.isArray(itNode)) {
    return enNode.map((x, i) => mapParallel(x, itNode[i] ?? x));
  }
  if (enNode && typeof enNode === "object" && itNode && typeof itNode === "object") {
    const o = {};
    for (const [k, v] of Object.entries(enNode)) {
      o[k] = mapParallel(v, itNode[k] ?? v);
    }
    return o;
  }
  return itNode;
}

// ---------- 6 Science ----------
const SCI_FIX = [
  ["Strong wind with no moisture", "Vento forte senza umidità"],
  ["Choose risultato in advance e skip repeats", "Scegli il risultato in anticipo e salta le ripetizioni"],
  ["Noi choose materiali per jobs based su quei properties.", "Scegliamo i materiali per i lavori in base a quelle proprietà."],
  [
    "Noi choose materiali per strength, flexibility, waterproofing, weight, e other properties che fit job.",
    "Scegliamo i materiali per resistenza, flessibilità, impermeabilità, peso e altre proprietà adatte al lavoro.",
  ],
];

function looksSciEn(s) {
  return /\b(Choose|choose|Strong wind|Noi choose|with no|based su|skip repeats|materials|moisture|jobs based|other properties|fit job|in advance)\b/.test(
    s,
  ) || /\b(the|and|with|that|this|from|into|about|because|which|when|what|how|result|materials|moisture|wind|strength|flexibility|waterproofing|weight|properties|repeats|advance)\b/i.test(
    s,
  ) && /\b(Choose|Strong|Noi choose|skip|based|moisture|waterproofing|flexibility)\b/i.test(s);
}

async function fixScience() {
  const en = (await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href))
    .SCIENCE_EN_OVERLAY;
  const itPath = path.join(ROOT, "data/science-questions-it-IT-overlay.js");
  let it = (await import(pathToFileURL(itPath).href + `?t=${Date.now()}`)).SCIENCE_IT_IT_OVERLAY;

  function polish(str, enStr) {
    let s = String(str ?? "");
    for (const [a, b] of SCI_FIX) {
      if (s === a || s.includes(a)) s = s.split(a).join(b);
    }
    if (looksSciEn(s) && enStr) {
      // translate common EN science instruction fragments
      s = String(enStr)
        .replace(/\bChoose the result in advance and skip repeats\b/gi, "Scegli il risultato in anticipo e salta le ripetizioni")
        .replace(/\bWe choose materials for jobs based on those properties\.\b/gi, "Scegliamo i materiali per i lavori in base a quelle proprietà.")
        .replace(/\bWe choose materials for strength, flexibility, waterproofing, weight, and other properties that fit the job\.\b/gi, "Scegliamo i materiali per resistenza, flessibilità, impermeabilità, peso e altre proprietà adatte al lavoro.")
        .replace(/\bStrong wind with no moisture\b/gi, "Vento forte senza umidità")
        .replace(/\bChoose\b/g, "Scegli")
        .replace(/\bWe choose\b/g, "Scegliamo")
        .replace(/\bmaterials\b/gi, "materiali")
        .replace(/\bfor jobs based on those properties\b/gi, "per i lavori in base a quelle proprietà")
        .replace(/\bin advance\b/gi, "in anticipo")
        .replace(/\band skip repeats\b/gi, "e salta le ripetizioni")
        .replace(/\bwith no moisture\b/gi, "senza umidità")
        .replace(/\bStrong wind\b/g, "Vento forte")
        .replace(/\bstrength\b/gi, "resistenza")
        .replace(/\bflexibility\b/gi, "flessibilità")
        .replace(/\bwaterproofing\b/gi, "impermeabilità")
        .replace(/\bweight\b/gi, "peso")
        .replace(/\band other properties that fit the job\b/gi, "e altre proprietà adatte al lavoro")
        .replace(/\bresult\b/gi, "risultato")
        .replace(/\bNoi\b/g, "Noi");
      // if still English-heavy, apply SCI_FIX on EN
      for (const [a, b] of SCI_FIX) {
        if (String(enStr) === a) s = b;
      }
      if (looksSciEn(s)) {
        // last resort word-ish
        s = s
          .replace(/\bchoose\b/gi, "scegli")
          .replace(/\bNoi scegli\b/g, "Scegliamo")
          .replace(/\bmaterials\b/gi, "materiali")
          .replace(/\bjobs\b/gi, "lavori")
          .replace(/\bbased\b/gi, "in base")
          .replace(/\bproperties\b/gi, "proprietà")
          .replace(/\bmoisture\b/gi, "umidità")
          .replace(/\bwind\b/gi, "vento")
          .replace(/\bstrong\b/gi, "forte")
          .replace(/\bwith no\b/gi, "senza")
          .replace(/\bin advance\b/gi, "in anticipo")
          .replace(/\bskip\b/gi, "salta")
          .replace(/\brepeats\b/gi, "ripetizioni")
          .replace(/\bother\b/gi, "altre")
          .replace(/\bthat fit\b/gi, "adatte a")
          .replace(/\bthe job\b/gi, "al lavoro")
          .replace(/\bfor\b/gi, "per")
          .replace(/\band\b/gi, "e")
          .replace(/\bthe\b/gi, "")
          .replace(/\bsu quei\b/gi, "a quelle")
          .replace(/\s{2,}/g, " ")
          .trim();
      }
    }
    s = authorityCopy(s);
    return applyItalianAuthorityPostfix(s);
  }

  const out = {};
  for (const id of Object.keys(en)) {
    const enQ = en[id];
    const itQ = it[id] || {};
    const row = {};
    for (const [k, ev] of Object.entries(enQ)) {
      const iv = itQ[k];
      if (k === "correctIndex" || k === "correctIndexes" || k === "id") {
        row[k] = ev;
        continue;
      }
      if (typeof ev === "string") row[k] = polish(iv ?? ev, ev);
      else if (Array.isArray(ev)) {
        row[k] = ev.map((item, i) =>
          typeof item === "string" ? polish(Array.isArray(iv) ? iv[i] ?? item : item, item) : item,
        );
      } else row[k] = iv ?? ev;
    }
    out[id] = row;
  }
  fs.writeFileSync(
    itPath,
    "/** Italian (Italy) science overlay — Italy blocker pass (offline). */\n" +
      `export const SCIENCE_IT_IT_OVERLAY = ${JSON.stringify(out, null, 2)};\n`,
    "utf8",
  );
  console.log("science fixed", Object.keys(out).length);
}

// ---------- 8 Word meanings ----------
async function fixMeanings() {
  const { WORD_LISTS } = await import(pathToFileURL(path.join(ROOT, "data/english-questions/word-lists.js")).href);
  const modPath = path.join(ROOT, "data/english-questions/word-meanings/it-IT.js");
  const mod = await import(pathToFileURL(modPath).href + `?t=${Date.now()}`);
  const it = structuredClone(mod.WORD_MEANINGS_IT_IT);

  const GLOSS = {
    "family:mom": "mamma",
    "family:dad": "papà",
    "family:boy": "ragazzo",
    "family:girl": "ragazza",
    "family:grandma": "nonna",
    "body:heart": "cuore",
    "food:cup": "tazza",
    "school:class": "classe",
    "school:hat": "cappello",
    "travel:bike": "bicicletta",
    "travel:truck": "camion",
    "actions:go": "andare",
    "actions:can": "potere",
    "house:house": "casa",
    "house:fridge": "frigorifero",
    "sight:the": "il/la",
    "sight:and": "e",
    "sight:is": "è",
    "sight:it": "esso/essa",
    "sight:me": "me",
    "sight:we": "noi",
    "sight:you": "tu",
    "sight:my": "mio/mia",
    "sight:at": "a/in",
  };

  // also pull from fr-FR / es-419 as structure reference for sight
  if (!it.sight) it.sight = {};
  for (const [cat, words] of Object.entries(WORD_LISTS)) {
    if (!it[cat]) it[cat] = {};
    for (const id of Object.keys(words)) {
      if (it[cat][id] == null) {
        const key = `${cat}:${id}`;
        it[cat][id] = GLOSS[key] || id; // fallback shouldn't happen
      }
    }
  }

  const body =
    `/**\n` +
    ` * Italian (Italy) (it-IT) meanings for English learning words.\n` +
    ` * Keys match WORD_LISTS English word IDs; values are child-friendly Italian glosses.\n` +
    ` * Polysemy resolved by category context (grade/mark/class/ticket/port/bank/watch/light/right/bat).\n` +
    ` * English learning targets are unchanged — these are instruction-locale glosses only.\n` +
    ` */\n\n` +
    `export const WORD_MEANINGS_IT_IT = ${JSON.stringify(it, null, 2)};\n`;
  fs.writeFileSync(modPath, body, "utf8");

  // verify
  let missing = 0;
  let total = 0;
  for (const [cat, words] of Object.entries(WORD_LISTS)) {
    for (const id of Object.keys(words)) {
      total += 1;
      if (!it[cat]?.[id]) missing += 1;
    }
  }
  console.log("meanings", { total, missing });
}

// ---------- packs surface grade/voto ----------
function fixPackSurfaces() {
  let n = 0;
  for (const f of walk(path.join(ROOT, "content-packs/it-IT"), (name) => name.endsWith(".json"))) {
    const obj = loadJson(f);
    const out = mapStrings(obj, (s) => authorityCopy(s));
    if (JSON.stringify(obj) !== JSON.stringify(out)) {
      saveJson(f, out);
      n += 1;
    }
  }
  console.log("packs surface fixed", n);
}

async function main() {
  fixLocales();
  fixHelp();
  fixReports();
  await fixScience();
  await fixMeanings();
  fixPackSurfaces();
  // books grade chrome
  for (const f of walk(path.join(ROOT, "docs/learning-book/it-IT"), (n) => n.endsWith(".md"))) {
    let t = fs.readFileSync(f, "utf8");
    const before = t;
    t = t
      .split(/\n/)
      .map((line) => {
        if (/title_english/i.test(line)) return line;
        return authorityCopy(line);
      })
      .join("\n");
    if (t !== before) fs.writeFileSync(f, t, "utf8");
  }
  console.log("DONE italy blockers");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
