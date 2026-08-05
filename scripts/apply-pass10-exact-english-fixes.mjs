/**
 * PASS 10 exact English fixes.
 * Applies full-page replacements only to english-g1 / english-g2 pages under exports/audio-text/books.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BOOKS_ROOT = path.join(ROOT, "exports", "audio-text", "books");

const replacements = {
  "english-g1/pages/page-002.txt": "  26 .\n  ,  .\n   :\nA   .\nB   .\nC   .\n         .\n",
  "english-g1/pages/page-003.txt": "   : B -M.\nB   .\nM   .\n     .\n",
  "english-g1/pages/page-004.txt": "   ?\nK\n-K       .\n  K.\nK\n",
  "english-g1/pages/page-006.txt": "   ?\nS\n-S   ,     .\n  S.\n   S ✓\n",
  "english-g1/pages/page-010.txt": "   : d -t.\nd     D.\nt     T.\n   ,    .\n",
  "english-g1/pages/page-011.txt": "   ?\np\n-p     ,      .\n   p.\np\n",
  "english-g1/pages/page-013.txt": "   ?\nb\n-b     ,    .\n  b.\n   b ✓\n",
  "english-g1/pages/page-023.txt": "  ,    :\n  —   .\n  —     .\n   :\nA   .\nB   .\nC   .\n cat  C   .\n   ,    .\n",
  "english-g1/pages/page-024.txt": "   .\n    A —   A.\n    M —   M.\n      .\n",
  "english-g1/pages/page-025.txt": "  ?\nF\n   F.\n  F.\nF\n",
  "english-g1/pages/page-027.txt": "   J?\n   J.\n  J.\n.\n",
  "english-g1/pages/page-030.txt": "     .\n bat    .\n mom    .\n sun    .\n cat, bed -sit    .\n",
  "english-g1/pages/page-031.txt": " mom     .\n top     .\n     .\n",
  "english-g1/pages/page-032.txt": "     sun?\n sun .\n   .\n\n",
  "english-g1/pages/page-034.txt": "     pen?\n pen .\n pen   .\n ✓\n",
  "english-g1/pages/page-038.txt": " mom    .\n mom   .\n pen    .\n pen   .\n",
  "english-g1/pages/page-039.txt": "   -cat?\n : cat.\n cat   .\n\n",
  "english-g1/pages/page-041.txt": "   -hat?\n : hat.\n hat   .\n  -hat   ✓\n",
  "english-g1/pages/page-057.txt": "      .\n,  cat   .\n   ,    cat.\n",
  "english-g1/pages/page-058.txt": "     :\ncat\nhat\nsit\nsun\npen\nbed\n      .\n",
  "english-g1/pages/page-059.txt": " cat     ,   cat.\n sit     ,   sit.\n",
  "english-g1/pages/page-060.txt": "       pen?\n    .\npen.\npen\n",
  "english-g1/pages/page-061.txt": "    b, e, d?\n  .\n       .\n",
  "english-g1/pages/page-062.txt": "    b, e, d?\n    .\n  :\nbed\nbed =  ✓\n",
  "english-g1/pages/page-079.txt": "Point to the door. —   .\nShow me your pen. —    .\nListen. — .\nLook. — .\n",
  "english-g1/pages/page-124.txt": "   .\n  ?\n  .\n       .\n",
  "english-g2/pages/page-002.txt": "       .\nA  -a, B  -b, C  -c,    Z -z.\nA   .\nZ   .\nM   -m .\nS   -s .\n",
  "english-g2/pages/page-003.txt": "  : G -R.\nG   -g .\nR   -r .\n     .\n",
  "english-g2/pages/page-006.txt": ":     Q?\n     .\n   Q  q.\nq ✓\n",
  "english-g2/pages/page-008.txt": "     .\n -A,  -B -C,   Z.\n   —  .\n",
  "english-g2/pages/page-009.txt": "    .\n   -A   G.\n   -H   N.\n   -O   T.\n   -U   Z.\n M  N.\n S  T.\n",
  "english-g2/pages/page-015.txt": "    .\n   ,     .\n: bat -pen, dog -top.\n",
  "english-g2/pages/page-016.txt": " bat    .\n pen    .\n dog    .\n top    .\n    ,  -cat, bed -sit.\n",
  "english-g2/pages/page-017.txt": "     ,       .\n     ,       .\n     .\n",
  "english-g2/pages/page-018.txt": "     pen?\n pen .\n   .\n\n",
  "english-g2/pages/page-020.txt": ":     den?\n  .\nden   ,  dog.\n ✓\n",
  "english-g2/pages/page-022.txt": "    .\n   ,     .\n",
  "english-g2/pages/page-023.txt": " cat     ,   cat.\n hat     ,   hat.\n sit     ,   sit.\n run     ,   run.\n big     ,   big.\n red     ,   red.\n hot     ,   hot.\n sun     ,   sun.\n",
  "english-g2/pages/page-024.txt": " cat   ,    .\n ,     : cat.\n",
  "english-g2/pages/page-025.txt": "       sun?\n  .\nsun.\nsun\n",
  "english-g2/pages/page-026.txt": "       pig?\n  .\n       .\n",
  "english-g2/pages/page-027.txt": ":        pig?\n  .\n pig.\npig ✓\n",
  "english-g2/pages/page-028.txt": "   .\n       .\n",
  "english-g2/pages/page-029.txt": "      .\n    ,    .\n  ,       .\n",
  "english-g2/pages/page-030.txt": "     —    M.\n     —    S.\n cat     —    C.\n B —      .\n T —      .\n",
  "english-g2/pages/page-031.txt": "     —  M.\n F —      .\n",
  "english-g2/pages/page-032.txt": "      cat?\ncat   .\n cat     C.\nC\n",
  "english-g2/pages/page-034.txt": ":     H  ?\n   hat.\n-hat    .\n ✓\n",
  "english-g2/pages/page-036.txt": "       .\n    ,      .\n",
  "english-g2/pages/page-037.txt": " :\ncat, sit, run.\n   :\nthe —    , : the cat\nI — \na —     , : a cat\nis —   : it is red\n",
  "english-g2/pages/page-038.txt": "   cat.\n   I — .\n     .\n",
  "english-g2/pages/page-043.txt": "    —    .\n: cat, hat -bat   .\n man, can -fan   .\n",
  "english-g2/pages/page-044.txt": " :\ncat, hat, bat —  .\nman, can, fan —  .\nsit, hit, bit —  .\ndog, log, fog —  .\n  ,   .\n",
  "english-g2/pages/page-045.txt": "cat -hat   .\nsit -hit   .\ndog -log   .\n",
  "english-g2/pages/page-046.txt": "    cat ,    cat?\nhat   .\n bat .\n",
  "english-g2/pages/page-047.txt": "    man ,    man?\n  .\n       .\n",
  "english-g2/pages/page-048.txt": ":     man ,    man?\n  can  fan.\n   -man .\ncan  fan ✓\n",
  "english-g2/pages/page-069.txt": ":  \"friend\" —  ?\n   friend.\nfriend    .\nfriend ✓\n",
  "english-g2/pages/page-170.txt": "Thank you — .\nThank you, teacher.\n , .\n",
  "english-g2/pages/page-171.txt": "  .\n ?\nThank you\n.\n"
};

const changed = [];
for (const [rel, content] of Object.entries(replacements)) {
  const file = path.join(BOOKS_ROOT, rel);
  if (!file.startsWith(BOOKS_ROOT)) throw new Error(`Unsafe path: ${rel}`);
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${file}`);
  const before = fs.readFileSync(file, "utf8");
  const next = content.endsWith("\n") ? content : `${content}\n`;
  if (before !== next) {
    fs.writeFileSync(file, next, "utf8");
    changed.push(rel);
  }
}

console.log(JSON.stringify({ changedCount: changed.length, changed }, null, 2));
