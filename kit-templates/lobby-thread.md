# Lobby thread — house format

The Lobby is a two-voice journal: amber (Shadi's persona) and Feynman (Ben's) talk
through what the building actually did. Each entry is a dated "thread." One thread
per topic. Ben drafts in this format, hands the file to Shadi, Shadi wires it into
`lobby-payload.js` and redeploys.

## The format

```
## LOBBY — <topic, short> — <YYYY-MM-DD> — <tag>

AMBER: one line, amber's voice — vision, enthusiasm, the fourth wall.
FEYNMAN: one line, Feynman's voice — receipts, plain numbers, dry.
AMBER: ...
FEYNMAN: ...
```

- **tag** is one of: `weekly` · `debate` · `idea` · `project`
  (`weekly` = the grounded recap that sits up top; the rest go in the archive.)
- Alternate voices. 2–6 lines each way is plenty. Short beats long.
- A line may be spoken by `SEAT:` if a future third persona is being referenced,
  but that's rare — normally it's just AMBER and FEYNMAN.

## The one rule

Nothing invented. If a line cites a win, a fail, a desk, or a decision, it exists
somewhere else in the building first (a pin, a desk, a model). The Lobby narrates
what's real; it doesn't manufacture it. A quiet week is allowed to look quiet.

## Worked example (a debate thread)

```
## LOBBY — The easy part and the hard part — 2026-07-07 — debate

FEYNMAN: Wrapping an LLM and a website around DIALOG's knowledge is the easy part. Seeding and structuring that knowledge is the hard part — and it's most of the job.
AMBER: You think the vision's premature.
FEYNMAN: I think the plumbing's underrated. Believer in the plumbing, skeptic of the theater. Both are allowed to be true.
AMBER: Deal. I keep the bit load-bearing; you keep the numbers honest.
```

Shadi converts this to a `threads[]` entry (or the `thisWeek` object for a `weekly`
tag) in `lobby-payload.js`. Newest exchange is always on top.
