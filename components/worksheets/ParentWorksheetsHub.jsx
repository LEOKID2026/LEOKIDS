/**

 * Parent worksheets hub — three tabs, parent auth only.

 */



import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import ReadyWorksheetsTab from "./ReadyWorksheetsTab.jsx";
import CreateWorksheetTab from "./CreateWorksheetTab.jsx";
import RecommendationsTab from "./RecommendationsTab.jsx";
import { useWorksheetShellAttrs, useWorksheetUi } from "../../hooks/useWorksheetUi.js";
import { defaultWorksheetTopicForGrade } from "../../lib/worksheets/worksheet-topic-options.js";
import { listMathPracticeFormatsForGradeTopic } from "../../lib/worksheets/worksheet-math-practice-format.js";
import {
  loadWorksheetIncludeAnswersPref,
  saveWorksheetIncludeAnswersPref,
} from "../../lib/worksheets/worksheet-include-answers-pref.client.js";
import { saveWorksheetPreviewSession, clearWorksheetAnswerKeySession } from "../../lib/worksheets/worksheet-preview-session.client.js";



/**

 * @param {{

 *   session: { access_token: string },

 *   students: Array<{ id: string, full_name?: string | null, grade_level?: string | null }>,

 *   T: Record<string, string>,

 * }} props

 */

