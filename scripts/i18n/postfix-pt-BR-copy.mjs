/**
 * Post-edit Brazilian Portuguese product copy after MT bootstrap.
 * Run: node scripts/i18n/postfix-pt-BR-copy.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const REPLACEMENTS = [
  [/Leo Crianças/g, "Leo Kids"],
  [/LEO Crianças/g, "LEO KIDS"],
  [/"home": "Lar"/g, '"home": "Início"'],
  [/"login": "Conecte-se"/g, '"login": "Entrar"'],
  [/"search": "Procurar"/g, '"search": "Buscar"'],
  [/\btelemóvel\b/gi, "celular"],
  [/\bautocarro\b/gi, "ônibus"],
  [/\bcomboio\b/gi, "trem"],
  [/\becrã\b/gi, "tela"],
  [/\bficheiro\b/gi, "arquivo"],
  [/atualize sua nota/gi, "atualize seu ano"],
  [/escolha uma nota/gi, "escolha um ano"],
  [/sua nota\b/gi, "seu ano"],
  [/Grade \{grade\}/g, "{grade}º ano"],
];

function walkJson(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJson(fp, files);
    else if (ent.name.endsWith(".json")) files.push(fp);
  }
  return files;
}

let changed = 0;
for (const file of [
  ...walkJson(path.join(ROOT, "locales", "pt-BR")),
  ...walkJson(path.join(ROOT, "content-packs", "pt-BR")),
]) {
  let text = fs.readFileSync(file, "utf8");
  const before = text;
  for (const [re, rep] of REPLACEMENTS) text = text.replace(re, rep);
  if (text !== before) {
    fs.writeFileSync(file, text, "utf8");
    changed++;
  }
}
console.log("Files updated:", changed);
