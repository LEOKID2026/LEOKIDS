/**
 * Dev-only hub list for solo game prototypes — not the production solo-game registry.
 */

/** Public games hub card — hidden; admin entry is via /admin nav only. */
export const SHOW_PUBLIC_PROTOTYPE_HUB_ENTRY = false;
export const SOLO_DEV_PROTOTYPE_LIST = [
  { id: "fruit-slice", titleHe: "Fruit Slice", route: "/dev/fruit-slice-prototype", emoji: "🍎" },
  { id: "pipe-puzzle", titleHe: "Water Pipes", route: "/dev/pipe-puzzle-prototype", emoji: "🚰" },
  { id: "connect-colors", titleHe: "Connect Colors", route: "/dev/connect-colors-prototype", emoji: "🎨" },
  { id: "traffic-jam", titleHe: "Traffic Jam", route: "/dev/traffic-jam-prototype", emoji: "🚗" },
  { id: "tower-stack", titleHe: "Block Tower", route: "/dev/tower-stack-prototype", emoji: "🧱" },
  { id: "marble-run", titleHe: "Marble Run", route: "/dev/marble-run-prototype", emoji: "⚪" },
  { id: "balance-scale", titleHe: "Balance Scale", route: "/dev/balance-scale-prototype", emoji: "⚖️" },
  { id: "rhythm", titleHe: "Rhythm Game", route: "/dev/rhythm-prototype", emoji: "🎵" },
  { id: "tangram", titleHe: "Tangram", route: "/dev/tangram-prototype", emoji: "🔺" },
  { id: "brick-breaker", titleHe: "Brick Breaker", route: "/dev/brick-breaker-prototype", emoji: "🧱" },
  { id: "smart-blocks", titleHe: "Smart Blocks — Prototype", route: "/dev/smart-blocks-prototype", emoji: "🧩" },
];

export const SOLO_DEV_PROTOTYPES_HUB = {
  route: "/dev/solo-game-prototypes",
  titleHe: "Game Prototypes",
  blurbHe: "Try ideas for new solo games",
  ctaHe: "Enter prototypes",
  emoji: "🧪",
};

export const SOLO_DEV_PROTOTYPES_PLAY_HUB = {
  route: "/dev/solo-game-prototypes/games",
  titleHe: "Solo Game Prototypes",
  metaHe: "11 prototypes · gameplay",
  blurbHe: "Fruit slice, pipes, blocks, and more — feel out solo gameplay.",
  ctaHe: "Enter solo prototypes",
  emoji: "🎮",
};

export const LEARNING_DEV_PROTOTYPES_HUB = {
  route: "/dev/learning-game-prototypes",
  titleHe: "Learning Prototypes",
  metaHe: "8 prototypes · enrichment",
  blurbHe: "Grocery, recycling, animals, lab, Israel journey, weather, space, and more.",
  ctaHe: "Enter learning prototypes",
  emoji: "📚",
};

export const STUDENT_WORLD_HOME_PROTOTYPE = {
  id: "student-world-home",
  route: "/student/world-home-prototype",
  titleHe: "Kids' World — Prototype",
  metaHe: "Home screen · UI",
  blurbHe: "Prototype for Kids' World screen — world background, gates, and dock. Requires student login.",
  ctaHe: "Open prototype",
  emoji: "🌍",
};

export const LEO_DOG_PROTOTYPE = {
  id: "leo-dog",
  route: "/dev/leo-dog-prototype",
  titleHe: "Leo's Dog",
  metaHe: "Pet · prototype",
  blurbHe: "Care for Leo, play, pet, and bathe — a light Talking Tom–style feel.",
  ctaHe: "Open prototype",
  emoji: "🐕",
};
