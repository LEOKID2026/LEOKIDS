import { gamePackCopy } from "../../lib/games/game-pack-copy.js";
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
  titleHe: gamePackCopy("lib__solo-games__dev-prototype-hub-list", "game_prototypes"),
  blurbHe: gamePackCopy("lib__solo-games__dev-prototype-hub-list", "try_ideas_for_new_solo_games"),
  ctaHe: gamePackCopy("lib__solo-games__dev-prototype-hub-list", "enter_prototypes"),
  emoji: "🧪",
};

export const SOLO_DEV_PROTOTYPES_PLAY_HUB = {
  route: "/dev/solo-game-prototypes/games",
  titleHe: gamePackCopy("lib__solo-games__dev-prototype-hub-list", "solo_game_prototypes"),
  metaHe: "11 prototypes · gameplay",
  blurbHe: gamePackCopy("lib__solo-games__dev-prototype-hub-list", "fruit_slice_pipes_blocks_and_more_feel_out_solo_gameplay"),
  ctaHe: gamePackCopy("lib__solo-games__dev-prototype-hub-list", "enter_solo_prototypes"),
  emoji: "🎮",
};

export const LEARNING_DEV_PROTOTYPES_HUB = {
  route: "/dev/learning-game-prototypes",
  titleHe: gamePackCopy("lib__solo-games__dev-prototype-hub-list", "learning_prototypes"),
  metaHe: "8 prototypes · enrichment",
  blurbHe: gamePackCopy("lib__solo-games__dev-prototype-hub-list", "grocery_recycling_animals_lab_israel_journey_weather_space_and_more"),
  ctaHe: gamePackCopy("lib__solo-games__dev-prototype-hub-list", "enter_learning_prototypes"),
  emoji: "📚",
};

export const STUDENT_WORLD_HOME_PROTOTYPE = {
  id: "student-world-home",
  route: "/student/world-home-prototype",
  titleHe: "Kids' World — Prototype",
  metaHe: gamePackCopy("lib__solo-games__dev-prototype-hub-list", "home_screen_ui"),
  blurbHe: "Prototype for Kids' World screen — world background, gates, and dock. Requires student login.",
  ctaHe: gamePackCopy("lib__solo-games__dev-prototype-hub-list", "open_prototype"),
  emoji: "🌍",
};

export const LEO_DOG_PROTOTYPE = {
  id: "leo-dog",
  route: "/dev/leo-dog-prototype",
  titleHe: "Leo's Dog",
  metaHe: gamePackCopy("lib__solo-games__dev-prototype-hub-list", "pet_prototype"),
  blurbHe: gamePackCopy("lib__solo-games__dev-prototype-hub-list", "care_for_leo_play_pet_and_bathe_a_light_talking_tom_style_feel"),
  ctaHe: gamePackCopy("lib__solo-games__dev-prototype-hub-list", "open_prototype"),
  emoji: "🐕",
};
