# M1-11 per-account planning costs domain handoff

Date: 2026-09-30. From: domain-dev. To: orchestrator, domain-reviewer, typescript-reviewer.

Implemented accepted [ADR 0009](../adr/0009-per-account-planning-costs.md) across generic cash, LucidFlex and Tradeify Select Flex calculations. No dependencies, lockfile changes, commits or board edits.

## Contract

All planner inputs and field errors now use `accountCost` instead of `cashCosts`. This is a nonnegative USD cost for each modeled account within the selected period, using existing eight-fractional-digit/$1 trillion input bounds. No period conversion, recurring subscription or promotional price is inferred.

Generic target results and both firm forward results expose exact decimal-string `portfolioCosts = accountCost × accountCount`. Every scaling row exposes its own exact `portfolioCosts` based on its row account count. Both firm goal results expose `portfolioCosts` whether feasible or infeasible.

Generic cash target = `(goal + portfolioCosts) / traderShare`. Scaling recomputes this target for each count, preserving the same cash goal while allowing account expenses to increase. Generic trading mode continues to ignore hidden cash controls, reports zero modeled cash costs and leaves trading targets unchanged. Annual trading-P&L projection is unchanged.

Firm portfolio cash after costs = trader payout cash minus account cost times modeled accounts. Per-account cash after costs subtracts account cost directly. Each scaling scenario subtracts its own count times account cost; Tradeify still recomputes its count-specific review pause. Firm inverse capacity and minimum-cent daily-profit searches include all modeled accounts' costs.

Costs never alter retained profit, net trading P&L, gross requests, qualifying days, payout schedules or lifecycle/review boundaries. All multiplication and subtraction use isolated precision-100 decimal arithmetic.

## Verification observed

- `npm run test --workspace=@tradehq/domain`: 42 tests passed, zero failed.
- `npm run typecheck --workspace=@tradehq/domain`: passed.

Eight new cross-model tests cover $100 × three = $300, exact fractional costs at eight decimal places, row-based costs, generic cash/share scaling, both firm solvers' minimum daily targets and capacities, unchanged financial schedules, zero/invalid cost inputs and no automatic period conversion. A $4,500 goal with three $100 account costs requires $711.12/day in the five-day test; $711.11/day yields $4,499.979 after costs and fails the target.

Existing 34 tests remain, with historical fixed-cost cases explicitly adapted to the new contract. The CALC-02 example retains $2,400 total across five accounts by entering $480 per account. Independent integer-cent solver oracles now compare against goal plus cost times account count. Lifecycle, threshold, rounding, provenance, timing-discontinuity and review-pause coverage remains intact.

The frontend received result and validation contracts before integration. Root owns amended historical ADRs, integrated docs/build/browser checks and final review evidence. No actual fee invoices, shared-cost ledger or heterogeneous account expenses are introduced.
