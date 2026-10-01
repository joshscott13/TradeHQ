# 2026-09-30: frontend-dev → orchestrator · M1-06

## Done

Added a separately selectable LucidFlex funded $50k planner while retaining all generic calculator controls. The default firm scenario exposes daily net profit, cash goal, week/month/year, active days, modeled accounts and total portfolio cash costs. Numeric inputs retain paired keyboard sliders and field errors; reset restores editable example assumptions.

Domain functions drive the forward payout simulation and minimum cent-valued goal target. Results distinguish modeled trader payout cash after costs, trader cash before costs, gross requests, retained trading profit and funded trading P&L. Infeasible goals show capacity rather than a fabricated target. Applying a solved target updates the forward schedule.

The five-payout progress view, exact accessible schedule and live-transition notice show the remaining funded phase. Annual selection never extrapolates into live accounts. Account-scaling comparisons hold portfolio cash costs fixed and expose the table for every modeled count. Firm-rule summary comes from typed domain metadata, with official sources, verification date and version. Visible scope explains fresh-account, loss-free, immediate-approval, processing-delay and account-count exclusions.

Extracted the unchanged shared NumberControl into apps/web/components/number-control.tsx. Updated README with runnable planner modes and explicit scope. No dependencies added.

## Look at this first

apps/web/components/lucidflex-planner.tsx, apps/web/app/page.tsx, apps/web/app/globals.css and accepted ADR 0006. Exact finance arithmetic is delegated to @tradehq/domain.

## Deliberately unfinished

Other firm/program profiles, existing-account balances/history, losses, drawdown/breach paths, real approval/payment timing, permitted account counts, live-stage income and actual received-cash records. The single program selector only exposes the researched funded $50k profile. Generic planner remains available.

## Reproduce green

`npm run typecheck --workspace @tradehq/web` passed. `npm run build --workspace @tradehq/web` passed: Next.js compiled and generated the static root and not-found routes. Root and independent reviewer own remaining browser/test evidence and validation decisions.

## Decisions made without an ADR

None. The separate planner component, default selected firm model and shared input component are implementation choices within accepted ADR 0006.

## Questions for the receiver

None.
