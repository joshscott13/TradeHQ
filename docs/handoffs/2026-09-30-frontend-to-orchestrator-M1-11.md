# 2026-09-30: frontend-dev → orchestrator · M1-11

## Done

All three cash planners now accept accountCost under accepted ADR 0009, labeled Account cost / selected week, month or year. Defaults are $50 per account, preserving $250 total across the five default accounts. Input hints describe expected per-account purchases, resets and activation/platform expenses in the selected period and exclude commissions/trading fees already deducted in daily net P&L.

Readable multiplication appears next to the account-cost input and alongside the derived portfolio-cost result. The total comes directly from exact domain portfolioCosts strings; there is no UI binary-number money multiplication. Equations preserve the entered account-cost precision, while displayed totals use the existing declared two-decimal formatter. Invalid cost/count inputs hide affected results; no stale totals are reused.

LucidFlex and Tradeify scaling comparisons now show each row's own account costs and cash outcome. Generic cash comparison includes one-versus-many costs and an expandable full account-count table with daily targets and costs. Trading-mode target and annual trading-P&L projection remain unchanged. Capacity and required-target outputs use the updated domain solvers. Existing payout schedules, source metadata, lifecycle/review boundaries, reset and input IDs are preserved.

The UI and README explicitly say period changes do not convert costs or make a one-time purchase recurring. No shared-cost input, pricing assumption, dependency or unrelated import change was added.

## Look at this first

apps/web/app/page.tsx, apps/web/components/lucidflex-planner.tsx, apps/web/components/tradeify-select-flex-planner.tsx and accepted ADR 0009. README explains the $100 × 3 = $300 monthly example.

## Deliberately unfinished

Actual invoices, heterogeneous account costs, shared-expense allocation and recurring pricing schedules. Users enter the expected per-account cost for the selected period; existing scenario limitations remain in place.

## Reproduce green

Scoped `git diff --check -- apps/web README.md` passed. A web typecheck attempt could not find tsc while the orchestrator's clean installation was in progress; it did not evaluate source. Root owns the final clean-install test/typecheck/build and browser evidence. No duplicate install or build was started.

## Decisions made without an ADR

None. Cost display and scaling-table columns implement accepted ADR 0009.

## Questions for the receiver

None.
