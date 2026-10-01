# 2026-09-30: Per-account planning costs independent review

Decision: **approve** M1-11 under accepted [ADR 0009](../adr/0009-per-account-planning-costs.md), replacing entered portfolio costs with selected-period account costs across all three planners. This is hypothetical expense modeling, not actual invoices or a firm-price verification. No remaining blocking findings.

## Contract and findings

Reviewed all three domain diffs, eight new cross-model tests, adapted existing financial tests, frontend source and current documentation. Exact decimal portfolio costs equal account cost times count. Every scaling row uses its own count; firm per-account cash subtracts account cost directly. Generic cash targets and both firm inverse solvers/capacity include the derived costs. Trading mode ignores hidden cash controls; annual trading-P&L projection remains unchanged. Costs do not change retained profit, gross requests, qualifying days, schedules or lifecycle/review boundaries.

Existing decimal validation/bounds and precision 100 remain intact, with field errors under `accountCost`. Invalid costs return errors without financial results; UI removes affected stale results. Cost totals/equations come from decimal-string domain outputs, with no binary monetary multiplication in UI. No dependencies, persistence, imported-record transformation or external account operations are added.

Resolved copy finding: Lucid's final assumptions still described explicit portfolio cash costs during implementation; now they state entered per-account costs times each count. Current live documentation has no fixed-portfolio-cost guidance. ADR 0005/0006/0008 retain prior descriptions with explicit ADR 0009 supersession; historical reviews/handoffs are preserved.

All three defaults use $50 per account and five accounts, preserving the prior $250 starting total. Equations preserve entered cost precision while totals use existing declared display rounding. The selected-period label and help explicitly require entered period costs; switching periods does not prorate amounts or turn a one-time evaluation into a recurring purchase. Commissions already in net P&L are excluded. Heterogeneous/shared costs and actual invoices remain future ledger concerns.

## Independent calculations

Reviewer executed a separate temporary oracle: **1,895 checks passed**, comprising 1,260 firm forward/scaling scenarios, 600 exhaustive inverse cases, 14 invalid-cost cases and 21 generic target/trading-independence checks. Firm references use BigInt eight-decimal monetary units, exact 90% share and independent schedule logic. Inverse checks enumerate every daily-cent candidate from $150 to $800 for Lucid and $150 to $1,000 for Tradeify rather than duplicate binary searches, including Lucid timing discontinuities. Generic derived totals are checked exactly; generic share/target comparisons use numerical tolerance, supplemented by committed exact-decimal tests.

Cases vary account count, partial horizons, zero/subthreshold/capped performance, zero/$50/$100/$100.125/eight-decimal costs, capacity and invalid inputs. Each scaling row's costs/cash and selected results are reconciled independently, including Tradeify's distinct count-specific review pause.

| Manually reconciled case | Expected result |
| --- | --- |
| $100/account, three accounts | $300 portfolio costs |
| Lucid $200/day, five days, three accounts, $100/account | $1,500 gross requests; $1,350 trader cash; $1,050 after costs; $1,500 retained; $350 cash after costs per account |
| $100.125/account, three accounts | Exact $300.375 total; display $300.38 |
| Generic $1,800 cash goal, 80% share, five days, two $100-cost accounts | $200 costs; $2,500 trading target; $250/account/day |
| $4,500 firm cash goal, five days, three $100-cost accounts | $711.12/day gives $4,500.06; $711.11 gives $4,499.979 and fails |
| Five $50-cost accounts | $250 derived total, preserving default selected-account cash |

Updated [accounting examples](../research/accounting-examples.md) and the [usability kit](../research/usability-test-kit.md) for current controls. U2 retains the $2,500 trading target using $100 cost per account across two accounts. U4 now correctly yields $1,200 after costs for three accounts at $50 each. Moderator values remain synthetic references; no participant observations were created.

## Verification and remaining limits

Domain worker reports 42 domain tests and typecheck passing; eight new tests cover cross-model costs and prior coverage remains intact. Root reports clean install, 50 total domain/import tests, workspace typechecks and production build passing. Reviewer independently ran the oracle, documentation verification, status drift check and whitespace check. No new firm-policy browsing is necessary because payout rules/provenance are unchanged and example costs are hypothetical.

Root executed all browser interactions; reviewer independently assessed source and three supplied screenshots. Root observed Lucid $100 × 3 = $300; $100.125 × 3 displays $300.38 while preserving the raw input in the equation; zero costs; negative costs clearing results; year label retaining entered $100/$300 total without conversion; keyboard Enter goal apply at $158.63 yielding $5,000.21. Tradeify's three-account $100 costs gave $300 total, with each scaling row showing $100/$200/$300/$400/$500 and goal apply yielding $5,000.29. Generic weekly $1,800 goal, two accounts, $100 each and 80% share gave $200 costs, $250/account/day and $475/day for one account. Negative input hid results; reset restored $50 and $250 defaults.

Screenshots inspected: `tradehq-account-costs.png` (full desktop), `tradehq-account-costs-detail.png` (focused user case) and `tradehq-account-costs-mobile.png` in `C:/Users/joshs/.codex/visualizations/2026/10/01/01a0f4e1-6db8-7243-bb61-5631aab44480/`. The account-cost label, multiplication, separate derived total, row costs and selected-period note are visible. Focus is visible on the cost input. Root's mobile 390×844 viewport reported document/scroll widths 375, with tables scrolling inside containers and no outer overflow. These interactions were not reviewer-executed; no full accessibility certification is claimed.

Actual fees, statement reconciliation, user sessions, account eligibility, payout receipt and full accessibility validation remain pending. This review does not mark M1-11 validated against real records or complete M1.
