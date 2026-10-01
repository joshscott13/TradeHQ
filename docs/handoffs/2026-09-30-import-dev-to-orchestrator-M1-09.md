# M1-09 import-dev → orchestrator

Date: 2026-09-30

## Scope and interfaces

Implemented [ADR 0007](../adr/0007-example-import-preview.md) in `packages/imports`: bounded local CSV preview, exact decimal monetary totals, row validation, source provenance, per-account summaries, within-file deduplication and conflicting-source/account checks. Regenerated the root npm lockfile after frontend-dev added the workspace dependency. No native export adapter, persistence or ledger import exists.

Public exports: `previewCsv`, `EXAMPLE_DATASETS`, `CSV_HEADERS`, `MAX_CSV_BYTES`, `MAX_RECORDS` and associated typed result/row/account/money interfaces. Financial amounts stay decimal strings. Failures return row-specific errors with no partial totals. Original decoded CSV field values, physical starting line and data-record ordinal remain on every unique row.

Source identity and account grouping use JSON tuples, so punctuation in identifiers cannot collapse identities. Decimal representations normalize for duplicate comparison; timestamp spelling remains explicit and unchanged, so differently spelled equivalent instants with the same identity conservatively conflict rather than silently replace provenance. This is within-file handling only.

## Synthetic reconciliation

Both datasets use the TradeHQ example schema; their platform labels do not imply vendor-native compatibility. All source/account IDs begin with `FAKE`.

- Lucid/Tradovate: gross $355.25 − commissions $12.00 − other trading fees $3.50 = net trading P&L $339.75.
- Tradeify/Rithmic: gross $295.25 − commissions $14.90 − other trading fees $2.10 = net trading P&L $278.25. Account A net is $186.00; account B net is $92.25.

Neither total contains firm fees or payouts received. These fixtures supplement development and cannot close actual statement reconciliation.

## Verification

Observed commands, all successful:

- `npm install`: workspace installed and lockfile regenerated; audit reported zero vulnerabilities. npm reported an existing esbuild install-script authorization warning.
- `npm run test --workspace=@tradehq/imports`: 8 tests passed, covering manual sample totals, exact eight-decimal arithmetic, invalid money, BOM/quotes/CRLF and provenance, malformed CSV, impossible dates and offsets, duplicate/conflicting rows, metadata controls/formula prefixes, and 250 KiB/2,000-record boundaries.
- `npm run typecheck --workspace=@tradehq/imports`: passed.
- `npm run test --workspace=@tradehq/domain`: 21 existing tests passed.
- `npm run typecheck --workspace=@tradehq/domain`: passed.

Independent review caught an initial aggregation loop that included account metadata; corrected it to enumerate only the four financial keys before successful test execution. Independent review and integrated app/build/docs gates are orchestrator follow-up evidence.

## Remaining gates

Real vendor headers, actual exports/statements, persistence, trading-day boundaries and production import contracts remain deferred. The current result is a synthetic local preview under accepted ADR 0007.
