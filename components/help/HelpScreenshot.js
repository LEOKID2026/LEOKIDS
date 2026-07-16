import { useState } from "react";
import { useSharedShellUi } from "../../hooks/useSharedShellUi.js";

const ALLOW_MISSING =
  process.env.NEXT_PUBLIC_HELP_CENTER_ALLOW_MISSING_SCREENSHOTS === "1" ||
  process.env.HELP_CENTER_ALLOW_MISSING_SCREENSHOTS === "1";

export default function HelpScreenshot({ path, alt, caption, sources }) {
  const { SP } = useSharedShellUi();
  const [failed, setFailed] = useState(false);
  const mobile = sources?.mobile || path;
  const tablet = sources?.tablet || path;

  if (!path || !alt?.trim()) return null;

  if (failed && ALLOW_MISSING) {
    return (
      <figure className={SP.screenshotMissing}>
        <figcaption>{caption || alt}</figcaption>
        <p className="mt-2">Screenshot coming soon</p>
      </figure>
    );
  }

  if (failed) {
    return (
      <figure className={SP.screenshotError}>
        <figcaption>{caption || alt}</figcaption>
        <p className="mt-2">Could not load screenshot</p>
      </figure>
    );
  }

  return (
    <figure className="my-6 text-left">
      <picture>
        <source media="(max-width: 640px)" srcSet={mobile} />
        <source media="(max-width: 1023px)" srcSet={tablet} />
        <img
          src={path}
          alt={alt}
          width={1366}
          height={768}
          loading="lazy"
          decoding="async"
          className={SP.screenshotBorder}
          onError={() => setFailed(true)}
        />
      </picture>
      {caption ? <figcaption className={SP.screenshotCaption}>{caption}</figcaption> : null}
    </figure>
  );
}
