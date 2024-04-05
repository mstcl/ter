/** @jsxImportSource npm:preact */

import { Crumb } from "../types.d.ts";

interface PageHeaderProps {
  crumbs: Crumb[];
}

const PageHeader = ({ crumbs }: PageHeaderProps) => {
  return (
    <header style="font-family: monospace; font-size: 0.75rem; flex-direction: column; gap: 0.5rem; display: flex">
      {crumbs && crumbs.length >= 1 && (
        <nav>
          {crumbs.map((crumb) => (
            <>
              {crumb.current ? (
                <span style="color: var(--sub)"> {crumb.slug} </span>
              ) : (
                <a href={crumb.url}> {crumb.slug} </a>
              )}
            </>
          ))}
        </nav>
      )}
    </header>
  );
};

export default PageHeader;
