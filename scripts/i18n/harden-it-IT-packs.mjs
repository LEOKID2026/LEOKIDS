/**
 * Offline: rebuild it-IT pack string values from EN authority + cache + ES bridge.
 * Prefer EN→IT cache / EN phrase translation over raw Spanish leftovers.
 * No network / no API agents.
 *
 * Run: node scripts/i18n/harden-it-IT-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  applyItalianAuthorityPostfix,
  esToIt,
  resolveItString,
} from "./offline-es-to-it-IT.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CACHE = JSON.parse(
  fs.readFileSync(path.join(__dirname, "_mt-cache-it-IT.json"), "utf8"),
);

const SKIP_KEYS = new Set([
  "id",
  "ids",
  "skillId",
  "pageType",
  "learningPageId",
  "learningLanguage",
  "gameId",
  "subjectId",
  "topicId",
  "slug",
  "href",
  "src",
  "path",
  "route",
  "url",
  "icon",
  "image",
  "imageSrc",
  "asset",
  "assetPath",
  "font",
  "ttf",
  "locale",
  "localeId",
  "contentLocale",
  "enum",
  "key",
  "code",
  "type",
  "kind",
  "status",
  "namespace",
  "version",
  "sha",
  "hash",
  "color",
  "bg",
  "background",
  "className",
  "component",
  "file",
  "filename",
  "ext",
  "mime",
  "doNotTranslateFields",
]);

/** Longer first — EN UI chrome → IT */
const EN_IT = [
  ["What are we learning?", "Cosa stiamo imparando?"],
  ["Simple explanation", "Spiegazione semplice"],
  ["Visual / concrete example", "Esempio concreto"],
  ["Let's solve together", "Risolviamo insieme"],
  ["Try it yourself", "Prova tu"],
  ["Common mistake — watch out!", "Errore comune — attenzione!"],
  ["Let's check together", "Controlliamo insieme"],
  ["Let's practice!", "Esercitiamoci!"],
  ["Let's practice now", "Esercitiamoci ora"],
  ["Table of contents", "Indice"],
  ["Pick a topic and read page by page", "Scegli un argomento e leggi pagina per pagina"],
  ["Back to Geometry", "Torna a Geometria"],
  ["Back to Science", "Torna a Scienze"],
  ["Back to English", "Torna a Inglese"],
  ["Back to Math", "Torna a Matematica"],
  ["Coming soon", "Prossimamente"],
  ["We'll practice this Geometry topic next", "Poi eserciteremo questo argomento di Geometria"],
  ["We'll practice this Science topic next", "Poi eserciteremo questo argomento di Scienze"],
  ["We'll practice this English topic next", "Poi eserciteremo questo argomento di Inglese"],
  ["We'll practice this Math topic next", "Poi eserciteremo questo argomento di Matematica"],
  ["Loading audio...", "Caricamento audio…"],
  ["Listen to this page", "Ascolta questa pagina"],
  ["Unable to load audio right now", "Impossibile caricare l'audio ora"],
  ["Back to the book home page", "← Torna alla copertina del libro"],
  ["No content to show on this page.", "Nessun contenuto da mostrare in questa pagina."],
  ["Page navigation within this topic", "Navigazione delle pagine in questo argomento"],
  ["Topic navigation", "Navigazione degli argomenti"],
  ["Page {current} of {total}", "Pagina {current} di {total}"],
  ["Previous page", "Pagina precedente"],
  ["Next page", "Pagina successiva"],
  ["Previous topic", "Argomento precedente"],
  ["Next topic", "Argomento successivo"],
  ["Page {number}", "Pagina {number}"],
  ["Watch out!", "Attenzione!"],
  ["Right angle", "Angolo retto"],
  ["Line of symmetry", "Asse di simmetria"],
  ["Parallel lines", "Rette parallele"],
  ["Place-value chart", "Tabella del valore posizionale"],
  ["Unknown geometry diagram", "Diagramma di geometria sconosciuto"],
  ["Answer key", "Soluzioni"],
  ["Worksheets", "Schede didattiche"],
  ["Worksheet", "Scheda didattica"],
  ["Choose grade", "Scegli la classe"],
  ["All grades", "Tutte le classi"],
  ["Try again", "Riprova"],
  ["Grade 1", "1ª primaria"],
  ["Grade 2", "2ª primaria"],
  ["Grade 3", "3ª primaria"],
  ["Grade 4", "4ª primaria"],
  ["Grade 5", "5ª primaria"],
  ["Grade 6", "1ª secondaria"],
  ["Student", "Alunno"],
  ["Students", "Alunni"],
  ["Teacher", "Insegnante"],
  ["Parent", "Genitore"],
  ["Parents", "Genitori"],
  ["Preview", "Anteprima"],
  ["Print", "Stampa"],
  ["Close", "Chiudi"],
  ["Resume", "Riprendi"],
  ["Stop", "Ferma"],
  ["Playing", "In riproduzione"],
  ["Loading...", "Caricamento…"],
  ["Loading…", "Caricamento…"],
  ["Example", "Esempio"],
  ["Side", "Lato"],
  ["Vertex", "Vertice"],
  ["Angle", "Angolo"],
  ["Length", "Lunghezza"],
  ["Width", "Larghezza"],
  ["Height", "Altezza"],
  ["Perimeter", "Perimetro"],
  ["Area", "Area"],
  ["Radius", "Raggio"],
  ["Diameter", "Diametro"],
  ["Base", "Base"],
  ["Math", "Matematica"],
  ["Geometry", "Geometria"],
  ["Science", "Scienze"],
  ["English", "Inglese"],
];

