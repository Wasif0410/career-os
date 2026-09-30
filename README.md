# Career OS

**Career coaching and job applying for CS students and early-career tech candidates, in one place.**

Career OS combines **1-1 coaching from real people** with software that scores your resume, teaches you what you're missing, finds jobs that fit, and applies for you.

```
Goal → Diagnose → Improve → Find Jobs → Apply → Track → Learn → Repeat
```

## What's Inside

**Get better**
- Resume score with specific fixes
- Courses and guides for growing as a CS candidate
- 1-1 coaching sessions with the founders
- A personal action plan written by your coach

**Get hired**
- Job matches with fit scores
- Auto-apply using monthly credits
- An application tracker from applied to offer

## Plans

| 🆓 Free | ⭐ Pro | 🚀 Elite |
|---|---|---|
| See where you stand | Get better | Get hired |
| Resume score preview, first lesson of each course, job match preview | Full resume report, all courses, monthly 1-1 coaching, action plan, tracker, some auto-apply credits | More coaching, async reviews, lots of auto-apply credits |

## Team

| | Works on |
|---|---|
| **Wasif** | Frontend platform + coaching |
| **Abishek** | Auto-applier + coaching |

## Tech Stack

Next.js · TypeScript · Tailwind CSS · shadcn/ui · Supabase · Stripe · Vercel · Resend · PostHog · Sentry
Auto-applier: Python service

## Repo Layout

| Path | What |
|---|---|
| [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md) | What Career OS is and the rules for building it. **Start here.** |
| [`docs/STRATEGY.md`](docs/STRATEGY.md) | Tiers, pricing, stack, architecture, roadmap |
| [`docs/frontend/PHASES.md`](docs/frontend/PHASES.md) | Frontend build guide, phase by phase |
| [`docs/updated_current_guide.md`](docs/updated_current_guide.md) | Where the project is right now: what's done, what's in progress, what's next |

## Code Layout

| Path | What |
|---|---|
| `app/(marketing)/` | Public site: landing, pricing, coaches, guides, privacy |
| `app/(app)/` | Student app: dashboard and every logged-in section. Own layout, noindex, not linked from marketing |
| `app/actions/` | Server actions (waitlist sign-up, demo tier switch) |
| `components/ui/` | Shared building blocks (buttons, sections, headings) |
| `components/app/` | Student app pieces (sidebar, header, cards, `Locked`) |
| `components/landing/`, `site/`, `waitlist/` … | Marketing sections |
| `lib/access.ts` | What each tier unlocks. The only place tier rules live |
| `lib/auth/` | The current user. A demo student until real auth lands |
| `lib/mock/` | Example data shaped like the future database tables |
| `content/` | MDX guides |
| `e2e/` | Playwright browser tests (`e2e/app/` for the student app, one file per page) |
| `supabase/migrations/` | Database changes, in order |

## Run Locally

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional in dev
npm run dev
```

Then open http://localhost:3000 for the site and http://localhost:3000/dashboard for the student app (demo student, no login).

| Command | What it does |
|---|---|
| `npm run check` | Lint, type check, format check and unit tests. Run before you push |
| `npm run format` | Format everything with Prettier |
| `npm test` / `npm run test:watch` | Unit and component tests (Vitest). They sit next to the code as `*.test.ts(x)` |
| `npm run test:e2e` | Browser tests in `e2e/` (Playwright). First time: `npx playwright install chromium` |
| `npm run build` | Production build |

CI runs all of these on every pull request. `main` only accepts changes through a PR with green checks.

## Deploy on Vercel

1. Import the repo in Vercel. It detects Next.js, so leave the build settings on their defaults.
2. Set **Production Branch** to `main`. Every other branch (like `frontend`) gets its own preview URL.
3. Add the variables from [`.env.example`](.env.example) under **Settings → Environment Variables**. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are required in production or sign-ups fail. `NEXT_PUBLIC_SITE_URL` is optional.
4. Turn on **Speed Insights** in the project to get Core Web Vitals from real visitors.
5. Set the **Function Region** (Settings → Functions) to the one closest to the Supabase project, e.g. `yul1` for Supabase's `ca-central-1`.

What the code handles:

- Every marketing page is prerendered at build time. The waitlist sign-up and the student app run as functions.
- The student app returns 404 in production until real login exists. It runs on local and preview deployments only.
- Canonical URLs, the sitemap and Open Graph images use the right domain for production and for each preview.
- Previews serve a `robots.txt` that blocks crawlers.
- Node is pinned to 24.x in `package.json`.

## Branches

| Branch | Purpose |
|---|---|
| `main` | Shared, stable |
| `frontend` | Marketing site work |
| `setup/*` | Tooling and repo setup |
| `app/structure` | The student app shell (layout, navigation, shared pieces) |
| `page/*` | One branch and one PR per student app page (`page/home`, `page/resume`, …) |

## Status

🚧 **Phase 1 (marketing site) is live. The student app is being built, one PR per page.** See [`docs/updated_current_guide.md`](docs/updated_current_guide.md) for details.
