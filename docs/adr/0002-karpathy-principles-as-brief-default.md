# ADR 0002: Karpathy-Inspired Principles as Brief Default

## Status

Accepted.

## Context

Promptify generates a compact brief from short developer intent. The brief tells the future executor what to do, what to inspect, and how to verify. Across templates, recurring constraints already exist in scattered form: "do not expand requirements", "do not refactor unrelated modules", "reproduce before fixing", "verify with relevant commands".

[Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls name four failure modes that map directly to these scattered constraints:

- silent assumptions and missing pushback,
- bloated abstractions and overengineering,
- drive-by edits to code orthogonal to the task,
- vague success criteria that prevent self-verification.

The [andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) repository compresses these into four principles: Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution. The principles are dense, observable, and aligned with what Promptify already implies but never names.

Promptify lacked a single source where these principles live. Without one, future template edits drift, and generated briefs vary in how strongly they push back against the four failure modes.

## Decision

Adopt the four principles as the default behavior contract for every generated brief, located at `skills/promptify/shared/principles.md`.

- `shared/principles.md` defines the principles, where each lands in the brief blocks, and the observable signals.
- `SKILL.md` lists `shared/principles.md` in Shared Sources, reads it during default behavior, and requires every generated brief to reflect the four principles.
- `shared/glossary.md` registers the four principle names as canonical terminology so templates and docs use one vocabulary.

Scope limits:

- The principles do not add new brief blocks. They shape how existing `goal`, `assumptions`, `context`, `requirements`, and `safety gate` blocks are filled.
- The principles do not add new modes. Existing modes (prompt-first, prompt-only, review-only, plan-only, prd-only, goal, analysis-first) keep their semantics.
- Templates may converge their wording on principle terminology in a later, separate change. This ADR does not require template rewrites.
- No host adapter, root-level `CLAUDE.md` injection, Cursor rule, or multi-platform distribution is adopted. See ADR-0001.

## Consequences

Briefs now have a single, named contract that targets known LLM failure modes. Maintainers editing templates can check whether a change preserves the four principles instead of relying on memory or scattered phrases.

Tradeoff: this biases Promptify toward clarity-before-action over speed. For trivial intent (typo, single-line tweak), the executor still uses judgment; for non-trivial work the brief carries stronger discipline, which can feel slower at the start of a task and pays back during verification.

Future template or mode changes that weaken any of the four principles must explain why in the relevant change record and, if durable, in a new ADR. Future proposals to distribute the principles outside the Promptify skill (root `CLAUDE.md`, Cursor rule, plugin manifest, etc.) remain out of scope under ADR-0001.
