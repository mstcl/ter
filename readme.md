# Ter

[![deno module](https://shield.deno.dev/x/ter)](https://deno.land/x/ter)

A tiny wiki-style site generator with Zettelkasten flavor.

- Doc-food: <https://ter.kkga.me/>
- Deno deploy version: <https://ter.deno.dev/>

Built with [Deno](https://deno.land/).

## Quick start

1. [Install Deno](https://deno.land/manual/getting_started/installation).
2. Build a site:

```
deno run -A https://deno.land/x/ter/main.ts
```

This command will recursively search for *.md files in the current directory and
output a site into the `_site` directory.

See [usage docs](https://ter.kkga.me/usage) for more details.
