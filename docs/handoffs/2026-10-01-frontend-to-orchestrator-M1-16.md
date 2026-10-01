# 2026-10-01: frontend-dev → orchestrator · M1-16

## Done

Simplified all four planners under accepted ADR 0012 without changing domain code, profiles, defaults, input bounds, formulas or persistence. Primary controls now ask for daily profit per account, number of accounts, payout goal and account cost. Helpers explain commissions/trading fees, the same daily profit/no losing days, selected-period expenses and unavailable firm account permissions.

Results clearly distinguish estimated payouts before account costs, estimated payouts after costs, total account costs and profit left in accounts. Tables distinguish the full request deducted from account profit from the user's 90% share. The Daily table describes profit since the last approved request rather than implying actual receipt. Generic output remains trading profit, with a separate simplified payout estimate.

Short estimate-only, new funded/no-history, purchase-date, stopping-point and Daily exact-$2,100/payment-timing statements remain visible. Longer rules, source versions and complete assumptions use native keyboard-operable details disclosures with readable explanations. The presentation-only planner-copy helper converts domain errors, constraints and infeasibility reasons without changing their numeric limits or meaning. Duplicate stop notices are omitted because the same limit is already visible in the result.

Reconciled current README/architecture/plan/PRD/design evidence to merged PR #11 at 1673799. M1-16 remains an implemented current change with review/merge pending. Canonical glossary definitions are preserved and presentation aliases documented under ADR 0012.

## Look at this first

- apps/web/app/page.tsx
- apps/web/components/lucidflex-planner.tsx
- apps/web/components/tradeify-select-flex-planner.tsx
- apps/web/components/tradeify-select-daily-planner.tsx
- apps/web/components/planner-copy.ts
- apps/web/app/globals.css
- README.md, ARCHITECTURE.md, docs/PLAN.md, docs/PRD.md
- docs/design/design-brief.md, docs/glossary.md

Examples: Daily net trading P&L / account → Daily profit per account, with after-fees explanation. Derived portfolio costs → Total account costs. Modeled request cash → Estimated payout, with before/after-account-cost distinctions. Retained trading profit → Profit left in accounts. Discretionary review boundary → Estimate stops before possible live review.

## Deliberately unfinished

Target-user validation, actual account eligibility and cash receipt, real statement reconciliation and all previously excluded scenario scope. Simpler wording does not close those gates.

## Reproduce green

`npm run typecheck --workspace @tradehq/web` passed after source cleanup. `python tools/verify.py` passed. Scoped `git diff --check` passed. Root observed a passing full build and owns final browser/independent review evidence; frontend did not start duplicate builds or installs. No text-mirroring tests were added.

## Decisions made without an ADR

None. Native disclosures, explicit message presentation and wording implement accepted ADR 0012.

## Questions for the receiver

None.

## CI smoke marker repair

The Docker smoke run reached a healthy non-root UID 1001 before failing its old homepage-heading assertion. Updated only the current homepage marker in tools/docker/smoke.py to Turn your goal into a daily plan; title, imports, static-asset, health and non-root checks remain intact. Search of current tools, workflows and application files found no other stale automation marker. Python compile and all 10 tooling tests passed; actual container smoke awaits CI.
