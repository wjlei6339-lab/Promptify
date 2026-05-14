# Promptify

Promptify 是一个 Claude Code skill，把简短的开发意图转换成结构化、上下文感知的任务 brief，并在生成 brief 之后再决定是否进入执行。

## 它是什么

- 一个 Claude Code skill 包：`skills/promptify/SKILL.md`。
- 一组 Markdown 共享规则与模板：`shared/`。
- 覆盖 bugfix、feature、refactor、test、review、docs、planning、long-running goal 等常见开发任务。

## 行为

- 把短意图分类后，按 `shared/task-routing.md` 路由到合适的模板。
- 先按 `shared/context-discovery.md` 探索最小必要项目上下文，再生成紧凑 brief。
- brief 生成语言跟随用户输入：中文输入生成中文，英文输入生成英文；技术标识、命令、路径保留原文。
- 高风险输入（deletion、migration、payment、permission、auth、security、production、mass update、rewrite、purge 等）进入 analysis-first 模式，destructive edits 前必须明确确认。
- 默认 prompt-first：先输出 brief，再询问是否执行。用户可以在请求里显式声明 `prompt-only`、`review-only`、`plan-only` 或 `goal` 模式。

## 目录结构

```text
promptify/
  README.md
  README.zh-CN.md
  AGENTS.md
  CLAUDE.md
  shared/
    brief-standard.md
    context-discovery.md
    safety.md
    task-routing.md
    test-plan.md
    templates/
      bugfix.md
      docs.md
      feature.md
      goal.md
      plan.md
      refactor.md
      review.md
      task.md
      test.md
  skills/
    promptify/
      SKILL.md
```

`skills/promptify/SKILL.md` 引用同级仓库下的 `shared/` 资源。整库需要保持完整目录结构。

## 安装

Promptify 以仓库形态分发，没有 npm 包、安装器或自动注册。把仓库放到 Claude Code 能识别 skill 的位置即可。

推荐：把仓库 clone 到一个稳定位置，然后让 Claude Code 加载它的 `skills/`。例如：

```bash
git clone <repo-url> ~/promptify
ln -s ~/promptify/skills/promptify ~/.claude/skills/promptify
```

或者把整个仓库直接放在项目里作为项目级 skill。无论哪种方式，请保持 `skills/` 与 `shared/` 同级。

## 使用

在 Claude Code 中描述你的开发意图，并要求使用 `promptify` skill 处理。例如：

```text
用 promptify 处理：修复登录失败提示
promptify：当前改动 review 一下
promptify：支持团队模板覆盖的实现计划
promptify：把 docs/superpowers/plans/2026-05-13-promptify-mvp.md 跑成 long-running goal
```

skill 会先生成紧凑 brief，再询问是否执行。

## 支持的任务类型

| 任务 | 模板 |
|---|---|
| 通用任务 | `shared/templates/task.md` |
| Bugfix / debug | `shared/templates/bugfix.md` |
| Feature | `shared/templates/feature.md` |
| Refactor | `shared/templates/refactor.md` |
| Test | `shared/templates/test.md` |
| Review | `shared/templates/review.md` |
| Docs | `shared/templates/docs.md` |
| Plan | `shared/templates/plan.md` |
| Goal prompt | `shared/templates/goal.md` |

## 安全规则

详见 `shared/safety.md`。高风险任务（deletion、migration、payment、permission、auth、security、production、mass update、rewrite、purge）会先进入 analysis-first 模式，destructive edits 前必须显式确认。

## Manual QA

修改 shared 模板或 SKILL.md 后，至少运行：

```bash
rg -n "目标：|模式：|上下文：|要求：" shared/templates
rg -n "analysis-first|prompt-only|review-only|plan-only|shared/templates" skills
rg -n "T[B]D|T[O]DO|implement late[r]|fill in detail[s]" shared skills README.md README.zh-CN.md AGENTS.md CLAUDE.md
git diff --check HEAD
```

第一条应能在每个模板里找到紧凑核心块。第二条应能找到 mode 名称和 shared template 引用。第三条应无输出。

## 限制

- 没有 npm CLI、安装器、宿主自动注册。
- 没有 Codex 适配器；本仓库只面向 Claude Code skill。
- 没有 web UI、hosted service、cloud sync、telemetry、MCP indexer。
- 执行阶段能力取决于 Claude Code 自身，并默认需要用户在 brief 生成后确认。
