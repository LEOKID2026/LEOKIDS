import fs from "node:fs";

const t = fs.readFileSync("data/science-questions-it-IT-overlay.js", "utf8");
const parts = [
  "cuál",
  "dónde",
  "también",
  "órgano",
  "estudiante",
  "hoja de",
  "seleccionar grado",
  "práctica",
  "respuesta correcta",
  "puedes",
  "inténtalo",
  "quieres",
  "cargando",
  "próximamente",
  "proximamente",
  "navegacion",
  "practiquemos",
  "resolvamos",
  "revisemos",
  "diviertanse",
  "turnense",
];
for (const part of parts) {
  const r = new RegExp(`\\b${part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  if (r.test(t)) {
    const i = t.search(r);
    console.log("MATCH", part, JSON.stringify(t.slice(Math.max(0, i - 40), i + 80)));
  }
}

// broader Spanish leftovers
const broad =
  /\b(cualquier|electricidad|descomponen|alimentos|estado gassoso|Solo el|ambos organos|mejor que|se ve solo|destello|Plastica:|metallo\.|energia\.|a cualquier)\b/gi;
const hits = [...t.matchAll(broad)].slice(0, 20);
console.log("broad", hits.length);
for (const h of hits) console.log(h[0], "->", t.slice(h.index, h.index + 100).replace(/\s+/g, " "));
