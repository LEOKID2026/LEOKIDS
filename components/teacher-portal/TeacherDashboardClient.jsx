import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { filterStudentsByRosterKey } from "../../lib/teacher-portal/teacher-dashboard-roster.js";
import { effectivePhysicalClassStudentCount } from "../../lib/teacher-portal/teacher-physical-class.js";
import {
  DASHBOARD_CREATE_CLASS_BUTTON,
  DASHBOARD_CREATE_CLASS_LABEL,
  DASHBOARD_CREATE_CLASS_PLACEHOLDER,
  DASHBOARD_NO_CLASSES_HINT,
  DASHBOARD_NO_CLASSES_TITLE,
  formatTeacherAttentionStudentLineHe,
  rosterFilterLabelHe,
  subjectLabelHe,
  teacherAuthFetch,
} from "../../lib/teacher-portal/teacher-ui.js";
import TeacherInviteOthersButton from "./TeacherInviteOthersButton";
import {
  getTeacherPortalTheme,
  teacherStatusBadgeClass,
} from "../../lib/teacher-ui/teacher-portal-theme.client.js";

const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "struggling", label: "Needs intervention / reinforcement" },
  { key: "low_activity", label: "Low activity" },
  { key: "watch", label: "Watch" },
  { key: "strong", label: "Strong" },
];

const SORT_OPTIONS = [
  { key: "name", label: "Name" },
  { key: "activity", label: "Last activity" },
  { key: "status", label: "Learning status" },
];

function formatCompactStudentStats(student, { activityLoading = false } = {}) {
  if (student.activityPending || activityLoading) {
    return "Loading activity data…";
  }
  const sessions = Number(student.totalSessions) || 0;
  const answers = Number(student.totalAnswers) || 0;
  const acc =
    student.accuracy != null && Number.isFinite(Number(student.accuracy))
      ? `${Math.round(Number(student.accuracy))}%`
      : "-";
  return `Sessions: ${sessions} · Answers: ${answers} · Success: ${acc}`;
}

function StudentDashboardCard({ student, activityLoading = false, T, bright = false }) {
  const pending = Boolean(student.activityPending || activityLoading);
  const badgeLabel = pending ? "Loading…" : student.statusBadge || "-";

  return (
    <li className={T.studentCard}>
      <p
        className="font-semibold text-sm leading-tight truncate"
        title={student.studentFullName}
      >
        {student.studentFullName}
      </p>
      <span
        className={`self-start text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full border leading-none ${teacherStatusBadgeClass(
          pending ? null : student.statusBadge,
          bright
        )}`}
      >
        {badgeLabel}
      </span>
      <p className={T.studentStats}>
        {formatCompactStudentStats(student, { activityLoading })}
      </p>
      <Link href={`/teacher/student/${student.studentId}`} className={T.studentReportLink}>
        View report
      </Link>
    </li>
  );
}

function Modal({ title, onClose, children, T }) {
  return (
    <OverlayFixed>
      <div className={T.modalOverlay} aria-hidden="true" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <ModalCard T={T}>
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button type="button" onClick={onClose} className={T.modalClose}>
              Close
            </button>
          </div>
          {children}
        </ModalCard>
      </div>
    </OverlayFixed>
  );
}

function classLimitErrorMessage(body) {
  const code = body?.error?.code;
  if (code === "class_student_limit_reached") {
    return "This class has reached the 40-student limit. You cannot add more students.";
  }
  return null;
}

function resolveManageClassIds(classInfo) {
  const fromGroup = (classInfo?.subjectClassIds || []).map((s) => s.classId).filter(Boolean);
  if (fromGroup.length) return fromGroup;
  return classInfo?.primaryClassId || classInfo?.classId ? [classInfo.primaryClassId || classInfo.classId] : [];
}

