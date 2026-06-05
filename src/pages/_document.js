import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      suppressHydrationWarning
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Head>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ":root,[data-theme='dark']{--app-bg:#121212;--app-fg:#fff;color-scheme:dark;}[data-theme='light']{--app-bg:#fff;--app-fg:rgba(0,0,0,.87);color-scheme:light;}html,body,#__next{display:flex;flex:1;height:100vh;margin:0;background:var(--app-bg);color:var(--app-fg);}body{justify-content:center;}#__next{width:100vw;}",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var cookieMatch=document.cookie.match(/(?:^|; )theme-mode=(light|dark)(?:;|$)/);var mode=localStorage.getItem('theme-mode')||(cookieMatch&&cookieMatch[1]);if(mode!=='light'&&mode!=='dark')mode='dark';document.documentElement.dataset.theme=mode;document.documentElement.style.colorScheme=mode;}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.style.colorScheme='dark';}})();",
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
