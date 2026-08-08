import fs from "node:fs";

const p = "artifacts/id-ID-phase4c/dict-merged.json";
const dict = JSON.parse(fs.readFileSync(p, "utf8"));
const fixes = {
  "Grade status": "Status Kelas",
  "{count} children": "{count} murid",
  "Child ID is missing": "ID murid tidak ada",
  "Child's answer": "Jawaban murid",
  "Coins, diamonds, and cards were saved to the child.":
    "Koin, berlian, dan kartu telah disimpan untuk murid.",
  "Deleting the child failed - please try again or contact support.":
    "Menghapus murid gagal - silakan coba lagi atau hubungi dukungan.",
  "Select a child": "Pilih murid",
  "View reports and child details": "Lihat laporan dan detail murid",
};

for (const [k, v] of Object.entries(fixes)) {
  if (!(k in dict)) {
    console.log("MISSING KEY", k);
    continue;
  }
  console.log(JSON.stringify(k), "→", JSON.stringify(v));
  dict[k] = v;
}

fs.writeFileSync(p, JSON.stringify(dict, null, 2));

// keep chunk dicts in sync for Grade status etc.
for (let i = 0; i < 4; i++) {
  const cp = `artifacts/id-ID-phase4c/dict-chunk-${i}.json`;
  const part = JSON.parse(fs.readFileSync(cp, "utf8"));
  let n = 0;
  for (const [k, v] of Object.entries(fixes)) {
    if (k in part) {
      part[k] = v;
      n++;
    }
  }
  if (n) {
    fs.writeFileSync(cp, JSON.stringify(part, null, 2));
    console.log("patched chunk", i, n);
  }
}

console.log("done");
