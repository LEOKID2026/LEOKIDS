import { rejectIfPublicWorksheetsReadyRateLimited } from "../../../../../lib/security/public-api-rate-limit.js";
import { getReadyWorksheetBySlug } from "../../../../../lib/worksheets/worksheet-ready-catalog.js";
import {
  generateWorksheetForParent,
  publicWorksheetPayload,
} from "../../../../../lib/worksheets/worksheet-generate.server.js";
import { buildWorksheetPayloadMeta } from "../../../../../lib/worksheets/worksheet-meta-labels.server.js";
import {
  generateReadyWritingBySlug,
  publicWritingPayload,
} from "../../../../../lib/writing/writing-generate.server.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  if (rejectIfPublicWorksheetsReadyRateLimited(req, res)) return undefined;

  const slug = String(req.query?.slug || "").trim();
  const interfaceLocale = String(req.query?.interfaceLocale || req.query?.locale || "").trim();
  const contentLocale = String(
    req.query?.contentLocale || req.query?.instructionLocale || interfaceLocale || ""
  ).trim();

  const writingGenerated = generateReadyWritingBySlug(slug, {
    publicOnly: true,
    interfaceLocale: interfaceLocale || undefined,
    contentLocale: contentLocale || undefined,
  });
  if (writingGenerated.ok) {
    return res.status(200).json({
      ok: true,
      worksheetPayload: publicWritingPayload(writingGenerated.worksheetPayload),
      generation: writingGenerated.generation,
      slug,
    });
  }
  if (writingGenerated.status === 403) {
    return res.status(403).json({ ok: false, error: writingGenerated.code });
  }

  const entry = getReadyWorksheetBySlug(slug);
  if (!entry) {
    return res.status(404).json({ ok: false, error: "not_found" });
  }

  const title = entry.title
    ? entry.title
    : buildWorksheetPayloadMeta({
        subjectId: entry.subjectId,
        gradeKey: entry.gradeKey,
        topicKey: entry.topicKey,
        levelKey: entry.levelKey,
        inkSave: entry.inkSave,
        mathPracticeFormat: entry.mathPracticeFormat,
      }).title;

  const generated = await generateWorksheetForParent({
    subjectId: entry.subjectId,
    gradeKey: entry.gradeKey,
    topicKey: entry.topicKey,
    levelKey: entry.levelKey,
    count: entry.count,
    seed: entry.seed,
    inkSave: entry.inkSave,
    title,
    mathPracticeFormat: entry.mathPracticeFormat,
    ...(interfaceLocale ? { interfaceLocale } : {}),
    ...(contentLocale ? { contentLocale, instructionLocale: contentLocale } : {}),
  });

  if (!generated.ok) {
    const status = generated.status || 500;
    return res.status(status).json({
      ok: false,
      error: generated.code,
      message: generated.message,
    });
  }

  return res.status(200).json({
    ok: true,
    worksheetPayload: publicWorksheetPayload(generated.worksheetPayload),
    generation: generated.generation,
    slug: entry.slug,
  });
}
