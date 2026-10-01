# TradeHQ roadmap

Status reviewed: 2026-10-01 (America/Chicago).

M0 bootstrap and the MIT-licensed generic income planner are published on main. M1-06 merged a sourced LucidFlex funded $50k payout scenario under accepted ADR 0006. M1-09 merged a local canonical CSV preview with synthetic Tradovate/Rithmic examples. Journal contracts, native export adapters, user validation and pricing remain open.

## Next actions

| Order | Action | Completion evidence |
| --- | --- | --- |
| 1 | Package prototype for Docker self-hosting | M1-12 accepted ADR 0010, real image health/non-root/routes smoke check and instructions |
| 2 | Confirm Lucid/Tradeify $50k purchase cohorts, platforms and redacted exports | Export inventory with dates, schemas and user permission |
| 3 | Validate the workflow with Josh and representative traders | Interview notes separating observations from hypotheses |
| 4 | Complete M1 production contracts and sample discovery | Approved contracts and real-record reconciliation |
| 5 | Build M2 reconciled financial domain and import adapters | Idempotent import and per-account statement totals against actual exports |
| 6 | Build M3 polished private MVP, then M4 private release | End-to-end journal/import flows, access isolation and user feedback |

## Dependency map

M0 research/bootstrap → M1 decisions, samples and prototype validation → M2 reconciliation and imports → M3 polished private MVP → M4 private release. Integration tasks cannot close on mock data. Research documents do not establish market demand.

## Open decisions

| Decision | Needed by | Notes |
| --- | --- | --- |
| Authentication provider, database access layer and deployment | M2/M4 | Core stack and PostgreSQL direction selected in ADR 0001 |
| Production journal/import accounting and broader scenario rules | M1/M2 | ADR 0002/0003 remain proposed; generic prototype ADR 0005 and scoped LucidFlex planner ADR 0006 accepted |
| Remaining account products, existing lifecycle state and export platforms | M1/M2 | Josh selected Lucid/Tradeify $50k variants excluding direct funded; Apex deferred. Tradovate/Rithmic example platforms selected; purchase cohorts and actual native export records remain required |
| Live-stage planning and loss-day scenarios | Follow-up calculator task | First LucidFlex model stops after five funded payouts and assumes equal positive daily performance |
| Personal-first versus paid SaaS | M1 | Public MIT repository selected; hosted service/pricing still undecided |

## Main reconciliation

Bootstrap commit `f168dce` and generic calculator squash commit `bc04e4b` (PR #1) are on origin/main. M1-01 through M1-03 are merged. M1-06 merged in PR #2 at `0ad6c8d`. Discovery preparation M1-07/M1-08 merged in PR #3 at `9cacfef`. M1-09 merged in PR #4 at `220b530`; M1-10 merged in PR #6 at `bb04134`; M1-11 merged in PR #7 at `8c41ca0`; real native exports and user sessions remain outstanding. Main requires PRs, passing up-to-date verify checks, resolved conversations and squash-only merges, including for admins.
