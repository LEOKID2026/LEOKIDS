import fs from "fs";
import path from "path";
import { I18N_NAMESPACES } from "../../lib/i18n/load-messages.js";

const PLACEHOLDER_RE = /\{[a-zA-Z_][a-zA-Z0-9_]*\}/g;

function collect(v, prefix, out) {
  if (typeof v === "string") {
    out.set(prefix, v);
    return;
  }
  if (Array.isArray(v)) {
    v.forEach((item, i) => {
      const p = `${prefix}[${i}]`;
      if (typeof item === "string") out.set(p, item);
      else collect(item, p, out);
    });
    return;
  }
  if (v && typeof v === "object") {
    for (const [k, c] of Object.entries(v)) {
      collect(c, prefix ? `${prefix}.${k}` : k, out);
    }
  }
}

function load(locale, ns) {
  const j = JSON.parse(
    fs.readFileSync(path.join("locales", locale, `${ns}.json`), "utf8")
  );
  const m = new Map();
  collect(j, "", m);
  return m;
}

let en = 0;
let id = 0;
let miss = 0;
let extra = 0;
let empty = 0;
let ph = 0;
const per = {};
for (const ns of I18N_NAMESPACES) {
  const e = load("en", ns);
  const i = load("id-ID", ns);
  per[ns] = { en: e.size, id: i.size };
  en += e.size;
  id += i.size;
  for (const [k, ev] of e) {
    if (!i.has(k)) miss++;
    else {
      const iv = i.get(k);
      if (!String(ev).trim() || !String(iv).trim()) empty++;
      const ep = [...String(ev).matchAll(PLACEHOLDER_RE)].map((m) => m[0]).sort().join();
      const ip = [...String(iv).matchAll(PLACEHOLDER_RE)].map((m) => m[0]).sort().join();
      if (ep !== ip) ph++;
    }
  }
  for (const k of i.keys()) if (!e.has(k)) extra++;
}

console.log(JSON.stringify({ en, id, miss, extra, empty, ph, ns: I18N_NAMESPACES.length, per }, null, 2));
