# Frontend Build Guide — Phases

> **For agents:** This is Wasif's step-by-step guide for the Career OS frontend (branch: `frontend`). Read [`../PROJECT_CONTEXT.md`](../PROJECT_CONTEXT.md) and [`../STRATEGY.md`](../STRATEGY.md) first. Work one phase at a time. A phase is done only when every item in **Done when** is true. Don't pull features forward from later phases.

**Owner:** Wasif
**Stack:** Next.js (App Router) · TypeScript · Tailwind · shadcn/ui · Supabase · Stripe · Vercel · Resend · PostHog · Sentry
**Order:** what visitors see → login → dashboard → payments → paid features → coach tools → launch

---

## Route Map (target at launch)

```
PUBLIC
/                      Landing page
/pricing               Tiers + upgrade / waitlist
/coaches               About Wasif & Abishek
/guides                Free guides list
/guides/[slug]         Guide article
/login  /signup        Auth
/terms  /privacy       Legal

STUDENT (logged in)
/onboarding            First-time setup wizard
/dashboard             Home: score, next steps, upgrade prompts
/profile               View / edit profile
/resume                Upload + score report
/courses               Course list
/courses/[course]/[lesson]
/jobs                  Job matches (teaser on Free)
/applications          Application tracker        (Pro+)
/coaching              Book sessions, history      (Pro+)
/plan                  Action plan                 (Pro+)
/billing               Plan, credits, cancel

COACH (role = coach)
/coach                 Student list
/coach/students/[id]   Everything about one student
```

---

## Phase 0 — Foundations
**Week 1 · Goal: a deployed skeleton and a design system.**

- [ ] Next.js + TypeScript + Tailwind + shadcn/ui in this repo
- [ ] ESLint + Prettier; strict TypeScript
- [ ] Supabase projects: `dev` and `prod`. Env vars in Vercel, never committed
- [ ] Vercel connected: every push to `frontend` gets a preview URL
- [ ] Buy the domain and point it at Vercel
- [ ] **Design system:** colors, fonts, spacing, logo, dark mode decision
- [ ] Core components: `Button`, `Card`, `Input`, `Badge`, `Dialog`, `Toast`, **`Locked`** (blur + "Unlock with Pro" + link to upgrade)
- [ ] Folder structure: `app/(marketing)`, `app/(auth)`, `app/(app)`, `app/(coach)`, `components/`, `lib/`, `content/`

**With Abishek:** agree on the shared tables (`profiles`, `jobs`, `job_matches`, `applications`, `credits`) and status values. Write them down in `docs/`.

**Done when:** the skeleton deploys to a Vercel URL, the core components render, and the shared tables are agreed.

---

## Phase 1 — Marketing Site
**Weeks 2-3 · Goal: a public site that builds trust and collects a waitlist.**

- [ ] **Landing page** `/`: hero with a clear promise, the problem, how it works (get better + get hired), founders, tier preview, call to action
- [ ] **Pricing** `/pricing`: Free / Pro / Elite table; buttons say "Join waitlist" for now
- [ ] **Coaches** `/coaches`: photos, background, why trust you
- [ ] **Guides** `/guides`: MDX in `content/guides/`, 3-5 real guides to start
- [ ] **Waitlist form**: saves to a Supabase `waitlist` table, sends a confirmation email through Resend, handles duplicates and invalid emails
- [ ] SEO: page titles, meta descriptions, Open Graph images, `sitemap.xml`, `robots.txt`
- [ ] PostHog: page views + waitlist signups
- [ ] Mobile-first responsive; check every page at 375px width
- [ ] Lighthouse: performance and accessibility 90+

**Needs from Abishek:** nothing.

**Done when:** the site is live on the domain, looks right on mobile, and real people have joined the waitlist.

---

## Phase 2 — Auth & Onboarding
**Weeks 3-4 · Goal: people can sign up, log in and set up their profile.**

- [ ] `/signup` and `/login` with email + password and Google (Supabase Auth)
- [ ] Email verification, forgot/reset password, log out
- [ ] Middleware protects `(app)` and `(coach)` routes; logged-out users go to `/login`
- [ ] `profiles` row created on signup with `role = student` and `tier = free`
- [ ] **Row-Level Security** on every table: students read/write only their own rows; coaches can read all students
- [ ] **Onboarding wizard** `/onboarding` (3-4 steps, progress bar):
  1. Target role + season (e.g. ML internship, Winter 2027)
  2. Internship or full-time, locations
  3. Education
  4. Skills
- [ ] After onboarding, go to `/dashboard` (an empty state is fine for now)

**Needs from Abishek:** nothing (he reads `profiles` later).

**Done when:** a new user can sign up, verify their email, finish onboarding and reach the dashboard, and a second test account cannot see the first account's data.

---

## Phase 3 — Free Tier Dashboard
**Weeks 5-6 · Goal: free users get a taste of value and hit locks that lead to upgrading.**