export default function ParentWorksheetsHub({ session, students, T }) {

  const router = useRouter();
  const ui = useWorksheetUi();
  const shell = useWorksheetShellAttrs();
  const tabs = useMemo(
    () => [
      { id: "ready", label: ui.tabReady, hint: ui.tabReadyHint },
      { id: "create", label: ui.tabGenerator, hint: ui.tabCreateHint },
      { id: "recommendations", label: ui.tabRecommendations, hint: ui.tabRecommendationsHint },
    ],
    [ui]
  );

  const [activeTab, setActiveTab] = useState("ready");



  const [catalogItems, setCatalogItems] = useState([]);

  const [catalogLoading, setCatalogLoading] = useState(true);

  const [catalogError, setCatalogError] = useState("");

  const [busySlug, setBusySlug] = useState(null);

  const [filterSubject, setFilterSubject] = useState("");

  const [filterGrade, setFilterGrade] = useState("");

  const [filterLevel, setFilterLevel] = useState("");



  const [createForm, setCreateForm] = useState(() => {
    const gradeKey = "g3";
    const topicKey = defaultWorksheetTopicForGrade("math", gradeKey);
    const formats = listMathPracticeFormatsForGradeTopic(gradeKey, topicKey);
    return {
      subjectId: "math",
      gradeKey,
      topicKey,
      mathPracticeFormat: formats[0]?.key || "",
      levelKey: "regular",
      count: 12,
      preferMcq: false,
      inkSave: true,
      mixedTopicKeys: null,
    };
  });

  const [includeAnswers, setIncludeAnswers] = useState(false);
  const [includeAnswersReady, setIncludeAnswersReady] = useState(false);

  const [createBusy, setCreateBusy] = useState(false);

  const [createError, setCreateError] = useState("");



  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || "");

  const [recommendations, setRecommendations] = useState([]);

  const [recEmptyMessage, setRecEmptyMessage] = useState(null);

  const [recLoading, setRecLoading] = useState(false);

  const [recError, setRecError] = useState("");

  const [busyRecId, setBusyRecId] = useState(null);



  const authHeader = `Bearer ${session.access_token}`;

  useEffect(() => {
    setIncludeAnswers(loadWorksheetIncludeAnswersPref());
    setIncludeAnswersReady(true);
  }, []);

  const handleIncludeAnswersChange = useCallback((next) => {
    const value = next === true;
    setIncludeAnswers(value);
    saveWorksheetIncludeAnswersPref(value);
  }, []);



  const fetchCatalog = useCallback(async () => {

    setCatalogLoading(true);

    setCatalogError("");

    try {

      const res = await fetch("/api/parent/worksheets/catalog", {

        headers: { Authorization: authHeader },

      });

      const data = await res.json();

      if (!res.ok || !data.ok) {

        setCatalogError(data.error || ui.errorGeneric);

        setCatalogItems([]);

        return;

      }

      setCatalogItems(data.items || []);

    } catch {

      setCatalogError(ui.errorGeneric);

    } finally {

      setCatalogLoading(false);

    }

  }, [authHeader]);



  useEffect(() => {

    fetchCatalog();

  }, [fetchCatalog]);



  const openPreview = useCallback(

    (worksheetPayload, generation, includeAnswers, source) => {

      clearWorksheetAnswerKeySession();

      saveWorksheetPreviewSession({

        worksheetPayload,

        generation,

        includeAnswers: includeAnswers === true,

        source,

      });

      router.push("/parent/worksheets/preview");

    },

    [router]

  );



  const handleReadyViewPrint = useCallback(

    async (slug) => {

      setBusySlug(slug);

      try {

        const res = await fetch(`/api/parent/worksheets/ready/${encodeURIComponent(slug)}`, {

          headers: { Authorization: authHeader },

        });

        const data = await res.json();

        if (!res.ok || !data.ok) {

          setCatalogError(data.error || ui.errorGeneric);

          return;

        }

        openPreview(data.worksheetPayload, data.generation, includeAnswers, "ready");

      } catch {

        setCatalogError(ui.errorGeneric);

      } finally {

        setBusySlug(null);

      }

    },

    [authHeader, openPreview, includeAnswers]

  );



  const handleCreateSubmit = useCallback(async () => {

    setCreateBusy(true);

    setCreateError("");

    try {
      if (
        createForm.topicKey === "mixed" &&
        Array.isArray(createForm.mixedTopicKeys) &&
        createForm.mixedTopicKeys.length === 0
      ) {
        setCreateError(ui.mixedTopicsEmptyError);
        return;
      }

      /** @type {Record<string, unknown>} */
      const body = {

          subjectId: createForm.subjectId,

          gradeKey: createForm.gradeKey,

          topicKey: createForm.topicKey,

          levelKey: createForm.levelKey,

          count: createForm.count,

          inkSave: createForm.inkSave,

          mathPracticeFormat:
            createForm.subjectId === "math" && createForm.mathPracticeFormat
              ? createForm.mathPracticeFormat
              : undefined,
          preferMcq: createForm.preferMcq === true,

        };

      if (createForm.topicKey === "mixed" && Array.isArray(createForm.mixedTopicKeys)) {
        body.mixedTopicKeys = createForm.mixedTopicKeys;
      }

      const res = await fetch("/api/parent/worksheets/generate", {

        method: "POST",

        headers: {

          Authorization: authHeader,

          "Content-Type": "application/json",

        },

        body: JSON.stringify(body),

      });

      const data = await res.json();

      if (!res.ok || !data.ok) {

        setCreateError(data.message || data.error || ui.errorGeneric);

        return;

      }

      openPreview(
        data.worksheetPayload,
        data.generation,
        includeAnswers,
        "create"
      );

    } catch {

      setCreateError(ui.errorGeneric);

    } finally {

      setCreateBusy(false);

    }

  }, [authHeader, createForm, openPreview, includeAnswers]);



  const fetchRecommendations = useCallback(async () => {

    if (!selectedStudentId) return;

    setRecLoading(true);

    setRecError("");

    try {

      const res = await fetch(

        `/api/parent/worksheets/recommendations?studentId=${encodeURIComponent(selectedStudentId)}`,

        { headers: { Authorization: authHeader } }

      );

      const data = await res.json();

      if (!res.ok || !data.ok) {

        setRecError(data.error || ui.errorGeneric);

        setRecommendations([]);

        setRecEmptyMessage(null);

        return;

      }

      setRecommendations(data.recommendations || []);

      setRecEmptyMessage(data.emptyMessageHe || null);

    } catch {

      setRecError(ui.errorGeneric);

    } finally {

      setRecLoading(false);

    }

  }, [authHeader, selectedStudentId]);



  useEffect(() => {

    if (activeTab === "recommendations" && selectedStudentId) {

      fetchRecommendations();

    }

  }, [activeTab, selectedStudentId, fetchRecommendations]);



  useEffect(() => {

    if (students.length && !selectedStudentId) {

      setSelectedStudentId(students[0].id);

    }

  }, [students, selectedStudentId]);



  const handleCreateFromRecommendation = useCallback(

    async (rec) => {

      setBusyRecId(rec.id);

      setRecError("");

      try {

        const res = await fetch("/api/parent/worksheets/from-recommendation", {

          method: "POST",

          headers: {

            Authorization: authHeader,

            "Content-Type": "application/json",

          },

          body: JSON.stringify({

            studentId: selectedStudentId,

            recommendationId: rec.id,

            subjectId: rec.subjectId,

            gradeKey: rec.gradeKey,

            topicKey: rec.topicKey,

            levelKey: rec.levelKey,

            count: rec.count,

            inkSave: true,

          }),

        });

        const data = await res.json();

        if (!res.ok || !data.ok) {

          setRecError(data.message || data.error || ui.errorGeneric);

          return;

        }

        openPreview(data.worksheetPayload, data.generation, includeAnswers, "recommendation");

      } catch {

        setRecError(ui.errorGeneric);

      } finally {

        setBusyRecId(null);

      }

    },

    [authHeader, openPreview, selectedStudentId, includeAnswers]

  );



  const filteredCatalogItems = useMemo(() => {

    return catalogItems.filter((item) => {

      if (filterSubject && item.subjectId !== filterSubject) return false;

      if (filterGrade && item.gradeKey !== filterGrade) return false;

      if (filterLevel && item.levelKey !== filterLevel) return false;

      return true;

    });

  }, [catalogItems, filterSubject, filterGrade, filterLevel]);



  const handleCatalogFilterChange = useCallback((patch) => {

    if ("filterSubject" in patch) setFilterSubject(patch.filterSubject);

    if ("filterGrade" in patch) setFilterGrade(patch.filterGrade);

    if ("filterLevel" in patch) setFilterLevel(patch.filterLevel);

  }, []);



  return (

    <div {...shell} className="worksheet-hub-page space-y-5">

      <section className={`worksheet-hub-hero ${T.infoBox}`}>

        <div className="flex gap-3 min-w-0 flex-1">

          <span className="worksheet-hub-hero-icon" aria-hidden="true">

            📄

          </span>

          <div className="min-w-0">

            <h1 className={`text-xl md:text-2xl font-bold ${T.heading}`}>

              {ui.hubTitle}

            </h1>

            <p className={`worksheet-hub-intro ${T.subheading}`}>{ui.hubSubtitle}</p>

            <p className={`mt-2 text-sm ${T.muted}`}>{ui.hubIntro}</p>

          </div>

        </div>

        <Link href="/parent/dashboard" className={`${T.secondaryBtn} shrink-0 self-start`}>

          {ui.back}

        </Link>

      </section>



      <nav className="worksheet-hub-tabs" aria-label="Worksheet hub sections">

        {tabs.map((tab) => (

          <button

            key={tab.id}

            type="button"

            onClick={() => setActiveTab(tab.id)}

            aria-current={activeTab === tab.id ? "page" : undefined}

            className={`worksheet-hub-tab ${activeTab === tab.id ? T.tabActive : T.tabIdle}`}

          >

            {tab.label}

          </button>

        ))}

      </nav>



      {activeTab === "ready" ? (

        <ReadyWorksheetsTab
          items={filteredCatalogItems}
          loading={catalogLoading}
          error={catalogError}
          onViewPrint={handleReadyViewPrint}
          busySlug={busySlug}
          filterSubject={filterSubject}
          filterGrade={filterGrade}
          filterLevel={filterLevel}
          onFilterChange={handleCatalogFilterChange}
          includeAnswers={includeAnswers}
          includeAnswersReady={includeAnswersReady}
          onIncludeAnswersChange={handleIncludeAnswersChange}
          T={T}
        />

      ) : null}



      {activeTab === "create" ? (

        <CreateWorksheetTab
          form={createForm}
          onChange={(patch) => setCreateForm((prev) => ({ ...prev, ...patch }))}
          onSubmit={handleCreateSubmit}
          busy={createBusy}
          error={createError}
          includeAnswers={includeAnswers}
          includeAnswersReady={includeAnswersReady}
          onIncludeAnswersChange={handleIncludeAnswersChange}
          T={T}
        />

      ) : null}



      {activeTab === "recommendations" ? (

        students.length === 0 ? (

          <div className="worksheet-empty-state">

            <div className="worksheet-empty-state-icon" aria-hidden="true">

              👨‍👩‍👧

            </div>

            <p className={`worksheet-empty-state-title ${T.heading}`}>{ui.noStudents}</p>

          </div>

        ) : (

          <RecommendationsTab
            students={students}
            selectedStudentId={selectedStudentId}
            onSelectStudent={setSelectedStudentId}
            recommendations={recommendations}
            emptyMessageHe={recEmptyMessage}
            loading={recLoading}
            error={recError}
            onCreateFromRecommendation={handleCreateFromRecommendation}
            busyId={busyRecId}
            includeAnswers={includeAnswers}
            includeAnswersReady={includeAnswersReady}
            onIncludeAnswersChange={handleIncludeAnswersChange}
            T={T}
          />

        )

      ) : null}

    </div>

  );

}


