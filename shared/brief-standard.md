# Promptify Brief Standard

Promptify briefs are compact by default. Stronger host models need clear intent,
context, constraints, and verification expectations; they do not need a verbose
form when the same information can be carried in fewer lines.

Every generated Promptify brief must include these core blocks unless a selected
task type explicitly removes one:

| Block | Required | Purpose |
|---|---|---|
| 目标 | Yes | Restate the intended outcome in concrete terms. |
| 假设 | Conditional | Include only when input is vague or task type detection is uncertain. |
| 模式 | Yes | State direct execution, prompt-only, analysis-first, review-only, or plan-only. |
| 上下文 | Yes | Tell the host assistant what local context to inspect first. |
| 要求 | Yes | Combine execution order, boundaries, acceptance, verification, and final report expectations. |
| 安全门禁 | Conditional | Include only for high-risk signals or destructive actions. |

## Compression Rules

- Prefer 4 compact blocks: `目标`, `模式`, `上下文`, and `要求`.
- Add `假设` only when it prevents ambiguity.
- Add `安全门禁` only when the input includes high-risk signals.
- Keep sentences short and task-specific.
- Avoid repeating generic host-agent rules unless they affect the selected task.
- Preserve technical identifiers, file paths, commands, package names, and framework names exactly.
- Keep professional boundaries: scope limits, verification, and final reporting must remain present, even when merged into `要求`.

## Generation Flow

Before filling a generated brief:
- Read `shared/context-discovery.md`.
- Parse the original user input and identify likely task type candidates.
- Explore the smallest useful project context allowed by the selected mode.
- Confirm task type and risk level after discovery.
- Fill the selected compact template with project-specific context, boundaries,
  verification, and reporting expectations.

## Mode Rules

Direct execution mode:
- Treat the generated brief as the active instruction for the current session.
- Inspect the workspace before editing.
- Preserve unrelated user changes.
- Plan briefly before edits.
- Verify with the most relevant available command.
- Report changed files, behavior changes, verification results, risks, and follow-ups.

Prompt-only mode:
- Output only the generated brief.
- Do not read files, run commands, edit files, or continue into execution.
- Include verification and safety expectations for the future executor.

Analysis-first mode:
- Inspect relevant context and identify impact.
- Do not perform high-risk or destructive edits before explicit confirmation.
- Report affected files, modules, likely blast radius, and a proposed safe plan.

Review-only mode:
- Use a code-review stance.
- Lead with findings.
- Prioritize bugs, regressions, security risks, and missing tests.
- Keep summaries secondary.

Plan-only mode:
- Investigate relevant code and constraints when allowed by the host.
- Produce a staged implementation plan.
- Do not edit code unless the user explicitly asks to continue.

## Language Rules
- Default output language is Chinese.
- If the user's task is mostly English, English output is allowed unless local instructions prefer Chinese.
- Keep technical identifiers, commands, file paths, package names, and framework names unchanged.
