# 2026-09-30: orchestrator → Josh · M1-11

## Done

Accepted ADR 0009 implements Josh's per-account expense request across generic cash, LucidFlex and Tradeify Select Flex planning. Monthly input is Account cost / month; each modeled count multiplies that amount exactly, including scaling comparisons and goal feasibility. PR #6 was confirmed merged at bb04134 and its board/changelog records reconciled.

## Look at this first

The user's example is $100 per account times three accounts equals $300 portfolio costs. Cost is for the selected period; no automatic monthly-to-annual conversion or recurring purchase charge is inferred. Daily net trading P&L already includes trading commissions, which must not be charged again here.

## Deliberately unfinished

Different account prices, shared cost entries, invoice history, native statement reconciliation and actual target-user sessions. Existing firm payout rules and model lifecycle boundaries remain unchanged. No firm evaluation price is hardcoded.

## Reproduce green

Root ran clean `npm ci`, `npm test` (50 application tests), `npm run typecheck`, `npm run build` and ten tooling tests. Independent arithmetic checks passed 1,895 cases. Browser checks covered all three planners, the $100/account times three accounts = $300 case, fractional/zero/invalid costs, scaling row expenses, firm goal apply by Enter, generic weekly cash bridge, year-label input preservation, reset and mobile width. Screenshots are saved outside Git; independent review approved code, current documentation and screenshots. M1-11 is in review; PR CI is required before merge. Documentation/status/staged-whitespace gates precede commit.

## Decisions made without an ADR

None. Josh directly requested the account-based cost model; ADR 0009 records period and arithmetic semantics and amends prior fixed-cost contracts.

## Questions for the receiver

None blocking this scoped change.
