# /promptify:docs

Input: `$ARGUMENTS`

Template: repository-root `shared/templates/docs.md`
Mode: generate a high-quality brief first, then ask whether to execute; confirmed execution is limited to documentation unless high-risk signals require analysis-first mode.

Follow repository-root `shared/brief-standard.md`, `shared/task-routing.md`, `shared/safety.md`, and `shared/context-discovery.md`.
