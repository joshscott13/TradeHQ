# TradeHQ roadmap

Status reviewed: 2026-09-30 (America/Chicago).

The current repository is a documentation and research bootstrap. Implementation is planned. Josh supplied the product audience, journaling/P&L goal and palette; Josh delegated the modern stack choice and named Lucid, Apex and Tradeify. The core web stack is selected; account products/export platforms, pricing and detailed accounting/scenario rules remain open.

## Next actions

| Order | Action | Completion evidence |
| --- | --- | --- |
| 1 | Review financial-contract and scenario-contract ADRs | Josh's decisions recorded in ADRs; accepted only when resolved |
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
| Accounting contract, rounding, currencies and trading day | M1 | ADR 0002; payout and trade views must remain separate |
| Initial account products and export platforms | M1/M2 | Firms selected: Lucid, Apex, Tradeify; specific export adapters need actual records |
| Personal-first versus paid SaaS; open-source boundary | M1 | Private repository is a temporary local assumption, not a license decision |
| Commit identity and GitHub destination | Remote handoff | No Git identity or remote is currently configured |

## M0 reconciliation

Current task states live in docs/milestones/M0.yaml and are rendered into STATUS.md. This local repository has no origin/main, so completed bootstrap work remains in review rather than marked merged. The next work is M1 scenario/financial contract review and real export discovery. Do not begin M1 automatically at the end of bootstrap.
