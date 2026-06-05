import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      style={{
        background: "#121212",
        display: "flex",
        height: "100vh",
      }}
    >
      <Head>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "html,body,#__next{display:flex;flex:1;height:100vh;margin:0;background:#121212;}body{justify-content:center;}#__next{width:100vw;}",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.querySelectorAll('[data-next-hide-fouc]').forEach(function(node){node.parentNode.removeChild(node);});",
          }}
        />
        <script async>{"const whTooltips = {}"}</script>
        <script src="https://wow.zamimg.com/js/tooltips.js" async></script>
      </Head>
      <body
        style={{
          background: "#121212",
          display: "flex",
          flex: 1,
          height: "100vh",
          justifyContent: "center",
          margin: 0,
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
