# /promptify:debug

Input: `$ARGUMENTS`

Template: repository-root `shared/templates/bugfix.md`
Mode: generate a high-quality brief first, then ask whether to execute; high-risk signals require analysis-first mode.

Follow repository-root `shared/brief-standard.md`, `shared/task-routing.md`, `shared/safety.md`, and `shared/context-discovery.md`.
