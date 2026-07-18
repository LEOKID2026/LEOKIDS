import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import parentCopilot from "../../utils/parent-copilot/index.js";
import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";
import {
  resolveCopilotAnswerBlocksText,
  resolveCopilotReportMessage,
} from "../../lib/parent-copilot/copilot-response-resolver.js";
import { applyCopilotResponseLocaleToTurn } from "../../lib/parent-copilot/copilot-locale-adapters/index.js";
import { ParentCopilotQuickActions } from "./parent-copilot-quick-actions.jsx";

/** Deterministic UI pacing (ms), plan range 250–450 */
const PROCESSING_UI_MS = 320;

/** Scroll "at bottom" tolerance (px) */
const SCROLL_BOTTOM_EPS = 28;

function makeSessionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `pc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function lineId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `ln-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function previewText(text, maxLen) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen)}…`;
}

/**
 * Completed assistant turns = assistant bubbles that carry a runtime response (not intro, not processing).
 * @param {Array<{ role: string; kind?: string; response?: object }>} lines
 */
function countCompletedAssistantTurns(lines) {
  let n = 0;
  for (const ln of lines) {
    if (ln.role === "assistant" && ln.kind !== "processing" && ln.response) n += 1;
  }
  return n;
}

/**
 * Optional server-side runner (e.g. `/api/parent/copilot-turn`) - keeps LLM keys off the client.
 * When omitted, uses bundled `runParentCopilotTurnAsync` / `runParentCopilotTurn` (detailed report default).
 *
 * @param {{ payload: object; selectedContextRef?: object | null; asyncTurnRunner?: ((input: object) => Promise<unknown>) | null }} props
 */
export function ParentCopilotPanel({ payload, selectedContextRef = null, asyncTurnRunner = null }) {
  const t = useT();
  const { reportLocale } = useI18n();
  const formId = useId();
  const [sessionId] = useState(() => makeSessionId());
  const [utterance, setUtterance] = useState("");
  const [lines, setLines] = useState(() => []);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const userPinnedBottomRef = useRef(true);

  const updatePinnedFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    userPinnedBottomRef.current = dist <= SCROLL_BOTTOM_EPS;
  }, []);

  const scrollToBottomIfPinned = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !userPinnedBottomRef.current) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => {
    scrollToBottomIfPinned();
  }, [lines, scrollToBottomIfPinned]);

  const submit = useCallback(
    async (text, meta = {}) => {
      const q = String(text || "").trim();
      if (!q || busy) return;
      setBusy(true);
      userPinnedBottomRef.current = true;

      const userLine = { id: lineId(), role: "user", text: q };
      const processingLine = {
        id: lineId(),
        role: "assistant",
        kind: "processing",
        text: t("ui.copilot.panel.processing"),
      };

      setLines((prev) => [...prev, userLine, processingLine]);
      await sleep(PROCESSING_UI_MS);

      try {
        const turnInput = {
          audience: "parent",
          payload,
          utterance: q,
          sessionId,
          selectedContextRef,
          clickedFollowupFamily: meta.clickedFollowupFamily || null,
        };
        const resRaw =
          typeof asyncTurnRunner === "function"
            ? await asyncTurnRunner(turnInput)
            : await (typeof parentCopilot.runParentCopilotTurnAsync === "function"
                ? parentCopilot.runParentCopilotTurnAsync(turnInput)
                : Promise.resolve(parentCopilot.runParentCopilotTurn(turnInput)));
        const res = applyCopilotResponseLocaleToTurn(resRaw, reportLocale);

        let answerCore = "";
        let fullText = "";
        if (res.resolutionStatus === "clarification_required") {
          const clarificationKey = String(res.clarificationQuestionKey || "").trim();
          answerCore = clarificationKey
            ? resolveCopilotReportMessage(reportLocale, clarificationKey, res.clarificationParameters || {}) ||
              String(res.clarificationQuestionHe || "").trim()
            : String(res.clarificationQuestionHe || "").trim();
          fullText = answerCore;
        } else {
          answerCore = resolveCopilotAnswerBlocksText(res.answerBlocks, reportLocale);
          fullText = answerCore;
          const followUpKey = String(res.suggestedFollowUp?.recommendationCode || "").trim();
          const followUpText = followUpKey
            ? resolveCopilotReportMessage(reportLocale, followUpKey, res.suggestedFollowUp?.parameters || {})
            : res.suggestedFollowUp?.answerText
              ? resolveCopilotReportMessage(
                  reportLocale,
                  String(res.suggestedFollowUp.explanationCode || "").trim(),
                  res.suggestedFollowUp.parameters || {}
                ) || String(res.suggestedFollowUp.answerText)
              : "";
          if (followUpText) {
            fullText += `\n\n- ${followUpText}`;
          }
        }

        const processingId = processingLine.id;
        const isClarification = res.resolutionStatus === "clarification_required";
        const followUpHe =
          !isClarification && res.suggestedFollowUp
            ? resolveCopilotReportMessage(
                reportLocale,
                String(
                  res.suggestedFollowUp.recommendationCode || res.suggestedFollowUp.explanationCode || ""
                ).trim(),
                res.suggestedFollowUp.parameters || {}
              ) ||
              String(res.suggestedFollowUp.answerText || "")
            : "";
        const assistantLine = {
          id: lineId(),
          role: "assistant",
          kind: "message",
          text: fullText,
          answerCore,
          followUpText: followUpHe,
          revealFollowUp: isClarification || !followUpHe,
          response: isClarification ? null : res,
        };

        setLines((prev) => {
          const withoutProc = prev.filter((l) => l.id !== processingId);
          return [...withoutProc, assistantLine];
        });

        requestAnimationFrame(() => {
          setLines((prev) =>
            prev.map((l) => (l.id === assistantLine.id ? { ...l, revealFollowUp: true } : l)),
          );
        });
      } catch (e) {
        const processingId = processingLine.id;
        const errText =
          e instanceof Error && String(e.message || "").trim()
            ? String(e.message).trim()
            : t("ui.copilot.panel.errorGeneric");
        setLines((prev) => {
          const withoutProc = prev.filter((l) => l.id !== processingId);
          return [
            ...withoutProc,
            {
              id: lineId(),
              role: "assistant",
              kind: "message",
              text: errText,
              answerCore: errText,
              followUpText: "",
              revealFollowUp: true,
              response: null,
            },
          ];
        });
      } finally {
        setBusy(false);
        setUtterance("");
      }
    },
    [busy, payload, selectedContextRef, sessionId, asyncTurnRunner, t, reportLocale],
  );

  const lastResponse = useMemo(() => {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].role === "assistant" && lines[i].response) return lines[i].response;
    }
    return null;
  }, [lines]);

  const quickItems = useMemo(() => {
    const qa = lastResponse?.quickActions;
    if (!Array.isArray(qa) || !qa.length) return [];
    return qa.map((a) => ({
      id: a.id,
      labelHe: a.labelHe,
      enabled: !!a.enabled,
      disabledReasonCode: a.disabledReasonCode,
      onPress: () => {
        const presetKey = `ui.copilot.panel.quickUtterances.${a.id}`;
        const preset = t(presetKey);
        const familyMap = {
          qa_action_today: "action_today",
          qa_action_week: "action_week",
          qa_avoid_now: "avoid_now",
          qa_advance_or_hold: "advance_or_hold",
          qa_explain_to_child: "explain_to_child",
          qa_ask_teacher: "ask_teacher",
        };
        submit(preset, { clickedFollowupFamily: familyMap[a.id] || null });
      },
    }));
  }, [lastResponse, submit, t]);

  const completedAssistantTurns = useMemo(() => countCompletedAssistantTurns(lines), [lines]);
  const shouldCompactHistory = completedAssistantTurns >= 4;

  let lastUserIndex = -1;
  let lastAssistantIndex = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lastUserIndex < 0 && lines[i].role === "user") lastUserIndex = i;
    if (lastAssistantIndex < 0 && lines[i].role === "assistant" && lines[i].kind !== "processing") {
      lastAssistantIndex = i;
    }
    if (lastUserIndex >= 0 && lastAssistantIndex >= 0) break;
  }

  const activeExchangeBusy = busy;

  return (
    <div
      className="w-full flex flex-col rounded-xl border border-white/12 bg-black/25 p-3 text-right text-white/90"
      style={{ height: "420px", minHeight: "420px" }}
    >
      <div className="flex items-center justify-between gap-2 shrink-0 mb-1">
        <div className="text-xs font-extrabold tracking-wide text-white/70">{t("ui.copilot.panel.title")}</div>
        <Link
          href="/ai-disclosure"
          className="text-[10px] text-sky-300/80 hover:text-sky-200 underline whitespace-nowrap shrink-0"
        >
          {t("ui.copilot.panel.aiDisclosureLink")}
        </Link>
      </div>
      <p className="text-[11px] leading-snug text-white/45 shrink-0 mb-1 pr-0.5" role="note">
        {t("ui.copilot.panel.disclaimer")}
      </p>
      <p className="text-[11px] leading-snug text-white/45 shrink-0 mb-2 pr-0.5">
        {t("ui.copilot.panel.intro")}
      </p>

      <div
        ref={scrollRef}
        onScroll={updatePinnedFromScroll}
        className="flex-1 min-h-0 overflow-y-auto space-y-2 text-sm leading-relaxed pr-0.5"
      >
        {lines.map((ln, i) => {
          if (ln.kind === "processing") {
            return (
              <div key={ln.id} className="text-white/50 whitespace-pre-wrap animate-pulse text-xs">
                {ln.text}
              </div>
            );
          }

          const isUser = ln.role === "user";
          const isLastUser = isUser && i === lastUserIndex;
          const isLastAssistant = ln.role === "assistant" && i === lastAssistantIndex;
          const inActiveBusyTail = activeExchangeBusy && lastUserIndex >= 0 && i >= lastUserIndex;

          let displayText = ln.text;
          if (ln.role === "assistant" && ln.kind === "message" && ln.answerCore != null) {
            const core = String(ln.answerCore || "");
            const fu = ln.followUpText && ln.revealFollowUp ? `\n\n- ${ln.followUpText}` : "";
            displayText = core + fu;
          }

          let compact = false;
          if (shouldCompactHistory && !inActiveBusyTail) {
            if (isUser && !isLastUser) compact = true;
            if (ln.role === "assistant" && ln.kind === "message" && !isLastAssistant) compact = true;
          }

          const body = compact ? previewText(displayText, 140) : displayText;

          return (
            <div
              key={ln.id}
              className={
                isUser
                  ? "text-emerald-100/95 whitespace-pre-wrap"
                  : "text-white/85 whitespace-pre-wrap"
              }
            >
              {isUser ? <span className="font-bold text-white/50">{t("ui.copilot.panel.youPrefix")}</span> : null}
              {body}
            </div>
          );
        })}
      </div>

      <div className="shrink-0 mt-2 pt-2 border-t border-white/10 space-y-2">
        <ParentCopilotQuickActions items={quickItems} compact />
        <form
          className="flex flex-col sm:flex-row gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit(utterance);
          }}
        >
          <label htmlFor={formId} className="sr-only">
            {t("ui.copilot.panel.questionLabel")}
          </label>
          <input
            id={formId}
            className="flex-1 min-w-0 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white placeholder:text-white/35"
            placeholder={t("ui.copilot.panel.placeholder")}
            value={utterance}
            disabled={busy}
            onChange={(e) => setUtterance(e.target.value)}
          />
          <button
            type="submit"
            disabled={busy || !utterance.trim()}
            className="shrink-0 rounded-lg border border-sky-400/40 bg-sky-900/35 px-4 py-2 text-sm font-bold text-sky-50 disabled:opacity-40"
          >
            {t("ui.copilot.panel.send")}
          </button>
        </form>
      </div>
    </div>
  );
}
