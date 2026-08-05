#!/usr/bin/env node
/**
 * Run Next.js dev with NODE_ENV=development (Windows-safe).
 * Usage: node scripts/run-next-dev.mjs [port] [host]
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEXT_BIN = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");
const port = process.argv[2] || "3001";
const host = process.argv[3] || "127.0.0.1";

const child = spawn(process.execPath, [NEXT_BIN, "dev", "-p", port, "-H", host], {
  cwd: ROOT,
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "development",
  },
});

child.on("exit", (code) => process.exit(code ?? 1));
child.on("error", (err) => {
  console.error("[run-next-dev] fatal:", err);
  process.exit(1);
});