/** Extra Spanish UI leftovers → Italian */
const ES_UI = [
  ["Qué aprendemos", "Cosa stiamo imparando?"],
  ["Qué aprendemos?", "Cosa stiamo imparando?"],
  ["Inténtalo tu", "Prova tu"],
  ["Inténtalo de nuevo", "Riprova"],
  ["Inténtalo de nuovo", "Riprova"],
  ["Volver a", "Torna a"],
  ["Volver a la portada del libro", "Torna alla copertina del libro"],
  ["Practicaremos", "Eserciteremo"],
  ["Practiquemos", "Esercitiamoci"],
  ["Proximamente", "Prossimamente"],
  ["Próximamente", "Prossimamente"],
  ["Cargando audio", "Caricamento audio"],
  ["Cargando", "Caricamento"],
  ["Escuchar esta pagina", "Ascolta questa pagina"],
  ["Escuchar questa pagina", "Ascolta questa pagina"],
  ["Escuchar", "Ascolta"],
  ["Detener", "Ferma"],
  ["Reproduciendo", "In riproduzione"],
  ["Navegacion de pagine", "Navigazione delle pagine"],
  ["Navegacion de argomenti", "Navigazione degli argomenti"],
  ["Navegacion", "Navigazione"],
  ["Pagina anterior", "Pagina precedente"],
  ["Pagina siguiente", "Pagina successiva"],
  ["página anterior", "pagina precedente"],
  ["página siguiente", "pagina successiva"],
  ["Argomento anterior", "Argomento precedente"],
  ["Argomento siguiente", "Argomento successivo"],
  ["Resolvamos insieme", "Risolviamo insieme"],
  ["Revisemos insieme", "Controlliamo insieme"],
  ["Cuidado!", "Attenzione!"],
  ["Ejemplo", "Esempio"],
  ["Lado", "Lato"],
  ["Vértice", "Vertice"],
  ["Vertice", "Vertice"],
  ["Angulo recto", "Angolo retto"],
  ["Angulo", "Angolo"],
  ["Ancho", "Larghezza"],
  ["Largo", "Lunghezza"],
  ["Altura", "Altezza"],
  ["Perimetro", "Perimetro"],
  ["Eje de simetria", "Asse di simmetria"],
  ["Cuadrilatero", "Quadrilatero"],
  ["paralelogramo", "parallelogramma"],
  ["Paralelogramo", "Parallelogramma"],
  ["trapecio", "trapezio"],
  ["Trapecio", "Trapezio"],
  ["Tabla de valor posicional", "Tabella del valore posizionale"],
  ["Diagrama de geometria desconocido", "Diagramma di geometria sconosciuto"],
  ["No hay contenido", "Nessun contenuto"],
  ["No se può cargar el audio ora", "Impossibile caricare l'audio ora"],
  ["No pudimos", "Non siamo riusciti a"],
  ["puedes", "puoi"],
  ["Quieres", "Vuoi"],
  ["Tienes", "Hai"],
  ["Hay un", "C'è un"],
  ["a continuacion", "poi"],
  ["a continuación", "poi"],
  ["ilimitadas", "illimitate"],
  ["adicionales", "aggiuntivi"],
  ["desbloquear", "sbloccare"],
  ["hojas de actividades", "schede didattiche"],
  ["hojas", "schede"],
  ["hoja", "scheda"],
  ["Algo salio mal", "Qualcosa è andato storto"],
  ["Algo salió mal", "Qualcosa è andato storto"],
  ["En el portal completo", "Nel portale completo"],
  ["Orden alfabético", "Ordine alfabetico"],
  ["Contar hacia adelante", "Contare in avanti"],
  ["recta numérica", "retta numerica"],
  ["y mas", "e altro"],
  ["actividades", "attività"],
  ["esten en curso", "siano in corso"],
  ["estén en curso", "siano in corso"],
  ["continuarean", "continueranno"],
  ["terminarse", "terminare"],
  ["Esté atento", "Stai attento"],
  ["globos especiales", "palloncini speciali"],
  ["pueden ayudarle", "possono aiutarti"],
  ["antes de que se acabe", "prima che finisca"],
  ["el tiempo", "il tempo"],
  ["Turnense", "Fate a turno"],
  ["diviértanse", "divertitevi"],
  ["diviertanse", "divertitevi"],
  ["Las capturas son obligatorias", "Le catture sono obbligatorie"],
  ["cuando estén disponibles", "quando sono disponibili"],
  ["quando estén disponibles", "quando sono disponibili"],
  ["Este es el numero", "Questo è il numero"],
  ["Questo es el numero", "Questo è il numero"],
  ["que le das a un amigo", "che dai a un amico"],
  ["él puede escribirlo", "può scriverlo"],
  ["él può escribirlo", "può scriverlo"],
  ["para enviarte una solicitud", "per inviarti una richiesta"],
  ["En tu turno", "Nel tuo turno"],
  ["se lanzan los dados", "si lanciano i dadi"],
  ["abre automaticamente", "apre automaticamente"],
  ["una animacion de tirada", "un'animazione del lancio"],
  ["Esperimento magnético", "Esperimento magnetico"],
  ["Por qué volvio", "Perché è tornato"],
  ["Por qué volvió", "Perché è tornato"],
  ["a casa?", "a casa?"],
  ["Hay un limite diario", "C'è un limite giornaliero"],
  ["una desaceleracion gradual", "un rallentamento graduale"],
  ["a medida que se acerca", "man mano che ti avvicini"],
  ["Comprueba que", "Controlla che"],
  ["lo has dividido todo", "hai diviso tutto"],
  ["no le quedan demasiados", "non ne restino troppi"],
  ["puedes darle mas", "puoi dargliene di più"],
  ["ogni nino", "ogni bambino"],
  ["cada niño", "ogni bambino"],
  ["modo demo", "modalità demo"],
  ["puedes explorar", "puoi esplorare"],
  ["pero no creare nuevas", "ma non crearne di nuove"],
  ["pero no crear nuevas", "ma non crearne di nuove"],
  ["Se elimino la conversion", "È stata rimossa la conversione"],
  ["de duplicados", "dei duplicati"],
  ["puedes vender", "puoi vendere"],
  ["un duplicado en la tienda", "un duplicato nel negozio"],
  ["en la tienda", "nel negozio"],
  ["descargar la carta", "scaricare la carta"],
  ["Qué vemos?", "Cosa vediamo?"],
  ["Qué significa?", "Cosa significa?"],
  ["Qué hacer", "Cosa fare"],
  ["Qué esta mas claro", "Cosa è più chiaro"],
  ["qué aun conviene", "cosa conviene ancora"],
  ["Qué aiuta ora", "Cosa aiuta ora"],
  ["qué conviene cambiar", "cosa conviene cambiare"],
  ["en aquesta materia", "in questa materia"],
  ["en questa materia", "in questa materia"],
  ["en orden", "in ordine"],
  ["en questa ronda", "in questo turno"],
  ["Qué conviene hacer ora", "Cosa conviene fare ora"],
  ["Qué vale la pena revisar", "Cosa vale la pena controllare"],
  ["Qué hacer primero", "Cosa fare per primo"],
  ["Qué hacer a continuacion", "Cosa fare dopo"],
  ["Qué conviene reunir", "Cosa conviene raccogliere"],
  ["Qué hacemos", "Cosa facciamo"],
  ["Qué es un", "Che cos'è un"],
  ["Qué es el", "Che cos'è il"],
  ["Qué estamos", "Cosa stiamo"],
  ["Qué digito decide", "Quale cifra decide"],
  ["Qué se domanda", "Cosa si chiede"],
  ["redondeando", "arrotondando"],
  ["comprobando", "controllando"],
  ["buscando", "cercando"],
];

