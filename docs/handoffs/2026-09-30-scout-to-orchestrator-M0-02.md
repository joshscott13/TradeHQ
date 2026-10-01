# Scout to orchestrator — M0-02

Date: 2026-09-30. State: in review. Repository stage: docs-only bootstrap.

## Done

Primary-source desk research covering TradeZella, TraderSync, Tradervue and user-priority Lucid, Apex and Tradeify. Created PRD, PLAN, glossary, design brief and manual accounting/calculator examples. Included dynamic week/month/year goals and one `$50k` program account vs many accounts as first-class MVP scope, with M1 prototype validation.

## Look at this first

[Market research](../research/market-research.md) identifies the existing competitive overlap. [Accounting examples](../research/accounting-examples.md) separates cash outcome from net trading P&L and documents calculator arithmetic. [PRD](../PRD.md) and [design brief](../design/design-brief.md) establish proposed product requirements.

## Deliberately unfinished

No app, real private export fixture, platform adapter, interview, usability test, market-size estimate, pricing study, accepted financial interface or payout-rule engine. Firm/program/platform/purchase cohort remains necessary before any preset. TraderSync support fetch timed out; this limitation is labeled. Apex consistency equality wording differs across primary pages and remains unresolved. Stack selection is the orchestrator's ADR 0001 responsibility.

## Reproduce green

Searched and opened the primary-source URLs recorded in market research on 2026-09-30. Manual examples were reconciled by arithmetic. Final repository whitespace/link/status verification and independent review remain the orchestrator/reviewer's responsibility; this handoff does not claim their completion.

## Decisions made without an ADR

Documented proposed product vocabulary and contract examples. No production schema or dependency introduced. Calculator models are explicitly scenarios rather than predictions. The maintainer authorized modern stack selection; the orchestrator records that choice separately.

## Questions for the receiver

1. Confirm exact Lucid/Apex/Tradeify programs, actual platforms and purchase cohorts for M1 samples.
2. Confirm which financial and calculator contract decisions can become accepted ADRs before implementation.
3. Reconcile PLAN/ROADMAP/test-matrix naming and record final review/check evidence before closing M0.
