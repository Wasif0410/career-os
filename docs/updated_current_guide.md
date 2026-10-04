# Career OS: Current Guide

> **Last updated:** 2026-10-02
> **Read this first** when you pick the project back up, whether you're a person or an agent. It covers what's done, what's in progress, how the branches fit together, and what comes next. The full phase plan is in [`frontend/PHASES.md`](frontend/PHASES.md). This file tracks where we actually are against it, including where we changed the order. The [checkpoint log](#checkpoint-log) at the bottom records what happened and when.
>
> **Keep it current:** update this file in the same PR as any change that moves a phase forward, changes the branch model, or settles an open question.

---

## Where we are in one paragraph

The marketing site (Phase 1) is live on Vercel from `main`. The engineering basics are on `main` too: formatting, unit and browser tests, CI on every PR, and branch protection. The **student app** (the dashboard and every logged-in page) lives on its own branch, `dashboard`, and **is now on `main` after PR #28**. It's being built **before** auth, running as a demo student, one PR per page. Marketing work continues on `marketing-site`. Supabase in the app, separate dev and prod environments, and error tracking are deliberately left for later.

---

## Branches

```
main  ← production (Vercel). Protected: PR only, CI must pass
 ├─ marketing-site    marketing site work → PR into main
 └─ dashboard   the student app, kept off main until it's ready
     └─ page/<name>   one branch + one PR per app page → PR into dashboard
```

| Branch | What it's for | Merges into |
|---|---|---|
| `main` | Production. Vercel deploys it | — |
| `marketing-site` | Marketing site changes | `main` |
| `dashboard` | The student app as a whole | `main`, in one PR, when we decide it's ready |
| `page/<name>` | Building one app page (`page/resume`, `page/jobs`, …) | `dashboard` |
| `setup/<name>`, `docs/<name>` | Tooling or docs changes on their own | `main` |

Every branch gets its own Vercel preview URL.

**`main` protection:** changes go in only through a PR. Both CI checks ("Lint, types, format and unit tests" and "Build and browser tests") must pass, the branch must be up to date with `main`, and nobody can force-push or delete it. This applies to admins too.

---

## Phase history

### Phase 0: Foundations. Mostly done

