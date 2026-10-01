# TradeHQ architecture

The generic income planner is implemented in TypeScript, React, Next.js App Router and Tailwind CSS under ADR 0001/0005. The domain package uses decimal arithmetic. ADR 0006 accepts a scoped LucidFlex funded-account payout scenario; ADR 0007 scopes a canonical synthetic CSV preview. ADR 0008 scopes a separate Tradeify Select Flex funded $50k scenario. ADR 0009 derives portfolio costs from per-account selected-period expenses. ADR 0010 adds stateless Docker self-hosting with a non-root Next.js standalone runtime. Persistence, journal and native export adapters remain planned.

M1-15 merged the separate hypothetical Tradeify Select Daily $50k component and domain subpath in PR #11 at `1673799` under [ADR 0011](docs/adr/0011-tradeify-select-daily-planner.md). Current M1-16 plain-language presentation under [ADR 0012](docs/adr/0012-plain-language-planner.md) is implemented with review and merge pending; domain contracts remain unchanged. The module preserves the buffer and new-cycle ledger, applies exact per-account costs and solves the global minimum cent-valued target across timing partitions. Existing models and imports retain their contracts; no policy engine or dependency is added.

## Implemented modules and planned extensions

A TypeScript web application using React and Next.js App Router, Tailwind CSS for the visual system, separately testable financial/scenario calculations, import adapters and journal UI. PostgreSQL is the persistence direction for the eventual hosted service. Authentication provider, ORM and deployment vendor remain deferred; choose them through follow-up ADRs before installation. See [ADR 0001](docs/adr/0001-platform.md).

Current implementation and remaining scope:

| Module | Implemented responsibility | Planned extension / boundary |
| --- | --- | --- |
| apps/web | Generic/LucidFlex/Tradeify planners and browser-only synthetic CSV preview | Journal, account records, overview and cash ledger remain planned; no sign-in or saved records |
| packages/domain | Precise generic and scoped firm scenarios, inverse targets and per-account costs | Ledger, account lifecycle and copied-decision calculations await production contracts; no UI or broker credentials |
| packages/imports | Canonical TradeHQ CSV parsing, diagnostics, scoped duplicate handling and preview totals | Native adapters and persistent import commits require real exports and accepted contracts |
| Docker packaging | Stateless standalone Next.js server under ADR 0010 | No database, volumes, TLS provisioning or public deployment |
| persistence service | Not implemented | User-scoped records, attachments, transactional commits, audit history and authorization remain planned |

## Financial boundaries

Trading performance and trader cash outcome are different views of different events. Aggregate account trades once by account, while strategy analysis can group copied executions into one trading decision. A reset or replacement creates a new account lifecycle rather than erasing a loss. A payout transfer never creates additional trading profit. Requested payouts and received payouts are distinct states.

The local-only example preview follows [ADR 0007](docs/adr/0007-example-import-preview.md), which does not accept a production import contract. Start production manual entry and a generic CSV contract only after [ADR 0002](docs/adr/0002-financial-contract.md) is accepted. Platform-specific adapters need actual redacted exports and their own contract decisions. No API integration is promised. Firm policy metadata needs source, effective date, account cohort and verification timestamp; missing policy data must remain unknown.

## Proposed persistence entities

User, prop firm, account lifecycle, instrument specification, execution, closed trade, journal entry, copy group, fee event, payout event, import batch, source record and correction event. These are discussion concepts, not an implemented schema.

## Open questions

Josh prioritizes Lucid and Tradeify $50k variants excluding direct funded; Apex is deferred. Josh selected Tradovate and Rithmic as example platforms without statements. The maintainer's purchase cohorts and native export fields still require verification; hypothetical scoped planner cohorts do not resolve them. Is this a personal tool first or a paid multi-user service? What reporting currency and trading-day boundary should the future ledger use? Current calculators use USD. Resolve the remaining ledger questions before schema implementation. Scoped parser and container checks do not establish production privacy, full financial correctness or actual statement reconciliation.
