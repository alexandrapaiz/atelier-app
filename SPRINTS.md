# Atelier — Ship Scrum

*Four one-week sprints from working web app to the App Store. The backlog IS
the App Store column on Side Hustles (dates and dependency chains live there);
this file is the sprint board of record. Companion to
[ARCHITECTURE.md](ARCHITECTURE.md) — this executes its Phase 1.*

**Team:** Alexandra (product owner — decisions, money, device testing) ·
Claude (everything buildable).
**Cadence:** sprints end Sundays, closed by the **Weekly compass** ritual
(review + retro + next sprint's plan in one conversation). The **Morning
brief** is the daily standup — Claude reads the board's dates and says what
today owes the sprint.
**Definition of done:** deployed or installed, verified on a real surface
(preview, simulator, or phone), tests green, board card checked.

---

## Sprint 1 — *Hold it in your hand* · Sep 11 → Sun Sep 20

Goal: Atelier boots as a native iOS app on the simulator.

| Item | Owner | Due |
|---|---|---|
| **Enroll in Apple Developer Program** ($99, apple.com — the only step Claude can't do; approval takes days, so it leads) | **Alexandra** | Sep 14 ⚡ |
| **Wrap Atelier in Capacitor** — Xcode shell, bundled build (no remote loading), native storage adapter replacing localStorage | Claude | Sep 20 |
| Boots + syncs on the iOS simulator, core suite still green | Claude | Sep 20 |

## Sprint 2 — *What Apple demands* · Sep 21 → Sun Sep 27

Goal: the account lifecycle is complete and the app is on Alexandra's phone.

| Item | Owner | Due |
|---|---|---|
| Password reset flow ("forgot?" → Supabase reset email → reset page) | Claude | Sep 24 |
| In-app account deletion (guideline 5.1.1(v): auth user + state row + MCP tokens, typed confirmation) | Claude | Sep 25 |
| First-run welcome + starter board (no more blank Studio) | Claude | Sep 27 |
| **TestFlight build on the real iPhone** — safe areas, keyboard vs drawer, offline boot, cross-device sync | Claude builds · **Alexandra tests** | Sep 27 |

## Sprint 3 — *Review-proof* · Sep 28 → Sun Oct 4

Goal: everything a reviewer touches is ready before submission.

| Item | Owner | Due |
|---|---|---|
| Fix whatever the phone QA surfaced | Claude | Sep 30 |
| **Google Calendar decision** — Google verification vs "beta" label for v1 | **Alexandra** decides · Claude executes | Sep 30 |
| Privacy policy page + App Privacy answers (email + user content, no tracking) | Claude drafts · Alexandra approves | Oct 2 |
| App Review demo account with lived-in sample data (the demo generator exists) | Claude | Oct 2 |
| Listing: name availability ("Atelier" likely contested — backup ready), subtitle, keywords, description, 6.7" screenshots | Claude drafts · Alexandra approves | Oct 4 |

## Sprint 4 — *Submit & ride the review* · Oct 5 → Sun Oct 11

Goal: submitted by Tuesday; the rest of the week absorbs Apple's feedback.

| Item | Owner | Due |
|---|---|---|
| **Submit from App Store Connect** (demo credentials in review notes) | Alexandra presses · Claude preps | Oct 6 |
| Respond to review feedback — rejections come with reasons and are usually one fix away | Claude | as it comes |
| 🍾 **Atelier is on the App Store** | both | — |

**After the finish line** (deliberately last, chained behind Publish on the
board): the app walkthrough flow — so the tour shows the app as it actually
shipped.

---

*Risks watched:* Apple enrollment latency (mitigated: it's first, urgent);
"Atelier" name collision (backup name decided at listing time, not submission
time); review rejection (a buffer week exists for exactly this).
*Not in scope:* Android, sharing/collaboration (ARCHITECTURE.md stages 2–3),
the WhatsApp digest (parked, per standing decision).