const ES_MARK =
  /[áíóúñ¿¡]|(\b)(qué|cuál|dónde|también|tambien|estudiante|hoja|puedes|quieres|tienes|volver|cargando|página|siguiente|anterior|cuidado|ejemplo|lado|vértice|ángulo|ancho|altura|perímetro|practicaremos|próximamente|proximamente|escuchar|detener|reproduciendo|navegacion|practiquemos|resolvamos|revisemos|inténtalo|intentalo|hacemos|significa|vemos|seleccionar|respuesta|correcta|incorrecta|ilimitadas|desbloquear|continuacion|continuación|actividades|globos|diviértanse|diviertanse|turnense|capturas|estén|esten|solicitud|tienda|descargar|elimino|conversion|duplicados|comprobando|redondeando|buscando|digito|poder\?|factor\?|multiplo|recta numérica|alfabético|hacia adelante|atento|ayudarle|acabe|demasiados|nino|niño|maestro|padre|madre|sesion|elija|formulacion|borrador|escriba|coteje|solucion|salio|salió|pudimos)(\b)/i;

function looksNonTranslate(s) {
  const str = String(s ?? "");
  if (!str.trim()) return true;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(str)) return true;
  if (/^https?:\/\//i.test(str) || str.startsWith("mailto:")) return true;
  if (/^\{[a-zA-Z0-9_]+\}$/.test(str)) return true;
  if (/^\d+(\.\d+)?%?$/.test(str)) return true;
  if (/^[A-Z0-9_]{2,}$/.test(str) && str.length <= 48) return true;
  if (!/\s/.test(str)) {
    if (/^[a-z0-9]+([_/.-][a-z0-9]+)+$/i.test(str)) return true;
    if (/^[a-z]+[A-Z][a-zA-Z0-9]*$/.test(str)) return true;
    if (/^\/[a-z0-9/_\[\]-]+$/i.test(str)) return true;
    if (/\.(png|jpe?g|gif|webp|svg|ttf|woff2?|json|js|css|mp3|wav|pdf)$/i.test(str)) return true;
  }
  return false;
}

