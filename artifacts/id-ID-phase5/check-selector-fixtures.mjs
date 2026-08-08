import fs from "fs";
import { getSelectableLocales } from "../../lib/i18n/locale-registry.js";

const src = fs.readFileSync("tests/i18n/country-locale-wiring.test.mjs", "utf8");
function grab(name) {
  const m = src.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\];`));
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}
const order = grab("SELECTOR_ORDER");
const ids = grab("SELECTOR_IDS");
const labels = grab("SELECTOR_LABELS");
const live = getSelectableLocales();
console.log({ order: order.length, ids: ids.length, labels: labels.length, live: live.length });
console.log("order match", JSON.stringify(order) === JSON.stringify(live.map((l) => l.id)));
const liveLabels = live
  .filter((l) => l.id !== "en")
  .map((l) => l.label || l.nativeName)
  .sort();
const sortedFixture = [...labels].sort();
console.log("labels match", JSON.stringify(sortedFixture) === JSON.stringify(liveLabels));
if (JSON.stringify(sortedFixture) !== JSON.stringify(liveLabels)) {
  const a = new Set(labels);
  const b = new Set(liveLabels);
  console.log(
    "only in SELECTOR_LABELS",
    [...a].filter((x) => !b.has(x))
  );
  console.log(
    "only in live",
    [...b].filter((x) => !a.has(x))
  );
}
console.log("ids sorted match", JSON.stringify([...ids].sort()) === JSON.stringify(live.map((l) => l.id).sort()));
