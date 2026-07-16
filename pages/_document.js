import { Html, Head, Main, NextScript } from "next/document";

/**
 * Default shell is English LTR. Runtime locale/direction are applied from `_app`
 * (and a tiny head bootstrap) via documentElement attributes.
 */
export default function Document() {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=document.cookie.match(/(?:^|; )lk_global_locale=([^;]*)/);var raw=m?decodeURIComponent(m[1]):'en';var map={en:['en','ltr'],'en-XA':['en-XA','ltr'],'ar-XB':['ar-XB','rtl']};var pair=map[raw]||['en','ltr'];document.documentElement.lang=pair[0];document.documentElement.dir=pair[1];}catch(e){}})();`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
