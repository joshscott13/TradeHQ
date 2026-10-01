# Accounting and calculator examples

Date: 2026-09-30. Status: proposed financial/calculator contract. These are manually reconciled synthetic examples, not implemented or passing tests, actual private records, payout predictions or firm presets. Accept the contract ADR before implementation.

## FIN-01 — Trading results and cash outcome

| Input | Value |
| --- | --- |
| Gross realized trading P&L | `$1,000` |
| Separately recorded commissions/exchange costs | `$60` |
| Firm fees actually paid | `$200` |
| Gross payout requested | `$500` |
| Withheld profit split | `$50` |
| Withheld payout-transfer fee | `$10` |
| Received net payout | `$440` |
| Received firm-fee refund | `$20` |

Net trading P&L = `1,000 − 60 = $940`. Cash outcome = `440 + 20 − 200 = $260`. Do not add `$940` to `$440`; do not subtract the `$60` account commissions or the withheld `$50/$10` again from received net cash. If a further `$15` transfer fee was paid separately, cash outcome becomes `$245` and the separate payment must have evidence.

## FIN-02 — Copied decision

Three account trades link explicitly to one trading decision. Their net trading P&L is `$95`, `$90`, and `−$20`. Aggregate account net trading P&L = `$165`; account trade count = `3`; trading decision count = `1`. Account view shows two winning trades and one losing trade. Strategy view does not claim three independent decisions or statistically independent outcomes. Classification of the mixed-result decision remains an explicit accepted-ADR policy; expose the account results instead of silently selecting a “winner.”

## FIN-03 — Net-only source

Source reports net result `$940` with `$60` commission already deducted. Display net trading P&L `$940`; if reliable gross/cost fields are supplied, show the bridge `$1,000 − $60`. If only net is known, gross and commission remain unknown. Never produce `$880` by subtracting the known included cost again, and never infer missing commissions as zero.

## FIN-04 — Pending payout

Paid firm fees `$200`; payout requested `$500`, approved `$450`, received `$0`. Cash outcome is `−$200`. Pending `$450` is displayed separately. Once received net cash `$440` is recorded, cash outcome becomes `$240`. Approval is not a received date. A denied payout contributes `$0` cash without erasing its lifecycle history.

## FIN-05 — Currency and session unknowns

USD net result `$100` and EUR net result `€100` cannot display as `$200`. Show currency subtotals or unresolved conversion until an FX policy provides source/rate/date. A timestamp `2026-11-01 01:30` without timezone is ambiguous around US DST; do not choose a UTC value or firm trading day silently. Retain source precision and require mapping review. Unknown trading costs show incomplete net result, not zero cost.

## CALC-01 — Weekly/monthly/yearly targets

Trading-result goal uses explicit active days. Weekly `$1,000` goal over `4` days requires `$250` aggregate/day. Monthly `$4,000` goal over `16` days also requires `$250` aggregate/day. Yearly side-income trading-result goal `$48,000` over `192` days requires `$250` aggregate/day. These examples deliberately use the same ratio; do not convert arbitrary weeks to months with a hidden factor of four.

With `5` equal active accounts, per-account daily target = `48,000 / (192 × 5) = $50`. With `1` account it is `$250`. The `$50k` program size does not enter this division: it is a label, not `$50,000` cash that the user invests or withdraws.

## CALC-02 — Cash target under simplified assumptions

Desired received cash outcome `$48,000` in a year, paid external costs `$2,400`, trader share `90%`, `192` active days, `5` accounts. If every modeled payout-eligible result is actually paid that year and there are no buffers/caps/delays, required eligible result = `(48,000 + 2,400) / 0.90 = $56,000`. Aggregate/day = `$291.666…`; per-account/day = `$58.333…`. Round display values only; retain calculation precision. This is an unconstrained scenario, not a Lucid/Apex/Tradeify payout forecast.

If only 3 accounts remain active, the same cash assumptions require `56,000 / (192 × 3) = $97.222…` per account/day. Costs must also be reconsidered rather than automatically kept proportional. If trader share is zero, the positive cash target is infeasible; zero days/accounts is invalid.

## CALC-03 — Caps and eligibility

Synthetic policy: eligible trading result `$3,000`, maximum request fraction `50%`, request cap `$1,000`, trader share `90%`, no separately paid cash fee. Candidate gross request = `min(3,000 × 0.50, 1,000) = $1,000`; candidate received cash = `$900`. If the qualifying-day requirement is not satisfied, modeled requestable amount is `$0`, not `$1,000`. If eligibility is unknown, show unresolved rather than eligible. Buffer requirements must be applied with the exact policy's balance definition. Never add the candidate `$900` to actual cash outcome before it is received.

## CALC-04 — Scaling is not a guarantee

Modeled average net result `$100` per account per active day over `180` days: one account gives `$18,000` trading P&L; five identical accounts give `$90,000` under the stated assumption. Five copied accounts are correlated, not five independent strategies. If only three remain active for all days the model gives `$54,000`; if two close after day 90, total modeled account-days are `3 × 180 + 2 × 90 = 720`, giving `$72,000`. Neither result establishes payout eligibility or receipt, and fees for failed accounts remain cash costs.

An average `$100` active-day result can include 3 days at `$200` and 1 day at `−$200`: `(600 − 200) / 4 = $100`. Substituting winning-day `$200` as the average doubles the scenario incorrectly. Conservative/base/optimistic inputs are assumptions, not probabilities. No historical distribution or success rate has been validated.
