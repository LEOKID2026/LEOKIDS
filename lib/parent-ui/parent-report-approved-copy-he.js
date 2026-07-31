/**
 * Global compatibility shim — legacy `*He` names delegate to English approved copy.
 * Authority: parent-report-approved-copy.js (report packs / EN parent language).
 */

export {
  cleanRegisteredGradeFromFreeText as cleanRegisteredGradeFromFreeTextHe,
  topicTitleForFreeText as topicTitleForFreeTextHe,
  sanitizeRegularReportFreeText as sanitizeRegularReportFreeTextHe,
  buildApprovedTopicCopy as buildApprovedTopicCopyHe,
  buildRegularReportTopicExplainCard as buildRegularReportTopicExplainCardHe,
} from "./parent-report-approved-copy.js";
