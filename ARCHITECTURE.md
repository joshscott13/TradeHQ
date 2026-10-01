# TradeHQ architecture

This is a pre-code product architecture. Josh delegated modern stack selection on 2026-09-30; ADR 0001 selects TypeScript, React, Next.js App Router and Tailwind CSS. No application dependencies are installed yet.

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

Start with manual entry and a generic CSV contract only after [ADR 0002](docs/adr/0002-financial-contract.md) is accepted. Platform-specific adapters need actual redacted exports and their own contract decisions. No API integration is promised. Firm policy metadata needs source, effective date, account cohort and verification timestamp; missing policy data must remain unknown.

## Proposed persistence entities

User, prop firm, account lifecycle, instrument specification, execution, closed trade, journal entry, copy group, fee event, payout event, import batch, source record and correction event. These are discussion concepts, not an implemented schema.

## Open questions

Josh names Lucid, Apex and Tradeify as first firms. Which account products, platform export formats and asset classes should be first? Is this a personal tool first or a paid multi-user service? What reporting currency and trading-day boundary should be default? Resolve these before schema implementation. Security testing and actual statement reconciliation are milestone gates, not claims about this bootstrap.
