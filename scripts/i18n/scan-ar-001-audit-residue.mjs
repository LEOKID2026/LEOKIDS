import fs from "fs";
import path from "path";

const roots = ["content-packs/ar-001", "locales/ar-001", "data/help-center/ar-001"];
const needles = [
  "أطفال ليو",
  "مكان وقوف",
  "عقد التقدم",
  "محرك التشخيص",
  "مجموعة تشخيصية",
  "إطار التشخيص",
  "موضوع وموضوع",
  "المواضيع والمواضيع",
];

function walk(d, out = []) {
  if (!fs.existsSync(d)) return out;
  for (const n of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, n.name);
    const norm = p.replace(/\\/g, "/");
    if (norm.includes("node_modules") || norm.includes(".next") || norm.includes("/tmp/")) continue;
    if (n.isDirectory()) walk(p, out);
    else if (/\.(json|js|md|jsx|ts|tsx)$/.test(n.name)) out.push(p);
  }
  return out;
}

const files = roots.flatMap((r) => walk(r));
const hits = Object.fromEntries(needles.map((n) => [n, []]));
const parentHits = [];

for (const f of files) {
  let t;
  try {
    t = fs.readFileSync(f, "utf8");
  } catch {
    continue;
  }
  for (const n of needles) {
    if (t.includes(n)) hits[n].push(f);
  }
  const norm = f.replace(/\\/g, "/");
  const skipParent =
    norm.includes("/books/") ||
    norm.includes("english-page") ||
    norm.includes("learning/burn-down");
  if (!skipParent && t.includes("الوالد")) {
    const m = t.match(/الوالد/g);
    if (m) parentHits.push([f, m.length]);
  }
}

for (const [n, arr] of Object.entries(hits)) {
  console.log(arr.length ? `HIT ${arr.length}` : "OK 0", n);
  arr.slice(0, 5).forEach((f) => console.log(" ", f));
}
console.log("الوالد UI files", parentHits.length);
parentHits.slice(0, 25).forEach(([f, c]) => console.log(`  ${c} ${f}`));
