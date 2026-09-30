# Career OS: Current Guide

> **Last updated:** 2026-09-30
> **Read this first** if you're picking the project back up. It says what's done, what's in progress right now, and what comes next. The full phase plan is in [`frontend/PHASES.md`](frontend/PHASES.md). This file tracks where we actually are against it, including where we changed the order.

---

## Where we are in one paragraph

The marketing site (Phase 1) is live on Vercel from `main`. We're now building the **student dashboard** on its own branch, `dashboard`, **before** auth. The dashboard runs as a demo student so we can design it without logging in. We also set up the engineering basics a production team would have: formatting, tests, CI on every PR and branch protection on `main`. Supabase, separate dev and prod environments, and error tracking are deliberately left for later.

---

## Phase history

### Phase 0: Foundations. Mostly done

| Item | Status |
|---|---|
| Next.js 16 + TypeScript (strict) + Tailwind 4 | ✅ |
| ESLint | ✅ |
| Prettier | ✅ added 2026-09-30 |
| Vercel connected, every branch gets a preview URL | ✅ |
| Design system: colors, fonts, spacing, logo | ✅ serif + Inter, deep blue tokens (PR #6) |
| Core components | 🟡 Button, Section, FAQ, PageHeader, and `Locked` (new). No Input, Dialog or Toast yet; we'll add them when a screen needs them |
| Folder structure `(marketing)`, `(app)` | ✅ `(app)` added 2026-09-30. `(auth)` and `(coach)` come with their phases |
| Supabase dev + prod projects | ⏸ Not yet, on purpose |
| Domain | ⏸ Not bought yet |

### Phase 1: Marketing site. Live, a few items left

Shipped through PRs #1 to #6 (all merged into `main`, production deploy green on 2026-09-28).

| Item | Status |
|---|---|
| Landing page: hero, guided journey, coaching graph, auto-apply demo, coaches, close | ✅ |
| `/pricing`, `/coaches`, `/guides`, `/privacy` | ✅ |
| Guides | 🟡 3 written (target 3-5) |
| Waitlist form → Supabase `waitlist` table + Resend confirmation email | ✅ code done; needs env vars set in Vercel to go live |
| SEO: titles, descriptions, OG image, sitemap, robots | ✅ |
| Security headers, Speed Insights, Node 24 pinned | ✅ |
| Mobile polish | ✅ (PR #6) |
| PostHog analytics | ❌ not started |
| Lighthouse 90+ check | ❌ not run yet |
| Domain live | ❌ |
| Placeholders to confirm in `lib/site.ts` | Pro $19 / Elite $59 prices, Cal.com links, coach photos |

### Phase 2: Auth and onboarding. **Moved after the dashboard**

We changed the order. The original plan was auth (Phase 2), then the dashboard (Phase 3). We're building the dashboard first with a demo user, because the dashboard is what students pay for and it's easier to design without logging in every time. Auth plugs in afterwards without changing the dashboard (see "How the auth bypass works" below).

---

## What we're doing right now

**Branch:** `dashboard`, created from `main` on 2026-09-30.
**Goal:** the logged-in student experience, built as its own part of the app.

### Done on `dashboard` so far

1. **Tooling:** Prettier (with Tailwind class sorting), Vitest for unit and component tests, Playwright for browser tests, and `npm run check` as the one command to run before pushing.
2. **Formatted the codebase** once with Prettier, in its own commit so it's easy to skip when reading history.
3. **Tier rules in one place:** `lib/access.ts` has `canAccess(user, feature)`, `requiredTier(feature)` and `limitFor(user, limit)`. No component checks a tier itself.
4. **Demo user:** `lib/auth/current-user.ts` → `getCurrentUser()` returns a demo student ("Maya Chen", Free tier). Example resume score and next step live in `lib/mock/student.ts`.
5. **The app shell** in `app/(app)/`: its own sidebar and header, a tier badge, and an Upgrade button on Free. It shares only fonts and colors with the marketing site.
6. **Dashboard** at `/dashboard`: resume score ring, the top fix, next step, job matches, and coaching, plan and tracker cards. On Free, paid content is blurred behind **Unlock with Pro**, which links to `/pricing`.
7. **Demo tier switcher** in the header (local and preview only), to see the app as Free, Pro or Elite.
8. **Placeholder pages** for every section on the route map: resume, coaching, plan, courses, jobs, applications, profile and billing. Also loading and error screens.
9. **Tests:** 15 unit and component tests, plus 18 browser tests run at desktop and phone sizes (36 runs).
10. **CI** (GitHub Actions) on every PR: lint → typecheck → format check → unit tests → production build → browser tests.
11. **Branch protection on `main`:** changes only go in through a PR, and both CI jobs must pass.
12. **Dependabot** (weekly grouped dependency updates) and a PR template.

### How the dashboard is kept separate from the marketing site

- It lives in its own route group, `app/(app)/`, with its own layout. No marketing header, footer, starfield or scroll effects.
- **Nothing on the marketing site links to it.** A browser test checks this.
- It's `noindex`, and `robots.txt` blocks crawlers from it.
- Its components live in `components/app/`. It reuses only the basics (`Button`, glyphs, logo, color tokens).
- Later, a "Log in" link on the marketing site is the only thing that connects the two.

### How the auth bypass works

- Every page gets the user from `getCurrentUser()`. Today it returns the demo student. When we build auth, we change **only that function** to read the Supabase session, and add `redirect("/login")` in `app/(app)/layout.tsx`.
- **Production safety:** in production (`VERCEL_ENV=production`) `getCurrentUser()` returns nobody, so the whole app returns 404. Even if `dashboard` is merged into `main` before auth exists, the fake dashboard can't show up on the live site.
- Preview URLs are public, so anyone with the link can see the demo. That's fine because it's fake data. **Never put real student data in until auth is built.**

---

## Next up (in order)

1. **Review the dashboard** on the `dashboard` preview URL and decide what to change.
2. **Build the real screens** behind the placeholders, starting with `/resume` (upload + score report) and `/jobs` (teaser on Free).
3. **Profile + onboarding wizard** (`/onboarding`), still using the demo user.
4. **Auth** (the old Phase 2): Supabase Auth, `/login`, `/signup`, and swapping `getCurrentUser()` for the real session. This is when we set up Supabase dev and prod, env var validation, and Sentry.
5. **Payments** (Phase 4, Stripe), then **paid features** (Phase 5).

Phase 1 leftovers to fit in when there's time: PostHog, one or two more guides, a Lighthouse pass, buying the domain.

---

## Deliberately not done yet

| Thing | Why not yet | When |
|---|---|---|
| Supabase in the app (auth, profiles, storage) | We're designing with mock data first | With auth |
| Separate dev and prod Supabase projects | Nothing uses Supabase in the app yet | With auth |
| Env var validation | Few env vars so far, all optional in dev | With auth |
| Sentry error tracking | No real users in the app yet | Before real users log in |
| Coach app `(coach)` | Comes after the student app | Phase 6 |

---

## How we work

- **Branches:** `main` is production (Vercel deploys it). `frontend` is for marketing site work. `dashboard` is for the student app. Every branch gets a preview URL.
- **Commits:** small and logical, one feature or section each, and each one builds on its own.
- **Merging:** open a PR into `main`. CI must be green. Wasif reviews on the preview URL, then merges with a **merge commit** (not squash) so every commit stays in history.
- **Before pushing:** run `npm run check`. For UI changes, also run `npm run test:e2e` and look at the page at phone width.
- **Tests:** unit tests sit next to the code (`lib/access.test.ts`). Browser tests are in `e2e/`. New tier rules or money logic always get a test.

---

## Open questions

- Final prices: Pro $19-29, Elite $59-99 (from `STRATEGY.md`)
- Coach photos and Cal.com links
- The resume score rubric (needed for real scoring)
- The agent coordination files (`AGENTS.md`, `docs/agents/`) are still uncommitted on `frontend`, waiting for Wasif's review
