# 2026-09-30: frontend-dev → orchestrator · M1-10

## Done

Added a third separately selectable Tradeify Select Flex planner while preserving LucidFlex, generic planning and the existing import-preview route. The new component uses the isolated @tradehq/domain/tradeify-select-flex subpath exports, with no new dependencies or policy-engine refactor.

The hypothetical profile is read-only: evaluation purchased strictly after September 1, 2026. Cohort and conservative review pause appear prominently above the controls. Daily net P&L qualification is declared a conservative assumption rather than actual approval. Controls cover goal, period, active days, daily net performance, 1–5 available household-funded slots and total portfolio cash costs. Cost copy names evaluation/reset/activation/platform fees and excludes already-deducted commissions/trading fees.

Domain calculations drive request cash, retained trading profit, gross requests, inverse minimum daily target/apply, validation and model-horizon infeasibility. The request path pauses for discretionary live consideration, never an automatic transition or official funded cap. An accessible schedule and always-visible scaling table show per-count requests, total requests and review-boundary day. Scaling independently recomputes the boundary for every count with fixed portfolio costs; annual selection does not extrapolate beyond review.

README describes the declared cohort, assumptions and runnable modes. New CSS is limited to third-selector layout, cohort/profile presentation and the new Tradeify tag. No existing Lucid component changes.

## Look at this first

apps/web/components/tradeify-select-flex-planner.tsx, apps/web/app/page.tsx and accepted ADR 0008. Official source URLs and verification/version metadata are read from the typed domain profile.

## Deliberately unfinished

Actual account identification/approval, prior payouts or live history, other household/plan accounts, losses/breaches/drawdown paths, approval ordering, processing delays/calendar cash receipt, continued funded trading after review and live-stage income. Other cohorts and programs remain separate scoped work.

## Reproduce green

`npm run typecheck --workspace @tradehq/web` passed. `npm run build --workspace @tradehq/web` passed and statically generated root, not-found and imports routes. Orchestrator and independent reviewer own final test/browser evidence and validation decisions.

## Decisions made without an ADR

None. Layout and separate component are implementation choices within accepted ADR 0008.

## Questions for the receiver

None.
