# Home Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/dashboard` as a calm, readable page: a deep-blue starfield hero, then the original cards with more space and fewer words.

**Architecture:** The page stays a server component. Home-only pieces live next to the route in `app/(app)/dashboard/_components/`. Paid-card demo data goes in a new `lib/mock/home.ts`. Every lock still goes through `Locked` and `lib/access.ts`. No shared component, layout or token changes.

**Tech Stack:** Next.js 16 (App Router, server components), Tailwind 4 tokens from `app/globals.css`, Playwright for browser tests.

**Spec:** [`docs/superpowers/specs/2026-10-02-home-page-design.md`](../specs/2026-10-02-home-page-design.md)

## Global Constraints

- Keep the original content and card format; use fewer words (one short line per card at most).
- Tier checks only through `canAccess` / `limitFor` / `requiredTier` / `Locked`. No tier comparisons in components.
- Do not edit `components/app/*`, `components/ui/*`, `app/(app)/layout.tsx`, `app/globals.css`, `lib/access.ts` or `lib/mock/student.ts`.
- The app reuses only basics from the marketing side (`Button`, glyphs, logo, tokens and the `deep-blue` / `eyebrow` classes). No imports from `components/landing/`.
- Stars are static: no scroll effects. Twinkle uses the existing `.star-twinkle` class, which turns off under reduced motion.
- The `h1` must still contain "Good to see you" (existing test).
- Commits: Wasif's Git identity, no AI trailers. Never `git add -A` or `git add docs`; add exact paths.

---

### Task 1: Demo data for the paid cards

**Files:**
- Create: `lib/mock/home.ts`

**Interfaces:**
- Produces: `CoachingSession`, `demoNextSession`, `PlanItem`, `demoWeekPlan`, `demoApplicationsUsed`

- [ ] **Step 1: Write the file**

```ts
/*
 * Example data for the Home page's coaching, plan and applications cards.
 * Nothing here is a real student. Shaped like the tables it stands in for, so
 * a Supabase query can replace each export later.
 */

export type CoachingSession = {
  coach: string;
  /** ISO 8601 with offset. Shown in Toronto time. */
  startsAt: string;
  minutes: number;
};

export const demoNextSession: CoachingSession = {
  coach: "Wasif",
  startsAt: "2026-10-08T18:00:00-04:00",
  minutes: 45,
};

/** One item in the plan a coach writes after each session. */
export type PlanItem = { text: string; done: boolean };

export const demoWeekPlan: PlanItem[] = [
  { text: "Push your ML project to GitHub", done: true },
  { text: "Add numbers to your top three bullets", done: true },
  { text: "Approve this week's job matches", done: false },
];

/** Auto-apply credits used this month. */
export const demoApplicationsUsed = 4;
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck` → passes.

- [ ] **Step 3: Commit**

```bash
git add lib/mock/home.ts
git commit -m "Add demo data for the Home page's coaching, plan and applications cards"
```

---

### Task 2: Failing browser test for the new Home

**Files:**
- Modify: `e2e/app/home.spec.ts`

- [ ] **Step 1: Replace the first two tests**

```ts
test("a Free student sees their score, next step and locked paid features", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Good to see you");
  await expect(page.getByRole("link", { name: /read the guide/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Where you stand" })).toBeVisible();
  await expect(page.getByRole("img", { name: /resume score: \d+ out of 100/i })).toBeVisible();
  // Resume breakdown, coaching, plan and applications.
  await expect(page.getByRole("link", { name: /unlock with pro/i })).toHaveCount(4);
  await expect(page.getByRole("link", { name: "Upgrade" })).toBeVisible();
});

test("switching the demo to Pro unlocks the paid features", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Pro" }).click();
  await expect(page.getByRole("button", { name: "Pro" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("link", { name: /unlock with/i })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Upgrade" })).toHaveCount(0);
  await expect(page.getByText("2 of 3 done")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open tracker" })).toBeVisible();
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx playwright test e2e/app/home.spec.ts --project=desktop`
Expected: FAIL on "Where you stand" (heading not found).

---

### Task 3: Hero, cards and page

