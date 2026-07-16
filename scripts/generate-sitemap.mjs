#!/usr/bin/env node
/**
 * Regenerate public/sitemap.xml and public/robots.txt using canonical site origin.
 * Usage: node scripts/generate-sitemap.mjs
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CANONICAL_PUBLIC_SITE_ORIGIN } from "../lib/site/canonical-public-site-origin.js";
import {
  SITEMAP_STATIC_PATHS,
  buildRobotsTxt,
  buildSitemapXml,
} from "../lib/seo/sitemap-static-paths.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const origin = CANONICAL_PUBLIC_SITE_ORIGIN;

writeFileSync(join(root, "public", "sitemap.xml"), buildSitemapXml(origin, SITEMAP_STATIC_PATHS), "utf8");
writeFileSync(join(root, "public", "robots.txt"), buildRobotsTxt(origin), "utf8");

console.log(`[generate-sitemap] origin=${origin}`);
console.log(`[generate-sitemap] wrote ${SITEMAP_STATIC_PATHS.length} URLs to public/sitemap.xml`);
