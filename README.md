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
- `assets/skills/` — downloadable `.skill` files, including `work-tracker-pipeline-friend.skill` (KIT_VERSION 2026-07-01.2 — architecture, schema, generator with regression guard, encryptor, and a mandatory version check)
- `work-tracker-starter.zip` — **KIT_VERSION 2026-07-01.2 (password-gate edition).** What `work-tracker-guide.html` tells the friend to download: `vault-setup/`, `github-pages/`, `apps-script/`, `skills/`, `tools/` (parse_tasks.py generator + encrypt_data.py password-gate encryptor), and a `VERSION` file. The shell now includes the encrypted-data password gate, Subtask capture, mobile layout, filter persistence, and a "Data generated" freshness stamp. The TASKS.md template is in the generator-parseable callout format.
- `kit-templates/` — working source for the TASKS.md and data.json templates inside the zip (edit here, re-zip)

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
