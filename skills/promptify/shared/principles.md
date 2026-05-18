# Promptify Brief Principles

Every Promptify-generated brief is also a behavior contract for the future executor. These four principles are the default contract. They target well-known LLM coding failure modes: silent assumptions, bloated abstractions, drive-by edits, and vague goals.

**Tradeoff:** Promptify biases toward clarity-before-action over speed. For trivial intent (a typo fix, a single-line tweak), use judgment; for non-trivial work the four principles must shape the brief.

The principles do not add new brief blocks. They tell the brief author how to fill the existing blocks from `shared/brief-standard.md`.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State assumptions explicitly when input is vague; do not pick one interpretation silently.
- If multiple interpretations exist, present them in the brief or ask one focused clarification question.
- If a simpler approach exists, surface it in the goal or requirements block.
- If something is unclear, stop and name what is confusing instead of guessing.

Where it lands in the brief:
- `目标` / `Goal`: concrete restatement, not generic restatement of input.
- `假设` / `Assumptions`: include only when ambiguity remains after discovery.
- `要求` / `Requirements`: at most one focused clarification question when intent is missing.

Self-check: Would a senior engineer reading this brief know what was assumed and what was confirmed?

## 2. Simplicity First

**Minimum scope that solves the stated problem. Nothing speculative.**

- No requirements beyond what the user asked.
- No abstractions, configuration, or "flexibility" that were not requested.
- No error handling for impossible scenarios.
- Prefer the smallest verified change over a larger refactor.

Where it lands in the brief:
- `要求` / `Requirements`: explicit scope limits ("不扩大需求", "不引入无关依赖", "不重写无关架构").
- `上下文` / `Context`: minimum set of files and signals that justify the scope.

Self-check: Would a senior engineer say this brief is overcomplicated for the stated goal? If yes, narrow the scope.

## 3. Surgical Changes

**Touch only what the goal requires. Clean up only orphans your change created.**

- Do not "improve" adjacent code, comments, formatting, or style.
- Do not refactor code that is not broken.
- Match existing style, even if the executor would do it differently.
- If unrelated dead code appears, mention it in the final report; do not delete it.
- Remove imports, variables, or functions that this change orphaned. Do not remove pre-existing dead code unless asked.

Where it lands in the brief:
- `要求` / `Requirements`: "保持改动最小", "不改无关模块", "不引入风格漂移".
- Final report: "changed files" must trace each touched line back to the stated goal.

Self-check: Does every changed line trace directly to the user's request?

## 4. Goal-Driven Verification

**Transform imperative tasks into verifiable goals. Loop until verified.**

- Convert "fix X" into "write a test that reproduces X, then make it pass".
- Convert "add Y" into "define the inputs and outputs Y must produce, then verify them".
- Convert "refactor Z" into "tests pass before and after; behavior unchanged".
- Multi-step work states each step's verification, not only the final result.

Where it lands in the brief:
- `目标` / `Goal`: a verifiable outcome, not an imperative verb.
- `要求` / `Requirements`: the verification command, test, or check that proves the goal was met; explicit fallback when no command can run.
- Final report: must state what was verified and how.

Self-check: After execution, could an outside reader reproduce the verification from the brief alone?

## How Principles Interact With Modes

- **prompt-only / plan-only / prd-only / goal**: principles still shape the brief content. The future executor reads them via the brief, not via this file.
- **review-only**: principles 2 and 3 inform what counts as a real finding; principle 4 informs what verification gap to flag.
- **analysis-first**: principles 1 and 4 are mandatory; the brief must name assumptions, blast radius, and verification before any high-risk edit.
- **execution-after-confirmation**: all four principles apply during edits and final reporting.

## Observable Signals

The principles are working when:
- diffs contain only lines that trace to the requested change;
- clarification questions arrive before implementation, not after;
- briefs name a concrete verification, not "make it work";
- reports state assumptions, changed files, verification, risks, and follow-ups without prompting.
