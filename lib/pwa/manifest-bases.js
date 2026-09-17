/**
 * Static PWA manifest bases — build-time JSON imports (no runtime fs reads from public/).
 * Keeps public/manifest-*.webmanifest as the single source of truth.
 */
import studentBase from "../../public/manifest-student.webmanifest" with { type: "json" };
import parentBase from "../../public/manifest-parent.webmanifest" with { type: "json" };
import teacherBase from "../../public/manifest-teacher.webmanifest" with { type: "json" };

/** @type {Readonly<Record<string, object>>} */
export const PWA_MANIFEST_BASES = Object.freeze({
  student: studentBase,
  parent: parentBase,
  teacher: teacherBase,
});
