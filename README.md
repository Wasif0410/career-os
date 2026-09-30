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
| `docs/frontend/PHASES.md` | Frontend build guide (on the `frontend` branch) |

## Run Locally

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional in dev
npm run dev
```

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

- Every page is prerendered at build time. Only the waitlist sign-up runs as a function.
- Canonical URLs, the sitemap and Open Graph images use the right domain for production and for each preview.
- Previews serve a `robots.txt` that blocks crawlers.
- Node is pinned to 24.x in `package.json`.

## Branches

| Branch | Purpose |
|---|---|
| `main` | Shared, stable |
| `frontend` | Wasif's frontend work |

## Status

🚧 **Phase 0: Foundations.** Setting up the project and agreeing on the shared database tables. Public launch is planned about 12 weeks out.
