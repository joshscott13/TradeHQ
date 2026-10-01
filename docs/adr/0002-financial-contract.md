# 0002: Financial metrics and import contract

Status: proposed

Date: 2026-09-30

Deciders: Josh; Codex architect recommends

## Context

Across prop firms, a trade result, a simulated account balance, a payout request and cash actually received are different events. A single unlabeled total can misrepresent the trader's result.

## Decision drivers

Reconcile against actual account records; preserve history; avoid duplicate imports and duplicated strategy statistics; show every financial metric's basis.

## Considered options

1. One combined profit total from trading results and payouts.
2. Separate net trading P&L, firm expenses and cash outcome with linked records.

## Decision

Recommend option 2. Net trading P&L is gross realized trading P&L less trading commissions and execution fees, including them exactly once. Payouts received represent actual net cash received. Trader cash outcome is payouts received plus recorded cash refunds less cash firm fees and other explicitly categorized cash costs. Pending payouts and simulated profits are excluded from cash outcome. Tax treatment is outside this contract.

Do not subtract commissions again from cash outcome when already reflected in the payout. A fee charged to an account balance and a fee paid out of pocket need different provenance. Never sum unlike currencies without an explicit conversion basis. Use exact monetary arithmetic, instrument multipliers, explicit rounding and immutable source identifiers. Implementation rules require Josh's acceptance and actual export samples.

Account financial totals include every distinct account execution. Strategy statistics optionally collapse an explicitly linked copy group into one decision. Reimporting the same source record must not create another execution. Reset accounts retain their prior lifecycle and expense history.

## Consequences

The overview must name the metric, currency, date basis and coverage. Manual entries can be useful before adapters exist but must be distinguishable from imported data. Rule eligibility requires versioned firm/account-policy inputs and is deferred.

## Open questions

- Accept these metric definitions and propose any additional cash categories?
- USD-first or multi-currency at launch? What reporting timezone and session boundary?
- Which platform exports can establish execution identity and commission inclusion?

## Decisions on the open questions

Pending Josh's response; no production schema accepted.

## Amendments

None.

## References

- [Topstep payout policy](https://help.topstep.com/en/articles/8284233-topstep-payout-policy), checked 2026-09-30: illustrates profit share and payout processing fees; rules depend on account cohorts.
- [Architecture](../../ARCHITECTURE.md)
