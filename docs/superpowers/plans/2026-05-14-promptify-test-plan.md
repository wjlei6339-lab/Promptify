# Promptify Test Execution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:verification-before-completion` before reporting this plan as executed. This file is a test plan, not an implementation plan; do not edit product code while following it unless a separate task explicitly asks for a fix.

**Goal:** Verify that Promptify remains a Markdown-first workflow package for Claude Code and Codex, and that its local NPM CLI safely installs, updates, uninstalls, packages, and diagnoses installed resources.

**Architecture:** Cover the project at three levels: static Markdown and adapter contract checks, automated Node.js unit/integration tests, and temporary-HOME CLI smoke tests. Use the existing `shared/test-plan.md` as the canonical checklist source and this file as the concrete execution plan for the current repository.

**Tech Stack:** Node.js ESM, `node:test`, NPM packaging, `rg`, `python3 -m json.tool`, temporary HOME directories, Markdown assets.

---

## Goal Template

一句话描述目标：为当前 Promptify 项目建立一份可执行、可复验、不会污染真实用户配置的测试计划，覆盖共享 Markdown 规则、Claude Code/Codex adapter、NPM CLI 安装生命周期、文档一致性和发布前检查。

Scope：只覆盖当前仓库内的测试计划与验证流程：`shared/`、`adapters/`、`lib/`、`bin/`、`test/`、`README.md`、`AGENTS.md`、`CLAUDE.md`、`docs/release/`、`package.json`。不要引入 web UI、runtime service、database、telemetry、cloud sync、MCP indexer，也不要修改真实 `~/.claude/CLAUDE.md` 或 `~/.codex/AGENTS.md`。

Constraints:
- 所有安装、更新、卸载、doctor smoke tests 必须使用临时 HOME，例如 `PROMPTIFY_SMOKE_HOME="$(mktemp -d)"`，禁止直接写入真实用户 HOME 下的 Claude Code 或 Codex 配置。
- 测试计划必须能映射到当前仓库已有命令和文件；不能使用未定义脚本、外部服务、网络依赖或真实全局 NPM 安装作为必需步骤。
- Promptify 的产品边界必须保持 Markdown-first；测试不得要求新增 runtime service、web UI、database、telemetry、cloud sync 或 MCP indexer。
- 对高风险或 destructive 行为的验证只能验证 Promptify 的 analysis-first/confirmation 规则是否存在并被 adapter 引用，不能真实执行破坏性操作。

Done when:
1. `docs/superpowers/plans/2026-05-14-promptify-test-plan.md` 存在，并包含目标、范围、约束、停止条件、测试矩阵、执行命令、验收证据和最终报告格式。
2. 执行者可以按本文运行 `npm test`、`npm pack --dry-run`、`node bin/promptify.js version`、静态 `rg` 扫描、`python3 -m json.tool adapters/claude-code/.claude-plugin/plugin.json`、`git diff --check HEAD` 和临时 HOME CLI smoke tests。
3. 测试结果能够明确区分已验证项、跳过项、失败项、剩余风险，并能追溯到具体命令或文件。

Stop if:
- 需要访问网络、发布真实 NPM 包、安装全局包、修改真实 HOME 配置，或要求执行真实 destructive 操作。
- 发现当前仓库实际结构与计划引用的关键路径不一致，例如 `package.json`、`bin/promptify.js`、`shared/templates/`、`adapters/` 或 `test/` 缺失。
- `npm test` 或 CLI smoke test 暴露产品缺陷；停止后先记录失败命令、失败输出摘要和受影响文件，再进入单独修复任务。

## Test Matrix

| Area | Files | Primary Checks | Required Evidence |
|---|---|---|---|
| Shared brief rules | `shared/brief-standard.md`, `shared/context-discovery.md`, `shared/task-routing.md`, `shared/safety.md` | compact block labels, mode names, context discovery references, high-risk confirmation rules | static review plus `rg` scans |
| Shared templates | `shared/templates/*.md` | every template keeps `目标：`、`模式：`、`上下文：`、`要求：`; task-specific boundaries and validation remain concrete | `rg -n "目标：|模式：|上下文：|要求：" shared/templates` |
| Claude Code adapter | `adapters/claude-code/**` | command modes remain direct/prompt-only/review-only/plan-only; adapter references repository-root `shared/...`; plugin metadata is valid JSON | adapter scan plus `python3 -m json.tool adapters/claude-code/.claude-plugin/plugin.json` |
| Codex adapter | `adapters/codex/**` | skill and fallback instructions reference `shared/`; mode behavior and safety gates match shared rules | adapter scan and manual review |
| NPM CLI | `bin/`, `lib/`, `test/`, `package.json` | argument parsing, version, install, update, uninstall, doctor, safe managed block writes, resource copy behavior | `npm test`, temporary HOME smoke tests |
| Packaging | `package.json`, package allowlist | package includes CLI, libraries, shared assets, adapters, README, release docs only | `npm pack --dry-run` output review |
| Docs | `README.md`, `AGENTS.md`, `CLAUDE.md`, `docs/release/` | documented commands match current behavior; limitations stay explicit; doctor documented after install | manual review plus unfinished-marker scan |

## Execution Plan

### 1. Preflight

- [ ] Confirm repository root:

```bash
pwd
```

Expected: `/Users/blingabc/PycharmProjects/promptify` or the active Promptify repository root.

- [ ] Confirm working tree state before testing:

```bash
git status --short
```

Expected: only intentional changes are present. Do not revert unrelated user changes.

- [ ] Confirm Node.js is available and satisfies `package.json`:

```bash
node --version
```

Expected: Node.js `v18.0.0` or newer.

