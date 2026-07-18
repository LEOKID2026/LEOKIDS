import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import styles from "./FractionDisplay.module.css";

const PACK = "components__educational-games__leo-pizzeria__FractionDisplay";

function fractionAria(n, d) {
  if (n === 0) return gamePackCopy(PACK, "fraction_zero");
  if (n === d) return gamePackCopy(PACK, "fraction_whole");
  return gamePackCopy(PACK, "fraction_parts", { numerator: n, denominator: d });
}

/**
 * @param {{ numerator: number, denominator: number, size?: 'sm'|'md'|'lg', className?: string }} props
 */
export default function FractionDisplay({ numerator, denominator, size = "md", className = "" }) {
  const n = Math.max(0, Math.floor(Number(numerator) || 0));
  const d = Math.max(1, Math.floor(Number(denominator) || 1));
  const aria = fractionAria(n, d);

  return (
    <span
      className={`${styles.fraction} ${styles[size] || styles.md} ${className}`}
      dir="ltr"
      role="img"
      aria-label={aria}
    >
      <span className={styles.numerator}>{n}</span>
      <span className={styles.bar} aria-hidden="true" />
      <span className={styles.denominator}>{d}</span>
    </span>
  );
}

/** Compare relation labels — never show enum strings. */
export const COMPARE_LABEL = Object.freeze({
  greater: gamePackCopy(PACK, "compare_greater"),
  less: gamePackCopy(PACK, "compare_less"),
  equal: gamePackCopy(PACK, "compare_equal"),
});
