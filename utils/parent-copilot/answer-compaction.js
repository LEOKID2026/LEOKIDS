/**
 * Parent-facing answer compaction: length bounds, semantic de-duplication, no repeated uncertainty tropes.
 * Deterministic only — no LLM.
 */

/** @param {string} t */
function norm(t) {
  return String(t || "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Phrases that must appear at most once across the whole answer body. */
const ONCE_ACROSS_ANSWER = [
  "Still too early to decide",
  "Cannot be closed",
  "uncertainty",
  "keep following",
  "early to the direction",
  "Unable to determine direction",
];

/**
 * @param {Array<{ type: string; answerText: string; source: string }>} blocks
 * @param {{ maxTotalChars?: number; maxBlocks?: number; scopeType?: string }} [opts]
 */
export function compactParentAnswerBlocks(blocks, opts = {}) {
  const maxTotal = opts.maxTotalChars != null ? opts.maxTotalChars : 2200;
  const maxBlocks = opts.maxBlocks != null ? opts.maxBlocks : 4;
  const scopeType = String(opts.scopeType || "");

  /** @type {typeof blocks} */
  let out = (Array.isArray(blocks) ? blocks : [])
    .map((b) => ({
      ...b,
      answerText: norm(b.answerText),
    }))
    .filter((b) => b.answerText.length > 0);

  let acc = "";
  /** @type {typeof out} */
  const deduped = [];
  for (const b of out) {
    let t = b.answerText;
    for (const p of ONCE_ACROSS_ANSWER) {
      if (!p) continue;
      if (acc.includes(p) && t.includes(p)) {
        t = norm(t.split(p).join(" ").replace(/\s{2,}/g, " "));
      }
    }
    if (t.length > 2) {
      deduped.push({ ...b, answerText: t });
      acc = `${acc} ${t}`;
    }
  }
  out = deduped;

  /** Collapse adjacent same-type contract_slot if very high overlap (token Jaccard). */
  function jaccard(a, b) {
    const ta = new Set(
      String(a)
        .split(/\s+/)
        .map((x) => x.replace(/^[^\u0590-\u05FF]+|[^\u0590-\u05FF]+$/g, ""))
        .filter((x) => x.length >= 4),
    );
    const tb = new Set(
      String(b)
        .split(/\s+/)
        .map((x) => x.replace(/^[^\u0590-\u05FF]+|[^\u0590-\u05FF]+$/g, ""))
        .filter((x) => x.length >= 4),
    );
    let inter = 0;
    for (const x of ta) if (tb.has(x)) inter += 1;
    const uni = ta.size + tb.size - inter;
    return uni ? inter / uni : 0;
  }

  /** @type {typeof out} */
  const merged = [];
  for (const b of out) {
    const prev = merged[merged.length - 1];
    if (
      prev &&
      prev.type === b.type &&
      prev.source === "contract_slot" &&
      b.source === "contract_slot" &&
      jaccard(prev.answerText, b.answerText) >= 0.55
    ) {
      merged[merged.length - 1] = { ...prev, answerText: norm(`${prev.answerText} ${b.answerText}`).slice(0, 900) };
      continue;
    }
    merged.push(b);
  }
  out = merged;

  if (scopeType === "executive") {
    for (let i = 0; i < out.length; i += 1) {
      if (out[i].type === "observation" && out[i].answerText.length > 720) {
        out[i] = { ...out[i], answerText: `${out[i].answerText.slice(0, 680)}…` };
      }
    }
  }

  while (out.length > maxBlocks) {
    out.pop();
  }

  let total = 0;
  /** @type {typeof out} */
  const trimmed = [];
  for (const b of out) {
    const room = maxTotal - total;
    if (room <= 40) break;
    const t = b.answerText.length > room ? `${b.answerText.slice(0, room - 1)}…` : b.answerText;
    trimmed.push({ ...b, answerText: t });
    total += t.length;
  }

  return trimmed.length ? trimmed : out.slice(0, 2);
}

export default { compactParentAnswerBlocks };