function enToItLite(en) {
  let out = String(en ?? "");
  for (const [from, to] of EN_IT) {
    if (out.includes(from)) out = out.split(from).join(to);
  }
  return applyItalianAuthorityPostfix(out);
}

function polish(en, es, current) {
  if (looksNonTranslate(en)) return en;
  const cached = CACHE[en];
  if (cached) return applyItalianAuthorityPostfix(cached);

  let out = resolveItString(en, es, CACHE);
  // If still Spanish-looking, prefer EN phrase map then ES cleanup
  if (ES_MARK.test(out) || ES_MARK.test(String(current || ""))) {
    out = enToItLite(en);
    if (ES_MARK.test(out) && es) out = esToIt(String(es));
    for (const [from, to] of ES_UI) {
      if (out.includes(from)) out = out.split(from).join(to);
    }
    out = esToIt(out);
  } else {
    for (const [from, to] of ES_UI) {
      if (out.includes(from)) out = out.split(from).join(to);
    }
  }
  // Final authority
  out = applyItalianAuthorityPostfix(out);
  for (const [from, to] of EN_IT) {
    if (out.includes(from)) out = out.split(from).join(to);
  }
  for (const [from, to] of ES_UI) {
    if (out.includes(from)) out = out.split(from).join(to);
  }
  out = out
    .replace(/\bstudente\b/gi, "alunno")
    .replace(/\bstudenti\b/gi, "alunni")
    .replace(/\b6ª primaria\b/gi, "1ª secondaria")
    .replace(/\bClasse\s*6\b/g, "1ª secondaria");
  return out;
}

