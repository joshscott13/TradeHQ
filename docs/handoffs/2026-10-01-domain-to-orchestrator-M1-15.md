# M1-15 Tradeify Select Daily domain handoff

Date: 2026-10-01. From: domain-dev. To: orchestrator, domain-reviewer, typescript-reviewer.

Implemented accepted [ADR 0011](../adr/0011-tradeify-select-daily-planner.md) as a separate domain module, test suite and package subpath. Existing generic, LucidFlex, Select Flex and per-account-cost behavior is preserved. No new dependency, lockfile edit, board change or Git commit.

## API

Import `TRADEIFY_SELECT_DAILY_50K_PROFILE`, `simulateTradeifySelectDaily`, `solveTradeifySelectDailyGoal` and `TradeifySelectDaily` types from `@tradehq/domain/tradeify-select-daily`.

Inputs and result fields follow Select Flex's current contract, including per-account costs, exact portfolio costs, per-account/portfolio cash, count-specific scaling and discretionary-review boundary. Each schedule row additionally exposes `cycleProfitBeforeRequestPerAccount` for reviewing cycle resets. Profile metadata is frozen, dated 2026-10-01 and explicitly identifies hypothetical evaluations purchased strictly after September 1, 2026, excluding date equality and earlier cohorts.

## Ledger and solver

The fresh funded ledger adds constant nonnegative daily net profit to retained and cycle profit. Requests use the lesser of available retained profit above $2,100, twice positive cycle profit and $1,250, floored to cents and required to meet the $250 minimum. Approval deducts full gross from retained profit and resets cycle profit. Exact 90% trader share remains unrounded until display. Post-request retained profit exactly $2,100 is an explicit modeling convention, with the policy/FAQ wording ambiguity disclosed.

Simulation pauses at `min(3, ceil(10 / accountCount))` complete synchronized request cycles, or the selected horizon. Scaling reruns the ledger and pause for each account count 1–5. Costs multiply per account without changing request amounts, timing or retained profit. No actual approvals, processing delays, history, drawdown paths, evaluation or post-review income are modeled.

The goal solver checks actual capacity at $3,350 daily profit, then searches exact daily cents globally. It partitions the bounded range 1–335,000 cents at first-request thresholds `ceil(235000 / t)` and later-request thresholds `ceil(25000 / t)` for each selected active day. Fixed request dates within a partition make cumulative gross monotone, allowing local binary search. Intervals are ascending and disjoint, so the first feasible partition's minimum is global. Zero goal and zero costs returns zero. Costs-only and positive targets require enough modeled request cash; infeasibility is explicitly limited to the model horizon/pause.

Global monotonicity is deliberately not assumed: at 14 days, $213.63/day gives $801.738 trader request cash, while $213.64/day gives $609.588 as the first request shifts earlier. The partitioned solver finds $205.56/day as the global minimum for a $700 goal in that horizon, yielding $700.056.

## Verification observed

- `npm run test --workspace=@tradehq/domain`: 55 tests passed, zero failed; 13 new Daily cases.
- `npm run typecheck --workspace=@tradehq/domain`: passed.

New cases cover immutable provenance/cohort, buffer/minimum equality, manually reconciled $500/day requests on days 5/6/7, cycle resets, sub-$250 request intervals, cap leftovers, count-specific pauses and costs, annual stopping, eight-decimal precision, fractional-cent share, zero/short scenarios, first-request cliffs, capacity boundaries, one-cent-less failures, independent exhaustive integer-cent ledger minima and invalid fields. The integer oracle operates only on bounded exact integer cents, independently of production decimal arithmetic and partition assumptions.

Production money uses isolated decimal.js precision 100. Inputs retain established nonnegative monetary bounds and field errors. The frontend received the contract before integration. Independent reviewer reported passing exhaustive cent/forward/inverse checks to the orchestrator; final review attribution, root build, browser and documentation verification remain orchestrator-owned.