| Item | Status |
|---|---|
| Next.js 16 + TypeScript (strict) + Tailwind 4 | ✅ |
| ESLint + Prettier | ✅ Prettier added 2026-09-30 (#8) |
| Unit tests (Vitest) + browser tests (Playwright) + CI | ✅ 2026-09-30 (#8) |
| Vercel connected, every branch gets a preview URL | ✅ |
| Design system: colors, fonts, spacing, logo | ✅ serif + Inter, deep blue tokens (#6) |
| Core components | 🟡 Button, Section, FAQ, PageHeader on `main`; `Card`, `Locked`, `TierBadge` on `dashboard`. No Input, Dialog or Toast yet. We'll add them when a screen needs them |
| Folder structure `(marketing)`, `(app)` | ✅ `(app)` is on `dashboard`. `(auth)` and `(coach)` come with their phases |
| Supabase dev + prod projects | ⏸ Not yet, on purpose |
| Domain | ⏸ Not bought yet |

### Phase 1: Marketing site. Live, a few items left

Shipped through PRs #1 to #6 (production deploy green on 2026-09-28).

| Item | Status |
|---|---|
| Landing page: hero, guided journey, coaching graph, auto-apply demo, coaches, close | ✅ |
| `/pricing`, `/coaches`, `/guides`, `/privacy` | ✅ |
| Guides | 🟡 3 written (target 3-5) |
| Waitlist form → Supabase `waitlist` table + Resend confirmation email | ✅ code done; needs env vars in Vercel to go live |
| SEO: titles, descriptions, OG image, sitemap, robots | ✅ |
| Security headers, Speed Insights, Node 24 pinned | ✅ |
| Mobile polish | ✅ (#6) |
| Browser tests for every marketing page | ✅ (#8) |
| PostHog analytics | ❌ not started |
| Lighthouse 90+ check | ❌ not run yet |
| Domain live | ❌ |
| Placeholders to confirm in `lib/site.ts` | Pro $19 / Elite $59 prices, Cal.com links, coach photos |

### Phase 2: Auth and onboarding. **Moved after the dashboard**

We changed the order. The original plan was auth (Phase 2), then the dashboard (Phase 3). We're building the dashboard first with a demo user, because the dashboard is what students pay for and it's easier to design without logging in every time. Auth plugs in afterwards without changing the dashboard pages (see [How the auth bypass works](#how-the-auth-bypass-works)).

### Phase 3: Student app. **In progress on `dashboard`**

The structure is merged into `dashboard` (#9):

- **Tier rules in one place:** `lib/access.ts` has `canAccess(user, feature)`, `requiredTier(feature)` and `limitFor(user, limit)`. No component checks a tier itself.
- **Demo user:** `lib/auth/current-user.ts` → `getCurrentUser()` returns a demo student ("Maya Chen", Free tier) from `lib/mock/student.ts`.
- **App shell** in `app/(app)/`: its own sidebar and header, a tier badge, an Upgrade button on Free, and loading and error screens.
- **Shared app pieces** in `components/app/`: `Card`, `PageTitle`, `TierBadge`, `ComingSoon`, and `Locked` (blurs paid content behind "Unlock with Pro" → `/pricing`).
- **Demo tier switcher** in the header (local and preview only), to see the app as Free, Pro or Elite.

Pages, each merged into `dashboard` through its own PR:

| Page | Route | PR | Status |
|---|---|---|---|
| Home | `/dashboard` | #10, redesign on `page/home` | ✅ First version in #10. v2 on `page/home`: bento layout with applications, resume, readiness and courses tiles, this week, top matches with details, and a calendar panel. **PR into `dashboard`** |
| Resume | `/resume` | #11 | Placeholder. Next: upload + score report |
| Coaching | `/coaching` | #12, booking in #34 | Booking page: calls left this month, booked calls with reschedule and cancel, and one card that books a call in three steps (call and coach, day, time) with a confirm step. Free can browse openings. Demo data; Cal.com later. **PR into `dashboard`** |
| Plan | `/plan` | #13 | Placeholder (Pro+) |
| Courses | `/courses` | #14 (original placeholder) | 3D course library (six courses as books), overviews and 24 MDX lessons implemented locally on `page/courses`; awaiting Wasif's local review. Not committed or integrated. |
| Jobs | `/jobs` | #15 | Placeholder. Next: teaser on Free, full list on Pro |
| Applications | `/applications` | #16 | Placeholder (Pro+) |
| Profile | `/profile` | #17 | Placeholder |
| Billing | `/billing` | #18 | Placeholder (Phase 4) |

Building a page for real means a new `page/<name>` branch off `dashboard` and a new PR back into it.

---

## How the student app works

### Kept separate from the marketing site

- It lives in its own route group, `app/(app)/`, with its own layout. No marketing header, footer, starfield or scroll effects. Exception (Wasif, 2026-10-02): the sidebar uses the deep-blue surface. No starfield or scroll effects on app pages.
- **Nothing on the marketing site links to it.** A browser test checks this.
- It's `noindex`, and `robots.txt` blocks crawlers from it.
- Its components live in `components/app/`. It reuses only the basics (`Button`, glyphs, logo, color tokens).
- Later, a "Log in" link on the marketing site is the only thing that connects the two.

### How the auth bypass works

- Every page gets the user from `getCurrentUser()`. Today that returns the demo student. When we build auth, we change **only that function** to read the Supabase session, and add `redirect("/login")` in `app/(app)/layout.tsx`.
- **Production is password-protected:** `proxy.ts` asks for a shared password (HTTP Basic auth; any username) on every app page whenever `APP_PASSWORD` is set. The password lives only in Vercel's environment variables, never in the repo, because the repo is public.
- **Safe default:** in production without `APP_PASSWORD`, `getCurrentUser()` returns nobody, so the whole app returns 404. Tests cover both cases and check that every app route is behind the password.
- **To change or remove the password:** edit or delete `APP_PASSWORD` in Vercel (Settings → Environment Variables), then redeploy.
- Preview URLs are public, so anyone with the link can see the demo unless `APP_PASSWORD` is also set for Preview. That's fine because it's fake data. **Never put real student data in until auth is built.** The shared password is a stopgap, not real accounts.

### Try it locally

```bash
git checkout dashboard
npm install
npm run dev
```

Open http://localhost:3000/dashboard and use the Free / Pro / Elite switch in the header.

---

## Next up (in order)

1. **Review the Home page** (`/dashboard`) and list the changes to make.
2. **Build the real screens** behind the placeholders, one `page/*` PR each, starting with `/resume` (upload + score report) and `/jobs` (teaser on Free).
3. **Profile + onboarding wizard** (`/onboarding`), still using the demo user.
4. **Auth** (the old Phase 2): Supabase Auth, `/login`, `/signup`, and swapping `getCurrentUser()` for the real session. This is also when we set up Supabase dev and prod, env var validation and Sentry.
5. **Payments** (Phase 4, Stripe), then **paid features** (Phase 5).

In parallel on `marketing-site`: marketing changes, plus the Phase 1 leftovers (PostHog, one or two more guides, a Lighthouse pass, buying the domain).

---

## Deliberately not done yet

| Thing | Why not yet | When |
|---|---|---|
| Supabase in the app (auth, profiles, storage) | We're designing with mock data first | With auth |
| Separate dev and prod Supabase projects | Nothing in the app uses Supabase yet | With auth |
| Env var validation | Few env vars so far, all optional in dev | With auth |
| Real accounts (replacing the shared password) | Needs Supabase Auth | Phase 2 |
| Sentry error tracking | No real users in the app yet | Before real users log in |
| Coach app `(coach)` | Comes after the student app | Phase 6 |

---

## How we work

- **One PR per concern.** Tooling, docs, app structure and each page never share a PR.
- **Commits:** small and logical, one feature or section each, and each one builds on its own.
- **Merging:** CI must be green. Wasif reviews on the preview URL, then merges with a **merge commit** (not squash) so every commit stays in history.
- **Stacked PRs:** if PR B is based on PR A's branch, point B at A's target *before* deleting A's branch. Otherwise GitHub closes B. (This happened to #9 once; it was reopened and nothing was lost.)
- **Before pushing:** run `npm run check`. For UI changes, also run `npm run test:e2e` and look at the page at phone width.
- **Tests:** unit tests sit next to the code (`lib/access.test.ts`). Browser tests are in `e2e/` (`e2e/app/<page>.spec.ts` for app pages). New tier rules or money logic always get a test.

---

## Open questions

- Final prices: Pro $19-29, Elite $59-99 (from `STRATEGY.md`)
- Coach photos and Cal.com links
- The resume score rubric (needed for real scoring)
- **Dependabot PRs #19–#25** opened on 2026-09-30. Hold the major jumps: TypeScript 5 → 7 (#25), ESLint 9 → 10 (#24), and `@types/node` 24 → 26 (#23), which doesn't match the Node 24 runtime. The GitHub Actions bumps (#19–#21) and the minor/patch group (#22) still need a proper look before merging.
- The agent coordination files (`AGENTS.md`, `CLAUDE.md`, `docs/agents/`, `.gitattributes`) are committed on `agent-config`; Wasif authorized integration into `main` and synchronization of `dashboard` and the nine page branches

---

## Checkpoint log

Newest first. One entry per working session: what changed, and any decisions made.

### 2026-10-04

- **Coaching (`page/coaching` → `dashboard`):** `/coaching` is a booking page. Wasif reviewed several HTML mockups and picked a single booking card: choose the call (check-in, mock interview, resume review or strategy) and the coach or either, pick a day, pick a time, confirm with an optional note. Booked calls sit above the card with Add to calendar, Reschedule and Cancel. Calls per month come from `coachingSessionsPerMonth` (Pro 1, Elite 4); a used-up month opens the next one. Free can browse openings and is sent to Pro. Design in `docs/coaching/DESIGN.md`.
- **Decided:** Coaching is booking only. Session notes and goals belong on Plan. Call types and lengths are placeholders until the coaches confirm them.

### 2026-10-02

- **Courses, 3D library (local review):** the course catalog is now a stack of six hardcover "books" on the cosmic background, built in CSS 3D (no WebGL, no new dependencies). Each course has its own cloth colour and cover drawing; scrolling moves the camera along the stack and choosing a book swings it upright beside the course details (`/courses?course=<slug>`, so Back closes it). Reduced motion gets a still stack. Course overviews and lessons are unchanged. Still local and uncommitted on `page/courses` pending Wasif's review.
- **Courses, local review:** `page/courses` in `C:/Users/wa/Documents/career-os-courses` now has six practical courses (direction, resume, LinkedIn, GitHub, projects and domain knowledge), each with four lessons and exercises. Added course overviews, source references, server-side Free/Pro lesson gating and reversible browser-local progress. Progress is visible per course and across the library, with completed syllabus indicators, continue-to-next-unfinished navigation, course completion and review states. Wasif requested the homepage's Newsreader/Inter typography and cosmic deep-blue treatment on this page, with restrained motion; the existing shell and shared tokens are reused. Research/design notes are in `docs/courses/`. Local preview: `http://localhost:3002/courses`. Wasif explicitly requested no commit, push, PR or merge before local review.
- **Current main:** PR #28 merged the student app into main; the existing password and demo protections remain in place.
- **Branches:** frontend was renamed marketing-site. Nine page branches were created from dashboard with identical starting content.
- **Authorized in chat:** merge agent-config into main after required CI, then bring dashboard and all nine page branches up to date with main. Agents still receive page assignments in chat.
- **Home redesign (`page/home` → `dashboard`):** deep-blue hero with the greeting and next step, then one grid of resume, jobs, coaching, plan and applications cards with fewer words. The target pill was removed from the app header at Wasif's request. Design in `docs/superpowers/specs/2026-10-02-home-page-design.md`.
- **Home v2 (`page/home` → `dashboard`):** final layout is a bento board modelled on a reference dashboard Wasif picked: solid-colour tiles (applications pipeline, resume trend, dark readiness, cobalt courses), this week, top matches with a details panel, and a calendar panel fixed to the right edge. Before that: Wasif approved a new concept and asked for it locally. Dark sidebar, readiness levels (Starter → Builder → Contender → Interview-ready → Offer-ready), calendar and coming-up rail, applications by stage, Courses instead of the radar chart, no blurred locks on Home. Readiness weighting and the resume rubric are still open, so both use demo numbers.
- **Decided (earlier the same day, superseded by v2):** keep the original Home card format; use the deep-blue hero rather than a dark app or a midnight shell. Still stars in the Home hero are the one exception to "no starfield in the app"; there are still no scroll effects.

### 2026-09-30

- **Decided:** build the student app before auth, on its own `dashboard` branch, running as a demo user. Keep it completely separate from the marketing site (not linked, noindex).
- **Decided:** one PR per concern: tooling on its own, app structure on its own, and one PR per page.
- **Merged into `main`:** #8 Tooling, tests and CI (Prettier, Vitest, Playwright, CI, Dependabot, PR template). Branch protection turned on for `main`.
- **Merged into `dashboard`:** #9 app structure, #10 Home, #11–#18 placeholder pages. The earlier combined PR #7 was closed in favor of this split.
- **Housekeeping:** deleted the merged `landing-journey-and-coaches` branch. Brought `frontend` up to date with `main`.
- **Deferred on purpose:** Supabase in the app, the dev/prod split, env validation, Sentry.

### 2026-09-28

- **Merged into `main`:** #6 premium redesign (serif + Inter type, deep blue, scroll effects, mobile polish). Production deploy green.

### 2026-09-27

- **Merged into `main`:** #1–#5: Next.js foundation, marketing site, Vercel readiness (site URL, preview robots, security headers, Node 24, Speed Insights), guided journey, coach profiles, resume tailoring demo, application tracker.

### 2026-09-23

- Repo set up with `README.md`, `docs/PROJECT_CONTEXT.md`, `docs/STRATEGY.md` and `docs/frontend/PHASES.md`. Decided that coaching is delivered by Wasif and Abishek (human-led), not AI.
