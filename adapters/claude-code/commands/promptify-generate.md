# /promptify:generate

Compatibility alias for users who still call `/promptify:generate`.
Convert the user's short task into a polished Promptify brief. Do not execute it.

Input: `$ARGUMENTS`

Rules:

- Do not edit files.
- Do not run commands.
- Do not continue into implementation.
- Do not ask whether to enter execution; `/promptify <short task>` is the guided prompt-first command for that flow.
- Use `shared/context-discovery.md` to describe what context the future executor
  should inspect; only perform read-only discovery if the host explicitly allows
  it for prompt generation.
- Output only the compact generated brief.
- Include the localized required blocks from `shared/brief-standard.md`; add assumptions or a safety gate only when needed.
- Keep verification, scope boundaries, and final reporting expectations inside the requirements block.
