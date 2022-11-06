import { WalkEntry } from "$std/fs/mod.ts";
import { basename, dirname, extname, join, relative } from "$std/path/mod.ts";
import * as frontmatter from "$std/encoding/front_matter.ts";
import { default as slugify } from "slugify";

import { parseMarkdown } from "./markdown.ts";
import * as attributes from "./attributes.ts";

import type { Heading, Page } from "./types.d.ts";

const decoder = new TextDecoder("utf-8");

export function isDeadLink(allPages: Page[], linkUrl: URL): boolean {
  return allPages.some((page) => page?.url?.pathname === linkUrl.pathname) ===
    false;
}

const getTitleFromHeadings = (headings: Array<Heading>): string | undefined => {
  for (const h of headings) {
    if (h.level === 1) return h.text;
  }
};

const getTitleFromFilename = (filePath: string): string => {
  return basename(filePath).replace(extname(filePath), "");
};

export function getAllTags(pages: Page[]): Array<string> {
  const tagSet: Set<string> = new Set();
  pages.forEach((p) => p.tags && p.tags.forEach((tag) => tagSet.add(tag)));
  return [...tagSet];
}

export function getPagesByTag(allPages: Page[], tag: string): Page[] {
  return allPages.filter((page) => page.tags && page.tags.includes(tag));
}

export function getBacklinkPages(allPages: Page[], current: Page): Page[] {
  const pageSet: Set<Page> = new Set();

  for (const outPage of allPages) {
    if (outPage.links) {
      for (const url of outPage.links) {
        if (
          outPage.url.pathname !== current.url.pathname &&
          url.pathname === current.url.pathname
        ) {
          pageSet.add(outPage);
        }
      }
    }
  }

  return [...pageSet];
}

export function getChildPages(
  allPages: Page[],
  current: Page,
): Page[] {
  return allPages.filter((p) =>
    current.url.pathname !== p.url.pathname &&
    current.url.pathname === dirname(p.url.pathname)
  );
}

export function getChildTags(allPages: Page[], current: Page): Array<string> {
  const tags: Set<string> = new Set();

  allPages.forEach((page) => {
    if (page.url.pathname.startsWith(current.url.pathname)) {
      page.tags?.forEach((tag) => tags.add(tag));
    }
  });

  return [...tags];
}

interface PageData {
  body?: string;
  attrs?: Record<string, unknown>;
  datePublished?: Date;
  dateUpdated?: Date;
  title?: string;
  description?: string;
  tags?: string[];
  pinned?: boolean;
  ignored?: boolean;
  log?: boolean;
  showHeader: boolean;
  showTitle: boolean;
  showDescription: boolean;
  showMeta: boolean;
  showToc: boolean;
}

const extractPageData = (raw: string, ignoreKeys: string[]): PageData => {
  const fm = frontmatter.extract(raw);
  const attrs = fm.attrs as Record<string, unknown>;
  const {
    getTitle,
    getDescription,
    getDate,
    getDateUpdated,
    hasKey,
    getBool,
    getTags,
  } = attributes;

  return {
    attrs: attrs,
    body: fm.body,
    title: getTitle(attrs),
    datePublished: getDate(attrs),
    dateUpdated: getDateUpdated(attrs),
    description: getDescription(attrs),
    tags: getTags(attrs),
    pinned: getBool(attrs, "pinned") ?? false,
    ignored: hasKey(attrs, ignoreKeys),
    log: getBool(attrs, "log") ?? true,
    showHeader: getBool(attrs, "showHeader") ?? true,
    showTitle: getBool(attrs, "showTitle") ?? true,
    showDescription: getBool(attrs, "showDescription") ?? true,
    showMeta: getBool(attrs, "showMeta") ?? true,
    showToc: getBool(attrs, "toc") ?? false,
  };
};

interface GeneratePageOpts {
  entry: WalkEntry;
  inputPath: string;
  siteUrl: URL;
  ignoreKeys: string[];
}

export async function generateContentPage(
  { entry, inputPath, siteUrl, ignoreKeys }: GeneratePageOpts,
): Promise<Page> {
  const relPath = relative(inputPath, entry.path);
  const raw = decoder.decode(await Deno.readFile(entry.path));
  const slug = slugify(entry.name.replace(/\.md$/i, ""), { lower: true });
  const pageUrl = new URL(join(dirname(relPath), slug), siteUrl);

  let page: Page = {
    url: pageUrl,
  };

  if (frontmatter.test(raw)) {
    page = { ...page, ...extractPageData(raw, ignoreKeys) };
  }

  const { html, links, headings } = parseMarkdown({
    text: page.body ?? raw,
    currentPath: relPath,
    baseUrl: new URL(siteUrl),
    isDirIndex: page.index === "dir",
  });

  page = { ...page, html, links, headings };

  page.title ??= getTitleFromHeadings(headings) ||
    getTitleFromFilename(relPath);

  return page;
}

export async function generateIndexPageFromFile(
  { entry, inputPath, siteUrl, ignoreKeys }: GeneratePageOpts,
): Promise<Page> {
  const relPath = relative(inputPath, dirname(entry.path)) || ".";
  const raw = decoder.decode(await Deno.readFile(entry.path));
  const dirName = basename(dirname(entry.path));
  const slug = relPath === "." ? "." : slugify(dirName);
  const pageUrl = new URL(join(dirname(relPath), slug), siteUrl);

  let page: Page = {
    url: pageUrl,
    index: "dir",
  };

  if (frontmatter.test(raw)) {
    page = { ...page, ...extractPageData(raw, ignoreKeys) };
  }

  const { html, links, headings } = parseMarkdown({
    text: page.body ?? raw,
    currentPath: relPath,
    baseUrl: new URL(siteUrl),
  });

  page = { ...page, html, links, headings };

  page.title ??= getTitleFromHeadings(headings) ||
    getTitleFromFilename(dirName);

  return page;
}

export function generateIndexPageFromDir(
  { entry, inputPath, siteUrl }: GeneratePageOpts,
): Page {
  const relPath = relative(inputPath, entry.path) || ".";
  const slug = relPath === "." ? "." : slugify(entry.name);
  const pageUrl = new URL(join(dirname(relPath), slug), siteUrl);

  return {
    title: entry.name,
    url: pageUrl,
    index: "dir",
  };
}
