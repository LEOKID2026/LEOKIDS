import fs from "node:fs";
import { SCIENCE_NL_NL_OVERLAY as NL } from "../../data/science-questions-nl-NL-overlay.js";
import { SCIENCE_EN_OVERLAY as EN } from "../../data/science-questions-en-overlay.js";

/** English leftovers that should not remain in finished NL instructional prose. */
const BAD =
  /\b(the|and|with|from|that|this|these|those|what|which|because|survive|called|provides|seeking|helps?|make|making|made|finding|Blood is|It delivers|carries away|Night can|Use a|Heavy stone|Pollination|They filter|Each heartbeat|Removing wastes|Desert specialists|Filtering|Produce urine|Kidneys|Cells use|Biodiversity|Joints filter|It connects|Your body|Rest is|Rest turns|Lifestyle|Water supports|Bright colors|Water keeps|Flowers contain|Excretory|Attract bees|Most reptiles|Many overlapping|Working |breathing|breathe|people|place with|house built|useful for|windows|feathers|manage |processes|nutrients|wastes|Circulation|limited water|classic examples|such adaptations|for the kidneys|leave the body|release energy|kinds of living|food webs|healthier|as it flows|allows the|shuts down|healthy lifestyle|turns muscles|no filter|solar filter|supervised|shade method|reproduce|fruit production|seed and|environment|Experiments help|Recycling helps|Sorting materials|Producers make|basic explanation|pulmonary|gas exchange|Covering up|Make sure|Clear variables|Earth also|organic material|Repeating improves|does not make|Brushing removes|Bones give|The skull|A control is|Pollen sticks|Details make|Gas exchange|Producers such|Predators help|Bones form|Bees visit|To help|A balanced|Fins help|Fins are|Faster breathing|The stomach|To help remove|Wastes that|Absorb digested|Fruits and|Clouds are|tiny water|ice crystals|floating in|become heavy|throughout|protects the|rib cage|comparison that|moves between|data useful|red blood|food energy|prey numbers|holds you|carry pollen|lungs breathe|variety of|keep steady|swimming adaptations|bring in more|break food|could make|leave the|digested|vegetables supply|support health)\b/i;

const unique = new Map();
let badFields = 0;
for (const id of Object.keys(EN)) {
  const n = NL[id];
  if (!n) continue;
  const pairs = [
    [n.stem, EN[id].stem],
    [n.explanation, EN[id].explanation],
    ...(n.options || []).map((o, i) => [o, (EN[id].options || [])[i]]),
    ...(n.theoryLines || []).map((t, i) => [t, (EN[id].theoryLines || [])[i]]),
  ];
  for (const [nl, en] of pairs) {
    if (!BAD.test(String(nl || ""))) continue;
    badFields++;
    const key = String(en || "").trim();
    if (!key) continue;
    if (!unique.has(key)) unique.set(key, String(nl || "").slice(0, 80));
  }
}
const list = [...unique.keys()];
fs.writeFileSync("scripts/i18n/_science-needs-nl-en.json", JSON.stringify(list, null, 2));
console.log({ badFields, unique: list.length });
console.log(list.slice(0, 30).join("\n---\n"));
