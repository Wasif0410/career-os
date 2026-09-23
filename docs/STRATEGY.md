# Career OS — Strategy & Direction

> **For agents:** This file holds the business and product decisions: tiers, pricing, stack, ownership and the roadmap. Read [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) first. Anything under **Open Questions** is undecided, so ask instead of assuming.

---

## Key Decisions

| Topic | Decision |
|---|---|
| **Launch** | Coaching platform and auto-apply launch **together**, each as a thin version |
| **Timeline** | Public launch about **12 weeks** from start |
| **First users** | **Online audience**: LinkedIn, TikTok, Discord, Reddit |
| **Coaching** | **Human 1-1**, by Wasif and Abishek. Paid tiers only |
| **Business model** | **Free → Pro → Elite** subscription tiers. Auto-apply credits are built into the paid tiers |
| **Free tier** | Deliberately limited. It shows what's missing so users want to upgrade |
| **Auto-apply method** | **Abishek decides.** The frontend only shows status |
| **Work split** | Wasif: frontend platform. Abishek: auto-applier |
| **Integration** | The two sides share **one Supabase database**. No direct calls between codebases |

---

## Tiers

| | 🆓 Free | ⭐ Pro | 🚀 Elite |
|---|---|---|---|
| **Goal for the user** | See where you stand | Get better | Get hired |
| Profile | Basic | Full | Full |
| Resume score | Number + 1 fix (rest locked) | Full report + all fixes | Full report + human review |
| Courses & guides | First lesson of each | All | All |
| Job matches | Count + 3 visible (rest blurred) | Full list + fit scores | Full list + fit scores |
| 1-1 coaching | ❌ | 1 session/month | 2-4 sessions/month + async reviews |
| Action plan | ❌ | ✅ | ✅ |
| Application tracker | ❌ | ✅ | ✅ |
| Auto-apply credits | ❌ | ~10/month | ~100/month |
| **Price (to test)** | **$0** | **~$19-29/mo** | **~$59-99/mo** |

### How the tiers should work

- **Show, don't give.** Free users see a real result (their score, a match count) with the details locked. Every locked item links straight to upgrading.
- **Cap coaching spots** (e.g. 30/month). Two coaches can't serve unlimited students. The cap protects your time and creates real scarcity ("8 spots left this month").
- **Auto-apply stays inside the tiers.** Selling it alone would make Career OS look like just another auto-apply bot. Pro gets a taste, Elite gets volume.
- **No dark patterns.** No fake countdowns, no hidden cancel button. Online audiences punish them, and Stripe can too.

### After launch
- Auto-apply **top-up credit packs** (e.g. +25 applications), once you know real usage
- Price tests based on conversion data

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js (App Router) + TypeScript** | Industry standard, good SEO for the marketing site, easy to hire for |
| UI | **Tailwind CSS + shadcn/ui** | Polished, accessible components fast; you own the code |
| Database, auth, files | **Supabase** (Postgres + Row-Level Security) | Login, database and resume storage in one; RLS keeps student data private |
| Payments | **Stripe** | Subscriptions, credits, customer portal |
| Hosting | **Vercel** | Auto-deploys from GitHub, free tier covers launch |
| Coach booking | **Cal.com embed** | Don't build a scheduler |
| Courses & guides | **MDX in the repo** | Write in markdown; move to a CMS only when content volume demands it |
| Email | **Resend** | Waitlist, reminders, status updates |
| Monitoring | **Sentry + PostHog** | Error alerts + funnel analytics |
| Auto-applier | **Python service** (tools chosen by Abishek) | Best ecosystem for scraping and browser automation |

Expected cost: about **$0-50/month** until real traction.

## Architecture

```
 Student ──► Next.js app (Wasif) ──► Supabase Postgres ◄── Auto-applier (Abishek)
                  │                   profiles, jobs,          Python worker:
                  │                   job_matches,             collects jobs, matches,
                  └──► Stripe ───────► applications, credits    applies, updates status
                     (webhooks set tier + credits)
```

**Shared tables (the contract).** Both owners must agree on any change:

| Table | Written by | Read by |
|---|---|---|
| `profiles` | Frontend | Both |
| `jobs` | Auto-applier | Both |
| `job_matches` | Auto-applier (scores), Frontend (approve/skip) | Both |
| `applications` | Auto-applier (status), Frontend (creates on approve) | Both |
| `credits` | Stripe webhook via Frontend; Auto-applier deducts | Both |

Application statuses: `queued`, `applied`, `in_review`, `oa`, `interview`, `offer`, `rejected`, `needs_action`, `failed`.

---

## Roadmap Overview

| Phase | Weeks | Wasif (frontend) | Abishek (auto-applier) |
|---|---|---|---|
| **0 · Foundations** | 1 | Repo, stack, design system | Research job sources and the apply method |
| **1 · Marketing site** | 2-3 | Landing, pricing, guides, waitlist | Job collector |
| **2 · Auth & onboarding** | 3-4 | Login, roles, onboarding wizard | Matching + fit scores |
| **3 · Free dashboard** | 5-6 | Resume score, courses, locked teasers | First working applier (1-2 ATS types) |
| **4 · Payments** | 6-7 | Stripe, tier gating, billing | Credit checks, status updates |
| **5 · Paid features** | 8-9 | Booking, action plans, tracker | Approved jobs flow through; reliability |
| **6 · Coach view** | 10 | Coach dashboard | Monitoring + kill switch |
| **7 · Beta & launch** | 11-12 | Beta, polish, legal pages, go live | Beta fixes |

**Together in Phase 0:** agree on the shared tables above. This is the most important early deliverable.
**Together throughout:** write the resume score rubric and course content, and post online.

Wasif's detailed steps: [`frontend/PHASES.md`](frontend/PHASES.md).

---

## Go-to-Market

- **Start posting in week 1.** Building in public, resume tips, CS career advice. The audience takes months to grow.
- **The marketing site collects a waitlist** from Phase 1 onward, so launch day has people waiting.
- **Free guides do double duty** as SEO content and social posts.
- **Founders are the brand.** Real faces and real credibility build trust with strangers.
- **Private beta** of 10-20 waitlist users before the public launch.

## Risks

| Risk | Mitigation |
|---|---|
| Coaching doesn't scale past two people | Cap spots; raise prices before adding coaches |
| Auto-apply gets accounts banned or breaks site terms | Abishek picks safe targets; a kill switch; a `needs_action` fallback |
| Course content takes longer than code | Outline in Phase 1, write alongside development |
| Free tier too weak to convert strangers | Watch PostHog; loosen one free feature if sign-ups don't upgrade |
| Two half-built products | Strict phase "done when" checks; ship thin versions |

## Open Questions

- Exact prices and the coaching spot cap
- Session format: video call length, async reviews, or both
- Job data sources and the auto-apply method (Abishek)
- Success metrics: interview rate, time to offer, paid conversion rate
- Refund policy for unused auto-apply credits
