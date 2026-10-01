# 0005: Generic USD calculator prototype and implementation dependencies

Status: accepted

Date: 2026-09-30

Deciders: Josh approved calculator defaults; Codex architect selected implementation details within delegated modern stack selection

## Context

Josh approved USD, editable active trading days, net trading P&L as the default goal, and a separate simplified cash-goal mode with explicit costs and payout share. Firm-specific eligibility remains pending exact programs. Josh selected MIT licensing and instructed Codex to begin the board.

## Decision drivers

A working polished calculator, exact arithmetic, explicit assumptions, independent tests and a narrow prototype that does not invent broker/account records.

## Considered options

1. Wait for every import/program decision before building any interactive calculator.
2. Implement the explicitly approved generic calculator now, preserving remaining production contracts as proposed.

## Decision

Choose option 2. Implement a TypeScript domain package and Next.js/React/Tailwind browser prototype. Use npm workspaces and an npm lockfile. Use decimal.js for exact decimal arithmetic, TypeScript for type checks, tsx and Node's test runner for financial cases. Use Playwright for meaningful browser verification if available; a dev-only installation is authorized. Use a single maintained icon family if needed; no external chart or animation library is necessary for the prototype. Pin exact installed dependencies in package manifests/lockfile. These dependency and CLI choices are accepted for this prototype.

Inputs: goal amount, period (week/month/year), positive integer active trading days, positive integer active accounts, mode (net trading P&L or simplified cash outcome), payout share and cash costs for the selected period. Goal and costs are nonnegative decimal USD amounts. Reject incomplete, nonfinite, negative and out-of-range inputs rather than show stale figures. Payout share must be in (0,100] for a positive target; zero share yields explicit infeasibility. Zero goal and zero costs may return zero target. Keep inputs editable and use clear field errors. Allocation is equal across accounts; unequal allocations are deferred.

Prototype numeric bounds: 1–100 active accounts; 1–7, 1–31 or 1–366 active days for week/month/year respectively. Monetary inputs have maximum magnitude $1 trillion and up to eight fractional digits; observed daily performance may be negative for an annual downside scenario. Decimal calculations use 100 significant digits, retaining precision until the two-decimal HALF_UP display boundary. Repeating division is a high-precision decimal approximation, not an exact rational representation. These validation limits protect the generic prototype and do not model firm account-count limits.

Trading target = goal. Cash-mode required trading target = (goal + cash costs) / trader share, under the visible assumptions that all modeled profit is paid in the selected period with no caps, buffers, eligibility restrictions or payment delays. Daily portfolio target = trading target / active days. Daily per-account target = trading target / (active days × account count). Compute using decimal arithmetic; preserve precision and format display at two decimals. State that rounding is for display. Compare 1–N accounts using the same portfolio goal and days. Do not annualize monthly goals with an implicit four-week conversion. Annual side-income projection uses explicitly selected annual trading days and a separately labeled daily-performance assumption; it is a scenario, never actual cash received.

The nominal $50k program label is not invested equity, buying power or an input into the target formula. Lucid/Apex/Tradeify references identify intended users; they do not seed unverified firm rules. Show generic scenario assumptions, do not advertise accurate payout eligibility. No ledger, import, auth, storage or paid service is introduced by this prototype.

UI contract: precise number inputs and keyboard-operable sliders, period/mode selectors, live results, per-account versus aggregate figures, one-versus-many comparison and accessible chart/table representation, reset and saved scenarios if feasible with clear local-device storage wording. No dead navigation implying an implemented journal. Responsive high-end fintech visual direction follows the supplied palette and design brief.

CLI: root `npm run dev`, `npm run build`, `npm run typecheck`, `npm test`; docs checks remain `python tools/verify.py`. CI's required `verify` job incorporates applicable app checks without renaming its status context.

MIT is the repository license, copyright 2026 Josh Scott. Public repository visibility, GitHub identity and remote already exist. M0 records can now name the actual bootstrap commit on origin/main; only implemented prototype work enters in review until its PR is merged.

## Consequences

The generic calculator can be reviewed now without private export records. Production journal/import arithmetic and full firm-rule simulation remain under proposed ADR 0002/0003. This scoped decision accepts only the approved formulas and prototype interfaces above. Local scenario persistence, if implemented, is not user-account storage.

## Open questions

Exact account programs/cohorts, imports, journal persistence and a paid business model remain M1/M2 discovery tasks. They do not block this approved generic prototype.

## Decisions on the open questions

Josh replied "Use these defaults" to the stated USD/trading-days/net-P&L/simplified-cash proposal. MIT selected explicitly. No firm eligibility assumptions or private records were approved.

## Amendments

None.

## References

- [Scenario proposal](0003-scenario-calculator.md)
- [Worked examples](../research/accounting-examples.md)
- [Design brief](../design/design-brief.md)
- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Tailwind with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)

## 2026-09-30 cost amendment

[ADR 0009](0009-per-account-planning-costs.md) supersedes this record's fixed portfolio cost input with a per-account cost for the selected period. Each scaling count derives its own total costs. Original fixed-cost descriptions above document the prior implementation; other payout and lifecycle rules remain unchanged.
