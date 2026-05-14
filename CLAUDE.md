# Claude Code Instructions For Promptify

## Project Role

Promptify is a Markdown-first task orchestration package for Claude Code and Codex. It converts short developer intent into structured coding task briefs, shows the generated brief first, and asks the user whether to enter execution.

This repository is currently an MVP documentation and workflow package. Do not add a runtime service, package manager, web UI, database, telemetry, cloud sync, or MCP server unless the PRD is updated first.

## Claude Code Context

Load and reason from the repository root. The Claude Code adapter under `adapters/claude-code/` depends on repository-root shared sources under `shared/`.

Key Claude Code files:

- `adapters/claude-code/.claude-plugin/plugin.json`: Plugin metadata. `commands` and `skills` are component paths and should stay as `./commands/` and `./skills/`.
- `adapters/claude-code/commands/*.md`: Slash command wrappers for Promptify workflows.
- `adapters/claude-code/skills/promptify/SKILL.md`: Claude Code skill instructions.

Shared behavior files:

- `shared/brief-standard.md`: Generated brief fields, modes, and language rules.
- `shared/task-routing.md`: Routing cues and priority.
- `shared/safety.md`: Safety levels, high-risk signals, and confirmation behavior.
- `shared/templates/*.md`: Core workflow templates.

## Editing Rules

- Put platform-neutral behavior in `shared/`.
- Put Claude Code-specific instructions only under `adapters/claude-code/`.
- Do not duplicate shared templates into the Claude adapter unless packaging requirements explicitly force it.
- Treat all `shared/...` references in Claude adapter files as repository-root-relative paths.
- Match generated brief language to the user's input language by default while preserving technical identifiers, commands, paths, package names, and framework names.
- Preserve the current command modes:
  - `/promptify`: guided prompt-first; output the generated brief, then ask whether to enter execution.
  - `/promptify:generate`: prompt-only compatibility alias; do not edit, run commands, or ask to execute.
  - `/promptify:review`: review-only; findings first.
  - `/promptify:plan`: plan-only; do not edit code unless the user explicitly asks to continue.

## Safety Rules

- High-risk signals include deletion, migration, payment, permission, auth, security, production, mass update, rewrite, and purge.
- High-risk or destructive work must start with analysis and require explicit confirmation before edits.
- Preserve unrelated user changes.
- For review-only and plan-only flows, do not imply files were changed unless edits were explicitly requested later.

## Verification

After changing shared templates, Claude adapter files, README, or this file, run the relevant checks:

```bash
rg -n "目标：|模式：|上下文：|要求：" shared/templates
rg -n "analysis-first|prompt-only|review-only|plan-only|shared/templates" adapters/claude-code
rg -n "T[B]D|T[O]DO|implement late[r]|fill in detail[s]" shared adapters README.md AGENTS.md CLAUDE.md
python3 -m json.tool adapters/claude-code/.claude-plugin/plugin.json
git diff --check HEAD
```

The unfinished-marker scan should produce no output. If a check is not relevant to the files changed, say why in the final response.

## Git Notes

- Use a feature branch or isolated worktree for multi-step changes.
- Keep commits scoped by concern.
- Do not revert unrelated user changes.
