import { globalBurnDownCopy } from "../../../../../lib/i18n/global-burn-down-copy.js";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../../components/Layout";
import TeacherPortalShell from "../../../../../components/teacher-portal/TeacherPortalShell";
import TeacherClassActivitiesNav from "../../../../../components/teacher-portal/TeacherClassActivitiesNav";
import { getLearningSupabaseBrowserClient } from "../../../../../lib/learning-supabase/client";
import { resolveTeacherAccessToken } from "../../../../../lib/teacher-portal/use-teacher-portal-session";
import { teacherAuthFetch } from "../../../../../lib/teacher-portal/teacher-ui.js";
import { REPORT_SUBJECTS, subjectLabel, activitySubjectsForGrade } from "../../../../../lib/teacher-portal/teacher-ui.js";
import { ACTIVITY_PREVIEW_SUPPORTED_SUBJECTS } from "../../../../../lib/classroom-activities/classroom-activities-preview.js";
import { generateActivityQuestionSetClient } from "../../../../../lib/classroom-activities/generate-activity-questions-client.js";
import { activityModeLabelHe } from "../../../../../lib/classroom-activities/classroom-activities-labels.client.js";
import {
  loadClassActivityContextFromApiClass,
  resolveCanonicalGradeKey,
} from "../../../../../lib/teacher-portal/teacher-class-grade.js";
import {
  defaultTopicForAssignedActivity,
  topicOptionsForAssignedActivity,
} from "../../../../../lib/classroom-activities/assigned-activity-topic-options.js";
import {
  geometryTopicOptionsForGrade,
  mathTopicOptionsForGrade,
  scienceTopicOptionsForGrade,
} from "../../../../../lib/teacher-portal/teacher-class-topic-options.js";
import AssignedActivityQuestionDisplay from "../../../../../components/classroom-activities/AssignedActivityQuestionDisplay.jsx";
import ActivityDisplayLevelSelector from "../../../../../components/classroom-activities/ActivityDisplayLevelSelector.jsx";
import { writeActivityDifficultyFromDisplayLevel } from "../../../../../lib/learning/activity-display-level.js";

export async function getServerSideProps(context) {
  const classId = String(context.params?.classId || "").trim();
  return { props: { classId } };
}

const MODES = ["guided_practice", "quiz", "homework", "live_lesson"];
const ACT_NEW = "pages__teacher__class__[classId]__activities__new";
const GRADE_PACK = "lib__teacher-portal__teacher-class-grade";
const GRADE_COPY_KEYS = {
  g1: "grade_1",
  g2: "grade_2",
  g3: "grade_3",
  g4: "grade_4",
  g5: "grade_5",
  g6: "grade_6",
};
function actNewCopy(key, vars) {
  let t = globalBurnDownCopy(ACT_NEW, key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      t = t.split("{" + k + "}").join(String(v));
    }
  }
  return t;
}
function gradeLabel(gradeLevel) {
  const key = String(gradeLevel || "").trim().toLowerCase();
  const copyKey = GRADE_COPY_KEYS[key];
  if (copyKey) return globalBurnDownCopy(GRADE_PACK, copyKey);
  return key;
}

