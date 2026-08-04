import React from "react";
import {
  studentDisplayLevelKeys,
  studentDisplayLevelLabel,
} from "../../lib/learning-client/student-display-level-practice.js";
import { useLearningMasterStrings } from "../../hooks/useLearningMasterStrings.js";

/**
 * Student-facing display level selector (Regular / Advanced). Science: hidden (regular-only).
 * Labels resolve from burn-down pack (lib__learning__display-level) with learning.json fallback.
 */
export function StudentDisplayLevelSelect({
  subjectId,
  value,
  onChange,
  disabled = false,
  className = "",
  title,
}) {
  const { getDisplayLevelLabel } = useLearningMasterStrings(subjectId);
  const keys = studentDisplayLevelKeys(subjectId);
  if (keys.length <= 1) return null;

  const labelFor = (dl) => studentDisplayLevelLabel(dl) || getDisplayLevelLabel(dl);

  return (
    <select
      value={value}
      title={title || labelFor(value)}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      className={className}
      data-testid="student-display-level-select"
    >
      {keys.map((dl) => (
        <option key={dl} value={dl}>
          {labelFor(dl)}
        </option>
      ))}
    </select>
  );
}

/**
 * Read-only label when only regular is available (science).
 */
export function StudentDisplayLevelRegularOnly({ className = "", subjectId = "science" }) {
  const { getDisplayLevelLabel } = useLearningMasterStrings(subjectId);
  return (
    <span className={className} data-testid="student-display-level-regular-only">
      {studentDisplayLevelLabel("regular") || getDisplayLevelLabel("regular")}
    </span>
  );
}
