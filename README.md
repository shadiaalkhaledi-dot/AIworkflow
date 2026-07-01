# Inside My AI Workflow

A small static website explaining what's been built with Claude, Obsidian, and NotebookLM — meant to be shared with a friend, not edited live.

## Files

- `index.html` — home page
- `dashboards.html` — the Apps Script + Sheets dashboards
- `work-tracker-guide.html` — setup guide for the two-file (index.html + data.json) work tracker, end to end: Cowork/Obsidian, GitHub Pages, Quick Capture Apps Script, and the field reference. Replaces the old `work-tracker.html`.
- `second-mind.html` — the Obsidian "Second Mind" system and NotebookLM
- `pipelines.html` — how the pipelines actually work, plus two worked examples
- `skills.html` — downloadable `.skill` files
- `connect.html` — setup guide for connecting a vault to Claude
- `glossary.html` — quick term reference
- `assets/style.css` — shared stylesheet (everything visual lives here)
- `assets/script.js` — shared script (stat counters, reveal animations)
- `assets/skills/` — downloadable `.skill` files, including `work-tracker-pipeline-friend.skill` (updated 2026-07-01 — architecture, schema, generator, and validator for the work tracker system)
- `work-tracker-starter.zip` — the actual starter kit `work-tracker-guide.html` tells the friend to download: `vault-setup/`, `github-pages/`, `apps-script/`, and `skills/` folders (index.html, blank data.json, TASKS.md template, the Quick Capture Apps Script — updated 2026-07-01 with the Subtask capture type and Synced/edit tracking — and `work-tracker-pipeline-friend.skill`, the architecture reference, added 2026-07-01)

No build step, no dependencies — it's plain HTML/CSS. Open `index.html` directly in a browser to preview it.

## Deploying to Netlify (no account needed for the quickest option)

**Note:** this Netlify section is for deploying *this informational site* (the pages listed above). It's unrelated to the work tracker itself — the work tracker's own live site is deployed to GitHub Pages, per `work-tracker-guide.html`'s own instructions, not Netlify (an earlier Netlify-based version of the tracker was tried and abandoned).

**Option A — drag and drop (fastest):**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this entire folder onto the page
3. Netlify gives you a live URL immediately — share that with your friend

**Option B — connected to a Netlify account (lets you update it later):**
1. Create a free account at [netlify.com](https://netlify.com)
2. "Add new site" → "Deploy manually" → drag this folder in
3. Optional: under Site settings → Domain management, pick a friendlier subdomain than the random one Netlify assigns

To update the site later, just re-drag the folder after editing the files — Netlify replaces the old version.

## Editing

Everything is plain HTML — open any `.html` file in a text editor, change the text inside the tags, save. Colors, fonts, and spacing all live in `assets/style.css` if you want to adjust the look without touching every page.
