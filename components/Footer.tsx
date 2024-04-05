/** @jsxImportSource npm:preact */

interface FooterProps {
  author?: { name: string; email: string; url: string };
}

const Footer = ({ author }: FooterProps) => {
  let items = [
    ["about", "https://meta.lonely-desk.top/about"],
    ["contact", "mailto://atiredprole@lonely-desk.top"],
    ["feed", "/feed.xml"],
    ["permacomputing", "https://permacomputing.net"],
    ["smolweb", "https://smolweb.org"],
  ];

  return (
    <footer>
      <hr></hr>
      <ul style="display: flex; align-items: baseline; list-style: none;
      margin: 0px; padding: 0px">
        {items.map(([label, path]) => (
          <li>
            <a href={path}>{label}</a>
          </li>
        ))}
      </ul>
    </footer>
  );
};
export default Footer;
