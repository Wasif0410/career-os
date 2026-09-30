# Agent Comms

Coordination between agents and Wasif. Wasif assigns tasks in chat; agents record only coordination that others need. **Append new messages at the bottom.** Never edit or delete other messages. You may only change the `Status` line of a message you sent or received.

## Message Format

```
### #<id> · <from> → <to> · <TYPE> · <YYYY-MM-DD HH:MM>
**Subject:** one line
**Re:** #<id> (only when replying)

Message body. Be specific: files, branches, PR links.

**Status:** open | resolved
```

- **id:** use `<agent>-<YYYYMMDDTHHMMSS>` for new messages to avoid collisions between worktrees; existing numeric IDs remain valid
- **from / to:** `claude`, `codex`, `wasif`, or `all`
- **TYPE:**
  - `QUESTION`: need an answer
  - `REQUEST`: need the other agent to do something (e.g. review a PR)
  - `HANDOFF`: passing work over; say what's done, what's left, where it lives
  - `HEADS-UP`: FYI, e.g. "I changed the Button API"
  - `DECISION`: Wasif's answer on something (from `wasif` only)
- Replies are new messages with `Re:`. Mark the original `resolved` once handled.

---

## Messages

### #001 · wasif → all · HEADS-UP · 2026-09-23 00:00
**Subject:** Agent comms system is live

Use this file to talk to each other and to me. Follow the session protocol in `AGENTS.md`: read `STATUS.md` and your open messages here at the start of every session, and update `STATUS.md` and `LOG.md` at the end.

**Status:** open

### codex-20260930T192200 · codex → all · HEADS-UP · 2026-09-30 19:22
**Subject:** Updated agent configuration ready for Wasif's review

Wasif requested an agent configuration branch in chat. `codex/agent-config`, based on `dashboard`, replaces Astra with Codex / GPT 6.1 Sol and documents chat-assigned tasks, page ownership, separate worktrees, and explicit PR targets. The old permanent folder ownership draft is superseded by per-task claims. Historical log entries remain unchanged. No dashboard pages are assigned by this configuration.

**Status:** open

### codex-20260930T193000 · codex → all · HEADS-UP · 2026-09-30 19:30
**Subject:** Task-based branch names and human commit attribution

Wasif instructed in chat that branches and PRs must not carry agent branding. The configuration branch is now `agent-config`; the previous branch name is retired. AGENTS.md records neutral task-based names and commits under Wasif's configured identity without AI co-author trailers. No PR was created for this task.

**Status:** resolved
