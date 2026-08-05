/** @typedef {'easy' || 'medium' || 'hard'} DifficultyId */

/**
 * @typedef {{ id: string, label: string, sub?: string, icon?: string }} DetectiveZone
 * @typedef {{ id: string, label: string }} DetectivePiece
 * @typedef {{
 *   id: string,
 *   type: string,
 *   caseLabel: string,
 *   missionHe: string,
 *   passage?: string,
 *   emoji?: string,
 *   zones: DetectiveZone[],
 *   pieces: DetectivePiece[],
 *   solution: Record<string, string>,
 * }} DetectiveTask
 */

import { LANGUAGE_PROTOTYPE_TASKS, shuffleTasks } from "../shared/language-prototype-config.js";

/** @param {DetectivePiece[]} pieces */
function shufflePieces(pieces) {
  return shuffleTasks(pieces);
}

/** @type {Record<DifficultyId, DetectiveTask[]>} */
export const WORD_DETECTIVE_TASKS = {
  easy: [
    {
      id: "e1",
      type: "letter_drop",
      caseLabel: "Case #1",
      missionHe: "Complete the word challenge.",
      emoji: "🐕",
      zones: [{ id: "z1", label: "Option", icon: "🔤" }],
      pieces: shufflePieces([
        { id: "p1", label: "R" },
        { id: "p2", label: "S" },
        { id: "p3", label: "H" },
        { id: "p4", label: "N" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "e2",
      type: "fill_gap",
      caseLabel: "#2",
      missionHe: "Complete the word challenge.",
      zones: [{ id: "z1", label: "Option", icon: "🧩" }],
      pieces: shufflePieces([
        { id: "p1", label: "S" },
        { id: "p2", label: "E" },
        { id: "p3", label: "U" },
        { id: "p4", label: "W" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "e3",
      type: "image_word",
      caseLabel: "Case #3",
      missionHe: "Complete the word challenge.",
      emoji: "🏠",
      zones: [{ id: "z1", label: "Option", icon: "📌" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "Option" },
        { id: "p3", label: "Option" },
        { id: "p4", label: "Option" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "e4",
      type: "sort_letter",
      caseLabel: "Case #4",
      missionHe: "Complete the word challenge.",
      zones: [
        { id: "zM", label: "Option", icon: "📁" },
        { id: "zX", label: "Option", icon: "🗑️" },
      ],
      pieces: shufflePieces([
        { id: "p1", label: "Who" },
        { id: "p2", label: "Option" },
        { id: "p3", label: "Option" },
        { id: "p4", label: "Option" },
      ]),
      solution: { zM: "p1" },
    },
    {
      id: "e5",
      type: "letter_drop",
      caseLabel: "Case #5",
      missionHe: "Complete the word challenge.",
      emoji: "🐱",
      zones: [{ id: "z1", label: "Option", icon: "🔤" }],
      pieces: shufflePieces([
        { id: "p1", label: "N" },
        { id: "p2", label: "G" },
        { id: "p3", label: "S" },
        { id: "p4", label: "H" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "e6",
      type: "image_word",
      caseLabel: "Case #6",
      missionHe: "Complete the word challenge.",
      emoji: "🍎",
      zones: [{ id: "z1", label: "Option", icon: "📌" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "to" },
        { id: "p3", label: "rain" },
        { id: "p4", label: "Option" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "e7",
      type: "fill_gap",
      caseLabel: "Case #7",
      missionHe: "Complete the word challenge.",
      zones: [{ id: "z1", label: "Option", icon: "📌" }],
      pieces: shufflePieces([
        { id: "p1", label: "Who" },
        { id: "p2", label: "to" },
        { id: "p3", label: "Option" },
        { id: "p4", label: "Blue" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "e8",
      type: "letter_drop",
      caseLabel: "Case #8",
      missionHe: "Complete the word challenge.",
      emoji: "🏠",
      zones: [{ id: "z1", label: "Option", icon: "🔤" }],
      pieces: shufflePieces([
        { id: "p1", label: "H" },
        { id: "p2", label: "P" },
        { id: "p3", label: "G" },
        { id: "p4", label: "F" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "e9",
      type: "sort_letter",
      caseLabel: "Case #9",
      missionHe: "Complete the word challenge.",
      zones: [{ id: "zS", label: "Option", icon: "📁" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "Option" },
        { id: "p3", label: "Who" },
        { id: "p4", label: "Option" },
      ]),
      solution: { zS: "p1" },
    },
    {
      id: "e10",
      type: "image_word",
      caseLabel: "Case #10",
      missionHe: "Complete the word challenge.",
      emoji: "✏️",
      zones: [{ id: "z1", label: "Option", icon: "📌" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "Option" },
        { id: "p3", label: "Who" },
        { id: "p4", label: "Option" },
      ]),
      solution: { z1: "p1" },
    },
  ],
  medium: [
    {
      id: "m1",
      type: "fill_sentence",
      caseLabel: "Case #1",
      missionHe: "Complete the word challenge.",
      zones: [{ id: "z1", label: "Option", icon: "📝" }],
      pieces: shufflePieces([
        { id: "p1", label: "cold the" },
        { id: "p2", label: "Option" },
        { id: "p3", label: "Blue" },
        { id: "p4", label: "to" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "m2",
      type: "sort_plural",
      caseLabel: "#2",
      missionHe: "Complete the word challenge.",
      zones: [
        { id: "zPlural", label: "Option", icon: "📁" },
        { id: "zSing", label: "Option", icon: "📂" },
      ],
      pieces: shufflePieces([
        { id: "p1", label: "Children" },
        { id: "p2", label: "to" },
        { id: "p3", label: "to" },
        { id: "p4", label: "to" },
      ]),
      solution: { zPlural: "p1" },
    },
    {
      id: "m3",
      type: "sort_gender",
      caseLabel: "Case #3",
      missionHe: "Complete the word challenge.",
      zones: [
        { id: "zFem", label: "Option", icon: "📁" },
        { id: "zMasc", label: "Option", icon: "📂" },
      ],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "Large" },
        { id: "p3", label: "to" },
        { id: "p4", label: "Large" },
      ]),
      solution: { zFem: "p1" },
    },
    {
      id: "m4",
      type: "word_family",
      caseLabel: "Case #4",
      missionHe: "Complete the word challenge.",
      zones: [{ id: "zFam", label: "Option", icon: "🧬" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "to" },
        { id: "p3", label: "Option" },
        { id: "p4", label: "Option" },
      ]),
      solution: { zFam: "p1" },
    },
    {
      id: "m5",
      type: "fill_sentence",
      caseLabel: "Case #5",
      missionHe: "Complete the word challenge.",
      zones: [{ id: "z1", label: "Option", icon: "📌" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "to" },
        { id: "p3", label: "Option" },
        { id: "p4", label: "Option" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "m6",
      type: "sort_plural",
      caseLabel: "Case #6",
      missionHe: "Complete the word challenge.",
      zones: [{ id: "zPlural", label: "Option", icon: "📁" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "Option" },
        { id: "p3", label: "Option" },
        { id: "p4", label: "Option" },
      ]),
      solution: { zPlural: "p1" },
    },
    {
      id: "m7",
      type: "word_family",
      caseLabel: "Case #7",
      missionHe: "Complete the word challenge.",
      zones: [{ id: "zFam", label: "Option", icon: "🧬" }],
      pieces: shufflePieces([
        { id: "p1", label: "to" },
        { id: "p2", label: "Option" },
        { id: "p3", label: "Option" },
        { id: "p4", label: "to" },
      ]),
      solution: { zFam: "p1" },
    },
    {
      id: "m8",
      type: "sort_gender",
      caseLabel: "Case #8",
      missionHe: "Complete the word challenge.",
      zones: [{ id: "zFem", label: "Option", icon: "📁" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "Who" },
        { id: "p3", label: "Option" },
        { id: "p4", label: "smart" },
      ]),
      solution: { zFem: "p1" },
    },
    {
      id: "m9",
      type: "fill_sentence",
      caseLabel: "Case #9",
      missionHe: "Complete the word challenge.",
      zones: [{ id: "z1", label: "Option", icon: "📌" }],
      pieces: shufflePieces([
        { id: "p1", label: "to" },
        { id: "p2", label: "Option" },
        { id: "p3", label: "Option" },
        { id: "p4", label: "to" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "m10",
      type: "fill_sentence",
      caseLabel: "Case #10",
      missionHe: "Complete the word challenge.",
      zones: [{ id: "z1", label: "Option", icon: "📝" }],
      pieces: shufflePieces([
        { id: "p1", label: "to" },
        { id: "p2", label: "Option" },
        { id: "p3", label: "Blue" },
        { id: "p4", label: "rain" },
      ]),
      solution: { z1: "p1" },
    },
  ],
  hard: [
    {
      id: "h1",
      type: "event_order",
      caseLabel: "Case #1",
      missionHe: "Complete the word challenge.",
      passage: "Text",
      zones: [
        { id: "z0", label: "Option", icon: "1️⃣" },
        { id: "z1", label: "Option", icon: "2️⃣" },
        { id: "z2", label: "Option", icon: "3️⃣" },
      ],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "Option" },
        { id: "p3", label: "Option" },
        { id: "p4", label: "Option" },
      ]),
      solution: { z0: "p1", z1: "p2", z2: "p3" },
    },
    {
      id: "h2",
      type: "title_stamp",
      caseLabel: "#2",
      missionHe: "Complete the word challenge.",
      passage: "Text",
      zones: [{ id: "zTitle", label: "Title", icon: "📋" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "Option" },
        { id: "p3", label: "Option" },
        { id: "p4", label: "Option" },
      ]),
      solution: { zTitle: "p1" },
    },
    {
      id: "h3",
      type: "conclusion",
      caseLabel: "Case #3",
      missionHe: "Complete the word challenge.",
      passage: "Text",
      zones: [{ id: "z1", label: "Option", icon: "🎯" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "to There are" },
        { id: "p3", label: "to Buy to" },
        { id: "p4", label: "to" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "h4",
      type: "conclusion",
      caseLabel: "Case #4",
      missionHe: "Complete the word challenge.",
      passage: "Text",
      zones: [{ id: "z1", label: "Option", icon: "🎯" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "Option" },
        { id: "p3", label: "to to" },
        { id: "p4", label: "Buy" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "h5",
      type: "event_order",
      caseLabel: "Case #5",
      missionHe: "Complete the word challenge.",
      passage: "Text",
      zones: [
        { id: "z0", label: "Option", icon: "1️⃣" },
        { id: "z1", label: "Option", icon: "2️⃣" },
        { id: "z2", label: "Option", icon: "3️⃣" },
      ],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "home" },
        { id: "p3", label: "Option" },
        { id: "p4", label: "to to" },
      ]),
      solution: { z0: "p1", z1: "p2", z2: "p3" },
    },
    {
      id: "h6",
      type: "title_stamp",
      caseLabel: "Case #6",
      missionHe: "Complete the word challenge.",
      passage: "Text",
      zones: [{ id: "zTitle", label: "Title", icon: "📋" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "Option" },
        { id: "p3", label: "Option" },
        { id: "p4", label: "to Forest" },
      ]),
      solution: { zTitle: "p1" },
    },
    {
      id: "h7",
      type: "meaning",
      caseLabel: "Case #7",
      missionHe: "Complete the word challenge.",
      passage: "Text",
      zones: [{ id: "z1", label: "Option", icon: "📖" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "There are" },
        { id: "p3", label: "All" },
        { id: "p4", label: "Option" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "h8",
      type: "conclusion",
      caseLabel: "Case #8",
      missionHe: "Complete the word challenge.",
      passage: "Text",
      zones: [{ id: "z1", label: "Option", icon: "🎯" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "All" },
        { id: "p3", label: "Option" },
        { id: "p4", label: "place" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "h9",
      type: "conclusion",
      caseLabel: "Case #9",
      missionHe: "Complete the word challenge.",
      passage: "Text",
      zones: [{ id: "z1", label: "Option", icon: "🎯" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "the" },
        { id: "p3", label: "home" },
        { id: "p4", label: "bin Who" },
      ]),
      solution: { z1: "p1" },
    },
    {
      id: "h10",
      type: "title_stamp",
      caseLabel: "Case #10",
      missionHe: "Title to rain",
      passage: "Text",
      zones: [{ id: "zTitle", label: "Title", icon: "📋" }],
      pieces: shufflePieces([
        { id: "p1", label: "Option" },
        { id: "p2", label: "to Forest" },
        { id: "p3", label: "shop" },
        { id: "p4", label: "Option" },
      ]),
      solution: { zTitle: "p1" },
    },
  ],
};

/** @param {DetectiveTask} task @param {Record<string, string>} zoneFills zoneId -> pieceId */
export function validateDetectiveTask(task, zoneFills) {
  for (const [zoneId, pieceId] of Object.entries(task.solution)) {
    if (zoneFills[zoneId] !== pieceId) return false;
  }
  return Object.keys(task.solution).every((z) => zoneFills[z]);
}

export function detectiveFeedback(ok) {
  return ok ? "🔖 !" : "-";
}

/** @param {DifficultyId} difficulty */
export function pickWordDetectiveTasks(difficulty) {
  const pool = WORD_DETECTIVE_TASKS[difficulty] ?? WORD_DETECTIVE_TASKS.easy;
  return shuffleTasks(pool).slice(0, LANGUAGE_PROTOTYPE_TASKS);
}

/** @param {DetectiveTask} task @param {Record<string, string>} zoneFills */
export function usedPieceIds(task, zoneFills) {
  return new Set(Object.values(zoneFills));
}
