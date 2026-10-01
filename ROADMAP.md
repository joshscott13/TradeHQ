# TradeHQ roadmap

Status reviewed: 2026-09-30 (America/Chicago).

M0 bootstrap is published on the public GitHub repository. M1 now implements the approved generic USD calculator prototype. Josh selected MIT and approved editable active trading days, net trading P&L as the default goal, and a separate simplified cash mode with explicit costs/share. Full firm-specific eligibility, journal contracts, export adapters and pricing remain open.

## Next actions

| Order | Action | Completion evidence |
| --- | --- | --- |
| 1 | Implement and independently review the generic calculator | Accepted ADR 0005, precise domain tests and actual browser-flow evidence |
| 2 | Select initial prop firms, asset classes and obtain redacted exports | Export inventory with dates, schemas and user permission |
| 3 | Validate the workflow with Josh and representative traders | Interview notes separating observations from hypotheses |
| 4 | Complete M1 contract, sample discovery and calculator prototype review | Approved contract, meaningful calculation tests and real-record reconciliation |
| 5 | Build M2 reconciled financial domain and import adapters | Idempotent import and per-account statement totals against actual exports |
| 6 | Build M3 polished private MVP, then M4 private release | End-to-end journal/import flows, access isolation and user feedback |

## Dependency map

M0 research/bootstrap → M1 decisions, samples and prototype validation → M2 reconciliation and imports → M3 polished private MVP → M4 private release. Integration tasks cannot close on mock data. Research documents do not establish market demand.

## Open decisions

| Decision | Needed by | Notes |
| --- | --- | --- |
| Authentication provider, database access layer and deployment | M2/M4 | Core TypeScript/React/Next.js/Tailwind and PostgreSQL direction selected; ADR 0001 |
| Production journal/import accounting and firm-specific scenario rules | M1/M2 | ADR 0002/0003 remain proposed; approved generic USD scope is isolated in ADR 0005 |
| Initial account products and export platforms | M1/M2 | Firms selected: Lucid, Apex, Tradeify; specific export adapters need actual records |
| Personal-first versus paid SaaS | M1 | Public MIT repository selected; hosted service/pricing still undecided |

## M0 reconciliation

Bootstrap commit `f168dcef71b6f7241c20c8036a42c1307c24adfc` is on origin/main and its verify CI passed. Historical M0 tasks retain that evidence. CURRENT is M1 under Josh's explicit instruction to start the board. Work on feat/mit-and-calculator-foundation will be submitted for review; no pending PR is described as merged. Main requires PRs, passing up-to-date verify checks, resolved conversations and squash-only merges, including for admins.