- [ ] **App layout:** sidebar nav, header, tier badge, "Upgrade" button always visible on Free
- [ ] **Dashboard** `/dashboard`: resume score card, "next step" card, locked cards for coaching / plan / tracker
- [ ] **Profile** `/profile`: view and edit everything from onboarding plus projects and experience
- [ ] **Resume upload** `/resume`: PDF only, size limit, stored in Supabase Storage (private bucket)
- [ ] **Resume scoring:** a server-side call to an LLM with the rubric → score out of 100 + category scores (impact, clarity, technical depth, formatting) + ranked fixes, saved to the database
  - Free: overall score + the top fix; everything else wrapped in `<Locked>`
- [ ] **Courses** `/courses`: MDX in `content/courses/`, lesson 1 of each course free, the rest locked
- [ ] **Job matches teaser** `/jobs`: "X jobs match you," 3 visible, the rest blurred. Use fake data if `job_matches` isn't ready yet
- [ ] **Feature gating helper:** `lib/access.ts` → `canAccess(user, feature)`. Every lock uses it. No tier checks inside components

**Needs from Abishek:** `job_matches` data (optional; use fake data until it's ready).
**Needs from both:** the resume score rubric.

**Done when:** a free user can upload a resume, get a score, read the free lessons and see locked content everywhere that leads to `/pricing`.

---

## Phase 4 — Payments & Tiers
**Weeks 6-7 · Goal: users pay and features unlock immediately.**

- [ ] Stripe products: **Pro** and **Elite**, monthly
- [ ] Checkout from `/pricing` and from every `<Locked>` component
- [ ] Webhook route `/api/stripe/webhook`: verify the signature, then update `tier` and monthly `credits` in Supabase
- [ ] Handle: new subscription, upgrade, downgrade, cancel, failed payment (→ back to Free)
- [ ] Credits reset every billing cycle
- [ ] `/billing`: current plan, credits left, "Manage subscription" (Stripe customer portal)
- [ ] Pricing buttons switch from "Join waitlist" to real checkout

**Needs from Abishek:** agreement that the applier deducts from `credits` before applying.

**Done when:** in Stripe test mode, a user can buy Pro, get unlocked instantly, upgrade to Elite, cancel, and drop back to Free.

---

## Phase 5 — Paid Features
**Weeks 8-9 · Goal: Pro and Elite users get everything they pay for.**

- [ ] Full resume report and all course lessons unlocked for paid tiers
- [ ] **Coaching** `/coaching`: Cal.com embed, sessions limited by tier per month, list of upcoming/past sessions
- [ ] **Action plan** `/plan`: "This week" and "This month" lists written by coaches; the student ticks items off
- [ ] **Session notes**: the shared notes from each session, visible to the student
- [ ] **Job matches (full)** `/jobs`: fit score, why they match, what's missing, **Approve / Skip**. Approve creates an `applications` row with `queued`
- [ ] **Application tracker** `/applications`: board or list by status; a **"Needs your action"** section on top; each item links to the job
- [ ] **Credits counter**: "34 of 100 applications left this month"; block approving when credits hit 0 and show upgrade/top-up messaging
- [ ] Emails (Resend): session reminder, application status changed, needs your action

**Needs from Abishek:** the applier picks up `queued` applications and updates their statuses.

**Done when:** a paid user can book a session, see their action plan, approve jobs, and watch applications move through the tracker.

---

## Phase 6 — Coach View
**Week 10 · Goal: Wasif and Abishek run coaching from the platform.**

- [ ] `(coach)` route group, only for `role = coach`
- [ ] **Student list** `/coach`: name, tier, resume score, last session, application count, search and filter
- [ ] **Student page** `/coach/students/[id]`: profile, resume + score, action plan, session notes, applications, all on one screen
- [ ] Write and edit the action plan (shows up on the student's `/plan`)
- [ ] Session notes: **private** (coaches only) and **shared** (student sees them)
- [ ] **Coaching spot cap:** set the monthly limit; `/pricing` shows "X spots left" and blocks checkout at 0

**Needs from Abishek:** nothing new.

**Done when:** a coach can open any student, see everything in one place, and write a plan the student sees immediately.

---

## Phase 7 — Beta & Launch
**Weeks 11-12 · Goal: real users, fixed bugs, public launch.**

- [ ] **Private beta:** invite 10-20 waitlist users (free or discounted Pro)
- [ ] PostHog funnels: landing → signup → onboarding → resume score → upgrade. Find the biggest drop-off and fix it
- [ ] Sentry on client and server; zero unhandled errors on the main flows
- [ ] Every page has loading, empty and error states
- [ ] `/terms` and `/privacy` pages (you store resumes, so this is required)
- [ ] Stripe **live mode**, tested with a real card
- [ ] Final mobile pass on every page
- [ ] Merge `frontend` into `main`, deploy to production
- [ ] **Launch:** email the waitlist, post everywhere, open the capped coaching spots

**Done when:** a stranger can find the site, sign up, pay, book coaching and have applications submitted, without anyone on the team helping them by hand.

---

## Frontend Conventions

- **Server components by default**; client components only when they need interactivity
- **All tier checks go through `canAccess()`** in `lib/access.ts`
- **Never expose secret keys** to the client. Supabase service role and Stripe secret keys stay on the server only
- **Content lives in `content/`** as MDX, not in the database
- **Every data-fetching page** has loading, empty and error states
- **Mobile-first**: design at 375px, then scale up
