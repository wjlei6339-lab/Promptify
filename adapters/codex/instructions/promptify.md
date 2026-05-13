# Promptify Codex Fallback Instructions

Use this file when Codex cannot load a dedicated Promptify command.

## Usage

- Direct execution: `promptify: <short task>`
- Prompt-only generation: `promptify generate: <short task>`
- Review: `promptify review: <scope>`
- Plan: `promptify plan: <feature or goal>`

## Behavior

1. Read `shared/task-routing.md`, `shared/safety.md`, and `shared/brief-standard.md`.
2. Select the relevant template from `shared/templates/`.
3. Apply Codex-specific rules:
   - inspect the workspace first;
   - preserve unrelated user changes;
   - follow `AGENTS.md` and session instructions;
   - verify with relevant commands;
   - report changed files, behavior changes, verification result, risks, and follow-ups.
4. For prompt-only generation, output the brief and stop.
5. For high-risk inputs, start with analysis and request explicit confirmation before destructive edits.
