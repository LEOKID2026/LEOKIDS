import {
  MOCK_PARENT,
  MOCK_PROGRESS,
  MOCK_REPORT_CONTRACT,
  MOCK_STUDENTS,
  getMockLocalizedReport,
} from "../../../lib/global/mock-fixtures.js";
import { createTranslator } from "../../../lib/i18n/create-translator.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const locale = String(req.query?.locale || "en").trim() || "en";
  const { t } = createTranslator(locale);
  const mockReport = getMockLocalizedReport(locale);

  return res.status(200).json({
    ok: true,
    mockMode: true,
    locale,
    parent: MOCK_PARENT,
    students: MOCK_STUDENTS,
    progress: MOCK_PROGRESS,
    contract: MOCK_REPORT_CONTRACT,
    localized: mockReport.localized,
    mockBanner: t("reports.mockBanner"),
  });
}
