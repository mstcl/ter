/** @jsxImportSource https://esm.sh/preact */

import { Heading, Page } from "../types.d.ts";
import { cx } from "../deps.ts";

function Toc({ headings }: { headings: Heading[] }) {
  return (
    <ol class="not-prose dim-links text-gray-500 p-0 list-none mt-12 mb-0 gap-4 columns-3xs">
      {headings
        .map((h: Heading, i) => {
          return (
            <li class="font-medium uppercase tracking-wide">
              <a
                href={`#${h.slug}`}
                class="
                  text(xs) 
                  block truncate
                  py-1.5 px-2
                  border(t dark:gray-800)
                "
              >
                <span class="font-mono mr-2">{i + 1}</span>
                {h.text}
              </a>
            </li>
          );
        })}
    </ol>
  );
}

interface HeaderProps {
  title?: string;
  description?: string;
  datePublished?: Date;
  url: URL;
  dateUpdated?: Date;
  tags?: string[];
  headings?: Heading[];
  lang: Intl.LocalesArgument;
  compact: boolean;
  showTitle: boolean;
  showMeta: boolean;
  showDescription: boolean;
  showToc: boolean;
}

function Header({
  title,
  description,
  url,
  datePublished,
  dateUpdated,
  tags,
  headings,
  lang,
  showTitle,
  showDescription,
  showMeta,
  showToc,
  compact,
}: HeaderProps) {
  const dateFormat: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return (
    <header
      class={cx(
        "dim-links empty:hidden only-child:(m-0)",
        !compact && "mb-12",
      )}
    >
      {showTitle && (
        <h1 class={cx("tracking-tight", compact ? "text-xl mb-1" : "mb-8")}>
          {title}
        </h1>
      )}

      {showDescription && description && <p class="lead">{description}</p>}

      {showMeta && (datePublished || tags) && (
        <div
          class={cx(
            "divide-dot not-prose flex items-baseline justify-end text(sm gray-500 dark:gray-400)",
            compact && "justify-start",
          )}
        >
          {datePublished && (
            <div>
              <a href={url.pathname}>
                <time dateTime={datePublished.toString()}>
                  {datePublished.toLocaleDateString(lang, dateFormat)}
                </time>
              </a>
            </div>
          )}
          {dateUpdated && (
            <div>
              <span>Upd:</span>{" "}
              <time dateTime={dateUpdated.toString()}>
                {dateUpdated.toLocaleDateString(lang, dateFormat)}
              </time>
            </div>
          )}
          {tags && (
            <ul class="m-0 p-0 space-x-2">
              {tags.map((tag) => (
                <li class="p-0 m-0 inline">
                  <a href={`/tags##${tag}`}>#{tag}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!compact && showToc && headings?.some((h) => h.level > 2) && (
        <Toc headings={headings.filter((h) => h.level <= 2)} />
      )}
    </header>
  );
}

interface Props {
  page: Page;
  lang: Intl.LocalesArgument;
  isInLog?: boolean;
  children?: preact.ComponentChildren;
  compact?: boolean;
}

export default function Article({
  page,
  children,
  lang,
  compact = false,
}: Props) {
  return (
    <article class="prose prose-sm md:prose-base dark:prose-invert max-w-none">
      {page.showHeader && (
        <Header
          url={page.url}
          title={page.title}
          description={page.description}
          datePublished={page.datePublished}
          dateUpdated={page.dateUpdated}
          tags={page.tags}
          headings={page.headings}
          lang={lang}
          compact={compact}
          showTitle={page.showTitle}
          showMeta={page.showMeta}
          showDescription={page.showDescription}
          showToc={page.showToc}
        />
      )}

      {page.html && <div dangerouslySetInnerHTML={{ __html: page.html }} />}

      {children}
    </article>
  );
}
