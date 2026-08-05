import { useMemo, useState } from "react";
import DevPrototypeShell from "../../../solo-games/prototypes/dev/DevPrototypeShell.jsx";

export default function IsraelJourneyPrototype() {
  const [phase] = useState("unavailable");

  return (
    <DevPrototypeShell
      title="Israel journey map"
      subtitle="Prototype unavailable in GLOBAL"
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-5xl" aria-hidden>
          🗺️
        </p>
        <p className="max-w-md text-sm font-semibold text-sky-200">
          This prototype uses Israel-specific curriculum content and is not available in the GLOBAL build.
        </p>
        <p className="max-w-md text-xs text-white/60">
          Check back in a region-specific build, or try another learning prototype from the dev lab.
        </p>
      </div>
    </DevPrototypeShell>
  );
}
