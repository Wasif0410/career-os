# Agent Status

Current assignments. Each agent edits only its own section. Wasif assigns tasks in chat; agents record them here. These updates become visible to other worktrees after they are shared through Git.

**States:** `idle` · `working` · `blocked` · `in-review` (an actual PR is open)

## Current stage

Student app UI development with demo data, before real authentication. This follows the revised order in [the current guide](../updated_current_guide.md). Marketing work continues separately on `marketing-site`.

Wasif controls this shared section.

## claude

- **State:** in-review
- **Task:** Coaching page (`/coaching`) as a booking page (assigned by Wasif in Claude’s chat, 2026-10-03; design approved from an HTML mockup on 2026-10-04): booked calls with reschedule and cancel, then one card that books a call in three steps (call and coach, day, time), a confirm step with a note, and a confirmation with undo. Another Claude chat built the Plan page (`/plan`), merged into dashboard through #33. Earlier: Home v2 (#30) and the courses library (#32). Resume (`/resume`) is a separate PR from page/resume (worktree C:/Users/wa/Documents/career-os-resume).
- **Owned paths:** app/(app)/coaching/**, lib/mock/coaching.ts (coaching-only demo data), e2e/app/coaching.spec.ts, docs/coaching/DESIGN.md
- **Worktree:** C:/Users/wa/Documents/career-os-coaching
- **Branch:** page/coaching (dashboard merged in, including #33)
- **PR base:** dashboard
- **PR:** https://github.com/Wasif0410/career-os/pull/34
- **Blocked by:** nothing
- **Next:** Wasif reviews PR #34 into dashboard and confirms the call types and lengths; then the resume PR into dashboard
- **Updated:** 2026-10-04

## codex

- **State:** idle
- **Task:** last tasks done: courses page (#32 into dashboard) and the dashboard QA link in the README (#31 into main)
- **Owned paths:** none
- **Worktree:** none
- **Branch:** none
- **PR base:** n/a
- **PR:** none open
- **Blocked by:** nothing
- **Next:** waiting for Wasif's next task
- **Updated:** 2026-10-02

## Ownership policy

Wasif controls this policy. Tasks own individual pages and page-specific components. There is no confirmed permanent folder ownership split.

Shared app layouts, navigation, components, design tokens, access rules, demo data, auth / proxy.ts, and database contracts require coordination before editing. Record the active owner and exact paths in the agent's section. Follow the conflict and agreement rules in AGENTS.md.

Separate worktrees are required when Claude and Codex work concurrently. This configuration branch does not create or assign the future page worktrees.
