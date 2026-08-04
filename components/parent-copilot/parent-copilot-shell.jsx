import React, { useState } from "react";
import { useT } from "../../lib/i18n/I18nProvider.jsx";
import { ParentCopilotPanel } from "./parent-copilot-panel.jsx";

/**
 * @param {{
 *   payload: object;
 *   selectedContextRef?: object || null;
 *   asyncTurnRunner?: ((input: object) => Promise<any>) || null;
 *   defaultOpen?: boolean;
 * }} props
 */
export default function ParentCopilotShell({
  payload,
  selectedContextRef = null,
  asyncTurnRunner = null,
  defaultOpen = false,
}) {
  const t = useT();
  const [open, setOpen] = useState(Boolean(defaultOpen));

  if (!payload) return null;

  return (
    <div className="w-full min-h-0 flex flex-col gap-2" data-testid="parent-copilot-shell">
      <button
        type="button"
        data-testid="parent-copilot-entrypoint"
        aria-expanded={open}
        aria-controls="parent-copilot-panel"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-lg border border-cyan-400/35 bg-cyan-950/30 px-3 py-2 text-start text-sm font-bold text-cyan-50 hover:bg-cyan-900/40"
      >
        {t("ui.copilot.panel.title")}
      </button>
      {open ? (
        <div id="parent-copilot-panel" data-testid="parent-copilot-panel" data-copilot-ready="true">
          <ParentCopilotPanel
            payload={payload}
            selectedContextRef={selectedContextRef}
            asyncTurnRunner={asyncTurnRunner}
            onRequestClose={() => setOpen(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