**Files:**
- Create: `app/(app)/dashboard/_components/hero-sky.tsx`
- Create: `app/(app)/dashboard/_components/home-hero.tsx`
- Create: `app/(app)/dashboard/_components/home-cards.tsx`
- Modify: `app/(app)/dashboard/page.tsx` (full rewrite)

**Interfaces:**
- Consumes: Task 1 exports; `Card`, `Locked`, `ScoreRing` from `components/app`; `ButtonLink`; `limitFor`, `requiredTier`.
- Produces: `HomeHero`, `HeroSky`, `GroupTitle`, `ResumeCard`, `JobsCard`, `CoachingCard`, `PlanCard`, `ApplicationsCard`.

- [ ] **Step 1: `hero-sky.tsx`**: a seeded, static star layer (46 stars, weighted to the right so the greeting stays clean), a soft cobalt glow and a faint orbit ring. Server component; `aria-hidden`.

- [ ] **Step 2: `home-hero.tsx`**: `deep-blue` rounded panel with `HeroSky`, mono eyebrow (`season · role`), serif `h1` "Good to see you, *{firstName}*", one line "Next step: {title}", and a `ButtonLink` (`variant="light"`, `arrow`) to the next step.

- [ ] **Step 3: `home-cards.tsx`**: `HomeCard` (Card + soft shadow, roomier padding), `Heading` (mono eyebrow + `h3`), `TextLink` (cobalt link with arrow), `GroupTitle` (`h2` with a hairline rule), and the five cards:
  - `ResumeCard`: score ring (120px), "Fix this first" + top fix, category bars in `<Locked feature="resume.fullReport">`, "Full report" link.
  - `JobsCard`: count as a large serif number, one line that depends on `limitFor(user, "visibleJobMatches")`, "View matches".
  - `CoachingCard`: session day (serif), time, length and coach, "View coaching", inside `<Locked feature="coaching.sessions">`.
  - `PlanCard`: checklist and "n of 3 done" with a bar, "Open your plan", inside `<Locked feature="plan">`.
  - `ApplicationsCard`: "used of limit" with a bar, "Open tracker", inside `<Locked feature="applications.tracker">`. Locked preview uses the required tier's limit via `limitFor({ tier: requiredTier(...) }, ...)`.
  - Dates are formatted with `Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto" })` so server output is stable.

- [ ] **Step 4: `page.tsx`**: hero, then "Where you stand" (`lg:grid-cols-3`, resume spans 2) and "Coaching and applications" (`lg:grid-cols-3`). Groups are `<section aria-labelledby>`; vertical rhythm `space-y-12`.

- [ ] **Step 5: Run the Home test**

Run: `npx playwright test e2e/app/home.spec.ts`
Expected: PASS on desktop and mobile.

- [ ] **Step 6: Full checks**

Run: `npm run check` then `npm run test:e2e` → all pass. Run `npx prettier --write` on changed files first if format check fails.

- [ ] **Step 7: Visual review**

Screenshots of Free, Pro and Elite at 1440px and 390px. Check: nothing cramped, no overflow, locked cards readable, hero text contrast.

- [ ] **Step 8: Commit**

```bash
git add "app/(app)/dashboard" e2e/app/home.spec.ts
git commit -m "Rebuild Home with a deep-blue hero and calmer cards"
```

---

### Task 4: Records and PR

**Files:**
- Modify: `docs/agents/STATUS.md` (claude section), `docs/agents/LOG.md` (append), `docs/agents/COMMS.md` (append), `docs/updated_current_guide.md` (Home row, starfield exception, checkpoint)
- Add: this plan and the spec

- [ ] **Step 1:** COMMS heads-up to Codex: new `lib/mock/home.ts`, Home-local `_components/`, the starfield exception, and an offer to move the mono eyebrow into the shared `CardTitle` later (not done here).
- [ ] **Step 2:** Guide: Home row → redesigned, PR link; note the static-stars exception under "Kept separate from the marketing site"; checkpoint entry for 2026-10-02.
- [ ] **Step 3:** LOG entry; STATUS → `in-review` once the PR exists.
- [ ] **Step 4:** `npm run format:check`, commit the exact doc paths, push `page/home`, open the PR into `dashboard`.
