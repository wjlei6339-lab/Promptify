# Promptify Agent Instructions

## Project Overview

Promptify is a Claude Code skill repository. It contains:

- A single skill at `skills/promptify/SKILL.md` that converts short developer intent into a structured task brief.
- A set of Markdown shared rules and templates under `shared/`.

The repository must not contain a runtime service, web UI, database, telemetry, MCP server, npm CLI, or any non-Claude-Code adapter.

## Repository Map

- `skills/promptify/SKILL.md`: The Promptify skill instructions. References sibling `shared/` files.
- `shared/brief-standard.md`: Compact brief blocks, guided prompt-first behavior, execution modes, language rules.
- `shared/task-routing.md`: Task type cues, routing priority, examples.
- `shared/safety.md`: High-risk signals, safety levels, confirmation behavior.
- `shared/context-discovery.md`: Minimal-context exploration rules.
- `shared/test-plan.md`: Manual QA checklist source.
- `shared/templates/*.md`: Templates for task, bugfix, feature, refactor, test, review, docs, plan, goal.
- `README.md`, `README.zh-CN.md`: User-facing installation, usage, safety, QA, limitations.

## Editing Guidelines

- Keep the product Markdown-first. Do not reintroduce executable runtime code, host abstractions, install/uninstall CLIs, or multi-platform adapters.
- Put platform-neutral rules in `shared/`. Put skill-specific routing and behavior in `skills/promptify/SKILL.md`.
- Skill references to `shared/...` are repository-root-relative; keep `skills/` and `shared/` as siblings.
- Match generated brief language to the user's input language while preserving technical identifiers in their original form.
- Treat the `promptify` skill as the only entry point. There are no slash commands.

## Safety And Scope

- Do not add web UI, hosted service, cloud sync, telemetry, external database, or MCP indexing.
- Do not add a Codex adapter, an npm package, or a CLI installer.
- High-risk signals: deletion, migration, payment, permission, auth, security, production, mass update, rewrite, purge.
- High-risk or destructive work must start with analysis and require explicit confirmation before edits.
- For review-only and plan-only modes, do not imply files were changed unless edits were explicitly requested later.

## Verification

After changing shared templates, the SKILL.md, or any of the markdown docs:

```bash
rg -n "目标：|模式：|上下文：|要求：" shared/templates
rg -n "analysis-first|prompt-only|review-only|plan-only|shared/templates" skills
rg -n "T[B]D|T[O]DO|implement late[r]|fill in detail[s]" shared skills README.md README.zh-CN.md AGENTS.md CLAUDE.md
git diff --check HEAD
```

The core-block scan should find the compact required blocks in each template. The skill scan should find mode names and shared template references. The unfinished-marker scan should produce no output. If a check is not relevant to the files you changed, state why in the final report.

## Git Notes

- Work on a feature branch or isolated worktree for multi-step changes.
- Keep commits scoped by concern.
- Do not revert unrelated user changes.
