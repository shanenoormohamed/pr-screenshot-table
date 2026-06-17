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
3. **Media** — drop PNG, JPG, GIF, MOV, or MP4 into each cell.
4. **Resize all** — shrink files for PR (800px default, matches `sips -Z 800`). Download individually or as ZIP.
5. **URL prefix** (optional) — paste your `ci-screenshots` base URL, e.g.  
   `https://github.com/org/repo/raw/ci-screenshots/12345`
6. **Copy markdown** — paste into your PR description.

## Example output

```markdown
|  | Before | After |
| --- | --- | --- |
| My Profile | ![1] | ![2] |

[1]: Screenshot 1

[2]: Screenshot 2
```

Images are numbered left-to-right, top-to-bottom. Alt text in each cell becomes the reference label (or `Screenshot N` by default).

Matches the hs-ios PR screenshot table pattern (`## Visual validation`).

All editing happens in the browser — images are not uploaded by this tool.

## Deploy

Pushes to `main` deploy via GitHub Actions. If you rename the repo, update `base` in `vite.config.ts`.
