# TradeHQ bootstrap independent review

Date: 2026-09-30 (America/Chicago).

Owner: Codex independent reviewer, separate from bootstrap and product authors.

State: approve for local documentation/tooling bootstrap after the corrections below. This is not acceptance of the proposed financial/scenario contracts or approval of a runnable product.

Branch / PR: local `main`, no commits or remote configured at review time; no PR. Repository contents reviewed from the shared working tree, not a named commit.

## Scope

Reviewed repository instructions, architecture, product requirements, plan/roadmap, ADRs 0001–0004, glossary, research, accounting examples, design brief, board and workflow procedures. Independently inspected status/link verification scripts, regression tests, Make wrapper and CI. No application code, imported private data, interviews, prototype or hosted service exists.

## Sources

Internal: [instructions](../../AGENTS.md), [plan](../PLAN.md), [roadmap](../../ROADMAP.md), [PRD](../PRD.md), [scenario contract](../adr/0003-scenario-calculator.md), [accounting examples](../research/accounting-examples.md), [research register](../research/market-research.md), [design brief](../design/design-brief.md), [test matrix](../testing/test-matrix.md), actual board and tooling files.

Primary pages independently opened on 2026-09-30:

- [TradeZella prop-firm page](https://www.tradezella.com/solutions/prop-firm-traders): advertised multi-account journal and cost/payout features support treating the proposed differentiation as a hypothesis.
- [Tradervue support matrix](https://app.tradervue.com/help/brokers) and [TraderSync journal](https://tradersync.com/trading-journal/): vendor documentation supports the import/analytics category observations; no authenticated feature quality testing occurred.
- [LucidFlex payouts](https://support.lucidtrading.com/en/articles/12945796-lucidflex-payouts): share, qualifying-day and request constraints support program-specific cash modeling.
- [Apex Intraday payouts](https://apextraderfunding.com/help-center/uncategorized/intraday-trailing-drawdown-payouts/), [EOD PA](https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-performance-accounts-pa/) and [consistency article](https://apextraderfunding.com/help-center/additional-helpful-items/50-consistency-requirement/): the documented equality inconsistency is real and remains unresolved for implementation.
- [Tradeify Select policies](https://help.tradeify.co/en/articles/12853966-select-flex-and-select-daily-payout-policies) and [consistency rule](https://help.tradeify.co/en/articles/10468320-rules-consistency-rule): program and purchase-cohort differences support dated policies rather than universal firm presets.
- [Topstep account parameters](https://help.topstep.com/en/articles/8284215-express-funded-account-parameters), [payout policy](https://help.topstep.com/en/articles/8284233-topstep-payout-policy), [TopstepX](https://help.topstep.com/en/articles/14434175-topstepx), [FTMO objectives](https://ftmo.com/en/trading-objectives/) and [TradeZella broker support](https://www.tradezella.com/brokersupport): supplemental lifecycle/export/rule sources. A published export procedure establishes neither a tested file schema nor TradeHQ integration support.

TraderSync broker-support availability was not independently established; research preserves the author's direct-fetch failure. External page observations can change and are not firm approval, market demand or live import validation.

## Findings

| Severity | Finding | Applied correction |
| --- | --- | --- |
| Medium, resolved | Initial ROADMAP used different M1–M3 scopes from PLAN and omitted M4. | Root aligned the dependency sequence to M1 definition/validation, M2 reconciliation/imports, M3 polished MVP, M4 release. |
| Medium, resolved | Proposed scenario ADR omitted explicit integer account count, share bounds and day-fraction normalization. | Root added integer account constraints, fractions in `[0,1]` summing to one, `0 < S ≤ 1`, and explicit zero-share infeasibility/zero-goal behavior. |
| Medium, resolved | First verification detected a missing board-referenced accounting-examples document. | Product author supplied the examples; final verification passes. |
| Informational | Payout-rule equality and purchase-cohort ambiguity can change a cash result. | Research records the Apex discrepancy and requires exact reviewed policy before implementation. No automatic eligibility is asserted. |
| Informational | Whitespace checking unstaged new files gives incomplete coverage. | Root staged bootstrap files; reviewer observed `git diff --cached --check` pass. No commit/remote success is claimed. |

No unresolved change request remains for the bootstrap scope. Accepted core-stack/tooling ADRs are distinguished from proposed financial/scenario ADRs. Research does not claim competitors lack the proposed features. Visual direction uses the supplied palette, explicit financial hierarchy and planned accessibility checks; rendered design/usability conformance remains untested.

## Checks

Observed from repository root after product documents and corrections stabilized:

- `python tools/verify.py`: passed local Markdown targets/anchors, board schema/dependencies/references and generated-status consistency.
- `python tools/status/render.py --check`: passed.
- `python -m unittest discover -s tools/tests`: 10 tests passed, covering invalid board fields/states/dependencies, cycles, completed dependency gates, missing references/anchors, repository escapes, matrix references and drift.
- `git diff --cached --check` and `git diff --check`: passed. CI configuration was inspected; no remote CI execution occurred.

Independently reconciled the synthetic arithmetic: PRD copied-trade example gives `$285` trading result and `$30` cash outcome; FIN-01 gives `$940` trading result and `$260` cash outcome; FIN-02 aggregates `$165`; pending payout produces `−$200`. CALC-01 yields `$250` aggregate/day and `$50` per-account/day for five equal accounts. CALC-02 requires `$56,000` modeled eligible result, with repeating-decimal daily targets. CALC-03 caps the synthetic request at `$1,000`, yielding `$900` before external costs. CALC-04 produces `$18,000`, `$90,000`, `$54,000`, or `$72,000` according to the explicit account-days. These are manual specification checks, not executable financial tests or achievable income claims.

Future implementation still requires accepted monetary/date/matching and scenario policies, real redacted exports with independent totals, actual UI/accessibility checks and user evidence. Repository consistency checks do not close those milestones.
