# /promptify

Convert the user's short task into a Promptify execution brief and proceed directly when safe.

Input: `$ARGUMENTS`

Workflow:

1. Read the repository-root files `shared/task-routing.md`, `shared/safety.md`, `shared/context-discovery.md`, and `shared/brief-standard.md`.
2. Classify `$ARGUMENTS`.
3. Explore the smallest useful project context allowed by the selected mode.
4. Confirm the task type and risk level after discovery.
5. Select the matching repository-root file from `shared/templates/`.
6. Generate a compact brief with `目标`, `模式`, `上下文`, and `要求`; add `假设` or `安全门禁` only when needed.
7. If high-risk signals are present, use analysis-first mode and ask for confirmation before high-risk edits.
8. Otherwise, treat the generated brief as the active instruction and execute it.
9. Report changed files, behavior changes, verification result, risks, and follow-ups.
