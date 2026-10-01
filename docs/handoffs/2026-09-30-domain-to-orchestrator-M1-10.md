# M1-10 Tradeify Select Flex domain handoff

Date: 2026-09-30. From: domain-dev. To: orchestrator, domain-reviewer, typescript-reviewer.

Implemented accepted [ADR 0008](../adr/0008-tradeify-select-flex-planner.md) in a separate domain module and package subpath, preserving generic and LucidFlex implementations. No dependency or lockfile changes.

## Contract and scope

Import `TRADEIFY_SELECT_FLEX_50K_PROFILE`, `simulateTradeifySelectFlex`, `solveTradeifySelectFlexGoal` and the associated types from `@tradehq/domain/tradeify-select-flex`.

The frozen profile carries payout, household account-limit and Elite Live sources; verification date/version; a hypothetical evaluation-purchase cohort strictly after September 1, 2026; and the scoped funded $50k rules. September 1 itself and earlier cohorts are excluded. Net daily profit is the scenario's conservative input basis; the official winning-day commission basis is unverified.

Forward inputs use decimal strings for constant nonnegative net daily performance and portfolio cash costs, with period/day/account strings. Validation follows the approved bounds with only 1–5 accounts allowed. Fresh funded accounts and available individual/household slots are assumed; no existing household funded accounts or prior payout/live history are included. Invalid inputs return field errors without stale output.

The model computes five-day qualifying cycles, half-retained-profit requests floored to cents and capped at $2,500, the $250 request minimum, and exact 90% trader cash. Full gross requests reduce retained profit. Results distinguish trading P&L, retained profit, gross requests, modeled request cash and cash after costs, with per-account/portfolio values and request schedule.

The conservative review pause is `min(3, ceil(10 / accounts))` complete synchronized cycles. Results expose per-account completed payouts, total portfolio requests, modeled days and `reviewBoundaryDay`, with no automatic-transition field or asserted firm payout maximum. Four accounts may cross ten requests at their third synchronized cycle; five pause after two cycles. Every scaling row recomputes its own boundary and retains the same total portfolio costs. Annual views stop at this model pause.

The inverse solver validates the same inputs, tests actual maximum-bound simulation, and searches exact daily cents between $150 and $1,000. Request timing is fixed every five days in that interval, making modeled cash monotone. Results either return the smallest daily amount and full realized schedule or declare infeasibility within the selected model horizon/pause. Zero goal plus zero costs returns zero. Positive small goals can be exceeded by minimum qualifying performance.

All production financial arithmetic uses isolated precision-100 decimal.js. Trader-share fractional cents remain exact until display; official payment rounding is unknown. Approval/payment timing, one-pending-request ordering, drawdown paths, real account eligibility and post-review income are excluded and disclosed.

## Verification observed

- `npm run test --workspace=@tradehq/domain`: 34 tests passed, zero failed; 13 new Tradeify cases.
- `npm run typecheck --workspace=@tradehq/domain`: passed.

Independent manually reconciled cases include $200/day yielding $500/$750/$875 gross requests and $1,912.50 modeled cash for one account, versus two cycles/$5,625 cash for five accounts. Tests also cover immutable provenance, subthreshold/short horizons, count-specific review pauses, non-linear scaling, fixed costs, caps, no annual extrapolation, cent rounding, zero/fee-only cases, modeled capacity, one-cent-less failures and an exhaustive independent integer-cent solver oracle.

The frontend received the API before implementation completion. Independent reviewer source recommendations were applied: household/Elite provenance and explicit household-slot/net-basis assumptions. Integrated browser/build/docs checks and final approval remain orchestrator-owned. No board state or Git commit was changed by this worker.
