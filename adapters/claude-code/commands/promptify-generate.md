# /promptify:generate

Convert the user's short task into a polished Promptify brief. Do not execute it.

Input: `$ARGUMENTS`

Rules:

- Do not edit files.
- Do not run commands.
- Do not continue into implementation.
- Use `shared/context-discovery.md` to describe what context the future executor
  should inspect; only perform read-only discovery if the host explicitly allows
  it for prompt generation.
- Output only the compact generated brief.
- Include `目标`, `模式`, `上下文`, and `要求`; add `假设` or `安全门禁` only when needed.
- Keep verification, scope boundaries, and final reporting expectations inside `要求`.
