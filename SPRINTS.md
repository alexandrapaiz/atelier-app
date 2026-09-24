# Atelier — Ship Scrum

*Four one-week sprints from working web app to the App Store. The backlog IS
the App Store column on Side Hustles (dates and dependency chains live there);
this file is the sprint board of record. Companion to
[ARCHITECTURE.md](ARCHITECTURE.md) — this executes its Phase 1.*

**Team:** Alexandra (product owner — decisions, money, device testing) ·
Claude (everything buildable).
**The worthiness gate (added Sep 19):** the $99 Developer Program waits until
Alexandra judges the product worthy of deployment — her call, no date. Nothing
buildable is blocked: simulator development is free, and a free-Apple-ID cable
install puts any build on her real iPhone (7-day installs). Enrollment,
TestFlight proper, the listing, and submission queue behind that call as a
dependency chain on the board, not as dated boxes.

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
| ~~Enroll in Apple Developer Program~~ → moved behind the worthiness gate (Sep 19) | **Alexandra** | when worthy |
| **Wrap Atelier in Capacitor** — Xcode shell, bundled build (no remote loading), native storage adapter replacing localStorage | Claude | Sep 20 |
| Boots + syncs on the iOS simulator, core suite still green | Claude | Sep 20 |

### Sprint 1 plan (set Sep 11)

| Day | The work |
|---|---|
| **Thu 11** | Scaffold: Capacitor project in the repo (`ios/` + config), app bundle assembled from index.html + core/ — Pages deploy untouched |
| **Fri 12** | The real engineering: a storage adapter — native Preferences on iOS, localStorage on web — loaded *before* the app script so boot stays synchronous. This is the sprint's risk item; it goes early |
| **Sun 14** | **Alexandra: Developer Program enrolled** (approval latency starts ticking) |
| **Mon 15** | First Xcode build → simulator boot; viewport, status bar, first safe-area pass |
| **Tue 16** | Supabase auth + sync from inside the shell (capacitor:// origin); the self-update pill stands down in native builds — updates ship through the store |
| **Wed 17** | App icon + splash from the padded icon; `npm test` green; harness untouched |
| **Thu–Fri 18–19** | Buffer for what the simulator surfaces; simulator screen-recording as the demo |
| **Sun 20** | Sprint review inside the weekly compass: demo, retro, Sprint 2 confirmed |

*Definition of done:* the app cold-boots on the iOS simulator from the bundled
build with no network, signs in, syncs when the network returns, and the
24-test suite passes untouched. *Known risks:* the async-storage boot refactor
(scheduled first for exactly that reason); Apple enrollment latency (hers,
urgent, day 3).

## Sprint 2 — *What Apple demands* · Sep 21 → Sun Sep 27

Goal: the account lifecycle is complete and the app is on Alexandra's phone.

| Item | Owner | Due |
|---|---|---|
| ~~Password reset flow ("forgot?" → Supabase reset email → reset page)~~ → shipped Sep 19 in PR #3; blocked on owner adding `reset.html` to Supabase redirect allowlist | Claude | Sep 24 |
| In-app account deletion (guideline 5.1.1(v): auth user + state row + MCP tokens, typed confirmation) | Claude | Sep 25 |
| First-run welcome + starter board (no more blank Studio) | Claude | Sep 27 |
| **On-device test on the real iPhone** — free-Apple-ID cable install: safe areas, keyboard vs drawer, offline boot, cross-device sync (TestFlight proper comes after the worthiness call) | Claude builds · **Alexandra tests** | Sep 27 |

### Sprint 2 status — Thu Sep 24

Shipped this week: the password reset flow (PR #3), with a headless
Chrome verification in `scripts/reset-page-test.mjs` and the new
`reset.html` page. Tests are green; Pages deploys are current.

In flight: account deletion is due tomorrow (Sep 25), first-run welcome
and on-device QA are due Sep 27. The on-device test still needs
Alexandra's iPhone and a cable install.

New owner block: the Supabase Auth redirect allowlist must include
`https://alexandrapaiz.github.io/atelier-app/reset.html` before the
reset flow is end-to-end. Recorded in `docs/agents/pending.md`.

## Sprint 3 — *Review-proof* · Sep 28 → Sun Oct 4

Goal: everything a reviewer touches is ready before submission.

| Item | Owner | Due |
|---|---|---|
| Fix whatever the phone QA surfaced | Claude | Sep 30 |
| **Google Calendar decision** — Google verification vs "beta" label for v1 | **Alexandra** decides · Claude executes | Sep 30 |
| Privacy policy page + App Privacy answers (email + user content, no tracking) | Claude drafts · Alexandra approves | Oct 2 |
| App Review demo account with lived-in sample data (the demo generator exists) | Claude | Oct 2 |
| Listing: name availability ("Atelier" likely contested — backup ready), subtitle, keywords, description, 6.7" screenshots | Claude drafts · Alexandra approves | Oct 4 |

## Sprint 4 — *Submit & ride the review* · after the worthiness call

Goal: enrollment → TestFlight → listing → submission, as one unbroken run
once Alexandra declares the product worthy. Sprints 1–3 exist to make that
declaration easy.

| Item | Owner | Due |
|---|---|---|
| **Submit from App Store Connect** (demo credentials in review notes) | Alexandra presses · Claude preps | gate + ~5 days |
| Respond to review feedback — rejections come with reasons and are usually one fix away | Claude | as it comes |
| (Enrollment approval and a TestFlight pass precede submission — about a week from the worthiness call to the button) | both | — |
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