function ClassManagePanel({
  accessToken,
  classInfo,
  allStudents,
  maxStudentsPerClass,
  onClose,
  onRefresh,
  T,
}) {
  const manageClassIds = useMemo(() => resolveManageClassIds(classInfo), [classInfo]);
  const primaryClassId = classInfo?.primaryClassId || classInfo?.classId;
  const [className, setClassName] = useState(classInfo?.name || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const [newStudentName, setNewStudentName] = useState("");
  const [editStudentId, setEditStudentId] = useState(null);
  const [editName, setEditName] = useState("");

  const loadMembers = async () => {
    /** @type {Map<string, Record<string, unknown>>} */
    const merged = new Map();
    for (const cid of manageClassIds) {
      const res = await teacherAuthFetch(accessToken, `/api/teacher/classes/${cid}`);
      const body = await res.json().catch(() => ({}));
      if (res.status !== 200) continue;
      for (const m of body.data?.members || []) {
        if (!merged.has(m.studentId)) {
          merged.set(m.studentId, { ...m, membershipIdsByClass: { [cid]: m.membershipId } });
        } else {
          const row = merged.get(m.studentId);
          row.membershipIdsByClass = { ...row.membershipIdsByClass, [cid]: m.membershipId };
        }
      }
    }
    setMembers([...merged.values()]);
  };

  useEffect(() => {
    if (manageClassIds.length) loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manageClassIds.join(",")]);

  const memberIds = new Set(members.map((m) => m.studentId));
  const addableStudents = allStudents.filter((s) => !memberIds.has(s.studentId));

  const onRenameClass = async () => {
    if (!className.trim()) return;
    setBusy(true);
    setError("");
    const res = await teacherAuthFetch(accessToken, `/api/teacher/classes/${primaryClassId}`, {
      method: "PATCH",
      body: JSON.stringify({ name: className.trim() }),
    });
    setBusy(false);
    if (res.status !== 200) {
      setError("Could not update the class name.");
      return;
    }
    onRefresh();
  };

  const onCreateAndAdd = async () => {
    if (!newStudentName.trim()) return;
    setBusy(true);
    setError("");
    const res = await teacherAuthFetch(accessToken, "/api/teacher/students/create", {
      method: "POST",
      body: JSON.stringify({
        fullName: newStudentName.trim(),
        gradeLevel: classInfo.gradeLevel,
        classId: primaryClassId,
      }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.status !== 201) {
      setError(classLimitErrorMessage(body) || "Could not add student.");
      return;
    }
    setNewStudentName("");
    await loadMembers();
    onRefresh();
    if (body.data?.loginUsername) {
      window.alert(`Student added.\nUsername: ${body.data.loginUsername}\nPIN: 1234`);
    }
  };

  const onAddExisting = async (studentId) => {
    setBusy(true);
    setError("");
    const res = await teacherAuthFetch(
      accessToken,
      `/api/teacher/classes/${primaryClassId}/members`,
      {
        method: "POST",
        body: JSON.stringify({ studentId }),
      }
    );
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.status !== 201) {
      setError(classLimitErrorMessage(body) || "Could not add the student to the class.");
      return;
    }
    await loadMembers();
    onRefresh();
  };

  const perClassCap =
    maxStudentsPerClass != null && Number.isFinite(maxStudentsPerClass)
      ? maxStudentsPerClass
      : null;
  const atClassCap = perClassCap != null && members.length >= perClassCap;

  const onRemoveFromClass = async (member) => {
    if (!window.confirm(globalBurnDownCopy("components__teacher-portal__TeacherDashboardClient", "remove_this_student_from_the_class"))) return;
    setBusy(true);
    setError("");
    const idsByClass = member.membershipIdsByClass || {};
    const pairs = Object.entries(idsByClass);
    if (!pairs.length && member.membershipId && primaryClassId) {
      pairs.push([primaryClassId, member.membershipId]);
    }
    let failed = false;
    for (const [cid, membershipId] of pairs) {
      const res = await teacherAuthFetch(
        accessToken,
        `/api/teacher/classes/${cid}/members/${membershipId}`,
        { method: "DELETE" }
      );
      if (res.status !== 200) failed = true;
    }
    setBusy(false);
    if (failed) {
      setError("Could not remove from class.");
      return;
    }
    await loadMembers();
    onRefresh();
  };

  const onSaveStudentName = async (studentId) => {
    if (!editName.trim()) return;
    setBusy(true);
    const res = await teacherAuthFetch(accessToken, `/api/teacher/students/${studentId}`, {
      method: "PATCH",
      body: JSON.stringify({ fullName: editName.trim() }),
    });
    setBusy(false);
    if (res.status !== 200) {
      setError("Could not update the student's name.");
      return;
    }
    setEditStudentId(null);
    await loadMembers();
    onRefresh();
  };

  const onArchiveStudent = async (studentId) => {
    if (!window.confirm(globalBurnDownCopy("components__teacher-portal__TeacherDashboardClient", "remove_this_student_from_your_teacher_list"))) return;
    setBusy(true);
    const res = await teacherAuthFetch(accessToken, `/api/teacher/students/${studentId}/archive`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    setBusy(false);
    if (res.status !== 200) {
      setError("Could not remove the student.");
      return;
    }
    await loadMembers();
    onRefresh();
  };

  return (
    <Modal title={globalBurnDownCopy("components__teacher-portal__TeacherDashboardClient", "manage_class")} onClose={onClose} T={T}>
      <div className="space-y-4">
        <div>
          <label className={T.label}>Class name</label>
          <div className="flex flex-wrap gap-2">
            <input
              className={T.input}
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
            <button
              type="button"
              disabled={busy}
              onClick={onRenameClass}
              className={T.primaryBtn}
            >
              Save
            </button>
          </div>
        </div>

        <section>
          <h4 className="text-sm font-semibold mb-2">Add student</h4>
          <div className="flex flex-wrap gap-2">
            <input
              className={T.input}
              placeholder={globalBurnDownCopy("components__teacher-portal__TeacherDashboardClient", "full_name_of_new_student")}
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
            />
            <button
              type="button"
              disabled={busy || atClassCap}
              onClick={onCreateAndAdd}
              className={T.emeraldBtn}
            >
              Add
            </button>
          </div>
          {addableStudents.length > 0 ? (
            <div className="mt-2 space-y-1">
              <p className={`text-xs ${T.faint}`}>Linked students not in this class:</p>
              {addableStudents.slice(0, 5).map((s) => (
                <div key={s.studentId} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate">{s.studentFullName}</span>
                  <button
                    type="button"
                    disabled={busy || atClassCap}
                    onClick={() => onAddExisting(s.studentId)}
                    className={`${T.ghostLink} disabled:opacity-50`}
                  >
                    Add to class
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section>
          <h4 className="text-sm font-semibold mb-2">
            Students in class ({members.length}
            {perClassCap != null ? ` / ${perClassCap}` : ""})
          </h4>
          {atClassCap ? <p className={T.warningText}>This class has reached the {perClassCap}-student limit.</p> : null}
          {members.length === 0 ? (
            <p className={T.muted}>No students in this class.</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {members.map((m) => (
                <li key={m.studentId} className={T.panelListItem}>
                  {editStudentId === m.studentId ? (
                    <EditRow>
                      <input
                        className={T.inputSm}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onSaveStudentName(m.studentId)}
                        className={T.successLink}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditStudentId(null)}
                        className={T.mutedLink}
                      >
                        Cancel
                      </button>
                    </EditRow>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium truncate">
                        {m.studentFullName || m.studentFullNameMasked || "Student"}
                      </span>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          type="button"
                          className={T.ghostLink}
                          onClick={() => {
                            setEditStudentId(m.studentId);
                            setEditName(m.studentFullName || m.studentFullNameMasked || "");
                          }}
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          className={T.mutedLink}
                          onClick={() => onRemoveFromClass(m)}
                        >
                          Remove from class
                        </button>
                        <button
                          type="button"
                          className={T.dangerLink}
                          onClick={() => onArchiveStudent(m.studentId)}
                        >
                          Remove from list
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {error ? (
          <p className={T.error} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </Modal>
  );
}

function OverlayFixed({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {children}
    </div>
  );
}

function ModalCard({ children, T }) {
  return <div className={T.modalPanel}>{children}</div>;
}

function EditRow({ children }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function rosterFilterLabel(option) {
  return rosterFilterLabelHe(option) || "";
}

function ClassesEmptyState({ accessToken, onCreated, T }) {
  const [className, setClassName] = useState("Class 3 - LEO");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onCreateClass = async () => {
    const name = className.trim();
    if (!name) return;
    setBusy(true);
    setError("");
    const res = await teacherAuthFetch(accessToken, "/api/teacher/classes", {
      method: "POST",
      body: JSON.stringify({ name, gradeLevel: "g3" }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.status !== 201) {
      setError(body?.error?.message || "Could not create class.");
      return;
    }
    onCreated?.();
  };

  return (
    <section className={T.emptySection} data-testid="teacher-classes-empty-state">
      <h2 className="text-lg font-semibold mb-2">Classes</h2>
      <p className={`text-sm mb-1 ${T.muted}`}>{DASHBOARD_NO_CLASSES_TITLE}</p>
      <p className={`text-sm mb-4 ${T.faint}`}>{DASHBOARD_NO_CLASSES_HINT}</p>
      <label className="block text-sm mb-3">
        <span className={T.emptyLabel}>{DASHBOARD_CREATE_CLASS_LABEL}</span>
        <input
          className={T.emptyInput}
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder={DASHBOARD_CREATE_CLASS_PLACEHOLDER}
        />
      </label>
      <button
        type="button"
        disabled={busy || !className.trim()}
        onClick={() => void onCreateClass()}
        className={T.primaryBtn}
      >
        {busy ? "Creating…" : DASHBOARD_CREATE_CLASS_BUTTON}
      </button>
      {error ? (
        <p className={`${T.error} mt-3`} role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}

export default function TeacherDashboardClient({
  accessToken,
  dashboard,
  activityLoading = false,
  onLogout,
  onRefresh,
  bright = false,
}) {
  const T = getTeacherPortalTheme(bright);
  const [search, setSearch] = useState("");
  const [rosterFilterKey, setRosterFilterKey] = useState(
    () => dashboard?.defaultRosterFilterKey || "all"
  );
  const [filterKey, setFilterKey] = useState("all");
  const [sortKey, setSortKey] = useState("name");
  const [manageClass, setManageClass] = useState(null);

  const rosterFilters = dashboard?.rosterFilters || [];

  const filteredStudents = useMemo(() => {
    let list = filterStudentsByRosterKey(
      dashboard?.students || [],
      rosterFilterKey,
      rosterFilters
    );
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((s) => String(s.studentFullName || "").toLowerCase().includes(q));
    }
    if (filterKey !== "all") {
      list = list.filter((s) => s.statusFilterKey === filterKey);
    }
    list.sort((a, b) => {
      if (sortKey === "name") {
        return String(a.studentFullName || "").localeCompare(String(b.studentFullName || ""), "he");
      }
      if (sortKey === "activity") {
        const pendingA = a.activityPending ? 1 : 0;
        const pendingB = b.activityPending ? 1 : 0;
        if (pendingA !== pendingB) return pendingA - pendingB;
        return (Number(b.totalAnswers) || 0) - (Number(a.totalAnswers) || 0);
      }
      if (sortKey === "status") {
        return (a.statusSortRank || 99) - (b.statusSortRank || 99);
      }
      return 0;
    });
    return list;
  }, [dashboard?.students, rosterFilterKey, rosterFilters, search, filterKey, sortKey]);

  const activeRosterOption = useMemo(
    () => rosterFilters.find((o) => o.key === rosterFilterKey) || null,
    [rosterFilters, rosterFilterKey]
  );

  const displayName = dashboard?.teacher?.displayName;

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={`text-xl font-semibold ${T.heading}`}>
            {displayName ? `Hi, ${displayName}` : "Hi, teacher"}
          </p>
          <p className={`text-sm mt-1 ${T.subheading}`}>Dashboard — classes and students</p>
        </div>
        <button type="button" onClick={onLogout} className={T.logoutBtn}>
          Sign out
        </button>
      </div>

      <section className={T.section}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryStat
            label={globalBurnDownCopy("components__teacher-portal__TeacherDashboardClient", "students")}
            value={dashboard?.summary?.studentCount ?? 0}
            testId="teacher-dashboard-summary-students"
            T={T}
          />
          <SummaryStat label={globalBurnDownCopy("components__teacher-portal__TeacherDashboardClient", "classes")} value={dashboard?.summary?.classCount ?? 0} T={T} />
          <div className="col-span-2 flex flex-col justify-center gap-2">
            <p className={`text-xs mb-1 ${T.faint}`}>Latest topic/activity</p>
            <p
              className={`text-sm font-medium leading-snug ${T.heading}`}
              data-testid="teacher-dashboard-latest-subject"
            >
              {activityLoading
                ? "Loading activity data…"
                : dashboard?.summary?.latestSubjectLabel || "Not enough data yet"}
            </p>
            <Link
              href="/teacher/worksheets"
              className={T.linkViolet}
              data-testid="teacher-dashboard-worksheets-link"
            >
              Worksheets →
            </Link>
            <Link
              href="/teacher/students/activities/new"
              className={T.linkEmerald}
              data-testid="teacher-dashboard-private-students-activity-link"
            >
              Send activity to private students →
            </Link>
          </div>
        </div>
      </section>

      {(dashboard?.teacherAttentionSignals?.topAttentionStudents || []).length > 0 ? (
        <section className={T.attentionSection} data-testid="teacher-dashboard-attention-signals">
          <h2 className={`text-lg font-semibold mb-3 ${T.heading}`}>Students who need attention</h2>
          <ul className="grid gap-2 sm:grid-cols-3">
            {dashboard.teacherAttentionSignals.topAttentionStudents.map((s) => (
              <li key={s.studentId} className={T.attentionCard}>
                <span className="font-semibold truncate">
                  {formatTeacherAttentionStudentLineHe(
                    s.studentFullNameMasked,
                    s.classDisplayLabel
                  )}
                </span>
                <span className={T.attentionSeverity}>
                  {s.guidanceSeverityTier === "critical"
                    ? "Needs immediate attention"
                    : s.guidanceSeverityTier === "needs_reinforcement"
                      ? "Needs reinforcement"
                      : s.riskLevel === "high"
                        ? "Needs immediate attention"
                        : "Worth monitoring"}
                </span>
                {s.topWeakTopicLabelHe ? (
                  <span className={T.attentionTopic}>{s.topWeakTopicLabelHe}</span>
                ) : null}
                <span className={T.attentionMeta}>
                  {s.accuracyPct != null ? `${Math.round(s.accuracyPct)}% success` : ""}
                  {s.totalAnswers ? ` · ${s.totalAnswers} answers` : ""}
                </span>
                <Link
                  href={`/teacher/student/${encodeURIComponent(s.studentId)}`}
                  className={T.attentionLink}
                >
                  View report
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard?.classes || []).length > 0 ? (
        <section className={T.classSection} data-testid="teacher-class-cards-section">
          <h2 className={`text-lg font-semibold mb-3 ${T.heading}`}>My classes</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {(dashboard.classes || []).map((c) => {
              const rosterKey = c.physicalGroupKey || c.classId;
              const subjectClasses = (c.subjectClassIds || []).filter((s) => s?.classId);
              const classRouteId =
                subjectClasses[0]?.classId || c.primaryClassId || c.classId;
              const classBase = classRouteId
                ? `/teacher/class/${encodeURIComponent(classRouteId)}`
                : "";
              const studentCount = effectivePhysicalClassStudentCount(c);
              const subjectLinkLabel = (s) =>
                s.subjectLabel || subjectLabelHe(s.subjectFocus) || "Class";
              const reportLinks =
                subjectClasses.length > 1
                  ? subjectClasses.map((s) => ({
                      classId: s.classId,
                      href: `/teacher/class/${encodeURIComponent(s.classId)}`,
                      label: `Report ${subjectLinkLabel(s)}`,
                    }))
                  : classBase
                    ? [
                        {
                          classId: classRouteId,
                          href: classBase,
                          label: globalBurnDownCopy("components__teacher-portal__TeacherDashboardClient", "class_report"),
                        },
                      ]
                    : [];
              const activityLinks =
                subjectClasses.length > 1
                  ? subjectClasses.map((s) => ({
                      classId: s.classId,
                      href: `/teacher/class/${encodeURIComponent(s.classId)}/activities/new`,
                      label: `Activity ${subjectLinkLabel(s)}`,
                    }))
                  : classBase
                    ? [
                        {
                          classId: classRouteId,
                          href: `${classBase}/activities`,
                          label: globalBurnDownCopy("components__teacher-portal__TeacherDashboardClient", "activities"),
                        },
                      ]
                    : [];
              return (
                <li
                  key={rosterKey}
                  className={
                    rosterFilterKey === rosterKey ? T.classCardActive : T.classCard
                  }
                  data-testid={`teacher-physical-class-card-${rosterKey}`}
                >
                  <div>
                    <p className="font-semibold break-words">{c.name}</p>
                    <p className={T.classMeta}>Students: {studentCount}</p>
                    {c.subjectsLabel ? (
                      <p className={T.classSubjects}>Subjects: {c.subjectsLabel}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setRosterFilterKey(rosterKey)}
                      className={T.secondaryBtn}
                      data-testid={`teacher-roster-filter-class-${rosterKey}`}
                    >
                      Show class students
                    </button>
                    {reportLinks.map((link) => (
                      <Link
                        key={link.classId}
                        href={link.href}
                        className={T.amberReportBtn}
                        data-testid={`teacher-class-report-${link.classId}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    {activityLinks.map((link) => (
                      <Link
                        key={link.classId}
                        href={link.href}
                        className={T.amberOutlineBtn}
                        data-testid={`teacher-class-activities-${link.classId}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={() => setManageClass(c)}
                      className={T.secondaryBtn}
                      data-testid={`teacher-class-manage-${rosterKey}`}
                    >
                      Manage class
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <ClassesEmptyState accessToken={accessToken} onCreated={onRefresh} T={T} />
      )}

      <section data-testid="teacher-student-roster-section">
        <h2 className={`text-lg font-semibold mb-1 ${T.heading}`}>Students</h2>
        {activeRosterOption && rosterFilterLabel(activeRosterOption) ? (
          <p className={`text-sm mb-3 ${T.muted}`} data-testid="teacher-roster-active-label">
            Showing: {rosterFilterLabel(activeRosterOption)}
          </p>
        ) : null}

        {rosterFilters.length > 0 ? (
          <div
            className="flex flex-wrap gap-2 mb-4"
            role="tablist"
            aria-label={globalBurnDownCopy("components__teacher-portal__TeacherDashboardClient", "filter_student_list")}
            data-testid="teacher-roster-filter-tabs"
          >
            {rosterFilters.map((opt) => {
              const tabLabel = rosterFilterLabel(opt);
              if (!tabLabel) return null;
              const isActive = rosterFilterKey === opt.key;
              const activeClass =
                opt.type === "direct" ? T.rosterTabActiveDirect : T.rosterTabActiveClass;
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setRosterFilterKey(opt.key)}
                  className={isActive ? activeClass : T.rosterTabIdle}
                  data-testid={`teacher-roster-tab-${opt.key}`}
                >
                  {tabLabel}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="space-y-3 mb-4">
          <input
            type="search"
            placeholder={globalBurnDownCopy("components__teacher-portal__TeacherDashboardClient", "search_by_name")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={T.searchInput}
          />
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilterKey(f.key)}
                className={filterKey === f.key ? T.filterChipActive : T.filterChipIdle}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className={T.faint}>Sort:</span>
            {SORT_OPTIONS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSortKey(s.key)}
                className={sortKey === s.key ? T.sortActive : T.sortIdle}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <p className={T.emptyHint} data-testid="teacher-roster-empty">
            No students to show for this filter.
          </p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
            {filteredStudents.map((s) => (
              <StudentDashboardCard
                key={s.studentId}
                student={s}
                activityLoading={activityLoading && !dashboard?.activityLoaded}
                T={T}
                bright={bright}
              />
            ))}
          </ul>
        )}
      </section>

      <TeacherInviteOthersButton bright={bright} />

      {manageClass ? (
        <ClassManagePanel
          accessToken={accessToken}
          classInfo={manageClass}
          allStudents={dashboard?.students || []}
          maxStudentsPerClass={dashboard?.limits?.maxStudentsPerClass ?? null}
          onClose={() => setManageClass(null)}
          onRefresh={onRefresh}
          T={T}
        />
      ) : null}
    </div>
  );
}

function SummaryStat({ label, value, testId, T }) {
  return (
    <div data-testid={testId}>
      <p className={T.statLabel}>{label}</p>
      <p className={T.statValue}>{value}</p>
    </div>
  );
}

