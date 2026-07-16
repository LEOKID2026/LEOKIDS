/**
 * Ready worksheets catalog tab — filters + catalog cards.
 */

import { WORKSHEET_SUBJECT_ALLOWLIST } from "../../lib/worksheets/worksheet-print-allowlist.js";
import { WORKSHEET_LEVEL_OPTIONS } from "../../lib/worksheets/worksheet-level-display.js";
import {
  useWorksheetUi,
  worksheetGradeLabel,
  worksheetLevelLabel,
  worksheetSubjectLabel,
} from "../../hooks/useWorksheetUi.js";
import { useT } from "../../lib/i18n/I18nProvider.jsx";
import WorksheetIncludeAnswersOption from "./WorksheetIncludeAnswersOption.jsx";

const GRADE_FILTER_KEYS = ["", "g1", "g2", "g3", "g4", "g5", "g6"];

/**
 * @param {{
 *   items: Array<Record<string, unknown>>,
 *   loading: boolean,
 *   error: string,
 *   onViewPrint: (slug: string) => void,
 *   busySlug: string | null,
 *   filterSubject: string,
 *   filterGrade: string,
 *   filterLevel: string,
 *   onFilterChange: (patch: Record<string, string>) => void,
 *   includeAnswers: boolean,
 *   includeAnswersReady: boolean,
 *   onIncludeAnswersChange: (includeAnswers: boolean) => void,
 *   T: Record<string, string>,
 *   titleOverride?: string,
 *   hintOverride?: string,
 * }} props
 */
export default function ReadyWorksheetsTab({
  items,
  loading,
  error,
  onViewPrint,
  busySlug,
  filterSubject,
  filterGrade,
  filterLevel,
  onFilterChange,
  includeAnswers,
  includeAnswersReady,
  onIncludeAnswersChange,
  T,
  titleOverride,
  hintOverride,
}) {
  const ui = useWorksheetUi();
  const t = useT();

  if (loading) {
    return (
      <div className={`worksheet-hub-panel ${T.panel}`}>
        <p className={`worksheet-loading-inline ${T.loading}`}>
          <span className="worksheet-loading-dot" aria-hidden="true" />
          {ui.loading}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`worksheet-hub-panel ${T.panel}`}>
        <p className={T.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={`worksheet-hub-panel ${T.panel}`}>
      <h2 className={`worksheet-hub-panel-title ${T.heading}`}>
        {titleOverride || ui.readyTitle}
      </h2>

      <p className={`worksheet-hub-panel-hint ${T.muted}`}>
        {hintOverride || ui.readyHint}
      </p>

      <div className="worksheet-filter-bar">
        <label>
          <span className={`worksheet-filter-label ${T.muted}`}>{ui.subjectField}</span>
          <select
            className={T.inputMt}
            value={filterSubject}
            onChange={(e) => onFilterChange({ filterSubject: e.target.value })}
          >
            <option value="">{ui.subjectFilterAll}</option>
            {Object.keys(WORKSHEET_SUBJECT_ALLOWLIST).map((key) => (
              <option key={key} value={key}>
                {worksheetSubjectLabel(t, key)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className={`worksheet-filter-label ${T.muted}`}>{ui.gradeField}</span>
          <select
            className={T.inputMt}
            value={filterGrade}
            onChange={(e) => onFilterChange({ filterGrade: e.target.value })}
          >
            {GRADE_FILTER_KEYS.map((key) => (
              <option key={key || "all"} value={key}>
                {worksheetGradeLabel(t, key)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className={`worksheet-filter-label ${T.muted}`}>{ui.levelField}</span>
          <select
            className={T.inputMt}
            value={filterLevel}
            onChange={(e) => onFilterChange({ filterLevel: e.target.value })}
          >
            <option value="">{ui.levelFilterAll}</option>
            {WORKSHEET_LEVEL_OPTIONS.map((levelOpt) => (
              <option key={levelOpt.key} value={levelOpt.key}>
                {worksheetLevelLabel(t, levelOpt.key)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {includeAnswersReady ? (
        <WorksheetIncludeAnswersOption
          checked={includeAnswers}
          onChange={onIncludeAnswersChange}
          T={T}
          className="worksheet-ready-include-answers"
        />
      ) : null}

      {!items.length ? (
        <div className="worksheet-empty-state">
          <div className="worksheet-empty-state-icon" aria-hidden="true">
            🔍
          </div>
          <p className={`worksheet-empty-state-title ${T.heading}`}>{ui.readyEmptyTitle}</p>
          <p className={`worksheet-empty-state-text ${T.muted}`}>{ui.readyEmptyText}</p>
        </div>
      ) : (
        <div className="worksheet-ready-grid">
          {items.map((item) => (
            <article key={item.slug} className="worksheet-ready-card">
              <div>
                <div className="worksheet-ready-card-top">
                  <span className="worksheet-subject-badge" data-subject={item.subjectId}>
                    {item.subjectHe}
                  </span>
                  <span className="worksheet-level-pill" data-level={item.levelKey}>
                    {item.levelHe}
                  </span>
                </div>
                <h3 className={`worksheet-ready-card-title ${T.heading}`}>{item.topicHe}</h3>
                <p className={`worksheet-ready-card-meta ${T.cardMeta}`}>{item.gradeHe}</p>
                <p className={`worksheet-ready-card-count ${T.muted}`}>
                  {item.count} {ui.questionCount}
                </p>
              </div>
              <button
                type="button"
                disabled={busySlug === item.slug}
                onClick={() => onViewPrint(item.slug)}
                className={T.cardReportBtn}
              >
                {busySlug === item.slug ? ui.loading : ui.viewAndPrint}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
