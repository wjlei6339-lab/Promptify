---
name: promptify
description: Convert short developer intent into structured Claude Code task workflows with direct execution as the default.
---

# Promptify for Claude Code

Use Promptify when the user invokes `/promptify` commands or asks to convert a short development intent into an executable task brief.

## Shared Sources

Consult these repository-root shared files:

- `shared/brief-standard.md`
- `shared/task-routing.md`
- `shared/safety.md`
- `shared/context-discovery.md`
- `shared/templates/*.md`

## Claude Code Rules

- Honor `CLAUDE.md`, project memory, repository conventions, existing code style, and relevant test commands.
- Preserve unrelated user changes.
- Explore the smallest useful project context before filling generated briefs.
- Generate compact briefs by default: include `目标`, `模式`, `上下文`, and `要求`; add `假设` or `安全门禁` only when needed.
- Default `/promptify` to direct execution.
- Keep `/promptify:generate` prompt-only.
- Use analysis-first mode for high-risk signals.
- Do not perform destructive edits without explicit confirmation.
- Final reports must include changed files, behavior changes, verification result, risks, and follow-ups.
