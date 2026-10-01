# 0011: Tradeify Select Daily funded $50k scenario

Status: accepted

Date: 2026-10-01

Deciders: Josh authorized Lucid/Tradeify $50k variants and continued board work; Codex architect scopes the next hypothetical preset.

## Context

M1-14 research merged in PR #10 at `0d4ce75`. Select Daily has a distinct buffer/cycle ledger and request timing; existing Flex solvers do not establish its inverse monotonicity. Actual account records and participant sessions remain unavailable. This scoped prototype does not accept broader production ADRs 0002/0003.

## Decision

Add a separate Tradeify Select Daily funded $50k planner, with no new dependency or generic policy-engine refactor. Use a frozen dated profile with official URLs, verified 2026-10-01, version and explicitly hypothetical evaluation purchase strictly AFTER September 1, 2026. September 1 itself and earlier cohorts are excluded. USD, constant nonnegative loss-free daily NET trading P&L, fresh zero retained/cycle profit and no prior request/live history, identical accounts and no other household funded accounts. Use 1–5 assumed free funded slots; active-day bounds remain 1–7/week, 1–31/month, 1–366/year. Validate strings under ADR 0005: eight decimal places, magnitude at most $1 trillion, complete decimal syntax; monetary arithmetic precision 100. Per-account selected-period costs follow ADR 0009 without auto-conversion or recurrence.

Rules: $2,100 retained-profit buffer; $250 minimum gross request; $1,250 maximum gross request; 90% trader share; twice new cycle profit limit; positive cycle profit. No five-day winning counter or funded consistency. Every active day adds daily profit to trading P&L, retained profit R and cycle profit C. Candidate gross request is min(max(R−2100,0), 2C, 1250); floor gross to cents, then request only when C>0 and gross>=250. Deduct full gross from R, reset C to zero on modeled approval, preserve trader-share precision until display. One pending request is allowed officially; model assumes hypothetical immediate approval/deduction before the next active day, excludes denials and actual 24–48-hour transfer timing. Request cash is not cash received.

Allow post-request R exactly $2,100 as a disclosed MODEL convention from core buffer wording; FAQ says above, so exact equality is not adjudicated official eligibility. The first-cycle continuity ambiguity cannot bind with zero history since available above buffer <= C <= 2C. Existing histories, losses, drawdown/news compliance, evaluation profits and live income remain excluded. Official cent/payment rounding is unknown; cent flooring and display half-up are model choices.

Pause at min(3, ceil(10/N)) complete synchronized request cycles for N accounts, or horizon first. This is a conservative modeling boundary for discretionary Elite consideration, not an official payout cap or automatic transition. Recompute the ledger and pause for each scaling count 1–5; whole synchronized cycles may cross ten requests. Report boundary day, modeled days, counts, trading P&L, retained profit, gross requests, trader request cash, costs/cash after costs, schedule and explicit assumptions/constraints. Annual selection stops at this boundary and does not extrapolate beyond it.

### Inverse target

Return the GLOBAL minimum cent-valued daily profit meeting goal after all N account costs, or infeasible within this model. Zero goal and zero costs returns zero. Search bounded cents 1..335000: $3,350 permits $1,250 on day one and every later modeled day, so saturates request-count/horizon capacity. Evaluate actual schedule at upper bound for capacity.

Do not use one global binary search: the first request moves earlier when daily profit crosses $2,350/t and can reduce initial request cash. For cent-valued q, first day is ceil(235000/q). Below $250/day the first gross never reaches the cap and empties available profit; subsequent request interval is ceil(25000/q). At or above $250/day each later active day is request-eligible; cap/leftovers change amounts but not timing. Partition candidate cents at ceil(235000/t) and ceil(25000/t) for t=1..selected active days, plus range bounds. Within each partition the request days/count are fixed, and request cash is monotone as q grows, including min/cap branches. Binary-search each partition, take the smallest feasible cent across all; an independently derived exhaustive integer/BigInt oracle must verify minimality, including timing cliffs and one-cent-less results. If review disproves this proof, amend ADR and algorithm before approval.

### Interfaces and UI

Use `packages/domain/src/tradeify-select-daily.ts` and subpath `@tradehq/domain/tradeify-select-daily`, exporting `TRADEIFY_SELECT_DAILY_50K_PROFILE`, `simulateTradeifySelectDaily`, `solveTradeifySelectDailyGoal` and analogous typed input/result/schedule/scaling/goal types to Select Flex. Keep existing fields/behavior stable. A request record also exposes cycle profit before approval and retained profit after deduction, making the ledger reviewable.

Add Select Daily as a fourth planner with existing responsive fintech controls, goal/apply, cost derivation, schedule/scaling, invalid clearing, reset and keyboard/focus behavior. Prominently distinguish buffer, minimum/cap, 90% share, cycle limit, exact-buffer model convention and discretionary pause; no official eligibility or daily payment claim. Show dated sources, cohort and excluded scope. Existing generic/LucidFlex/Select Flex/imports preserve behavior.

## Consequences

A narrow hypothetical model supports period targets and scaling without claiming actual approvals, records or guaranteed annual income. Source conflicts remain disclosed. Real export/user gates stay open; other variants require separate scoped tasks/contracts.

## Decisions on open questions

Existing authorization covers remaining non-direct $50k presets. Architect selects the researched current hypothetical cohort, exact-buffer convention, cent request flooring and conservative pause as explicit prototype assumptions. No new user-specific cohort or production decision is inferred.

## References

- [Readiness and synthetic references](../research/tradeify-50k-planner-readiness.md)
- [Select payout policies](https://help.tradeify.co/en/articles/12853966-select-flex-and-select-daily-payout-policies)
- [Household account limits](https://help.tradeify.co/en/articles/10468251-how-many-simulated-funded-accounts-can-i-have-at-once)
- [Elite consideration](https://help.tradeify.co/en/articles/12969284-tradeify-elite-program)
- [Per-account costs](0009-per-account-planning-costs.md)
