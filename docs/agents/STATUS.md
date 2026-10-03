# Agent Status

Current assignments. Each agent edits only its own section. Wasif assigns tasks in chat; agents record them here. These updates become visible to other worktrees after they are shared through Git.

**States:** `idle` · `working` · `blocked` · `in-review` (an actual PR is open)

## Current stage

Student app UI development with demo data, before real authentication. This follows the revised order in [the current guide](../updated_current_guide.md). Marketing work continues separately on `marketing-site`.

Wasif controls this shared section.

## claude

- **State:** idle
- **Task:** Courses visual design: a 3D course library on the cosmic background that opens each course in place (assigned by Wasif in Claude's chat, 2026-10-02). Codex finished the course content and progress work; Claude now owns the courses design. Earlier: Home page v2 and the shared shell restyle, merged into dashboard through PR #30.
- **Owned paths:** app/(app)/courses/**, components/courses/**, e2e/app/courses.spec.ts, docs/courses/DESIGN.md (lib/courses.ts and content/courses/** only if a design change needs it)
- **Worktree:** C:/Users/wa/Documents/career-os-courses (taken over from Codex, who is idle)
- **Branch:** page/courses (fast-forwarded to dashboard at dd6d7c7, including PR #30)
- **PR base:** dashboard
- **PR:** none; local and uncommitted until Wasif reviews
- **Blocked by:** nothing
- **Next:** Wasif reviews the 3D library at http://localhost:3002/courses; changes stay local and uncommitted until he decides
- **Updated:** 2026-10-02

## codex

- **State:** idle
- **Task:** completed courses with visible persistent progress, completed syllabus indicators and continue-learning flows; 20 desktop/phone browser checks passed; awaiting Wasif's local review
- **Owned paths:** app/(app)/courses/**, components/courses/**, lib/courses.ts, content/courses/**, e2e/app/courses.spec.ts, docs/courses/**, own coordination records; courses row/checkpoint in docs/updated_current_guide.md
- **Worktree:** C:/Users/wa/Documents/career-os-courses
- **Branch:** page/courses (base: dashboard at 4eff326)
- **PR base:** dashboard
- **PR:** none; Wasif requested no commit, push, PR or merge before local review
- **Blocked by:** nothing
- **Next:** Wasif reviews http://localhost:3002/courses and gives the next instruction. Changes remain local and uncommitted; no PR is open.
- **Updated:** 2026-10-02
## Ownership policy

Wasif controls this policy. Tasks own individual pages and page-specific components. There is no confirmed permanent folder ownership split.

Shared app layouts, navigation, components, design tokens, access rules, demo data, auth / proxy.ts, and database contracts require coordination before editing. Record the active owner and exact paths in the agent's section. Follow the conflict and agreement rules in AGENTS.md.

Separate worktrees are required when Claude and Codex work concurrently. This configuration branch does not create or assign the future page worktrees.
