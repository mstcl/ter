/** @jsxImportSource npm:preact */

import { Page } from "../types.d.ts";

interface IndexGridProps {
  items: Page[];
  lang: Intl.LocalesArgument;
}

const IndexGrid = ({ items }: IndexGridProps) => {
  return (
    <section>
      <h6 class="section-heading">Pages</h6>
      {Array.isArray(items) ? (
        <ul class="index-grid">
          {items.map((item) => (
            <a href={item.url.pathname} style="
              gap: 0.25rem;
              padding: 0.5rem;
              display: flex;
              flex-direction: column;
            "
            class="box">
              {item.thumbnailUrl && (
                <img
                  class="mb-2 w-full object-cover aspect-[4/3]"
                  src={item.thumbnailUrl.toString()}
                />
              )}
              <span style="font-weight:500; display: block">{item.title}</span>

              {item.description && (
                <span style="font-size: 0.875rem; color: var(--sub)">
                  {item.description}
                </span>
              )}
            </a>
          ))}
        </ul>
      ) : null}
    </section>
  );
};

export default IndexGrid;
