/** Static public paths included in sitemap.xml (global product — no /he routes). */

import { listReadyWorksheetPublicPaths } from "../worksheets/worksheet-ready-public-page.server.js";

export const SITEMAP_STATIC_PATHS = [
  "/",
  "/privacy",
  "/terms",
  "/legal",
  "/security",
  "/accessibility",
  "/ai-disclosure",
  "/data-deletion",
  "/contact",
  "/about",
  "/help",
  "/kids",
  "/parents",
  "/teachers",
  "/games",
  "/learning",
  "/gallery",
  "/practice",
  "/practice/math",
  "/practice/reading",
  "/practice/english",
  "/practice/geometry",
  "/practice/science",
  "/practice/games",
  "/practice/no-print",
  "/practice/parent-reports",
  "/practice/worksheets",
  ...listReadyWorksheetPublicPaths(),
  "/guides",
  "/guides/math-practice-at-home",
  "/guides/reading-practice-at-home",
  "/guides/no-print-worksheets",
  "/guides/learning-games-at-home",
  "/guides/parent-progress-tracking",
  "/guides/home-practice-routine",
  "/guides/math-games-for-kids",
  "/guides/reading-comprehension-at-home",
  "/guides/english-vocabulary-practice",
  "/guides/how-to-follow-child-progress",
];

/**
 * @param {string} origin
 * @param {string[]} paths
 */
export function buildSitemapXml(origin, paths) {
  const base = String(origin || "").replace(/\/+$/, "");
  const urls = paths
    .map((path) => `  <url><loc>${base}${path.startsWith("/") ? path : `/${path}`}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/**
 * @param {string} origin
 */
export function buildRobotsTxt(origin) {
  const base = String(origin || "").replace(/\/+$/, "");
  return `User-agent: *
Allow: /

Disallow: /api/
Disallow: /admin/
Disallow: /dev/
Disallow: /school/
Disallow: /guardian/
Disallow: /auth/
Disallow: /student/
Disallow: /parent/
Allow: /parent/login
Allow: /parent/install-app
Disallow: /teacher/
Allow: /teacher/login
Allow: /teacher/install-app
Disallow: /learning/parent-report
Disallow: /learning/parent-report-detailed
Disallow: /learning/dev/
Disallow: /learning/dev-student-simulator
Disallow: /offline/
Allow: /games
Disallow: /game

Sitemap: ${base}/sitemap.xml
`;
}
