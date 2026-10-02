# Agent Instructions

Every agent working in this repo follows this file. Wasif assigns tasks in each agent's chat, makes product decisions, and reviews and merges PRs.

## Agents

| Name | Tool / model | Coordination name |
|---|---|---|
| Claude | Claude Code | `claude` |
| Codex | Codex / GPT 6.1 Sol | `codex` |
| Wasif | Human lead | `wasif` |

Codex replaces Astra. Historical entries mentioning Astra remain part of the record.

## Read first

1. [Project context](docs/PROJECT_CONTEXT.md): product purpose and constraints.
2. [Strategy](docs/STRATEGY.md): architecture, tiers, and open questions.
3. [Current guide](docs/updated_current_guide.md): actual progress, branches, and next steps.
4. [Phase plan](docs/frontend/PHASES.md): detailed roadmap. The current guide records changes to its original order.
5. [Agent status](docs/agents/STATUS.md) and [comms](docs/agents/COMMS.md): active assignments and coordination.

## Assignments and coordination

Wasif gives assignments in Claude Code or Codex chat. Agents record a short summary in their own STATUS section; Wasif does not need to write assignments into files. A direct instruction from Wasif takes precedence over these docs. Record any resulting shared decision for the other agent.

| File | Purpose | Editing rule |
|---|---|---|
| `docs/agents/STATUS.md` | Current task, owned files, worktree, branch, and PR base | Edit only your own agent section. Wasif controls shared stage and ownership policy |
| `docs/agents/COMMS.md` | Questions, shared changes, review requests, and handoffs | Append messages; only change the Status of messages you sent or received |
| `docs/agents/LOG.md` | Brief completed-session history | Append; never rewrite past entries |
| `docs/updated_current_guide.md` | Overall progress and project checkpoints | Update when work changes project status; coordinate edits to avoid overlap |

Use COMMS for durable coordination between agents. Ask Wasif questions in the active chat and record decisions that affect both agents. Do not assume the other agent can see your conversation or that file updates are live.

## Branches and worktrees

Each concurrently working agent must use a separate Git worktree and task branch. Separate chats sharing one checkout can overwrite each other's work or switch each other's branch.

| Work | Base branch | Task branch | PR target |
|---|---|---|---|
| Student app page | `dashboard` | `page/<task>` | `dashboard` |
| Marketing | `marketing-site` | `marketing/<task>` | `marketing-site` |
| Standalone tooling / docs | `main` unless Wasif specifies otherwise | `setup/<task>` or `docs/<task>` | Explicitly record the target |

Existing `page/<name>` branches remain valid. Record the actual base and target for every assignment. Only Wasif merges task PRs or promotes `marketing-site` / `dashboard` into `main`. Never commit feature work directly to those integration branches, force-push shared branches, or merge your own PR.

## Session protocol

### Start

1. Check the branch, worktree, and working tree before changing anything. Preserve existing edits.
2. Fetch remote updates. On a clean branch with an upstream, use `git pull --ff-only`. Without an upstream, inspect the intended base rather than guessing what to pull.
3. Read STATUS and open COMMS messages addressed to you or all agents. Act on relevant requests first.
4. Record your assignment, owned paths, worktree, branch, and PR target in your STATUS section.

### Work

- Split dashboard work by page: for example, home and courses. Each agent owns its assigned route and page-specific components.
- Reuse the app shell and design system. Before editing shared layouts, navigation, `components/app/`, `components/ui/`, design tokens, `lib/access.ts`, demo data, or auth / `proxy.ts`, post the intended changes in COMMS.
- If another agent owns an affected file, wait for agreement or Wasif's direction before changing it. Unassigned shared work needs an explicit claim and conflict check; do not assume ownership of a whole folder.
- Use demo data for current student UI work. Real auth, database integration, payments, and later-phase features require a separate assignment.
- If blocked, record why in STATUS and COMMS, and continue independent work where possible.
- File updates in one worktree are invisible in the other until shared through Git. Commit and push coordination updates at useful checkpoints. Read relevant remote updates before starting overlapping work; never silently merge the other agent's feature branch.

### Finish

1. Run checks appropriate to the work. Code changes use `npm run check`; UI changes also use browser tests and a phone-width review. Docs-only changes need formatting and diff checks.
2. Append a brief LOG entry, update your STATUS section, and mark resolved messages accordingly.
3. Commit coordination files with the work and push the task branch. Open a PR when requested or as part of the assigned delivery, with the recorded base.
4. Set `in-review` only when a PR is actually open; otherwise use `idle` or `blocked` with a clear next step.

## Shared rules

- One active owner per shared file. No permanent Claude-versus-Codex folder split is assumed.
- Review the other agent's PR when Wasif assigns a review in chat or COMMS.
- Keep tier rules centralized in `lib/access.ts`; human coaches provide coaching.
- Shared database changes require both product owners' agreement.
- Never invent answers to product questions. Ask Wasif and record the decision.
- Union merging COMMS and LOG preserves appended text, but does not guarantee ordering or resolve conflicting decisions. Use unique message IDs and inspect merged records.

Use task-based branch names and PR titles. Do not add agent or model branding to branches or PRs. Commits use Wasif's configured Git identity without AI co-author trailers.
