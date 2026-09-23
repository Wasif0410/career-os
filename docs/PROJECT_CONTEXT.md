# Career OS — Project Context

> **For agents:** Read this before any work in this repo. It explains what Career OS is, who it's for, and the rules that aren't obvious from the code. If this file conflicts with an older assumption, this file wins. For pricing, tiers, stack and roadmap, read [`STRATEGY.md`](STRATEGY.md). For frontend build steps, read [`frontend/PHASES.md`](frontend/PHASES.md).

---

## What Career OS Is

Career OS helps CS students and early-career tech candidates land the roles they want. It combines **human 1-1 career coaching** with **software that teaches, scores, matches and applies to jobs**.

## Team

| Person | Owns |
|---|---|
| **Wasif** | Frontend platform: marketing site, auth, dashboard, courses, coaching features, payments UI. Also a coach. |
| **Abishek** | Auto-applier: job collection, matching, submitting applications. Also a coach. |

**Coaching is done by Wasif and Abishek, not by AI.** Software handles prep, scoring and tracking. The coaches give the advice.

## Who It's For

- CS / Software Engineering students
- Internship seekers and new grads
- Early-career SWE, AI, ML and data candidates

Every user sets a **target goal**, e.g. *"Winter 2027 Machine Learning internship."* Everything in the product is built around that goal.

The first users are an **online audience** (LinkedIn, TikTok, Discord, Reddit). They're strangers, so the product has to earn trust through polish, free value and visible founders.

## The Problem

Job seekers use a separate, unconnected tool for resumes, advice, job boards, learning, tracking and applying. They don't know:

- How competitive they are for their target role
- What to improve next
- Which jobs are worth applying to
- How to apply at scale without sending low-quality applications

## How It Works

```
            ┌──────────────────────────────┐
            │  SHARED PROFILE + JOB DATA   │
            │     (Supabase database)      │
            └──────────────┬───────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                     ▼
┌─────────────────────┐             ┌─────────────────────┐
│ GET BETTER          │             │ GET HIRED           │
│ Courses, resume     │◄───────────►│ Job matching,       │
│ score, 1-1 human    │  feedback   │ auto-apply,         │
│ coaching, plans     │             │ application tracker │
└─────────────────────┘             └─────────────────────┘
   Wasif's frontend                    Abishek's service
```

**Get better (coaching side)**
1. Student builds a profile and uploads a resume.
2. The platform scores the resume and shows how they compare to their target role.
3. Courses and guides teach them what they're missing.
4. Paid students get **1-1 sessions with Wasif or Abishek**, who pick the top 3 gaps and write an action plan (this week / this month).
5. Progress is tracked between sessions.

**Get hired (job side)**
1. The platform finds jobs that fit the student's goal and profile.
2. Each job gets a fit score: why they match and what's missing.
3. The student approves jobs, and the auto-applier submits applications using monthly credits.
4. Every application is tracked: `queued → applied → in_review → oa → interview → offer / rejected`, plus `needs_action` and `failed`.

**The loop:** application results feed back into coaching (e.g. 12 applications and 0 OAs means the plan needs to change), and coaching progress unlocks better-fit jobs.

```
Goal → Diagnose → Improve → Find Jobs → Apply → Track → Learn → Repeat
```

## What Career OS Is NOT

Not just a resume builder, a job board, an auto-apply bot, or an AI chatbot. **The value is connecting getting better with getting hired.**

## Rules for Agents

- **Coaching = humans.** Never build features where AI gives career advice to students in place of the coaches. AI may draft, score, summarize and prep for the coaches.
- **Relevance over volume.** Auto-apply must stay relevant to the student's goal.
- **One shared profile.** Coaching and job features read from and write to the same database tables. Don't create parallel data models.
- **The database is the contract.** The frontend and the auto-applier communicate only through the shared Supabase tables. Don't change a shared table without both owners agreeing.
- **Gate features by tier.** Use the single feature-gating helper. Never hard-code tier checks in components.
- **Respect platform rules.** Check terms of service and legality before automating against job sites or ATS platforms.
- **Student data is sensitive.** Resumes contain personal info. Row-Level Security is always on, and students only ever see their own data.
- **Unsure? Ask.** Anything listed as open in `STRATEGY.md` is undecided.

## Repo Map

| Path | What |
|---|---|
| `docs/PROJECT_CONTEXT.md` | This file: what we're building and the rules |
| `docs/STRATEGY.md` | Direction: tiers, pricing, stack, ownership, roadmap |
| `docs/frontend/PHASES.md` | Wasif's phase-by-phase frontend build guide |

**Branches:** `main` is shared and stable. `frontend` is Wasif's work.
