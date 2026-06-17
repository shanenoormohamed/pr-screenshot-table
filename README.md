# PR Screenshot Table

Build markdown tables of screenshots for GitHub PRs — like a **Visual validation** light/dark grid.

**Live app:** https://shanenoormohamed.github.io/pr-screenshot-table/

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173/

## How to use

1. **Table size** — click and drag on the box grid (like inserting a table in Google Docs).
2. **Titles** — edit column headers and row labels in the table.
3. **Screenshots** — drop an image into each cell; set alt text if needed.
4. **URL prefix** (optional) — paste your `ci-screenshots` base URL, e.g.  
   `https://github.com/org/repo/raw/ci-screenshots/12345`
5. **Copy markdown** — paste into your PR description.

## Example output

```markdown
| | Light | Dark |
| --- | --- | --- |
| Home | ![home-light](https://github.com/.../home-light.png) | ![home-dark](...) |
| Profile | ![profile-light](...) | ![profile-dark](...) |
```

Matches the hs-ios PR screenshot table pattern (`## Visual validation`).

All editing happens in the browser — images are not uploaded by this tool.

## Deploy

Pushes to `main` deploy via GitHub Actions. If you rename the repo, update `base` in `vite.config.ts`.
