/**
 * @deprecated Use `npm run test:i18n:direction` (locale-direction.test.mjs).
 * Thin wrapper kept for backward-compatible script names.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const target = path.join(path.dirname(fileURLToPath(import.meta.url)), "locale-direction.test.mjs");
const result = spawnSync(process.execPath, ["--test", target], { stdio: "inherit" });
process.exit(result.status === null ? 1 : result.status);
