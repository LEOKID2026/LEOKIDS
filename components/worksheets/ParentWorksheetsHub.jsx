/**

 * Parent worksheets hub — three tabs, parent auth only.

 */



import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import ReadyWorksheetsTab from "./ReadyWorksheetsTab.jsx";
import CreateWorksheetTab from "./CreateWorksheetTab.jsx";
import CreateWritingWorksheetTab, {
  buildWritingGenerateBody,
  defaultWritingCreateForm,
} from "../writing/CreateWritingWorksheetTab.jsx";
import {
  buildColoringGenerateBody,
  defaultColoringCreateForm,
} from "../coloring/CreateColoringWorksheetTab.jsx";
import ColoringTabShell from "../coloring-upload/ColoringTabShell.jsx";
import ColoringPreviewModal from "../coloring/ColoringPreviewModal.jsx";
import WorksheetPreviewModal from "./WorksheetPreviewModal.jsx";
import RecommendationsTab from "./RecommendationsTab.jsx";
import { useWorksheetShellAttrs, useWorksheetUi } from "../../hooks/useWorksheetUi.js";
import { writingErrorLabelEn } from "../../lib/writing/writing-error-labels.en.js";
import { defaultWorksheetTopicForGrade } from "../../lib/worksheets/worksheet-topic-options.js";
import { listMathPracticeFormatsForGradeTopic } from "../../lib/worksheets/worksheet-math-practice-format.js";
import {
  loadWorksheetIncludeAnswersPref,
  saveWorksheetIncludeAnswersPref,
} from "../../lib/worksheets/worksheet-include-answers-pref.client.js";
import {
  saveWorksheetPreviewSession,
  clearWorksheetAnswerKeySession,
  saveWorksheetAnswerKeySession,
} from "../../lib/worksheets/worksheet-preview-session.client.js";
import { buildWorksheetSessionFingerprint } from "../../lib/worksheets/worksheet-fingerprint.js";
import { isWritingWorksheetPayload } from "../../lib/worksheets/worksheet-payload-kind.client.js";



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
  const tabs = [
    { id: "ready", label: ui.tabReady, hint: ui.tabReadyHint },
    { id: "create", label: ui.tabGenerator, hint: ui.tabCreateHint },
    { id: "recommendations", label: ui.tabRecommendations, hint: ui.tabRecommendationsHint },
  ];

  const [activeTab, setActiveTab] = useState("ready");



  const [catalogItems, setCatalogItems] = useState([]);

  const [catalogLoading, setCatalogLoading] = useState(true);

  const [catalogError, setCatalogError] = useState("");

  const [busySlug, setBusySlug] = useState(null);

  const [filterSubject, setFilterSubject] = useState("");

  const [filterGrade, setFilterGrade] = useState("");

  const [filterLevel, setFilterLevel] = useState("");

  const [filterWorksheetType, setFilterWorksheetType] = useState("");

  const [filterWritingCategory, setFilterWritingCategory] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [createWorksheetType, setCreateWorksheetType] = useState("questions");

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

  const [writingForm, setWritingForm] = useState(() => defaultWritingCreateForm());

  const [writingCreateBusy, setWritingCreateBusy] = useState(false);

  const [writingCreateError, setWritingCreateError] = useState("");

  const [coloringCards, setColoringCards] = useState([]);
  const [coloringCatalogLoading, setColoringCatalogLoading] = useState(true);
  const [coloringForm, setColoringForm] = useState(() => defaultColoringCreateForm());
  const [coloringCreateBusy, setColoringCreateBusy] = useState(false);
  const [coloringCreateError, setColoringCreateError] = useState("");
  const [coloringPreviewPayload, setColoringPreviewPayload] = useState(null);

  const [worksheetPreviewSession, setWorksheetPreviewSession] = useState(null);
  const [previewRefreshLoading, setPreviewRefreshLoading] = useState(false);
  const [previewAnswerKeyLoading, setPreviewAnswerKeyLoading] = useState(false);
  const [previewModalError, setPreviewModalError] = useState("");

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

  const openWorksheetPreviewModal = useCallback(
    (worksheetPayload, generation, includeAnswersValue, source) => {
      clearWorksheetAnswerKeySession();
      setPreviewModalError("");
      setWorksheetPreviewSession({
        worksheetPayload,
        generation,
        includeAnswers: includeAnswersValue === true,
        source,
      });
    },
    []
  );

  const handlePreviewModalRefresh = useCallback(async () => {
    if (
      !worksheetPreviewSession ||
      worksheetPreviewSession.source !== "create" ||
      !worksheetPreviewSession.generation ||
      isWritingWorksheetPayload(worksheetPreviewSession.worksheetPayload)
    ) {
      return;
    }
    setPreviewModalError("");
    setPreviewRefreshLoading(true);
    try {
      const gen = worksheetPreviewSession.generation;
      const newSeed = Math.floor(Math.random() * 1_000_000);
      const res = await fetch("/api/parent/worksheets/generate", {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectId: gen.subjectId,
          gradeKey: gen.gradeKey,
          topicKey: gen.topicKey,
          levelKey: gen.levelKey,
          count: gen.count,
          seed: newSeed,
          inkSave: gen.inkSave === true,
          mathPracticeFormat:
            typeof gen.mathPracticeFormat === "string" ? gen.mathPracticeFormat : undefined,
          ...(typeof gen.preferMcq === "boolean" ? { preferMcq: gen.preferMcq } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setPreviewModalError(data.message || ui.refreshQuestionsError);
        return;
      }
      clearWorksheetAnswerKeySession();
      setWorksheetPreviewSession({
        worksheetPayload: data.worksheetPayload,
        generation: data.generation,
        includeAnswers: worksheetPreviewSession.includeAnswers === true,
        source: "create",
      });
    } catch {
      setPreviewModalError(ui.refreshQuestionsError);
    } finally {
      setPreviewRefreshLoading(false);
    }
  }, [worksheetPreviewSession, authHeader]);

  const handlePreviewModalAnswerKey = useCallback(async () => {
    if (!worksheetPreviewSession?.generation || !worksheetPreviewSession.includeAnswers) {
      return;
    }
    setPreviewModalError("");
    clearWorksheetAnswerKeySession();
    setPreviewAnswerKeyLoading(true);
    try {
      const expectedWorksheetFingerprint = buildWorksheetSessionFingerprint(
        worksheetPreviewSession.worksheetPayload,
        worksheetPreviewSession.generation
      );
      const res = await fetch("/api/parent/worksheets/answer-key", {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...worksheetPreviewSession.generation,
          includeAnswers: true,
          expectedWorksheetFingerprint,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setPreviewModalError(data.message || ui.answerKeyStale);
        return;
      }
      saveWorksheetPreviewSession(worksheetPreviewSession);
      saveWorksheetAnswerKeySession(data.answerKeyPayload);
      setWorksheetPreviewSession(null);
      router.push("/parent/worksheets/preview/answers");
    } catch {
      setPreviewModalError(ui.errorGeneric);
    } finally {
      setPreviewAnswerKeyLoading(false);
    }
  }, [worksheetPreviewSession, authHeader, router]);



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

      openWorksheetPreviewModal(
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

  }, [authHeader, createForm, openWorksheetPreviewModal, includeAnswers]);

  const handleWritingCreateSubmit = useCallback(async () => {
    setWritingCreateBusy(true);
    setWritingCreateError("");
    try {
      const body = buildWritingGenerateBody(writingForm);
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
        setWritingCreateError(
          data.message || writingErrorLabelEn(data.error) || ui.errorGeneric
        );
        return;
      }
      openWorksheetPreviewModal(data.worksheetPayload, data.generation, false, "create");
    } catch {
      setWritingCreateError(ui.errorGeneric);
    } finally {
      setWritingCreateBusy(false);
    }
  }, [authHeader, writingForm, openWorksheetPreviewModal]);

  const fetchColoringCatalog = useCallback(async () => {
    setColoringCatalogLoading(true);
    try {
      const res = await fetch("/api/parent/worksheets/coloring-catalog", {
        headers: { Authorization: authHeader },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setColoringCards([]);
        return;
      }
      setColoringCards(Array.isArray(data.cards) ? data.cards : []);
    } catch {
      setColoringCards([]);
    } finally {
      setColoringCatalogLoading(false);
    }
  }, [authHeader]);

  useEffect(() => {
    fetchColoringCatalog();
  }, [fetchColoringCatalog]);

  const handleColoringCreateSubmit = useCallback(async (cardKeyOverride) => {
    setColoringCreateBusy(true);
    setColoringCreateError("");
    try {
      const cardKey = String(cardKeyOverride || coloringForm.cardKey || "").trim();
      const body = buildColoringGenerateBody({ cardKey });
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
        setColoringCreateError(data.message || data.error || ui.errorGeneric);
        return;
      }
      setColoringForm((prev) => ({ ...prev, cardKey }));
      setColoringPreviewPayload(data.worksheetPayload);
    } catch {
      setColoringCreateError(ui.errorGeneric);
    } finally {
      setColoringCreateBusy(false);
    }
  }, [authHeader, coloringForm.cardKey]);

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



  const handleCatalogFilterChange = useCallback((patch) => {
    if ("filterWorksheetType" in patch) setFilterWorksheetType(patch.filterWorksheetType);
    if ("filterWritingCategory" in patch) setFilterWritingCategory(patch.filterWritingCategory);
    if ("filterSubject" in patch) setFilterSubject(patch.filterSubject);
    if ("filterGrade" in patch) setFilterGrade(patch.filterGrade);
    if ("filterLevel" in patch) setFilterLevel(patch.filterLevel);
    if ("searchQuery" in patch) setSearchQuery(patch.searchQuery);
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
          items={catalogItems}
          loading={catalogLoading}
          error={catalogError}
          onViewPrint={handleReadyViewPrint}
          busySlug={busySlug}
          filterWorksheetType={filterWorksheetType}
          filterWritingCategory={filterWritingCategory}
          filterSubject={filterSubject}
          filterGrade={filterGrade}
          filterLevel={filterLevel}
          searchQuery={searchQuery}
          onFilterChange={handleCatalogFilterChange}
          includeAnswers={includeAnswers}
          includeAnswersReady={includeAnswersReady}
          onIncludeAnswersChange={handleIncludeAnswersChange}
          hintOverride={ui.writingCatalogHint}
          T={T}
        />

      ) : null}



      {activeTab === "create" ? (
        <div className="space-y-4">
          <div className="worksheet-create-type-toggle" role="tablist" aria-label="Generator type">
            <button
              type="button"
              role="tab"
              aria-selected={createWorksheetType === "questions"}
              className={`worksheet-hub-tab ${createWorksheetType === "questions" ? T.tabActive : T.tabIdle}`}
              onClick={() => setCreateWorksheetType("questions")}
            >
              {ui.createTypeQuestions}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={createWorksheetType === "writing"}
              className={`worksheet-hub-tab ${createWorksheetType === "writing" ? T.tabActive : T.tabIdle}`}
              onClick={() => setCreateWorksheetType("writing")}
            >
              {ui.createTypeWriting}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={createWorksheetType === "coloring"}
              className={`worksheet-hub-tab ${createWorksheetType === "coloring" ? T.tabActive : T.tabIdle}`}
              onClick={() => setCreateWorksheetType("coloring")}
            >
              {ui.createTypeColoring}
            </button>
          </div>

          {createWorksheetType === "coloring" ? (
            <ColoringTabShell
              cards={coloringCards}
              selectedCardKey={coloringForm.cardKey}
              onSelectCardKey={(cardKey) => setColoringForm((prev) => ({ ...prev, cardKey }))}
              onSubmit={handleColoringCreateSubmit}
              busy={coloringCreateBusy}
              error={coloringCreateError}
              loading={coloringCatalogLoading}
              T={T}
            />
          ) : createWorksheetType === "writing" ? (
            <CreateWritingWorksheetTab
              form={writingForm}
              onChange={(patch) => setWritingForm((prev) => ({ ...prev, ...patch }))}
              onSubmit={handleWritingCreateSubmit}
              busy={writingCreateBusy}
              error={writingCreateError}
              T={T}
            />
          ) : (
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
          )}
        </div>
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

      <ColoringPreviewModal
        worksheetPayload={coloringPreviewPayload}
        onClose={() => setColoringPreviewPayload(null)}
        T={T}
      />

      <WorksheetPreviewModal
        session={worksheetPreviewSession}
        onClose={() => setWorksheetPreviewSession(null)}
        onRefresh={
          worksheetPreviewSession &&
          !isWritingWorksheetPayload(worksheetPreviewSession.worksheetPayload) &&
          worksheetPreviewSession.source === "create"
            ? handlePreviewModalRefresh
            : undefined
        }
        onAnswerKey={
          worksheetPreviewSession?.includeAnswers &&
          worksheetPreviewSession?.generation &&
          !isWritingWorksheetPayload(worksheetPreviewSession.worksheetPayload)
            ? handlePreviewModalAnswerKey
            : undefined
        }
        refreshLoading={previewRefreshLoading}
        answerKeyLoading={previewAnswerKeyLoading}
        errorMessage={previewModalError}
        T={T}
      />

    </div>

  );

}


