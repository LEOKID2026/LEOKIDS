import fs from "node:fs";

const all = {};
for (let i = 0; i < 8; i++) {
  Object.assign(all, JSON.parse(fs.readFileSync(`artifacts/id-ID-phase4b/map-chunk-${i}.json`, "utf8")));
}
for (const [k, v] of Object.entries(all)) {
  if (
    /doesn't end the game|Memory Match|vs Bot|Leo Bot|Leo Safari|New game|\{mode\}|word train|Word Train|Word Detective/i.test(
      k
    )
  ) {
    console.log(JSON.stringify(k), "=>", JSON.stringify(v));
  }
}
