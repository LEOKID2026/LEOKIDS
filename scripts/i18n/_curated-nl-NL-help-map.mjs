import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
/** @type {Record<string, string>} */
export const HELP_EN_TO_NL = require("./_curated-nl-NL-help-map.json");
