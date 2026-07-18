import { gamePackCopy } from "../../lib/games/game-pack-copy.js";
/** Solo Leo games catalog for /student/solo-games/* */

export const SOLO_GAME_KEYS = Object.freeze([
  "catcher",
  "puzzle",
  "memory",
  "flyer",
  "leo-jump",
  "balloons",
  "maze",
  "picture-puzzle",
  "target-tap",
  "sort-shapes",
  "smart-blocks",
  "fruit-slice",
  "leo-miners",
]);

export const SOLO_DIFFICULTY_OPTIONS = Object.freeze([
  { id: "easy", labelHe: "Easy" },
  { id: "medium", labelHe: "Medium" },
  { id: "hard", labelHe: "Hard" },
]);

/** @typedef {"landscape-recommend" | "portrait-recommend" | null} SoloOrientationHint */

/** @typedef {{ howToPlay: string, scoring: string, rewards: string, tip: string }} SoloGameHelpConfig */

/** @type {Record<string, { id: string, route: string, titleHe: string, emoji: string, blurbHe: string, hasDifficultyPicker: boolean, orientationHint: SoloOrientationHint, help: SoloGameHelpConfig }>} */
export const SOLO_GAME_REGISTRY = {
  catcher: {
    id: "catcher",
    route: "/student/solo-games/catcher",
    titleHe: gamePackCopy("lib__solo-games__solo-game-registry", "catch_with_leo"),
    emoji: "🎯",
    blurbHe: gamePackCopy("lib__solo-games__solo-game-registry", "catch_coins_and_stay_away_from_bombs"),
    hasDifficultyPicker: false,
    orientationHint: "landscape-recommend",
    help: {
      howToPlay: gamePackCopy("lib__solo-games__solo-game-registry", "move_leo_left_and_right_to_catch_coins_and_diamonds_falling_from_the_sky"),
      scoring: gamePackCopy("lib__solo-games__solo-game-registry", "every_coin_or_diamond_caught_adds_points_hitting_a_bomb_ends_the_game"),
      rewards: "The more points you earn, the more coins and diamonds you'll get for your kid world.",
      tip: "Keep your eyes on what's falling and move ahead of time before the item reaches the bottom.",
    },
  },
  flyer: {
    id: "flyer",
    route: "/student/solo-games/flyer",
    titleHe: gamePackCopy("lib__solo-games__solo-game-registry", "leo_in_a_plane"),
    emoji: "🪂",
    blurbHe: gamePackCopy("lib__solo-games__solo-game-registry", "hold_to_fly_collect_coins_and_avoid_obstacles"),
    hasDifficultyPicker: false,
    orientationHint: "landscape-recommend",
    help: {
      howToPlay: gamePackCopy("lib__solo-games__solo-game-registry", "hold_the_button_or_the_screen_to_fly_and_release_to_descend_collect_coin"),
      scoring: gamePackCopy("lib__solo-games__solo-game-registry", "coins_and_diamonds_add_points_hitting_an_obstacle_ends_the_game"),
      rewards: "The farther you fly and the more points you earn, the more coins and diamonds you'll get.",
      tip: "Don't fly too high - sometimes it's better to pass beneath an obstacle.",
    },
  },
  puzzle: {
    id: "puzzle",
    route: "/student/solo-games/puzzle",
    titleHe: "Leo's Puzzle",
    emoji: "🧩",
    blurbHe: gamePackCopy("lib__solo-games__solo-game-registry", "merge_tiles_and_rack_up_points_before_time_runs_out"),
    hasDifficultyPicker: true,
    orientationHint: "portrait-recommend",
    help: {
      howToPlay: gamePackCopy("lib__solo-games__solo-game-registry", "move_tiles_on_the_board_to_merge_matching_numbers_the_bigger_the_numbers"),
      scoring: gamePackCopy("lib__solo-games__solo-game-registry", "every_merge_adds_points_the_goal_is_to_reach_the_score_target_before_tim"),
      rewards: gamePackCopy("lib__solo-games__solo-game-registry", "winning_based_on_difficulty_level_grants_coins_and_a_score_bonus_adds_ev"),
      tip: gamePackCopy("lib__solo-games__solo-game-registry", "try_to_keep_a_corner_free_so_you_have_room_to_move_tiles"),
    },
  },
  memory: {
    id: "memory",
    route: "/student/solo-games/memory",
    titleHe: "Leo's Memory Game",
    emoji: "🧠",
    blurbHe: gamePackCopy("lib__solo-games__solo-game-registry", "flip_cards_and_find_pairs_before_the_clock_runs_out"),
    hasDifficultyPicker: true,
    orientationHint: null,
    help: {
      howToPlay: gamePackCopy("lib__solo-games__solo-game-registry", "tap_a_card_to_flip_it_and_find_its_matching_pair_every_pair_you_find_sta"),
      scoring: gamePackCopy("lib__solo-games__solo-game-registry", "you_start_with_a_high_score_the_longer_you_take_the_lower_it_drops_findi"),
      rewards: gamePackCopy("lib__solo-games__solo-game-registry", "winning_based_on_difficulty_level_grants_coins_and_diamonds_the_higher_t"),
      tip: "Try to remember where you saw each picture - even if you didn't find its pair right away.",
    },
  },
  "leo-jump": {
    id: "leo-jump",
    route: "/student/solo-games/leo-jump",
    titleHe: gamePackCopy("lib__solo-games__solo-game-registry", "leo_jumps"),
    emoji: "🦘",
    blurbHe: gamePackCopy("lib__solo-games__solo-game-registry", "jump_over_obstacles_and_collect_coins"),
    hasDifficultyPicker: false,
    orientationHint: "landscape-recommend",
    help: {
      howToPlay: gamePackCopy("lib__solo-games__solo-game-registry", "tap_to_jump_get_past_obstacles_and_collect_coins_diamonds_and_magnets_al"),
      scoring: gamePackCopy("lib__solo-games__solo-game-registry", "coins_and_diamonds_add_points_consecutive_jumps_over_obstacles_give_a_co"),
      rewards: "The farther you run and the more points you earn, the more coins and diamonds you'll get.",
      tip: "Don't jump every time - sometimes it's better to wait a moment and jump at the right time.",
    },
  },
  balloons: {
    id: "balloons",
    route: "/student/solo-games/balloons",
    titleHe: gamePackCopy("lib__solo-games__solo-game-registry", "balloon_pop"),
    emoji: "🎈",
    blurbHe: gamePackCopy("lib__solo-games__solo-game-registry", "pop_balloons_before_time_runs_out"),
    hasDifficultyPicker: false,
    orientationHint: null,
    help: {
      howToPlay: gamePackCopy("lib__solo-games__solo-game-registry", "tap_balloons_to_pop_them_you_have_three_lives_and_one_minute_watch_out_f"),
      scoring: gamePackCopy("lib__solo-games__solo-game-registry", "regular_gold_and_diamond_balloons_add_points_clock_balloons_add_time_and"),
      rewards: gamePackCopy("lib__solo-games__solo-game-registry", "reaching_the_pop_target_or_a_high_final_score_grants_coins_and_diamonds"),
      tip: gamePackCopy("lib__solo-games__solo-game-registry", "watch_for_special_balloons_they_can_help_you_before_time_runs_out"),
    },
  },
  maze: {
    id: "maze",
    route: "/student/solo-games/maze",
    titleHe: "Leo's Maze",
    emoji: "🌀",
    blurbHe: gamePackCopy("lib__solo-games__solo-game-registry", "find_the_exit_of_the_maze_before_time_runs_out"),
    hasDifficultyPicker: true,
    orientationHint: "portrait-recommend",
    help: {
      howToPlay: gamePackCopy("lib__solo-games__solo-game-registry", "move_leo_through_the_maze_collect_keys_and_stars_and_find_the_exit_befor"),
      scoring: gamePackCopy("lib__solo-games__solo-game-registry", "keys_stars_and_diamonds_add_points_finishing_the_maze_gives_a_big_bonus_"),
      rewards: gamePackCopy("lib__solo-games__solo-game-registry", "successfully_finishing_the_maze_based_on_difficulty_level_grants_coins_a"),
      tip: gamePackCopy("lib__solo-games__solo-game-registry", "collect_the_keys_first_sometimes_they_unlock_a_shorter_path"),
    },
  },
  "picture-puzzle": {
    id: "picture-puzzle",
    route: "/student/solo-games/picture-puzzle",
    titleHe: gamePackCopy("lib__solo-games__solo-game-registry", "picture_puzzle"),
    emoji: "🖼️",
    blurbHe: "Complete the pieces of Leo's picture!",
    hasDifficultyPicker: true,
    orientationHint: "landscape-recommend",
    help: {
      howToPlay: gamePackCopy("lib__solo-games__solo-game-registry", "drag_the_picture_pieces_to_the_right_place_on_the_board_complete_all_the"),
      scoring: "The faster you finish and the fewer moves you use, the higher the score. If time runs out before you finish - there's no win.",
      rewards: gamePackCopy("lib__solo-games__solo-game-registry", "completing_the_puzzle_based_on_difficulty_level_grants_coins_and_a_score"),
      tip: "Start with the corners and edges - it's easier to see where each piece belongs.",
    },
  },
  "target-tap": {
    id: "target-tap",
    route: "/student/solo-games/target-tap",
    titleHe: gamePackCopy("lib__solo-games__solo-game-registry", "target_tap"),
    emoji: "🎯",
    blurbHe: gamePackCopy("lib__solo-games__solo-game-registry", "tap_the_targets_before_they_disappear"),
    hasDifficultyPicker: true,
    orientationHint: null,
    help: {
      howToPlay: gamePackCopy("lib__solo-games__solo-game-registry", "tap_the_targets_that_appear_on_the_screen_before_they_disappear_you_have"),
      scoring: gamePackCopy("lib__solo-games__solo-game-registry", "regular_targets_stars_and_diamonds_are_worth_different_points_missing_co"),
      rewards: gamePackCopy("lib__solo-games__solo-game-registry", "reaching_the_hit_target_or_a_high_final_score_grants_coins_and_diamonds"),
      tip: "Don't rush at everything - sometimes a target with a diamond is worth more.",
    },
  },
  "sort-shapes": {
    id: "sort-shapes",
    route: "/student/solo-games/sort-shapes",
    titleHe: gamePackCopy("lib__solo-games__solo-game-registry", "sort_shapes"),
    emoji: "🔺",
    blurbHe: gamePackCopy("lib__solo-games__solo-game-registry", "sort_shapes_and_colors_into_the_correct_boxes"),
    hasDifficultyPicker: true,
    orientationHint: null,
    help: {
      howToPlay: gamePackCopy("lib__solo-games__solo-game-registry", "drag_each_shape_to_the_matching_box_by_shape_or_color_finish_all_the_sor"),
      scoring: gamePackCopy("lib__solo-games__solo-game-registry", "every_correct_sort_adds_points_a_mistake_deducts_from_the_score_if_time_"),
      rewards: gamePackCopy("lib__solo-games__solo-game-registry", "finishing_successfully_based_on_difficulty_level_grants_coins_and_a_scor"),
      tip: gamePackCopy("lib__solo-games__solo-game-registry", "first_decide_which_box_each_shape_belongs_to_then_drag_with_confidence"),
    },
  },
  "smart-blocks": {
    id: "smart-blocks",
    route: "/student/solo-games/smart-blocks",
    titleHe: gamePackCopy("lib__solo-games__solo-game-registry", "smart_blocks"),
    emoji: "🧱",
    blurbHe: gamePackCopy("lib__solo-games__solo-game-registry", "place_shapes_clear_rows_and_columns_and_reach_the_score_target"),
    hasDifficultyPicker: true,
    orientationHint: "landscape-recommend",
    help: {
      howToPlay: gamePackCopy("lib__solo-games__solo-game-registry", "drag_shapes_onto_the_board_rotate_them_if_needed_and_place_them_to_fill_"),
      scoring: gamePackCopy("lib__solo-games__solo-game-registry", "clearing_a_row_or_column_adds_points_the_goal_is_to_reach_the_score_targ"),
      rewards: gamePackCopy("lib__solo-games__solo-game-registry", "winning_based_on_difficulty_level_grants_coins_and_a_score_bonus_adds_ev"),
      tip: gamePackCopy("lib__solo-games__solo-game-registry", "try_to_clear_several_rows_at_once_it_gives_a_lot_of_points"),
    },
  },
  "fruit-slice": {
    id: "fruit-slice",
    route: "/student/solo-games/fruit-slice",
    titleHe: gamePackCopy("lib__solo-games__solo-game-registry", "fruit_slice"),
    emoji: "🍎",
    blurbHe: gamePackCopy("lib__solo-games__solo-game-registry", "slice_fruit_avoid_bombs_and_reach_the_score_target"),
    hasDifficultyPicker: true,
    orientationHint: null,
    help: {
      howToPlay: gamePackCopy("lib__solo-games__solo-game-registry", "drag_your_finger_across_the_screen_to_slice_flying_fruit_avoid_bombs_you"),
      scoring: gamePackCopy("lib__solo-games__solo-game-registry", "every_fruit_sliced_adds_points_slicing_several_fruits_at_once_gives_a_co"),
      rewards: gamePackCopy("lib__solo-games__solo-game-registry", "reaching_the_score_target_based_on_difficulty_level_grants_coins_and_dia"),
      tip: "Slice only fruit - if you see a bomb, it's best to skip it.",
    },
  },
  "leo-miners": {
    id: "leo-miners",
    route: "/student/solo-games/leo-miners",
    titleHe: gamePackCopy("lib__solo-games__solo-game-registry", "leo_the_miner"),
    emoji: "⛏️",
    blurbHe: gamePackCopy("lib__solo-games__solo-game-registry", "merge_mining_dogs_break_rocks_and_earn_points_to_redeem"),
    hasDifficultyPicker: false,
    orientationHint: "portrait-recommend",
    help: {
      howToPlay:
        "Add mining dogs to the board, drag dogs of the same level to merge them, and break rocks to earn coins and points.",
      scoring: "Every rock broken grants coins. Points accumulate based on the rock's stage - with a daily limit.",
      rewards: gamePackCopy("lib__solo-games__solo-game-registry", "points_can_be_redeemed_for_leo_coins_and_diamonds_once_the_server_is_rea"),
      tip: gamePackCopy("lib__solo-games__solo-game-registry", "upgrade_dps_to_break_rocks_faster_and_gold_to_earn_more_coins_from_each_"),
    },
  },
};

export const SOLO_GAME_LIST = SOLO_GAME_KEYS.map((key) => SOLO_GAME_REGISTRY[key]);

/**
 * @param {string} gameKey
 */
export function findSoloGame(gameKey) {
  const key = String(gameKey || "").trim().toLowerCase();
  return SOLO_GAME_REGISTRY[key] || null;
}

/**
 * @param {string} gameKey
 */
export function isValidSoloGameKey(gameKey) {
  return SOLO_GAME_KEYS.includes(String(gameKey || "").trim().toLowerCase());
}

/**
 * @param {string} difficulty
 */
export function isValidSoloDifficulty(difficulty) {
  if (!difficulty) return true;
  return SOLO_DIFFICULTY_OPTIONS.some((d) => d.id === difficulty);
}

/**
 * @param {string} difficulty
 */
export function difficultyLabelHe(difficulty) {
  const d = SOLO_DIFFICULTY_OPTIONS.find((x) => x.id === difficulty);
  return d?.labelHe || difficulty || "-";
}