export default function TeacherNewActivityPage({ classId }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("math");
  const [topic, setTopic] = useState(() => defaultTopicForAssignedActivity("math", "g3"));
  const [subtopic, setSubtopic] = useState("");
  const [mode, setMode] = useState("guided_practice");
  const [displayLevel, setDisplayLevel] = useState("regular");
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [gradeLevel, setGradeLevel] = useState("g3");
  const [classContext, setClassContext] = useState({
    gradeLocked: false,
    subjectLocked: false,
    className: "",
    loaded: false,
  });
  const [creationBlocked, setCreationBlocked] = useState(false);
  const [contextError, setContextError] = useState("");
  const [preview, setPreview] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = getLearningSupabaseBrowserClient();
        const session = await resolveTeacherAccessToken(supabase);
        if (!session.ok) {
          router.replace("/teacher/login");
          return;
        }
        const res = await teacherAuthFetch(
          session.token,
          `/api/teacher/classes/${encodeURIComponent(classId)}`
        );
        const json = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.status === 403) {
          setContextError(actNewCopy("err_no_permission"));
          setCreationBlocked(true);
          setClassContext((prev) => ({ ...prev, loaded: true }));
          return;
        }
        if (!res.ok) {
          setContextError(json?.error?.message || actNewCopy("err_load_class"));
          setClassContext((prev) => ({ ...prev, loaded: true }));
          return;
        }
        const cls = json?.data?.class;
        if (!cls) {
          setClassContext((prev) => ({ ...prev, loaded: true }));
          return;
        }
        const ctx = loadClassActivityContextFromApiClass(cls);
        if (ctx.gradeLocked && !ctx.gradeKey) {
          setContextError(actNewCopy("err_invalid_grade"));
          setClassContext({ ...ctx, loaded: true });
          return;
        }
        const nextGrade = ctx.gradeKey || resolveCanonicalGradeKey(cls.gradeLevel) || "g3";
        if (ctx.subjectFocus) {
          setSubject(ctx.subjectFocus);
          setTopic(defaultTopicForAssignedActivity(ctx.subjectFocus, nextGrade));
        } else {
          setTopic(defaultTopicForAssignedActivity(subject, nextGrade));
        }
        setGradeLevel(nextGrade);
        setClassContext({ ...ctx, loaded: true });
      } catch {
        if (!cancelled) {
          setContextError(actNewCopy("network_error"));
          setClassContext((prev) => ({ ...prev, loaded: true }));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [classId, router]); // eslint-disable-line react-hooks/exhaustive-deps

  const topicOpts = topicOptionsForAssignedActivity(subject, gradeLevel);

  useEffect(() => {
    if (topicOpts.length && !topicOpts.some((o) => o.key === topic)) {
      setTopic(topicOpts[0].key);
    } else if (topicOpts.length === 0 && topic !== "") {
      setTopic("");
    }
  }, [subject, gradeLevel, topic, topicOpts]);

  useEffect(() => {
    if (activitySubjectsForGrade(gradeLevel).includes(subject)) return;
    const next = activitySubjectsForGrade(gradeLevel).find((s) =>
      ACTIVITY_PREVIEW_SUPPORTED_SUBJECTS.has(s)
    );
    if (next) {
      setSubject(next);
      setTopic(defaultTopicForAssignedActivity(next, gradeLevel));
    }
  }, [gradeLevel, subject]);

  const runPreview = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const qs = await generateActivityQuestionSetClient({
        subject,
        gradeLevel,
        topic,
        difficulty: displayLevel,
        count: questionCount,
      });
      setPreview(qs);
    } catch (e) {
      setError(e?.message || actNewCopy("err_preview"));
      setPreview([]);
    } finally {
      setBusy(false);
    }
  }, [subject, gradeLevel, topic, displayLevel, questionCount]);

  const createDraft = useCallback(async () => {
    if (!title.trim()) {
      setError(actNewCopy("err_enter_title"));
      return;
    }
    if (!preview.length) {
      setError(actNewCopy("err_preview_first"));
      return;
    }
    setBusy(true);
    setError("");
    try {
      const supabase = getLearningSupabaseBrowserClient();
      const session = await resolveTeacherAccessToken(supabase);
      if (!session.ok) {
        router.replace("/teacher/login");
        return;
      }
      const body = {
        classId,
        title: title.trim(),
        subject,
        topic: topic.trim(),
        subtopic: subtopic.trim() || null,
        mode,
        questionSelection: "same_exact",
        difficultyLevel: writeActivityDifficultyFromDisplayLevel(displayLevel, subject),
        questionCount: Number(questionCount),
        questionSet: preview,
        gradeLevel: resolveCanonicalGradeKey(gradeLevel) || gradeLevel,
      };
      if (timeLimitSeconds) body.timeLimitSeconds = Number(timeLimitSeconds);
      if (dueAt) body.dueAt = new Date(dueAt).toISOString();
      if (mode === "quiz" && !timeLimitSeconds) {
        setError(actNewCopy("err_quiz_time"));
        setBusy(false);
        return;
      }

      const res = await teacherAuthFetch(session.token, "/api/teacher/activities", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error?.message || json?.error?.code || actNewCopy("err_save"));
        return;
      }
      const activityId = json?.data?.activityId;
      if (activityId) {
        router.push(
          `/teacher/class/${encodeURIComponent(classId)}/activities/${encodeURIComponent(activityId)}/monitor`
        );
      }
    } catch {
      setError(actNewCopy("network_error"));
    } finally {
      setBusy(false);
    }
  }, [
    classId,
    title,
    subject,
    topic,
    subtopic,
    mode,
    displayLevel,
    questionCount,
    preview,
    timeLimitSeconds,
    dueAt,
    gradeLevel,
    router,
  ]);

  return (
    <Layout>
      <TeacherPortalShell title={actNewCopy("new_activity")} backHref={`/teacher/class/${classId}/activities`} backLabel={actNewCopy("back_to_activities")}>
        <TeacherClassActivitiesNav classId={classId} />

        {error || contextError ? (
          <p className="mb-4 text-red-200 text-sm rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2">
            {error || contextError}
          </p>
        ) : null}

        {creationBlocked ? null : (
        <>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <label className="block text-sm">
            <span className="text-white/70">{actNewCopy("title")}</span>
            <input
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />
          </label>
          <label className="block text-sm">
            <span className="text-white/70">{actNewCopy("subject")}</span>
            {classContext.subjectLocked ? (
              <input
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 opacity-70"
                value={subjectLabel(subject)}
                readOnly
                disabled
              />
            ) : (
            <select
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
              value={subject}
              onChange={(e) => {
                const next = e.target.value;
                setSubject(next);
                setTopic(defaultTopicForAssignedActivity(next, gradeLevel));
              }}
            >
              {activitySubjectsForGrade(gradeLevel, REPORT_SUBJECTS)
                .filter((s) => ACTIVITY_PREVIEW_SUPPORTED_SUBJECTS.has(s))
                .map((s) => (
                <option key={s} value={s}>
                  {subjectLabel(s)}
                </option>
              ))}
            </select>
            )}
          </label>
          <label className="block text-sm">
            <span className="text-white/70">{actNewCopy("topic")}</span>
            {subject === "science" && topicOpts.length === 0 ? (
              <p className="mt-1 text-amber-200 text-sm rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2">
                {actNewCopy("no_science_topics")}
              </p>
            ) : subject !== "science" && topicOpts.length === 0 ? (
              <p className="mt-1 text-amber-200 text-sm rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2">
                {actNewCopy("no_subject_topics")}
              </p>
            ) : subject === "geometry" ? (
              <select
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {geometryTopicOptionsForGrade(gradeLevel).map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            ) : subject === "english" ? (
              <select
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {topicOpts.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            ) : subject === "math" ? (
              <select
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {mathTopicOptionsForGrade(gradeLevel).map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            ) : subject === "science" ? (
              <select
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {scienceTopicOptionsForGrade(gradeLevel).map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            )}
          </label>
          <label className="block text-sm">
            <span className="text-white/70">{actNewCopy("subtopic_optional")}</span>
            <input
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
              value={subtopic}
              onChange={(e) => setSubtopic(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-white/70">{actNewCopy("grade_for_questions")}</span>
            {classContext.gradeLocked ? (
              <input
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 opacity-70"
                value={gradeLabel(gradeLevel)}
                readOnly
                disabled
              />
            ) : (
            <select
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
              value={gradeLevel}
              onChange={(e) => {
                const g = e.target.value;
                setGradeLevel(g);
                setTopic(defaultTopicForAssignedActivity(subject, g));
              }}
            >
              {["g1", "g2", "g3", "g4", "g5", "g6"].map((g) => (
                <option key={g} value={g}>
                  {gradeLabel(g)}
                </option>
              ))}
            </select>
            )}
          </label>
          <label className="block text-sm">
            <span className="text-white/70">{actNewCopy("activity_mode")}</span>
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
            label={globalBurnDownCopy("pages__teacher__class__[classId]__activities__new", "level")}
            className=""
            inputClassName="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
          />
          <label className="block text-sm">
            <span className="text-white/70">{actNewCopy("number_of_questions")}</span>
            <input
              type="number"
              min={1}
              max={50}
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            <span className="text-white/70">{actNewCopy("time_limit_optional")}</span>
            <input
              type="number"
              min={30}
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
              value={timeLimitSeconds}
              onChange={(e) => setTimeLimitSeconds(e.target.value)}
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="text-white/70">{actNewCopy("due_date_optional")}</span>
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            disabled={busy || !topic || creationBlocked}
            onClick={runPreview}
            className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 text-sm"
          >
            {busy ? actNewCopy("generating") : actNewCopy("preview_questions")}
          </button>
          <button
            type="button"
            disabled={busy || !preview.length || creationBlocked}
            onClick={createDraft}
            className="px-4 py-2 rounded-xl bg-amber-500/90 text-black font-semibold text-sm disabled:opacity-50"
          >
            {actNewCopy("save_draft")}
          </button>
        </div>

        {preview.length > 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h2 className="text-lg font-semibold mb-3">{actNewCopy("preview_heading", { n: preview.length })}</h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-white/90">
              {preview.map((q, i) => (
                <li key={i} className="list-item">
                  <AssignedActivityQuestionDisplay question={q} variant="preview" />
                  <span className="text-white/40 text-xs me-2"> {actNewCopy("not_sent_hint")}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
        </>
        )}
      </TeacherPortalShell>
    </Layout>
  );
}
