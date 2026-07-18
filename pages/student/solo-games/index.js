import { getLocaleFromPath, withLocalePath } from "../../../lib/i18n/locale-path.js";
import { readSsrLocaleForRedirect } from "../../../lib/i18n/read-request-interface-locale.server.js";

/** Legacy hub URL — scoped to /student/game so PWA scope /student/ is preserved. */
export function getServerSideProps(context) {
  const resolvedPath = context.resolvedUrl?.split("?")[0] || "";
  const locale =
    readSsrLocaleForRedirect(context.req, resolvedPath) ||
    getLocaleFromPath(resolvedPath) ||
    "en";

  return {
    redirect: {
      destination: withLocalePath(locale, "/student/game"),
      permanent: false,
    },
  };
}

export default function SoloGamesHubRedirect() {
  return null;
}
