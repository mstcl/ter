/** @jsxImportSource npm:preact */

import { Page } from "../types.d.ts";

interface PageItemProps {
  url: URL;
  title: string;
  description?: string;
  isDirIndex?: boolean;
}

const PageItem = ({ title, description, url, isDirIndex }: PageItemProps) => {
  return (
    <li style="max-width: 100%">
      <a
        href={url.pathname}
        style="
          color: var(--foreground);
          align-items: baseline;
          gap: 0.375rem;
          display: flex;
          flex-direction: row;
          padding: 0.25rem 0.5rem;
        "
        class="box"
      >
        <div
          style="
            white-space: nowrap;
            align-items: baseline;
            overflow: hidden;
            flex: 1 1 0%;
            display: flex;"
          >
          <span style="font-weight: 500; flex-shrink: 0" class="truncate">
            {title}
            {isDirIndex && " / .."}
          </span>
          {description && (
            <span style="color: var(--sub);"
              class="truncate">
              <span style="
              margin-left: 0.5rem;
              margin-right: 0.5rem;
              ">&mdash;</span>
              {description}
            </span>
          )}
        </div>
      </a>
    </li>
  );
};

interface TagItemProps {
  name: string;
  pageCount: number;
}

const TagItem = ({ name, pageCount }: TagItemProps) => {
  return (
    <li style="max-width: 100%">
      <a href={`/tags##${name}`} class="box" style="
          padding: 0.25rem 0.5rem;
          color: var(--foreground)
      ">
        {name} <span style="color: var(--sub)">{pageCount}</span>
      </a>
    </li>
  );
};

interface IndexListProps {
  title: string;
  items: Page[] | Record<string, Page[]>;
  type: "pages" | "tags" | "backlinks";
  lang: Intl.LocalesArgument;
}

const IndexList = ({ items, title, type }: IndexListProps) => {
  return (
    <section id={title}>
      <h6 class="section-heading">{title}</h6>
      {(type === "pages" || type === "backlinks") && Array.isArray(items) && (
        <ul style="
          align-items: flex-start;
          flex-direction: column;
          margin: 0px;
          padding: 0px;
          margin-left: calc(0.5rem * -1);
          margin-right: calc(0.5rem * -1);
          display: flex;
          list-style: none;
          line-height: 1.5;
        "
        >
          {items.map((item) => (
            <PageItem
              isDirIndex={item.index === "dir"}
              title={item.title || ""}
              description={item.description}
              url={item.url}
            />
          ))}
        </ul>
      )}
      {type === "tags" && (
        <ul style="
          display: flex;
          margin: 0px;
          padding: 0px;
          margin-left: calc(0.5rem * -1);
          margin-right: calc(0.5rem * -1);
          flex-wrap: wrap;
          list-style: none;">
          {Object.entries(items).map((item) => (
            <TagItem name={item[0]} pageCount={item[1].length} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default IndexList;
