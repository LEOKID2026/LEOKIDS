import { useCallback, useEffect, useState } from "react";
import { teacherAuthFetch } from "../../lib/teacher-portal/teacher-ui.js";
import { REPORT_SUBJECTS, subjectLabelHe } from "../../lib/teacher-portal/teacher-ui.js";
import { ACTIVITY_PREVIEW_SUPPORTED_SUBJECTS } from "../../lib/classroom-activities/classroom-activities-preview.js";
import { generateActivityQuestionSetClient } from "../../lib/classroom-activities/generate-activity-questions-client.js";
import {
  activityModeLabelHe,
  activityStatusLabelHe,
  studentActivityStatusLabelHe,
} from "../../lib/classroom-activities/classroom-activities-labels.client.js";
import ActivityDisplayLevelSelector from "../classroom-activities/ActivityDisplayLevelSelector.jsx";
import { writeActivityDifficultyFromDisplayLevel } from "../../lib/learning/activity-display-level.js";

const MODES = ["guided_practice", "quiz", "homework"];

export default function TeacherStudentIndividualActivitiesPanel({ accessToken, studentId, gradeLevel }) {
  const [activities, setActivities] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("math");
  const [topic, setTopic] = useState("Addition");
  const [mode, setMode] = useState("homework");
  const [displayLevel, setDisplayLevel] = useState("regular");
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState("");
  const [preview, setPreview] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!accessToken || !studentId) return;
    try {
      const res = await teacherAuthFetch(
        accessToken,
        `/api/teacher/student-activities?studentId=${encodeURIComponent(studentId)}`
      );
      const json = await res.json().catch(() => ({}));
      if (res.ok && json?.data?.activities) {
        setActivities(json.data.activities);
      }
    } catch {
      /* non-blocking */
    } finally {
      setLoaded(true);
    }
  }, [accessToken, studentId]);

  useEffect(() => {
    void load();
  }, [load]);

  const runPreview = async () => {
    setBusy(true);
    setError("");
    try {
      const qs = await generateActivityQuestionSetClient({
        subject,
        gradeLevel: gradeLevel || "g3",
        topic,
        difficulty: displayLevel,
        count: questionCount,
      });
      setPreview(qs);
    } catch (e) {
      setError(e?.message || "Could not create question preview");
      setPreview([]);
    } finally {
      setBusy(false);
    }
  };

  const createDraft = async () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    if (!preview.length) {
      setError("Please preview the questions before saving");
      return;
    }
    if (mode === "quiz" && !timeLimitSeconds) {
      setError("Quiz mode requires a time limit in seconds");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const body = {
        studentId,
        title: title.trim(),
        subject,
        topic: topic.trim(),
        mode,
        questionSelection: "same_exact",
        difficultyLevel: writeActivityDifficultyFromDisplayLevel(displayLevel, subject),
        questionCount: Number(questionCount),
        questionSet: preview,
        gradeLevel: gradeLevel || "g3",
      };
      if (timeLimitSeconds) body.timeLimitSeconds = Number(timeLimitSeconds);

      const res = await teacherAuthFetch(accessToken, "/api/teacher/student-activities", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message || json?.error?.code || "Could not create the activity");
        return;
      }
      const activityId = json?.data?.activityId;
      if (activityId) {
        await teacherAuthFetch(
          accessToken,
          `/api/teacher/student-activities/${encodeURIComponent(activityId)}/status`,
          { method: "PATCH", body: JSON.stringify({ action: "activate" }) }
        );
      }
      setShowForm(false);
      setTitle("");
      setPreview([]);
      await load();
    } catch {
      setError("A network error occurred");
    } finally {
      setBusy(false);
    }
  };

  const patchStatus = async (activityId, action) => {
    setBusy(true);
    setError("");
    try {
      const res = await teacherAuthFetch(
        accessToken,
        `/api/teacher/student-activities/${encodeURIComponent(activityId)}/status`,
        { method: "PATCH", body: JSON.stringify({ action }) }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message || json?.error?.code || "Could not update the activity");
        return;
      }
      await load();
    } catch {
      setError("A network error occurred");
    } finally {
      setBusy(false);
    }
  };

  if (!accessToken || !studentId) return null;

  return (
    <section
      className="rounded-xl border border-violet-500/25 bg-violet-950/20 p-5 mb-6"
      data-testid="teacher-student-individual-activities"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold">Individual student activities</h2>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-violet-500/90 hover:bg-violet-400 text-black text-sm font-bold px-4 py-2"
        >
          {showForm ? "Cancel" : "Create individual student activity"}
        </button>
      </div>

      {error ? (
        <p className="mb-3 text-red-200 text-sm border border-red-400/30 bg-red-500/10 px-3 py-2 rounded-lg">
          {error}
        </p>
      ) : null}

      {showForm ? (
        <div className="grid gap-3 md:grid-cols-2 mb-4 text-sm">
          <label className="block">
            <span className="text-white/70">Title</span>
            <input
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />
          </label>
          <label className="block">
            <span className="text-white/70">Subject</span>
            <select
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {REPORT_SUBJECTS.filter((s) => ACTIVITY_PREVIEW_SUPPORTED_SUBJECTS.has(s)).map((s) => (
                <option key={s} value={s}>
                  {subjectLabelHe(s)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-white/70">Topic</span>
            <input
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-white/70">Activity type</span>
            <select
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              {MODES.map((m) => (
                <option key={m} value={m}>
                  {activityModeLabelHe(m)}
                </option>
              ))}
            </select>
          </label>
          <ActivityDisplayLevelSelector
            subjectId={subject}
            value={displayLevel}
            onChange={(dl) => {
              setDisplayLevel(dl);
              setPreview([]);
            }}
            variant="select"
            label="Level"
            inputClassName="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
          />
          <label className="block">
            <span className="text-white/70">Number of questions</span>
            <input
              type="number"
              min={1}
              max={50}
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
            />
          </label>
          <label className="block">
            <span className="text-white/70">Time limit (seconds, for quizzes)</span>
            <input
              type="number"
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
              value={timeLimitSeconds}
              onChange={(e) => setTimeLimitSeconds(e.target.value)}
            />
          </label>
          <div className="md:col-span-2 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void runPreview()}
              className="rounded-lg border border-white/25 px-4 py-2 hover:bg-white/10"
            >
              {busy ? "Generating…" : "Preview questions"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void createDraft()}
              className="rounded-lg bg-violet-500 text-black font-bold px-4 py-2"
            >
              Save and launch
            </button>
          </div>
          {preview.length > 0 ? (
            <p className="md:col-span-2 text-white/60 text-xs">
              Preview ({preview.length} questions)
            </p>
          ) : null}
        </div>
      ) : null}

      {loaded && activities.length === 0 && !showForm ? (
        <p className="text-white/60 text-sm">No individual activities yet</p>
      ) : null}

      {activities.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {activities.map((a) => (
            <li
              key={a.activityId}
              className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 flex flex-wrap items-center justify-between gap-2"
            >
              <div>
                <span className="font-semibold">{a.title}</span>
                <span className="text-white/50 mx-2">·</span>
                <span className="text-white/70">
                  {activityStatusLabelHe(a.status)} · {activityModeLabelHe(a.mode)}
                </span>
                {a.studentStatus ? (
                  <span className="text-white/50 block text-xs mt-0.5">
                    {studentActivityStatusLabelHe(a.studentStatus) || a.studentStatus}
                    {a.scorePct != null ? ` · ${a.scorePct}%` : ""}
                  </span>
                ) : null}
              </div>
              <div className="flex gap-2">
                {a.status === "draft" ? (
                  <button
                    type="button"
                    disabled={busy}
                    className="text-xs text-violet-300 hover:underline"
                    onClick={() => void patchStatus(a.activityId, "activate")}
                  >
                    Launch
                  </button>
                ) : null}
                {a.status === "active" ? (
                  <button
                    type="button"
                    disabled={busy}
                    className="text-xs text-amber-300 hover:underline"
                    onClick={() => void patchStatus(a.activityId, "close")}
                  >
                    Close
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
