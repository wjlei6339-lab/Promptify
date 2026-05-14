# /promptify

Convert the user's short task into a Promptify brief, show it to the user, and ask whether to execute it.

Input: `$ARGUMENTS`

Workflow:

1. Read the repository-root files `shared/task-routing.md`, `shared/safety.md`, `shared/context-discovery.md`, and `shared/brief-standard.md`.
2. Classify `$ARGUMENTS`.
3. Explore the smallest useful project context allowed by the selected mode.
4. Confirm the task type and risk level after discovery.
5. Select the matching repository-root file from `shared/templates/`.
6. Generate a compact brief with the localized required blocks from `shared/brief-standard.md`; add assumptions or a safety gate only when needed.
7. Output the generated brief first.
8. Ask whether the user wants to enter the execution stage.
9. Do not edit files or run execution commands before the user confirms.
10. If the user confirms and high-risk signals are present, use analysis-first mode and ask for confirmation before high-risk edits.
11. If the user confirms and no high-risk signals are present, treat the generated brief as the active instruction and execute it.
12. After execution, report changed files, behavior changes, verification result, risks, and follow-ups.
