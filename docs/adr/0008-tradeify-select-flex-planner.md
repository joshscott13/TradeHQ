# 0008: Tradeify Select Flex funded $50k scenario

Status: accepted

Date: 2026-09-30

Deciders: Josh requested Tradeify/Lucid $50k program modeling; Codex architect scopes the next dated preset.

## Context

The existing generic/LucidFlex planners and synthetic import preview are merged. Real native exports and participant evidence are unavailable. Josh's instruction to resume the board continues the authorized firm-rule calculator work. This scenario requires public rules, not private statements, and does not accept production ADR 0002/0003.

## Decision

Add a separate Tradeify Select Flex funded $50k planner without changing LucidFlex or generic behavior. No new dependency. Profile metadata includes official URLs, verification date/version and explicit cohort: evaluation accounts purchased strictly AFTER September 1, 2026. The date itself and earlier cohorts are excluded because source before/after headings leave equality unresolved. This is a chosen hypothetical cohort, not identification of Josh's account.

Verified policy: five winning days per cycle, daily profit at least $150; positive cycle net profit; minimum gross request $250; maximum min(50% retained profit above nominal starting balance, $2,500); 90% trader share. No minimum balance/buffer, funded consistency rule or daily loss limit. Gross requests reduce retained trading profit. One pending request per account; source describes typical 24–48 hour processing. Actual payments, approvals, calendar dates, evaluation profit, fees already included in daily net P&L and drawdown-path compliance are not inferred.

The official winning-day commission basis is unverified; daily NET trading P&L is a declared conservative scenario choice, not an official eligibility definition. Use constant nonnegative, loss-free daily net trading P&L, USD, fresh identical funded accounts with zero retained profit and no prior payout/live history or other Tradeify accounts. Active days bounds match ADR 0005 (1–7/week, 1–31/month, 1–366/year). Account count is 1–5, reflecting the published total funded-account limit across plan types; all five individual/household slots are assumed available, with no other household funded accounts. Cash costs are nonnegative total portfolio costs in selected period, held fixed across scaling comparisons. Use decimal arithmetic at precision 100; validate monetary strings/bounds under ADR 0005. Round gross requests down to cents; preserve trader share exact until display (payment rounding unknown).

For each modeled active day add daily profit to trading P&L, retained profit and cycle profit. Count qualifying days only at >=$150. After five qualifying days and positive cycle profit, request up to the lesser of half retained profit and $2,500, when the cent-rounded amount is >=$250. Deduct gross, reset days/cycle, and assume immediate approval/payment processing before further modeled days. Expose that simplification; do not claim received cash.

### Conservative review boundary

Tradeify says Elite Live CONSIDERATION begins at three payouts on one account OR ten payouts across all plan types since the last live transition/first purchase. This is discretionary eligibility, not a mandatory transition or funded payout cap. This first scenario deliberately PAUSES at the earliest such review point, rather than forecast uncertain later treatment. For N synchronized identical accounts stop after min(3, ceil(10/N)) complete payout cycles, or the selected horizon, whichever first. A full synchronized cycle can cross ten total payouts; real approval ordering is not simulated. Result exposes reviewBoundaryDay, modeledDays, payouts per account and total portfolio requests. UI must call this 'model pauses for live review', never 'funded phase ends', 'automatic transition' or an official maximum. Annual views do not extrapolate beyond this modeled pause. Existing payout history, other plans, continued simulated funding and Elite Live are deferred.

### Goal and scaling calculations

Under constant daily profit >=$150, first payout always occurs at day five (minimum half of $750 = $375 exceeds $250), then every five modeled days. For a fixed account count and horizon, request cash is monotone with daily profit. Solve minimum cent-valued daily net profit via bounded binary search from $150 to $1,000; $1,000 reaches the $2,500 cap in the first five days and every subsequent cycle. Zero goal and zero costs returns zero daily target. For positive goal plus costs, test actual simulation at upper bound; return infeasible within this MODEL horizon/pause if exceeded, not firm-wide impossible. Goals may overshoot due to minimum qualifying performance. Test one-cent-less minimality and short horizons. Scaling recomputes the review boundary for EACH count 1–5, rather than multiply the one-account schedule; costs remain fixed. Copied exposure stays correlated.

Expose separate typed profile/input/goal/result/schedule, using file `packages/domain/src/tradeify-select-flex.ts` and subpath export analogous to LucidFlex. Do not build a generic policy engine or refactor existing Lucid behavior. Output trading P&L, retained profit, gross requests, trader payout cash, cash after costs, schedule, scaling, limits and assumptions. Invalid inputs hide affected stale results.

### UI

Add Tradeify Select Flex as a third planning model, matching established fintech styling, keyboard controls and responsive behavior. Show $50k cohort, $250 minimum/$2,500 cap, 90% share, five $150+ days and model review pause prominently. Include goal/apply, costs examples (evaluation/reset/activation/platform fees; commissions already in daily net P&L excluded), source/date, schedule and per-count scaling. Label dollars as modeled request cash rather than cash received. Do not copy Lucid's fifth payout or $500 minimum. Reset and invalid-input flows preserve existing planners.

## Consequences

This implements one additional researched hypothetical profile. It is not account eligibility approval, live income, real statement reconciliation or completion of M1. Other requested $50k variants remain subsequent scoped tasks.

## Decisions on open questions

Josh authorized Tradeify/Lucid $50k variants and resumed board work. Architect chooses current explicit Select Flex cohort and conservative discretionary-review pause to avoid guessing personal account history. No new maintainer choice is needed for this declared prototype assumption.

## References

- [Select payout policies](https://help.tradeify.co/en/articles/12853966-select-flex-and-select-daily-payout-policies)
- [Research record](../research/tradeify-select-flex-policy.md)
- [Existing LucidFlex scope](0006-lucidflex-planner.md)

## 2026-09-30 cost amendment

[ADR 0009](0009-per-account-planning-costs.md) supersedes this record's fixed portfolio cost input with a per-account cost for the selected period. Each scaling count derives its own total costs. Original fixed-cost descriptions above document the prior implementation; other payout and lifecycle rules remain unchanged.
