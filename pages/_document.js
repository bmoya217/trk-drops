import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <script async>{"const whTooltips = {}"}</script>
        <script src="https://wow.zamimg.com/js/tooltips.js" async></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
