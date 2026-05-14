---
name: promptify
description: Convert short developer intent into a structured task brief, then guide the user into optional execution.
---

# Promptify

Use this skill when the user gives a short development intent (bug, feature, refactor, test, review, docs, plan, debug, or long-running goal) and you need to convert it into a structured brief before any code edits.

## Shared Sources

Read these sibling files relative to the skill repository root:

- `shared/brief-standard.md`
- `shared/task-routing.md`
- `shared/safety.md`
- `shared/context-discovery.md`
- `shared/templates/*.md`

## Default Behavior

1. Read `shared/task-routing.md`, `shared/safety.md`, `shared/context-discovery.md`, and `shared/brief-standard.md`.
2. Classify the user's intent.
3. Explore the smallest useful project context per `shared/context-discovery.md`.
4. Confirm task type and risk level.
5. Select the matching template from `shared/templates/`.
6. Generate a compact brief with the localized required blocks from `shared/brief-standard.md`; add assumptions or a safety gate only when needed.
7. Output the generated brief first.
8. Ask the user whether to enter execution.
9. Do not edit files or run execution commands before confirmation.
10. If confirmed and high-risk signals are present, use analysis-first mode and require confirmation before destructive edits.
11. If confirmed and no high-risk signals are present, execute the brief.
12. After execution, report changed files, behavior changes, verification result, risks, and follow-ups.

## Modes

Map the user's natural-language request to one of these modes:

- prompt-only: user asks for the brief only. Output the brief and stop.
- review-only: user asks for code review or audit. Findings first, no edits unless explicitly requested later.
- plan-only: user asks for an implementation plan or staged design. Produce the plan via `shared/templates/plan.md` and stop.
- goal: user describes a long-running task or asks for a host-ready `/goal` prompt. Produce only the goal block from `shared/templates/goal.md` and stop.
- analysis-first: enforced automatically when high-risk signals from `shared/safety.md` are present.

## Rules

- Honor `CLAUDE.md`, project memory, repository conventions, existing code style, and relevant test commands.
- Preserve unrelated user changes.
- Generate the brief in the user's input language; keep technical identifiers, commands, paths, package names, and framework names in their original form.
- Do not perform destructive edits without explicit confirmation.
- Final reports must include changed files, behavior changes, verification result, risks, and follow-ups.
