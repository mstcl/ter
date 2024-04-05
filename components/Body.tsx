/** @jsxImportSource npm:preact */

import Article from "./Article.tsx";
import Footer from "./Footer.tsx";
import Header from "./Header.tsx";
import IndexList from "./IndexList.tsx";
import IndexLog from "./IndexLog.tsx";
import IndexGrid from "./IndexGrid.tsx";

import { Crumb, Page } from "../types.d.ts";

interface BodyProps {
  page: Page;
  crumbs: Crumb[];
  childPages?: Page[];
  backlinkPages?: Page[];
  relatedPages?: Page[];
  pagesByTag?: Record<string, Page[]>;
  author?: { name: string; email: string; url: string };
  lang: Intl.LocalesArgument;
}

const PageIndex = ({
  pages,
  layout,
  lang,
}: {
  pages: Page[];
  layout: Page["layout"];
  lang: Intl.LocalesArgument;
}) => {
  switch (layout) {
    case "log":
      return <IndexLog items={pages} lang={lang} />;
    case "grid":
      return <IndexGrid items={pages} lang={lang} />;
    default:
      return (
        <IndexList title="Pages" items={pages} type={"pages"} lang={lang} />
      );
  }
};

const Body = ({
  page,
  crumbs,
  childPages,
  backlinkPages,
  relatedPages,
  pagesByTag,
  author,
  lang,
}: BodyProps) => (
  <body>
    <Header crumbs={crumbs} />

    <main>
      <Article lang={lang} page={page} />
    </main>

    <aside style="flex-direction: column; gap: 3rem; display: flex">
      {childPages && childPages.length > 0 && (
        <PageIndex lang={lang} layout={page.layout} pages={childPages} />
      )}

      {page.index !== "tag" && relatedPages && relatedPages.length > 0 && (
        <IndexList
          title={`Related`}
          items={relatedPages}
          type={"pages"}
          lang={lang}
        />
      )}

      {page.index === "tag" &&
        pagesByTag &&
        Object.keys(pagesByTag).length > 0 &&
        Object.keys(pagesByTag).map((tag) => (
          <IndexList
            title={`#${tag}`}
            items={pagesByTag[tag]}
            type={"pages"}
            lang={lang}
          />
        ))}

      {page.index === "dir" &&
        pagesByTag &&
        Object.keys(pagesByTag).length > 0 && (
          <IndexList
            title="Tags"
            items={pagesByTag}
            type={"tags"}
            lang={lang}
          />
        )}

      {backlinkPages && backlinkPages.length > 0 && (
        <IndexList
          title="Links to this page"
          items={backlinkPages}
          type={"backlinks"}
          lang={lang}
        />
      )}
    </aside>

    <Footer author={author} />
  </body>
);

export default Body;
