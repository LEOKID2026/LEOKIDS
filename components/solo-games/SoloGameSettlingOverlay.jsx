import { useSoloGameShellUi } from "../../hooks/solo-games/useSoloGameShellUi.js";

/**
 * @param {{ open?: boolean }} props
 */
export default function SoloGameSettlingOverlay({ open = false }) {
  const { SG } = useSoloGameShellUi();

  if (!open) return null;

  return (
    <div className={SG.settlingOverlay} dir="ltr" role="status" aria-live="polite">
      <div className={SG.settlingSpinner} />
      <p className={SG.settlingTitle}>Calculating score…</p>
      <p className={SG.settlingSub}>Just a moment — saving your coins</p>
    </div>
  );
}
