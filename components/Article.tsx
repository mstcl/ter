/** @jsxImportSource npm:preact */

import { Heading, Page } from "../types.d.ts";

const Toc = ({ headings }: { headings: Heading[] }) => (
  <ol class="toc">
    <span style="display: block; font-size; 0.875rem; color: var(--foreground)">Contents</span>
    {headings.map((h: Heading) => {
      return (
        <li class="truncate">
          <a style="font-size: .9rem; text-decoration: none; color: var(--sub)" href={`#${h.slug}`}>{h.text}</a>
        </li>
      );
    })}
  </ol>
);

const Metadata = ({
  label,
  children,
}: {
  label?: string;
  children: preact.ComponentChildren;
}) => (
  <div>
    {label && <span>{label}&nbsp;</span>}
    {children}
  </div>
);

interface HeaderProps {
  url: URL;
  lang: Intl.LocalesArgument;
  title?: string;
  description?: string;
  datePublished?: Date;
  dateUpdated?: Date;
  tags?: string[];
  compact?: boolean;
}

const Header = ({
  title,
  description,
  url,
  datePublished,
  dateUpdated,
  tags,
  lang,
  compact,
}: HeaderProps) => {
  const dateFormat: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return (
    <header>
      <h1 style="margin-top: 0px; margin-bottom: 0px;">{title}</h1>

      {description && <p class="lead">{description}</p>}

      {(datePublished || dateUpdated || tags) && (
        <div class="metadata" style="align-items: baseline; font-size: 0.875rem; display: flex">
          {datePublished && (
            <Metadata>
              <a href={url.toString()}>
                <time dateTime={datePublished.toISOString()}>
                  {datePublished.toLocaleDateString(lang, dateFormat)}
                </time>
              </a>
            </Metadata>
          )}
          {dateUpdated && (
            <Metadata label="Upd:">
              <time dateTime={dateUpdated.toISOString()}>
                {dateUpdated.toLocaleDateString(lang, dateFormat)}
              </time>
            </Metadata>
          )}
          {tags && (
            <Metadata>
              <ul style="padding: 0px; margin: 0px; list-style: none">
                {tags.map((tag) => (
                  <li style="padding: 0px; margin: 0px; display: inline">
                    <a href={`/tags##${tag}`}>#{tag}</a>
                  </li>
                ))}
              </ul>
            </Metadata>
          )}
        </div>
      )}
    </header>
  );
};

interface ArticleProps {
  page: Page;
  lang: Intl.LocalesArgument;
  children?: preact.ComponentChildren;
  compact?: boolean;
}

const Article = ({ page, children, lang, compact }: ArticleProps) => {
  const {
    showHeader,
    url,
    title,
    description,
    datePublished,
    dateUpdated,
    tags,
    headings,
    showToc,
    html,
  } = page;

  return (
    <article class="prose prose-neutral max-w-none">
      {showHeader && (
        <Header
          url={url}
          title={title}
          description={description}
          datePublished={datePublished}
          dateUpdated={dateUpdated}
          tags={tags}
          lang={lang}
          compact={compact}
        />
      )}

      {!compact && showToc && headings?.some((h) => h.level >= 2) && (
        <Toc headings={headings.filter((h) => h.level <= 2)} />
      )}

      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}

      {children}
    </article>
  );
};

export default Article;
