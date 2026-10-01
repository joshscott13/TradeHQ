# TradeHQ architecture

The generic income planner is implemented in TypeScript, React, Next.js App Router and Tailwind CSS under ADR 0001/0005. The domain package uses decimal arithmetic. ADR 0006 accepts a scoped LucidFlex funded-account payout scenario; ADR 0007 scopes a canonical synthetic CSV preview. Persistence, journal and native export adapters remain planned.

## Recommended shape

A TypeScript web application using React and Next.js App Router, Tailwind CSS for the visual system, separately testable financial/scenario calculations, import adapters and journal UI. PostgreSQL is the persistence direction for the eventual hosted service. Authentication provider, ORM and deployment vendor remain deferred; choose them through follow-up ADRs before installation. See [ADR 0001](docs/adr/0001-platform.md).

Proposed modules:

| Module | Responsibility | Boundary |
| --- | --- | --- |
| apps/web | Overview, journal, accounts, cash ledger, import review | Displays explicit metric definitions and data freshness |
| packages/domain | Account lifecycle, trade grouping, financial and scenario calculations | No UI, broker credentials or binary floating-point money |
| packages/imports | Parse and normalize approved export formats | Preserve provenance; preview before committing; idempotent reimports |
| persistence service | User-scoped records, attachments, audit history | Authorize every object operation; transactional import commits |

## Financial boundaries

Trading performance and trader cash outcome are different views of different events. Aggregate account trades once by account, while strategy analysis can group copied executions into one trading decision. A reset or replacement creates a new account lifecycle rather than erasing a loss. A payout transfer never creates additional trading profit. Requested payouts and received payouts are distinct states.

The local-only example preview follows [ADR 0007](docs/adr/0007-example-import-preview.md), which does not accept a production import contract. Start production manual entry and a generic CSV contract only after [ADR 0002](docs/adr/0002-financial-contract.md) is accepted. Platform-specific adapters need actual redacted exports and their own contract decisions. No API integration is promised. Firm policy metadata needs source, effective date, account cohort and verification timestamp; missing policy data must remain unknown.

## Proposed persistence entities

User, prop firm, account lifecycle, instrument specification, execution, closed trade, journal entry, copy group, fee event, payout event, import batch, source record and correction event. These are discussion concepts, not an implemented schema.

## Open questions

Josh prioritizes Lucid and Tradeify $50k variants excluding direct funded; Apex is deferred. Josh selected Tradovate and Rithmic as example platforms without statements. Exact purchase cohorts and native export fields still require verification. Is this a personal tool first or a paid multi-user service? What reporting currency and trading-day boundary should be default? Resolve these before schema implementation. Security testing and actual statement reconciliation are milestone gates, not claims about this bootstrap.
