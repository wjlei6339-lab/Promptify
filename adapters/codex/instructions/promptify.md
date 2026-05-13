# Promptify Codex Fallback Instructions

Use this file when Codex cannot load a dedicated Promptify command.

## Usage

- Direct execution: `promptify: <short task>`
- Prompt-only generation: `promptify generate: <short task>`
- Review: `promptify review: <scope>`
- Plan: `promptify plan: <feature or goal>`

## Behavior

1. Read the repository-root shared files: `shared/task-routing.md`, `shared/safety.md`, `shared/context-discovery.md`, and `shared/brief-standard.md`.
2. Classify the input, then explore the smallest useful project context allowed by the selected mode.
3. Confirm task type and risk level after discovery.
4. Select the relevant template from `shared/templates/`.
5. Apply Codex-specific rules:
   - inspect the workspace first;
   - preserve unrelated user changes;
   - follow `AGENTS.md` and session instructions;
   - verify with relevant commands;
6. Generate compact briefs by default: include `目标`, `模式`, `上下文`, and `要求`; add `假设` or `安全门禁` only when needed.
7. Editing/direct execution modes must report changed files, behavior changes, verification result, risks, and follow-ups.
8. Prompt-only mode must output only the compact generated brief and stop.
9. Review-only mode must lead with findings, include file/line references where possible, and omit a changed-file summary unless edits were explicitly requested later.
10. Plan-only mode must report the staged plan, risks, tests, and rollout notes, and omit a changed-file summary unless edits were explicitly requested later.
11. For high-risk inputs, start with analysis and request explicit confirmation before destructive edits.
