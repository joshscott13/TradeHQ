# 0006: LucidFlex funded-account income planning

Status: accepted

Date: 2026-09-30

Deciders: Josh requested firm/account-size payout modeling; Codex architect scoped the first profile and deterministic scenario contract.

## Context

The generic prototype merged in PR #1 at bc04e4b. Josh requested income planning under prop firm payout rules, starting with LucidFlex $50k. This scoped decision implements that request without accepting the broader production contracts in ADR 0002/0003.

## Decision

Add a separate LucidFlex funded $50k planner, preserving generic planning. Profile metadata includes nominal account size, official source URLs, verification date and version. Only this researched program is selectable initially; other profiles remain planned. No new dependencies.

Rules verified on 2026-09-30: five separate days with net daily profit at least $150 per payout cycle; qualifying days reset after an approved payout; positive cycle net profit; gross request minimum $500; maximum the lesser of 50% of accumulated retained profit and $2,000; 90% trader share; at most five payouts before live transition. Source table expressly uses profit, excluding nominal $50k. No buffer required. Request locks maximum loss limit at $50,100; remaining profit minus $100 is the modeled post-request loss headroom. No actual eligibility approval or drawdown-path simulation is claimed.

Use loss-free constant net daily trading P&L per account, applied equally to 1–100 modeled accounts, with active trading days 1–7/week, 1–31/month, 1–366/year. These are scenario bounds, not authorized firm account counts. Begin each account at zero accumulated profit, zero qualifying days and no previous payouts. Evaluation, existing accounts and live-stage income remain outside this first contract. Fees are an editable nonnegative portfolio cash cost for the selected period. Goal is trader payout cash less these costs. Payout requests are deducted in gross from retained trading profit; trader cash is 90% of request. The retained portion is not cash income.

Simulate each active day: add daily net trading P&L to retained profit and cycle profit; increment qualifying days only when daily profit is at least $150. When five qualifying days, positive cycle profit and a gross request of at least $500 are available, request the lesser of half retained profit (rounded down to cents) and $2,000. Deduct gross request, reset cycle/qualifying days and increment payout count. Stop simulation of the funded phase on the fifth payout. No account replacement or repeated annualization beyond that boundary. Request timing assumes immediate approval and deduction before the next modeled day; projected payouts are requests, not cash received by a calendar deadline. Source says disbursement within two business days after approval, which is not modeled by trading-day count.

Expose typed profile, input, result, payout schedule, retained profit, gross requests, trader payout cash, cash after costs, funded-phase trading P&L, completed payouts, modeled days, transition day and assumptions. The 90% share remains an exact decimal calculation until display rounding, because the source does not specify payment rounding; actual received cash is not asserted. All money uses isolated decimal arithmetic at precision 100; validate decimal inputs using ADR 0005 bounds. Errors hide stale results. Daily profit is nonnegative. Forward simulation supports sub-threshold daily profit and returns zero requests with an explanatory constraint.

Goal solver finds the smallest cent-valued constant daily profit that yields requested cash after costs within selected active days, under the same simulation. Zero goal with zero costs requires zero daily profit. Otherwise search three cent intervals separately: 15000–16666 (first request day 7), 16667–19999 (day 6), and 20000–80000 (day 5). Request cash is monotone within each interval because request days are fixed. After the first request, retained profit is at least $500 and five further qualifying days add at least $750, so every later request occurs five active days afterward. Use bounded binary search within each feasible interval and choose the smallest candidate across intervals. $800/day reaches the maximum $2,000 request at day 5 and every following five days. Global cash is not monotone: $166.66/day yields a later, larger first request than $166.67/day at a seven-day horizon; test this timing discontinuity. First test the theoretical attainable request capacity: min(floor(days/5),5) times $2,000 times 90% times account count, less costs. If goal plus costs exceeds it, return infeasible with the binding limit; do not show an invented daily target. A feasible goal returns the minimum daily profit and its realized schedule (cash can exceed goal because of minimum requests). Cross-check minimum via one-cent-less tests.

UI: polished firm/account-size selector, visible rule summary and source/date, daily profit assumption, goal/period/days/accounts/cost controls, request cash and retained-profit distinction, required daily target or infeasibility, accessible schedule table and account scaling. Annual cash reports only remaining funded phase (maximum five payouts per account); live income requires a future profile. Reset, validation, desktop/mobile and keyboard behavior remain supported. Scenario copy must state assumed qualifying performance, fees, account-count limits not checked, losses/breaches not modeled and payout processing delay.

## Consequences

Users can model funded-stage cash timing and target feasibility with sourced policy. This is scenario arithmetic, not firm approval, guaranteed income, actual cash records, live trading or an import integration. Broader program catalog and history-aware/loss-day simulations remain follow-up work.

## Decisions on the open questions

Josh explicitly selected LucidFlex $50k as the initial example. The architect chooses the fresh funded-account, loss-free scenario to avoid guessing existing lifecycle state. No private data is required for this modeled feature.

## References

- [LucidFlex payouts](https://support.lucidtrading.com/en/articles/12945796-lucidflex-payouts)
- [LucidFlex drawdown](https://support.lucidtrading.com/en/articles/12945815-lucidflex-drawdown)
- [Generic prototype](0005-calculator-prototype.md)

## 2026-09-30 cost amendment

[ADR 0009](0009-per-account-planning-costs.md) supersedes this record's fixed portfolio cost input with a per-account cost for the selected period. Each scaling count derives its own total costs. Original fixed-cost descriptions above document the prior implementation; other payout and lifecycle rules remain unchanged.
