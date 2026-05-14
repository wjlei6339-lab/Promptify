# Claude Code Instructions For Promptify

## Project Role

Promptify is a Claude Code skill repository. The single skill at `skills/promptify/SKILL.md` converts short developer intent into a structured task brief, shows the brief first, and asks whether to enter execution.

This repository is Markdown-only. Do not add a runtime service, npm CLI, package manager, web UI, database, telemetry, cloud sync, MCP server, slash commands, or non-Claude-Code adapters.

## Claude Code Context

Load and reason from the repository root. The skill under `skills/promptify/` depends on sibling files under `shared/`.

Key files:

- `skills/promptify/SKILL.md`: The Promptify skill.
- `shared/brief-standard.md`: Generated brief fields, modes, and language rules.
- `shared/task-routing.md`: Routing cues and priority.
- `shared/safety.md`: Safety levels, high-risk signals, and confirmation behavior.
- `shared/context-discovery.md`: Minimal-context exploration rules.
- `shared/templates/*.md`: Core workflow templates (task, bugfix, feature, refactor, test, review, docs, plan, goal).

## Editing Rules

- Put platform-neutral behavior in `shared/`.
- Put skill-specific routing and behavior only in `skills/promptify/SKILL.md`.
- Treat all `shared/...` references in the skill as repository-root-relative paths; keep `skills/` and `shared/` as siblings.
- Match generated brief language to the user's input language by default while preserving technical identifiers, commands, paths, package names, and framework names.
- The `promptify` skill is the only entry point. There are no slash commands, no host abstractions, no install/update/uninstall CLIs.
- Preserve mode semantics inside the skill:
  - default prompt-first: output the brief, then ask whether to enter execution.
  - prompt-only: output the brief and stop.
  - review-only: findings first; do not edit unless explicitly requested.
  - plan-only: produce the plan and stop.
  - goal: produce only the goal block from `shared/templates/goal.md` and stop.
  - analysis-first: auto-enforced on high-risk signals.

## Safety Rules

- High-risk signals include deletion, migration, payment, permission, auth, security, production, mass update, rewrite, and purge.
- High-risk or destructive work must start with analysis and require explicit confirmation before edits.
- Preserve unrelated user changes.
- For review-only and plan-only flows, do not imply files were changed unless edits were explicitly requested later.

## Verification

After changing the SKILL.md, shared templates, README, AGENTS.md, or this file, run the relevant checks:

```bash
rg -n "目标：|模式：|上下文：|要求：" shared/templates
rg -n "analysis-first|prompt-only|review-only|plan-only|shared/templates" skills
rg -n "T[B]D|T[O]DO|implement late[r]|fill in detail[s]" shared skills README.md README.zh-CN.md AGENTS.md CLAUDE.md
git diff --check HEAD
```

The unfinished-marker scan should produce no output. If a check is not relevant to the files changed, say why in the final response.

## Git Notes

- Use a feature branch or isolated worktree for multi-step changes.
- Keep commits scoped by concern.
- Do not revert unrelated user changes.
