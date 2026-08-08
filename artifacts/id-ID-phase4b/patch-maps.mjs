/**
 * Patch remaining UI chrome map entries, then re-apply all packs.
 */
import fs from "node:fs";

const patches = {
  "Memory Match": "Cocok Memori",
  "vs Bot": "Lawan Bot",
  "vs Bot label": "Lawan Bot",
};

// Also fix chunk maps if keys exist
for (let i = 0; i < 8; i++) {
  const p = `artifacts/id-ID-phase4b/map-chunk-${i}.json`;
  const map = JSON.parse(fs.readFileSync(p, "utf8"));
  let changed = false;
  for (const [en, id] of Object.entries(patches)) {
    if (Object.prototype.hasOwnProperty.call(map, en) && map[en] !== id) {
      map[en] = id;
      changed = true;
    }
  }
  // Leo Bot stays as brand
  if (changed) {
    fs.writeFileSync(p, JSON.stringify(map, null, 2) + "\n", "utf8");
    console.log("patched", p);
  }
}

console.log("done patching maps");
