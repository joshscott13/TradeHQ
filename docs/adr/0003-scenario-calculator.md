# 0003: Income target and scaling scenarios

Status: proposed

Date: 2026-09-30

Deciders: Josh; Codex architect recommends

## Context

Josh wants a dynamic polished calculator answering: what daily target produces X per week/month/year, what annual side income looks like, and how scaling one nominal $50k prop account changes the outcome.

## Decision drivers

Instant feedback, editable assumptions, clear per-account versus portfolio targets, transparent distinction between modeled trading performance and possible payouts, and useful comparison against actual journal results.

## Considered options

1. Multiply account count by a fixed daily profit and annualize.
2. Show a transparent unconstrained performance scenario alongside a separate policy-constrained cash scenario.

## Decision

Recommend option 2. User-provided trading days are the denominator; do not silently use calendar days or assume every weekday is traded. A $50k account is a product label, not personal capital available for investment. Account count does not change assumed per-account edge or make correlated copied positions independent.

### Performance mode

For a period goal G in aggregate net trading P&L, with D active trading days and N equivalent active accounts, required daily portfolio net target = G / D. Required daily per-account net target = G / (D × N). For unequal accounts, use explicit allocation weights summing to one rather than divide evenly. Reject D ≤ 0, N ≤ 0, invalid currencies, NaN and infinite values. Retain exact precision internally and show rounding explicitly; rounding up a daily target is an optional declared choice.

Annual modeled net trading P&L = per-account daily net expectancy × annual active trading days × active accounts, only in an explicitly simplified scenario. To use winning-day inputs, net expectancy = win-day fraction × average winning day − loss-day fraction × average losing day, with flat days represented separately. Commission treatment must be named and applied once.

Account count must be a positive integer. Winning, losing and flat day fractions must each lie in [0,1] and sum to one; winning/loss magnitude inputs are nonnegative. An active-day count is a positive integer for an actual calendar, while an explicitly labeled annual planning average may be fractional. Invalid inputs produce a clear field error instead of stale or silently clamped output.

### Cash mode

Target cash received cannot be solved by G/(D×N) alone. Use per-account, per-cycle available trading profit after retained buffers, payout eligibility, withdrawal caps, profit share, processing fees and paid firm costs. Carry retained account profit forward, and apply scheduled account activation/closure and cycle counters. Denied/pending/received payout states remain distinct. When an account's rule inputs or cohort are missing, show cash projection as unavailable or a generic assumption-based estimate; never claim firm-specific eligibility.

If the simplified model assumes all modeled profit is distributable, a uniform trader share S and cash costs C, required trading net profit = (desired net cash + C) / S. Display this only with an explicit no-cap/no-buffer/full-distribution assumption. Full policy-constrained targets require solving the actual cycle schedule; return infeasible if caps prevent reaching the target. Do not apply one policy to all firms.

For this inverse formula, require 0 < S ≤ 1 and nonnegative cash cost C. Reject negative or greater-than-one shares. With S = 0 and a positive goal-plus-cost amount, report infeasible instead of dividing by zero. A zero goal with zero costs can have a zero target; negative goals need a separate explicit interpretation before support.

### Interaction contract

Weekly/monthly/yearly goal selector; separate performance/cash goal modes; editable trading days, firms/accounts, fees and payout assumptions; typed numeric inputs paired with keyboard-operable sliders; immediate recalculation; saved comparison scenarios; one-account versus scaling table; accessible chart and tabular equivalent. Show baseline/downside/upside assumptions, never imply probabilistic confidence without an evidence-based model. Clearly label all outputs as scenarios, separately from actual ledger values.

## Consequences

The first prototype can run generic performance and fully declared simple cash scenarios. Named firm cash projections need current policy sources and account cohort data. Scenario sensitivity should be useful even when firm rules are unknown. Actual journal results can later supply observed expectancy, with sample size and date range shown.

## Open questions

- Broader history-aware and live-stage scenario behavior remains open; generic defaults are accepted in ADR 0005.
- Lucid and Tradeify $50k variants excluding direct funded are prioritized; Apex is deferred. Exact purchase cohorts remain required.
- Processing/calendar timing and loss-day assumptions for additional firm profiles remain open.

## Decisions on the open questions

Josh approved USD, editable active trading days, default net trading P&L and simplified cash defaults under accepted ADR 0005. ADR 0006 separately accepts the implemented fresh funded LucidFlex $50k model. This broader proposal remains unaccepted; it does not authorize full policy simulation or journal-derived forecasting.

## Amendments

2026-09-30: Josh narrowed the initial program research to Lucid/Tradeify $50k variants excluding direct funded, with Apex deferred. Reconciled this broader proposal with the separately accepted and merged prototype decisions [0005](0005-calculator-prototype.md) and [0006](0006-lucidflex-planner.md).

## References

- [Financial contract](0002-financial-contract.md)
- [Product requirements](../PRD.md)