### 2. Automated Test Suite

- [ ] Run all Node.js tests:

```bash
npm test
```

Expected: all `node:test` tests pass. This covers current tests in `test/cli-version.test.js`, `test/install.test.js`, `test/update-uninstall.test.js`, `test/doctor.test.js`, `test/fs-safe.test.js`, `test/hosts.test.js`, and `test/paths.test.js`.

- [ ] If a narrow failure needs isolation, rerun the affected file:

```bash
node --test test/install.test.js
node --test test/update-uninstall.test.js
node --test test/doctor.test.js
```

Expected: the targeted file either passes or produces a reproducible failure that can be filed with command output and affected assertion.

### 3. CLI Smoke Tests With Temporary HOME

- [ ] Verify version command:

```bash
node bin/promptify.js version
```

Expected: prints `promptify 0.1.0` or the current `package.json` version.

- [ ] Run install, doctor, update, and uninstall in an isolated HOME:

```bash
PROMPTIFY_SMOKE_HOME="$(mktemp -d)"
HOME="$PROMPTIFY_SMOKE_HOME" node bin/promptify.js install --host=claude-code,codex
HOME="$PROMPTIFY_SMOKE_HOME" node bin/promptify.js doctor
HOME="$PROMPTIFY_SMOKE_HOME" node bin/promptify.js update
HOME="$PROMPTIFY_SMOKE_HOME" node bin/promptify.js uninstall --host=claude-code,codex
```

Expected:
- install reports both hosts installed and creates Promptify-managed blocks under the temporary HOME only.
- doctor reports `OK` checks after install.
- update reports completion and reruns doctor.
- uninstall removes managed blocks for both hosts while preserving surrounding config content.

- [ ] Inspect smoke HOME if a failure occurs:

```bash
find "$PROMPTIFY_SMOKE_HOME" -maxdepth 4 -type f | sort
```

Expected: only temporary smoke-test files are inspected. Do not copy or modify real HOME config files.

### 4. Static Contract Checks

- [ ] Confirm every shared template retains compact core labels:

```bash
rg -n "目标：|模式：|上下文：|要求：" shared/templates
```

Expected: relevant matches in every file under `shared/templates/`.

- [ ] Confirm adapters preserve execution mode names and shared template references:

```bash
rg -n "analysis-first|prompt-only|review-only|plan-only|shared/templates" adapters
```

Expected: relevant matches in Claude Code and Codex adapter files.

- [ ] Confirm unfinished markers are not present in user-facing assets:

```bash
rg -n "T[B]D|T[O]DO|implement late[r]|fill in detail[s]" shared adapters README.md AGENTS.md CLAUDE.md docs/release
```

Expected: no output. If output appears, inspect whether it is intentional quoted guidance; otherwise fix or file a docs cleanup task.

- [ ] Validate Claude Code plugin JSON:

```bash
python3 -m json.tool adapters/claude-code/.claude-plugin/plugin.json
```

Expected: valid formatted JSON output and exit code 0.

- [ ] Check whitespace in current diff:

```bash
git diff --check HEAD
```

Expected: no output.

### 5. Packaging Check

- [ ] Run NPM dry-run packaging:

```bash
npm pack --dry-run
```

Expected: package contents include `bin/`, `lib/`, `shared/`, `adapters/`, `README.md`, and `docs/release/`; package contents do not imply a runtime service, web UI, database, telemetry, cloud sync, or MCP indexer.

If this fails only because the local `~/.npm` cache is not writable, do not change user-owned cache permissions as part of this plan. Re-run the packaging check with an isolated cache and record both results:

```bash
npm --cache "$(mktemp -d)" pack --dry-run
```

Expected: the isolated-cache command exits 0 and prints the same package file list shape. Treat the original cache failure as an environment issue, not a project failure.

### 6. Manual Review

- [ ] Review the final diff:

```bash
git diff -- README.md AGENTS.md CLAUDE.md shared adapters lib bin test docs package.json
```

Expected:
- shared behavior remains under `shared/`.
- Claude Code-specific behavior remains under `adapters/claude-code/`.
- Codex-specific behavior remains under `adapters/codex/`.
- CLI code remains limited to install, update, uninstall, doctor, version, resource copy, and safe config block management.
- docs continue to say Promptify has no runtime service, web UI, database, telemetry, cloud sync, or MCP indexer.
- Chinese-first output rules remain intact.

## Change-Type Selection

Use the smallest relevant subset:

- Shared template/rule only: run sections 1, 4, and 6.
- Adapter only: run sections 1, 4, and 6; include plugin JSON validation when Claude Code metadata changed.
- NPM CLI or package metadata: run sections 1, 2, 3, 5, and 6.
- README, AGENTS, CLAUDE, or release docs: run sections 1, unfinished-marker scan from section 4, and section 6.
- Release candidate: run every section.

## Failure Handling

For every failed check, record:

```text
Command:
Observed:
Expected:
Likely area:
Next action:
```

Do not mark the run complete until every failed required check either passes after a fix or is explicitly documented as skipped with a concrete reason.

## Final Report Format

```text
Changed files:
- List every changed path, one per line.

Verified:
- `npm test` — pass/fail/skip with reason
- `npm pack --dry-run` — pass/fail/skip with reason
- `node bin/promptify.js version` — pass/fail/skip with reason
- static scans — pass/fail/skip with reason
- temporary HOME CLI smoke tests — pass/fail/skip with reason
- `git diff --check HEAD` — pass/fail/skip with reason

Unverified:
- List checks not run, each with a concrete reason.

Remaining risk:
- List known residual risks, or write "None identified after the checks above."
```
