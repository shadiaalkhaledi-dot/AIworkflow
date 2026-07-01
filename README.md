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

## Deploying (GitHub Pages — what's actually live)

This site is live at `https://shadiaalkhaledi-dot.github.io/AIworkflow/`, hosted the same way as the work tracker itself — a GitHub repo with Pages enabled, no separate hosting account or Netlify involved.

**To update it after editing a file:**
1. Go to the `AIworkflow` repo on github.com
2. Click the file you changed (or navigate into a subfolder like `assets/skills/` first if you're adding a new file there)
3. Click the pencil icon to edit in place, or **Add file → Upload files** to drag one in
4. Commit changes — GitHub Pages rebuilds automatically on every push to `main`, no manual redeploy step

Same filename = it just replaces the old version. Give it a few minutes after a push for GitHub's CDN to catch up before checking the live site.

## Editing

Everything is plain HTML — open any `.html` file in a text editor, change the text inside the tags, save. Colors, fonts, and spacing all live in `assets/style.css` if you want to adjust the look without touching every page.
