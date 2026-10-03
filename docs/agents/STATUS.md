# Agent Status

Current assignments. Each agent edits only its own section. Wasif assigns tasks in chat; agents record them here. These updates become visible to other worktrees after they are shared through Git.

**States:** `idle` · `working` · `blocked` · `in-review` (an actual PR is open)

## Current stage

Student app UI development with demo data, before real authentication. This follows the revised order in [the current guide](../updated_current_guide.md). Marketing work continues separately on `marketing-site`.

Wasif controls this shared section.

## claude

- **State:** idle
- **Task:** Home page redesign (`/dashboard`): keep the original card layout with fewer words, more space, and a deep-blue starfield hero, per Wasif in chat
- **Owned paths:** `app/(app)/dashboard/` (page and new `_components/`), new `lib/mock/home.ts`, `e2e/app/home.spec.ts`, `docs/superpowers/specs/2026-10-02-home-page-design.md`
- **Worktree:** C:/Users/wa/Documents/career-os-home
- **Branch:** page/home
- **PR base:** dashboard
- **PR:** none yet
- **Blocked by:** nothing
- **Next:** built and tested (check + 36 browser tests); push page/home and open the PR into dashboard once Wasif confirms
- **Updated:** 2026-10-02

## codex

- **State:** idle
- **Task:** delivered configuration guidelines in PR #29; branch synchronization authorized
- **Owned paths:** branch references in AGENTS.md, README.md, docs/PROJECT_CONTEXT.md, docs/frontend/PHASES.md, docs/updated_current_guide.md, and own coordination records
- **Worktree:** C:/Users/wa/Documents/career-os-repo
- **Branch:** agent-config (coordination record only)
- **PR base:** main
- **PR:** https://github.com/Wasif0410/career-os/pull/29
- **Blocked by:** nothing
- **Next:** Wasif assigns pages in chat; use separate worktrees for parallel editing
- **Updated:** 2026-10-02
## Ownership policy

Wasif controls this policy. Tasks own individual pages and page-specific components. There is no confirmed permanent folder ownership split.

Shared app layouts, navigation, components, design tokens, access rules, demo data, auth / proxy.ts, and database contracts require coordination before editing. Record the active owner and exact paths in the agent's section. Follow the conflict and agreement rules in AGENTS.md.

Separate worktrees are required when Claude and Codex work concurrently. This configuration branch does not create or assign the future page worktrees.
