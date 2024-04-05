/** @jsxImportSource npm:preact */

import { HIGHLIGHT_STYLE, HMR_CLIENT } from "./constants.ts";
import { render } from "./deps/preact.ts";
import { Crumb, Page, UserConfig } from "./types.d.ts";
import Body from "./components/Body.tsx";
import { sortPages, sortTaggedPages } from "./pages.ts";

interface RenderOpts {
  page: Page;
  crumbs: Crumb[];
  dev?: boolean;
  childPages?: Page[];
  backlinkPages?: Page[];
  relatedPages?: Page[];
  pagesByTag?: Record<string, Page[]>;
  userConfig: UserConfig;
}

export function renderPage({
  page,
  crumbs,
  dev,
  childPages,
  backlinkPages,
  relatedPages,
  pagesByTag,
  userConfig,
}: RenderOpts): string {
  const body = render(
    <Body
      page={page}
      crumbs={crumbs}
      childPages={childPages && sortPages(childPages)}
      backlinkPages={backlinkPages && sortPages(backlinkPages)}
      relatedPages={relatedPages && sortPages(relatedPages)}
      pagesByTag={pagesByTag && sortTaggedPages(pagesByTag)}
      lang={userConfig.lang}
      author={{
        name: userConfig.authorName,
        email: userConfig.authorEmail,
        url: userConfig.authorUrl,
      }}
    />
  );

  const pageTitle =
    page.title === userConfig.title
      ? page.title
      : `${page.title} &middot; ${userConfig.title}`;
  const pageDescription = `${page.description || userConfig.description}`;

  return (
    `<!doctype html>
<html lang="${userConfig.lang || "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${pageDescription}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="$${pageDescription}">
  <meta property="og:url" content="${page.url}">
  <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAMAUExURf1H5U2uGNq0aYnCyElGuy3jejhMY9O0UNgSPHLQ2+Chx7Ti+6hJVoq1kGhbFiA9mdG/EEJgQrYCF0vlLi8nRcBNroyP+ADEiTMkR4Qaz2nEGJ3k4wWcnIAQeYsPfaQ8QcV6L23YMooQ37Mjx4SUW7o56T3GAubbX8thFDL0/W+9Gf5Fy+kTIJzggWmIn0pEtb7crTRoUcT2HXjhCM3vuB4iJjwRgpNjav+dJhZswUIgJH/mXWmsgxGwy6HIsw5DWn75YAlz6K9/GNwLbco7067CWvbu5Ba16SsjgIaACnJCfSRjWpbsLGBpmkvrnyoFrX15qHzRywOeJbwClmut7yqBVrGSPc39UhP61ybsLR9fcmAQN3UH+vh3vLRFN5DGN+ZmCSzvm8UdHYqvDklLeawoXsafkOPtTJ4XdTyj9MYFVNsUr9dT9tEaVGzysisH7reL6B1inKOEfJIa7kltjba4GcpG7mpQmN+Gx+a83cDY4/IEcjLPT2UWSXqpdRhWYOTEjxKfqbyf0oG9nz+F5JPMA7r/a9PPEtfackBaZoFkRUWuRaZGmcM2ibgmccwGxbMQZ/ySZE1Hdbb4vENjaRIlcJXLtLbCg5KOPWjeUDeGZarXFf0YGZcT+sIU/On+mcVI4741V+jEzUF85vT8CSwqsXbM9q/QgDbAlIEvA25j6GbXIjDq3iPP61dY6noKUnwjiB2nyJskiPzJhg736/bU42P+hB/7wT3+Wx2bweWyYO+XDoCtnVToYvsgSN2nh/lbGarY7WDwZ9EYIAji1lF580xjhi7LauZX4cAzLJBKs6TrdM9+raBCboF787YEpsOylYCCAHPmW5BhVavo5158cjuBgAM7JJHhuBW9n6dWRt/ZuQ8MdeENdTxPTUGmTjXP9rM7bNRsOwBFwzLykkeOuTjegpGbNM4h5l8+n+9GuPOyYi5cYYohc9CLG3w1E45UGDNT+KBwep/52wqUu1YNClsrpUlM4+cMHevnCdEIdpub2Wu8DEy+HS9DACMc2RlsNqwAAAAHdElNRQfoBAQTETgpmoR/AAABG0lEQVQY0wEQAe/+AAABAgMEBQYHCAkKCwwNDg8AEBESExQVFhcYGRobHB0eHwAgISIjJCUmJygpKissLS4vADAxMjM0NTY3ODk6Ozw9Pj8AQEFCQ0RFRkdISUpLTE1OTwBQUVJTVFVWV1hZWltcXV5fAGBhYmNkZWZnaGlqa2xtbm8AcHFyc3R1dnd4eXp7fH1+fwCAgYKDhIWGh4iJiouMjY6PAJCRkpOUlZaXmJmam5ydnp8AoKGio6SlpqeoqaqrrK2urwCwsbKztLW2t7i5uru8vb6/AMDBwsPExcbHyMnKy8zNzs8A0NHS09TV1tfY2drb3N3e3wDg4eLj5OXm5+jp6uvs7e7vAPDx8vP09fb3+Pn6+/z9/v8Wc3+B4YIArgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNC0wNC0wNFQxOToxNzo1NiswMDowMH+coO4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjQtMDQtMDRUMTk6MTc6NTYrMDA6MDAOwRhSAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI0LTA0LTA0VDE5OjE3OjU2KzAwOjAwWdQ5jQAAAABJRU5ErkJggg=="
  <link rel="alternate" type="application/atom+xml" href="/feed.xml" title="${
    userConfig.title
  }" />
  ${userConfig.head || ""}
  <style type="text/css">
    html {
      line-height: 1.75;
      -webkit-text-size-adjust: 100%;
    }

    body {
      margin: 0;
    }

    main {
      display: block;
    }

    h1 {
      font-size: 2em;
      margin: 0.67em 0;
    }

    hr {
      box-sizing: content-box;
      height: 0;
      overflow: visible;
    }

    pre {
      font-family: monospace, monospace;
      font-size: 1em;
    }

    a {
      background-color: transparent;
    }

    abbr[title] {
      border-bottom: none;
      text-decoration: underline;
      text-decoration: underline dotted;
    }

    b,
    strong {
      font-weight: bolder;
    }

    code,
    kbd,
    samp {
      font-family: monospace, monospace;
      font-size: 1em;
    }

    small {
      font-size: 80%;
    }

    sub,
    sup {
      font-size: 75%;
      line-height: 0;
      position: relative;
      vertical-align: baseline;
    }

    sub {
      bottom: -0.25em;
    }

    sup {
      top: -0.5em;
    }

    img {
      border-style: none;
    }

    button,
    input,
    optgroup,
    select,
    textarea {
      font-family: inherit;
      font-size: 100%;
      line-height: 1.15;
      margin: 0;
    }

    button,
    input {
      overflow: visible;
    }

    button,
    select {
      text-transform: none;
    }

    button,
    [type="button"],
    [type="reset"],
    [type="submit"] {
      -webkit-appearance: button;
    }

    button::-moz-focus-inner,
    [type="button"]::-moz-focus-inner,
    [type="reset"]::-moz-focus-inner,
    [type="submit"]::-moz-focus-inner {
      border-style: none;
      padding: 0;
    }

    button:-moz-focusring,
    [type="button"]:-moz-focusring,
    [type="reset"]:-moz-focusring,
    [type="submit"]:-moz-focusring {
      outline: 1px dotted ButtonText;
    }

    fieldset {
      padding: 0.35em 0.75em 0.625em;
    }

    legend {
      box-sizing: border-box;
      color: inherit;
      display: table;
      max-width: 100%;
      padding: 0;
      white-space: normal;
    }

    progress {
      vertical-align: baseline;
    }

    textarea {
      overflow: auto;
    }

    [type="checkbox"],
    [type="radio"] {
      box-sizing: border-box;
      padding: 0;
    }

    [type="number"]::-webkit-inner-spin-button,
    [type="number"]::-webkit-outer-spin-button {
      height: auto;
    }

    [type="search"] {
      -webkit-appearance: textfield;
      outline-offset: -2px;
    }

    [type="search"]::-webkit-search-decoration {
      -webkit-appearance: none;
    }

    ::-webkit-file-upload-button {
      -webkit-appearance: button;
      font: inherit;
    }

    details {
      display: block;
    }

    summary {
      display: list-item;
    }

    template {
      display: none;
    }

    [hidden] {
      display: none;
    }

    html {
      box-sizing: border-box;
    }

    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }

    :root {
      --background: #f8f8f8;
      --subtle: #eee;
      --foreground: #222;
      --sub: #666;
      --hover: #dfdfdf;
    }

    body {
      font-family: sans-serif;
      background-color: var(--background);
      -webkit-text-size-adjust: 100%;
      font-size: 1rem;
      font-weight: 400;
      padding: 1em;
      margin: auto;
      max-width: 42rem;
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.2rem;
    }

    h3 {
      font-size: 1.2rem;
    }

    h4 {
      font-size: 1.2rem;
    }

    h5 {
      font-size: 1rem;
    }

    h6 {
      font-size: 0.9rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: var(--foreground);
      line-height: 125%;
      margin-top: 2rem;
    }

    p {
      margin: 1rem 0;
    }

    a {
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-decoration-color: var(--hover);
      color: var(--foreground);
    }

    a:visited {
      color: var(--foreground);
    }

    a:hover {
      text-decoration: var(--sub);
    }

    a:active {
      color: var(--foreground);
      background: var(--hover);
    }

    ul,
    ol {
      margin: 1rem 0;
      padding: 0 0 0 0 2rem;
    }

    ul ul,
    ul ol,
    ol ul,
    ol ol {
      margin: 0.3rem 0;
    }

    li p:last-child {
      margin-bottom: 0;
    }

    blockquote {
      color: var(--sub);
      margin: 0;
      padding-left: 1em;
      font-style: italic;
      font-weight: 500;
      border-left: 0.25em var(--hover) solid;
    }

    hr {
      display: block;
      height: 2px;
      border: 0;
      border-top: 1px solid var(--subtle);
      border-bottom: 1px solid var(--subtle);
      margin: 1em 0;
      padding: 0;
    }

    pre,
    code,
    kbd,
    samp {
      word-wrap: break-word;
      color: var(--foreground);
      font-family: monospace;
      font-size: 0.98em;
    }

    pre {
      white-space: pre;
      word-wrap: break-word;
    }

    b,
    strong {
      font-weight: bold;
    }

    dfn {
      font-style: italic;
    }

    ins {
      background: #ff9;
      color: #000;
      text-decoration: none;
    }

    sub,
    sup {
      font-size: 75%;
      line-height: 0;
      position: relative;
      vertical-align: baseline;
    }

    sup {
      top: -0.5em;
    }

    sub {
      bottom: -0.25em;
    }

    /* Custom styles */
    details {
      color: var(--sub)
    }
    table {
      text-indent: 0;
      border-color: inherit;
      border-collapse: collapse;
      text-align: left
    }
    thead {
      border-bottom: 1px solid var(--hover);
    }
    thead th {
      font-weight: 600;
      vertical-align: bottom;
      padding-right: .571em;
      padding-bottom: .571em;
      padding-left: .571em;
    }
    tbody tr {
      border-bottom: 1px solid var(--hover);
    }
    tbody td {
      padding-left: 0;
    }
    tbody td, tfoot td {
      vertical-align: baseline;
      padding-top: .571em;
      padding-right: .571em;
      padding-bottom: .571em;
      padding-left: .571em;
    }
    body {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      grid-gap: 2.5rem;
      gap: 2.5rem;
    }
    :where(a[rel~="external"])::after {
      content: "\\0000a↗";
      font-size: 0.75rem;
    }
    .section-heading {
      color: var(--sub);
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.025em;
      margin-bottom: 0.75rem;
      display: flex;
      grid-gap: 0.5rem;
      gap: 0.5rem;
      align-items: baseline;
      font-size: 0.75rem;
      line-height: 1rem;
      margin-top: 0px;
    }
    .section-heading::after {
      content: "";
      background-color: var(--hover);
      flex: 1 1 0%;
      height: 1px;
    }
    nav > :not(:last-child)::after {
      content: '/';
    }
    .index-grid {
      margin: 0px;
      padding: 0px;
      margin-left: calc(0.5rem * -1);
      margin-right: calc(0.5rem * -1);
      gap: 0.375rem;
      display: grid;
    }
    @media (min-width: 640px) {
      .index-grid {
        -ms-grid-columns: repeat(3,minmax(0,1fr));
        grid-template-columns: repeat(3,minmax(0,1fr));
      }
    }
    .box {
      display:block;
      background-color:transparent;
      border-radius:0.25rem;
    }
    .box:is(a):hover {
      --tw-text-opacity: 1;
      color: var(--foreground);
    }
    .box:is(a):hover {
      --tw-bg-opacity: 1;
      background-color: var(--subtle);
    }
    .box:is(a) {
      --tw-text-opacity: 1;
      color: var(--foreground);
    }
    .h-anchor {
      text-decoration-line: none !important;
      display: flex;
      opacity: 0;
      font-size: 1rem;
      margin-left: -1.5rem;
      transition-property: opacity;
      transition-timing-function: cubic-bezier(0.4,0,0.2,1);
      transition-duration: 150ms;
      position: absolute;
      justify-content: center;
      align-items: center;
      border-radius: 0.125rem;
      font-size: inherit;
    }
    .truncate {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    :where(h1, h2, h3, h4, h5, h6):hover > .h-anchor {
      opacity: .7
    }
    .box {
      background-color: transparent;
      border-radius: 0.25rem;
    }
    .lead {
      color: var(--sub);
      margin: 0px;
      margin-bottom: 0px;
      font-size: 1rem;
      line-height: 1.75;
      font-weight: 500;
    }
    header a, footer a,
    aside a,
    header a:visited,
    footer a:visited,
    aside a:visited {
      color: var(--sub);
      text-decoration: none;
    }
    main > header {
      flex-direction: column;
      gap: 0.5rem;
      display: flex;
    }
    article header {
      margin-bottom: 3rem;
    }
    article header:only-child {
      margin:0px
    }
    article :where(article :last-child) {
    margin-bottom: 0px;
    }
    header
    footer {
      margin-top: auto;
      align-items: baseline;
      font-size: 0.75rem;
      line-height: 1rem;
      display: flex;
    }
    .toc {
      border-radius: 0.25rem;
      list-style-type: none;
      list-style-position: inside;
      margin-left: 1rem;
      font-weight: 500;
      font-size: 0.875rem;
      line-height: 1.5;
      background-color: var(--subtle);
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      margin-top: 0px;
      margin-bottom: 0px;
      float: right;
      display: none;
    }
    @media (min-width: 1024px) {
      .toc {
        width: 30%;
      }
    }
    @media (min-width: 640px) {
      .toc {
        display: block;
      }
    }
    .metadata > :not(:last-child)::after, footer ul li:not(:last-child)::after {
      content:'·';
      color: var(--hover);
      margin-left: 0.375rem;
      margin-right: 0.375rem;
    }
    pre {
      border-radius: 0.125rem;
      border: 1px solid var(--hover);
      background: var(--subtle);
      line-height: 1.5;
      font-size: 13px;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      border-width: 1px;
      overflow-x: auto;
    }
    dl, dt, dd {
      margin: 0;
    }
    dt {
      font-weight: 600;
    }
    /* Custom styles end */

    @media screen and (min-width: 768px) {
      body {
        margin: auto 5rem;
      }
    }

    @media print {
      * {
        background: transparent !important;
        color: black !important;
        filter: none !important;
        -ms-filter: none !important;
      }

      body {
        font-size: 12pt;
        max-width: 100%;
      }

      a,
      a:visited {
        text-decoration: underline;
      }

      hr {
        height: 1px;
        border: 0;
        border-bottom: 1px solid black;
      }

      a[href]:after {
        content: " (" attr(href) ")";
      }

      abbr[title]:after {
        content: " (" attr(title) ")";
      }

      .ir a:after,
      a[href^="javascript:"]:after,
      a[href^="#"]:after {
        content: "";
      }

      pre,
      blockquote {
        border: 1px solid var(--hover);
        padding-right: 1em;
        page-break-inside: avoid;
      }

      tr,
      img {
        page-break-inside: avoid;
      }

      img {
        max-width: 100% !important;
      }

      @page :left {
        margin: 15mm 20mm 15mm 10mm;
      }

      @page :right {
        margin: 15mm 10mm 15mm 20mm;
      }

      p,
      h2,
      h3 {
        orphans: 3;
        widows: 3;
      }

      h2,
      h3 {
        page-break-after: avoid;
      }
    }
  </style>
</head>
${dev ? `<script>${HMR_CLIENT}</script>` : ""}
${body}
</html>`,
  );
}
