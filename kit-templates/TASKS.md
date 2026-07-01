# Tasks

_Claude keeps this file current. At the start of each session, Claude reads it alongside your tracker and helps you triage what's changed. This exact format matters — the generator (`parse_tasks.py`) reads it mechanically: `## Program` → `### Package` → status callout → `> - [ ]` item (exactly one space before the dash)._

**Status callouts:** `[!danger]+` Blocking · `[!todo]+` Open · `[!warning]` Unverified · `[!quote]-` Watch · `[!success]-` Completed.

**Site metadata tags** go at the end of each active item line: `[cat:: ...] [disc:: ...] [action:: ...] [court:: ...] [horizon:: ...]` (+ optional `[delegate:: Name]`). Valid values — cat: `decisions|meetings|coordination|documentation|drawings|rfi` · action: `model|review|coordinate|chase|admin` · horizon: `today|sprint|week|watch` · disc: customize the list in `parse_tasks.py` (`DISC_ENUM`) to your own field, then use those values here.

**Under each item** (indented sub-lines): `🔜 **Next:** the single next action` · `- [ ] a sub-step` · `YYYY-MM-DD: a dated update that keeps history without closing the item`. Dates on the item line: 📅 due · ➕ raised.

---

## Program A

### Package 1 — Description

> [!danger]+ Blocking
> - [ ] **Blocking —** Example: waiting on client sign-off before anything can proceed 📅 2026-07-10 [cat:: decisions] [disc:: owner] [action:: chase] [court:: Client Name] [delegate:: Jordan] [horizon:: today]
>     - 🔜 **Next:** chase the client for a decision by end of day
>     - [ ] Send the escalation email
>     - 2026-07-01: sent decision request — no response yet

> [!todo]+ Open
> - [ ] Example: follow up with vendor on the quote ➕ 2026-07-01 [cat:: coordination] [disc:: owner] [action:: chase] [court:: You] [horizon:: week]
>     - 🔜 **Next:** send the follow-up email
>     - [ ] Draft the email
>     - [ ] Send it

> [!quote]- Watch
> - [ ] **Watch —** Example: possible schedule change, nothing to do yet [cat:: documentation] [disc:: owner] [court:: You] [horizon:: watch]
>     - 2026-07-01: heard about it secondhand — watching

> [!success]- Completed
> - [x] Example: a finished item stays here for the record
>     - 2026-06-30: done — brief note on how it was resolved

## Program B

> [!todo]+ Open
> - [ ] A program can also hold items directly, with no packages [cat:: coordination] [disc:: owner] [action:: coordinate] [court:: You] [horizon:: week]
