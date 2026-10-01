# 2026-09-30: scout → orchestrator · M1-10

## Done

Created [Select Flex policy review](../research/tradeify-select-flex-policy.md): opened official payout, drawdown, evaluation, account-limit, Elite, commission, activation and payment-method sources. Recorded the explicit post-September 1, 2026 `$50k` cohort, minimum request/qualifying-day/cap/share rules, account restrictions and retained-profit semantics. Derived a fresh loss-free schedule and synthetic examples for a scoped ADR.

## Look at this first

Minimum gross request is `$250`; qualifying daily threshold is inclusive `$150`. Current cohort request cap is `$2,500`, unlike LucidFlex's `$2,000`. Live consideration is discretionary at three payouts on one account or ten across plans; it is not a hard payout cap. Orchestrator selected a model boundary after the complete synchronized cycle reaching consideration: `min(3, ceil(10/N))`.

## Deliberately unfinished

No real account cohort, statement, integration, eligibility approval, user validation or code. Exact September 1 purchases, older cohorts, live income, mixed portfolios, actual pending states and transfer delays remain outside the preset. Official cent rounding and precise winning-day commission basis are unverified. Immediate approval/payment and cent flooring are proposed disclosed model conventions.

## Reproduce green

Ran `python tools/verify.py`: passed local links/anchors, board schema/dependencies/references and generated STATUS. Ran `git diff --check`: passed. Official pages opened on 2026-09-30 and linked beside factual observations. No application tests were required or claimed for this research-only task.

## Decisions made without an ADR

Research only. The mathematical model and synchronized review boundary reflect root's proposed implementation scope; accept a new scoped ADR before implementation. No production contract accepted.

## Questions for the receiver

1. Keep the scenario cohort explicit; do not silently apply it to Josh's actual accounts.
2. Make immediate approval/payment, no other household accounts/history and finite review-boundary scope visible to users.
3. Distinguish infeasibility within this finite model from an official lifetime earnings limit.
