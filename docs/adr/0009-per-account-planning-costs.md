# 0009: Per-account planning costs

Status: accepted

Date: 2026-09-30

Deciders: Josh requested account-based costs; Codex architect specifies consistent arithmetic.

## Context

Josh finds total portfolio cash costs unintuitive: $100 spent on each of three LucidFlex evaluation accounts should model $300 total. The existing planners hold portfolio costs fixed when scaling. This change replaces that assumption across generic cash, LucidFlex and Tradeify Select Flex planning.

## Decision

Replace the editable `cashCosts` input with `accountCost`, a nonnegative USD cost per modeled account for the selected week/month/year. Label `Account cost / month` in monthly mode, following the selected period for week/year. Do not convert periods automatically, amortize purchases, infer promotional prices, or silently treat an evaluation purchase as a recurring subscription. The user enters expected cost per account IN that period, including purchases/resets and applicable activation/platform expenses. Trading costs already in daily net P&L are excluded.

Total portfolio costs = exact accountCost × accountCount. Show this derived total and readable multiplication next to the input and in results. Example: $100/account × 3 accounts = $300 in the selected month. When scaling, EACH row uses its own count × the same per-account cost. No fixed portfolio cost remains in the new input contract. Shared costs are outside this simple model and can be allocated by the user across accounts; no separate shared-cost field in this request.

Use isolated precision-100 decimal arithmetic throughout. Retain existing nonnegative decimal input limits and field errors under key `accountCost`. Domain results expose exact `portfolioCosts` (and scaling rows where relevant); per-account cash after costs = per-account trader cash minus accountCost. Generic cash required trading target = (cash goal + portfolioCosts) / trader share. Firm goal solvers use portfolioCosts both for required cash and capacity; costs never change retained trading profit, gross payout formulas, payout schedules or review/lifecycle boundaries. Trading-mode target and annual trading-P&L projection remain unchanged.

Defaults change from $250 total / five accounts to $50 per account, preserving the starting total. No new dependency. Update all three planner UIs, capacity messages, scaling tables, accessible labels/hints and reset/error paths. Exact multiplication comes from domain outputs, not binary-number money in UI. Existing sample statement import arithmetic is unchanged.

Tests must independently check $100×3=$300, fractional money, zero/invalid cost, scaled per-row costs, generic inverse/share bridge, firm solver minimality/upper bounds and existing payout/lifecycle invariants. Update historical tests to the declared new contract; do not erase relevant coverage. Record amendments to ADR 0005/0006/0008 so superseded fixed-cost behavior is explicitly historical, not contradictory current guidance.

## Consequences

Users reason in account costs and scaling includes the additional accounts' expenses. Selected-period inputs require user entry; a one-time purchase is not automatically charged every future period. Actual invoices, heterogeneous per-account costs and shared recurring expenses remain future ledger concerns.

## Decisions on open questions

Josh directly authorized this cost model change with the $100×3 example. The architect applies the same convention to all planners to keep controls and arithmetic consistent; no firm price is hardcoded.

## References

- [Generic planner](0005-calculator-prototype.md)
- [LucidFlex planner](0006-lucidflex-planner.md)
- [Tradeify Select Flex planner](0008-tradeify-select-flex-planner.md)
