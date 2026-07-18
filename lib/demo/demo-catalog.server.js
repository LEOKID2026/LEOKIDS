import { GAME_ACCESS_STATES } from "../games/game-catalog.constants.js";
import {
  loadSiteGameCatalog,
  resolveCategoryCardState,
  resolveEffectiveGameAccess,
} from "../games/server/game-access.server.js";
import { resolveGlobalGameDisplayText } from "../games/game-display-text.server.js";
import {
  loadActiveCatalogSubjectsForGrade,
  loadAvailableGradesForSubject,
} from "../learning/subject-permissions/subject-access.server.js";
import { resolveEffectiveContentGradePure } from "../learning/subject-permissions/subject-grade-defaults.resolver.js";
import { getSubjectPermissionLabelHe } from "../learning/subject-permissions/subject-permission-labels.js";
import { normalizePracticeGradeKey } from "../learning-supabase/practice-grade-resolution.js";

const DEMO_PERMISSIONS = Object.freeze({
  online_enabled: true,
  offline_enabled: true,
  solo_enabled: true,
  educational_enabled: true,
});

/**
 * Global admin game catalog only — no parent locks, no guest locks.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} [contentLocale]
 */
export async function buildDemoGameAccessPayload(supabase, contentLocale = "en") {
  const catalog = await loadSiteGameCatalog(supabase);

  const games = catalog.map((row) => {
    const access = resolveEffectiveGameAccess(row, DEMO_PERMISSIONS);
    const display = resolveGlobalGameDisplayText(row.game_key, row.category, contentLocale);
    return {
      gameKey: row.game_key,
      category: row.category,
      titleHe: display.title,
      route: row.route,
      hubRoute: row.hub_route,
      isEnabled: row.is_enabled === true,
      sortOrder: row.sort_order,
      emoji: row.emoji,
      blurbHe: display.blurb,
      accessState: access.state,
      playable: access.state === GAME_ACCESS_STATES.ALLOWED,
      lockMessage: access.message,
    };
  });

  const categories = {};
  for (const cat of ["online", "offline", "solo", "educational"]) {
    categories[cat] = resolveCategoryCardState(cat, catalog, DEMO_PERMISSIONS);
  }

  return {
    permissions: {
      onlineEnabled: true,
      offlineEnabled: true,
      soloEnabled: true,
      educationalEnabled: true,
    },
    categories,
    games,
    isGuest: false,
  };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} gradeLevel
 */
export async function buildDemoSubjectAccessPayload(supabase, gradeLevel) {
  const gradeKey = normalizePracticeGradeKey(gradeLevel) || "g3";
  const catalogRows = await loadActiveCatalogSubjectsForGrade(supabase, gradeKey);

  /** @type {Record<string, { isEnabled: boolean, isGradeSuitable: boolean, effectiveGrade: string }>} */
  const subjectPermissions = {};
  const subjects = [];

  for (const row of catalogRows) {
    const subjectKey = row.subject_key;
    if (subjectPermissions[subjectKey]) continue;

    const availableGrades = await loadAvailableGradesForSubject(supabase, subjectKey);
    const effectiveGrade =
      availableGrades.length > 0
        ? resolveEffectiveContentGradePure(gradeKey, availableGrades)
        : gradeKey;

    subjectPermissions[subjectKey] = {
      isEnabled: row.is_enabled_by_default === true,
      isGradeSuitable: row.is_grade_suitable === true,
      effectiveGrade,
    };

    const catalogMeta = row.subject_permission_catalog || {};
    subjects.push({
      subjectKey,
      displayNameHe: getSubjectPermissionLabelHe(subjectKey) || catalogMeta.display_name_he || subjectKey,
      sortOrder: catalogMeta.sort_order ?? 0,
      isActive: catalogMeta.is_active === true,
    });
  }

  return {
    gradeLevel: gradeKey,
    subjects,
    subjectAccess: {
      enforced: true,
      allowStudentGradePicker: true,
      subjectPermissions,
    },
  };
}