function transform(enNode, esNode, itNode, key) {
  if (typeof enNode === "string") {
    if (SKIP_KEYS.has(key)) return enNode;
    return polish(enNode, typeof esNode === "string" ? esNode : null, typeof itNode === "string" ? itNode : null);
  }
  if (Array.isArray(enNode)) {
    return enNode.map((item, i) =>
      transform(
        item,
        Array.isArray(esNode) ? esNode[i] : null,
        Array.isArray(itNode) ? itNode[i] : null,
        key,
      ),
    );
  }
  if (enNode && typeof enNode === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(enNode)) {
      const esVal = esNode && typeof esNode === "object" && !Array.isArray(esNode) ? esNode[k] : null;
      const itVal = itNode && typeof itNode === "object" && !Array.isArray(itNode) ? itNode[k] : null;
      out[k] = transform(v, esVal, itVal, k);
    }
    return out;
  }
  return enNode;
}

function listJson(dir) {
  /** @type {string[]} */
  const out = [];
  (function walk(p) {
    for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith(".json")) out.push(full);
    }
  })(dir);
  return out;
}

function main() {
  const enRoot = path.join(ROOT, "content-packs/en");
  const esRoot = path.join(ROOT, "content-packs/es-419");
  const itRoot = path.join(ROOT, "content-packs/it-IT");
  const files = listJson(enRoot);
  let n = 0;
  for (const enFile of files) {
    const rel = path.relative(enRoot, enFile);
    const enObj = JSON.parse(fs.readFileSync(enFile, "utf8"));
    let esObj = null;
    const esFile = path.join(esRoot, rel);
    if (fs.existsSync(esFile)) {
      try {
        esObj = JSON.parse(fs.readFileSync(esFile, "utf8"));
      } catch {
        esObj = null;
      }
    }
    let itObj = null;
    const itFile = path.join(itRoot, rel);
    if (fs.existsSync(itFile)) {
      try {
        itObj = JSON.parse(fs.readFileSync(itFile, "utf8"));
      } catch {
        itObj = null;
      }
    }
    const out = transform(enObj, esObj, itObj, "");
    fs.mkdirSync(path.dirname(itFile), { recursive: true });
    fs.writeFileSync(itFile, JSON.stringify(out, null, 2) + "\n", "utf8");
    n += 1;
    if (n % 40 === 0) console.log("hardened", n, "/", files.length);
  }
  console.log("hardened packs", n);
}

main();
