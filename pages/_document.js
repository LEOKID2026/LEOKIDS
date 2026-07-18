import Document, { Head, Html, Main, NextScript } from "next/document";
import { resolveLocaleDefinition } from "../lib/i18n/locale-registry.js";
import { readRequestInterfaceLocale } from "../lib/i18n/read-request-interface-locale.server.js";

/**
 * SSR locale shell — reads middleware-resolved interface locale from request header
 * or locale prefix in the user-facing URL (ctx.asPath).
 */
function readDocumentInterfaceLocale(ctx) {
  const fromRequest = readRequestInterfaceLocale(ctx.req, ctx.asPath || ctx.pathname || "");
  if (fromRequest) return fromRequest;
  return "en";
}

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const localeId = readDocumentInterfaceLocale(ctx);
    const direction = resolveLocaleDefinition(localeId).direction;
    return { ...initialProps, localeId, direction };
  }

  render() {
    const localeId = this.props.localeId || "en";
    const direction = this.props.direction || "ltr";
    return (
      <Html lang={localeId} dir={direction}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
