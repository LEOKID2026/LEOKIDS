/**
 * Phase 10: add params.patternFamily to all science items missing it.
 * Heuristics: topic + Hebrew stem keywords (broad families only).
 * Does not rename existing patternFamily values (e.g. body_1–3 legacy science_*).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SCIENCE_QUESTIONS } from "../data/science-questions.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mainPath = path.join(root, "data/science-questions.js");
const phase3Path = path.join(root, "data/science-questions-phase3.js");

function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** @param {{ stem?: string, topic: string, params?: object }} q */
function assignPatternFamily(q) {
  if (q.params?.patternFamily) return null;
  const s = q.stem || "";

  if (q.topic === "body") {
    if (
      /|||||||||||||| || | |.*| |||||| ||||| |  /i.test(
        s,
      )
    ) {
      return "sci_body_health";
    }
    return "sci_body_systems";
  }

  if (q.topic === "animals") {
    if (
      /|||||| || | |  |||| |   /i.test(
        s,
      )
    ) {
      return "sci_animals_life_processes";
    }
    return "sci_animals_classification";
  }

  if (q.topic === "plants") {
    if (
      /||||||  |\b|\b|| | | | ||||||.*|  /i.test(
        s,
      )
    ) {
      return "sci_plants_parts";
    }
    return "sci_plants_growth";
  }

  if (q.topic === "materials") {
    if (
      / | | |||   ||.*|.*|.*| |   | | /i.test(
        s,
      )
    ) {
      return "sci_materials_changes";
    }
    return "sci_materials_properties";
  }

  if (q.topic === "earth_space") {
    if (
      / ||||||\b|\b| | |  | ||||\b|\b.*|  /i.test(
        s,
      )
    ) {
      return "sci_earth_space_weather";
    }
    return "sci_earth_space_cycles";
  }

  if (q.topic === "environment") {
    if (
      /|| | | | || | | |\b.*| /i.test(
        s,
      )
    ) {
      return "sci_environment_sustainability";
    }
    return "sci_environment_ecosystems";
  }

  if (q.topic === "experiments") {
    // Note: do not use \\b — JavaScript word boundaries are not reliable for Hebrew.
    if (
      /|||| | |  |  | | |   | | || |  /i.test(
        s,
      )
    ) {
      return "sci_experiments_observation_inference";
    }
    return "sci_experiments_scientific_method";
  }

  return "sci_experiments_scientific_method";
}

function insertPatternFamily(text, id, patternFamily) {
  const re = new RegExp(
    `(\\"id\\"\\s*:\\s*\\"${escRe(id)}\\"[\\s\\S]*?\\"params\\"\\s*:\\s*\\{)(\\s*)`,
    "m",
  );
  const ma = text.match(re);
  if (!ma) {
    throw new Error(`insertPatternFamily: id not found: ${id}`);
  }
  const idx = ma.index ?? text.search(re);
  const head = text.slice(idx, idx + 900);
  if (/\"patternFamily\"/.test(head)) {
    return text;
  }
  return text.replace(re, `$1$2"patternFamily": "${patternFamily}",\n      `);
}

function addSubtypeSciBodyGeneral(text, id, afterPatternFamilyLine) {
  const re = new RegExp(
    `(\\"id\\"\\s*:\\s*\\"${escRe(id)}\\"[\\s\\S]*?\\"params\\"\\s*:\\s*\\{[\\s\\S]*?${escRe(
      afterPatternFamilyLine,
    )}\\s*\n)(      )`,
    "m",
  );
  const head = text.match(re)?.[0];
  if (!head || /\"subtype\"/.test(head)) return text;
  return text.replace(re, `$1$2"subtype": "sci_body_general",\n$2`);
}

let main = fs.readFileSync(mainPath, "utf8");
let p3 = fs.readFileSync(phase3Path, "utf8");

let added = 0;
for (const q of SCIENCE_QUESTIONS) {
  const pf = assignPatternFamily(q);
  if (!pf) continue;
  const id = q.id;
  const inP3 = p3.includes(`"id": "${id}"`);
  const inMain = main.includes(`"id": "${id}"`);
  if (inP3 && !inMain) {
    const next = insertPatternFamily(p3, id, pf);
    if (next !== p3) added++;
    p3 = next;
  } else if (inMain) {
    const next = insertPatternFamily(main, id, pf);
    if (next !== main) added++;
    main = next;
  } else {
    throw new Error(`id ${id} not in either file`);
  }
}

main = addSubtypeSciBodyGeneral(
  main,
  "body_1",
  '"patternFamily": "science_body_heart_location",',
);
main = addSubtypeSciBodyGeneral(
  main,
  "body_2",
  '"patternFamily": "science_body_sense_organs",',
);
main = addSubtypeSciBodyGeneral(
  main,
  "body_3",
  '"patternFamily": "science_respiratory_gas_exchange",',
);

fs.writeFileSync(mainPath, main, "utf8");
fs.writeFileSync(phase3Path, p3, "utf8");

console.log("patternFamily insertions:", added);
console.log("Wrote", mainPath);
console.log("Wrote", phase3Path);
