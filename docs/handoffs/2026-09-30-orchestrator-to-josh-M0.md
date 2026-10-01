# 2026-09-30: orchestrator → Josh · M0

## Done

Initialized the local TradeHQ Git repository on main. Added the Codex agent workflow, role ownership, primary-source research, product requirements, design brief, milestone plan, ADR index, task board, deterministic status renderer, repository verifier, regression checks and CI configuration.

Recorded Josh's additional direction: Lucid, Apex and Tradeify; dynamic week/month/year targets, annual side-income scenarios and one nominal $50k account versus scaling. Selected TypeScript, React, Next.js App Router, Tailwind CSS and PostgreSQL direction under delegated stack selection. Financial and scenario contracts remain proposed. No app dependency is installed.

## Look at this first

Start with [PRD](../PRD.md), [accounting and scenario examples](../research/accounting-examples.md), [design brief](../design/design-brief.md) and [ROADMAP](../../ROADMAP.md). Read [financial contract](../adr/0002-financial-contract.md) and [calculator contract](../adr/0003-scenario-calculator.md) before implementing their interfaces.

Research identifies existing competitive multi-account/prop-firm features, so the reconciliation and calculator positioning requires user testing. Policy metadata must identify exact firm product and purchase cohort; research flags ambiguous source wording rather than encoding a guessed rule.

## Deliberately unfinished

No app, working calculator, prototype, real export import, user interview, live firm integration, hosted service, release or market-demand validation. No Git remote or configured commit identity exists. Files are staged for review but not committed or pushed; no PR or origin/main merge is claimed. The workflow does not guess a Git identity or publish a repository.

M1 needs actual account products, redacted platform exports and contract decisions. No monthly pricing or commercial license has been selected. Authentication, ORM, decimal/chart libraries and hosting are deferred rather than silently installed.

## Reproduce green

From repository root, the following commands were run successfully:

```text
python tools/status/render.py
python tools/verify.py
python tools/status/render.py --check
python -m unittest discover -s tools/tests
git diff --cached --check
```

The regression suite contains ten checks. These verify repository tooling, not application financial correctness. Independent review details and any corrections are recorded in [bootstrap review](../reviews/2026-09-30-bootstrap.md). Primary-source review evidence lives in the market research source register.

## Decisions made without an ADR

The local repository name/path and main branch follow Josh's bootstrap request. Core stack selection is in accepted ADR 0001 and procedural tooling in accepted ADR 0004. Product/accounting/scenario details are proposed, not implicitly approved.

## Questions for the receiver

1. Which specific Lucid/Apex/Tradeify programs and trading platforms should provide the first redacted export samples?
2. Should the calculator initially default to net trading P&L targets or actual cash side-income goals?
3. Should the first build be a personal/private tool or a paid multi-user product?
