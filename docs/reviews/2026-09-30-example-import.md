# Synthetic import preview independent review

Date: 2026-09-30. Scope: M1-09 under accepted ADR 0007, local TradeHQ-format CSV preview with synthetic Tradovate/Lucid and Rithmic/Tradeify examples. Reviewer: independent Codex security, domain, TypeScript and design reviewer.

## Trust boundary and calculation review

Inspected the CSV state machine, UTF-8/record bounds, calendar/offset validation, metadata and money validation, scoped identity handling, provenance, account aggregates and UI rendering/file lifecycle. The parser checks 250 KiB before parsing and limits 2,000 data records. Quoting/header/width or row failures return errors without successful totals. Calendar validation rejects impossible dates and ambiguous local timestamps; original offsets and source fields remain available. Metadata formula/control checks are separate from signed gross money. Costs are nonnegative, exact decimal arithmetic subtracts commissions and fees once, and unknown currency/platform is rejected.

Duplicate identity is the platform/account/record tuple. Matching normalized repeats are skipped explicitly; conflicting repeats and inconsistent account metadata fail. Distinct IDs stay distinct. This is within-preview deduplication, not saved-history idempotency. Uploaded fields render as escaped React text; no raw HTML, evaluation, external upload, browser storage or durable ledger was added.

The two examples use the same visibly labeled TradeHQ schema; platform labels do not claim native broker compatibility. Example identities begin with `FAKE`; no real records or statements were supplied. Trading totals exclude firm fees and payout cash. Edited content loses the original synthetic-source label. File-size checks precede reading, strict UTF-8 decoding rejects malformed bytes, and revision guards prevent later file completion from overwriting an edit, example selection or clear action.

## Findings resolved

1. Account aggregation initially iterated all `AccountSummary` keys and attempted to parse the account ID as a decimal. Reviewer reproduced both samples throwing `DecimalError`. The worker changed aggregation to a fixed four-money-field tuple; sample and independent checks now pass.
2. UI initially used `File.text()`, which can silently replace malformed UTF-8 bytes. Worker changed it to `arrayBuffer()` with fatal UTF-8 `TextDecoder`, retaining the asynchronous revision guard and explicit read-error state.
3. Delimiter-concatenated React row keys could collide for legal IDs containing colons. Worker now serializes identity tuples, matching the parser's key boundary.

## Independent numerical and parser evidence

Reviewer ran all eight import test cases successfully and `npm run typecheck --workspace=@tradehq/imports` successfully. A separate temporary reference script at `C:/Users/joshs/AppData/Local/Temp/tradehq-import-independent.mjs`, run with `node --import tsx`, passed 97 checks. These cover invalid dates/offsets, signed and bounded amounts, formula/control metadata, malformed quotes, headers/widths, BOM/CRLF/escaped quotes, duplicates/conflicts/account scopes, UTF-8 byte and row limits, and 100 generated signed rows reconciled using independent integer-cent sums.

Manual sample reconciliation:

| Synthetic sample | Gross P&L | Commissions | Other trading fees | Net trading P&L |
| --- | --- | --- | --- | --- |
| Tradovate / Lucid | $355.25 | $12.00 | $3.50 | $339.75 |
| Rithmic / Tradeify | $295.25 | $14.90 | $2.10 | $278.25 |

Tradeify account A reconciles to $186.00 and account B to $92.25. Exact calculation precedes two-decimal display rounding. These are synthetic acceptance figures, not real upstream reconciliation.

## Browser evidence and disposition

Root-executed Codex browser evidence: both sample totals and Tradeify account totals matched the manual values above. Editing cleared old total headings; an exact repeated row raised skipped count to one without changing totals. A conflicting identity showed row 5 errors and no totals. Impossible February 30 and unclosed quotes produced row errors; selecting an example and previewing recovered. A valid local CSV gave $339.75 with its file-source label. Invalid UTF-8 and a file one byte over 250 KiB showed file errors without totals. An empty file left Preview disabled and no totals, without an error section. Keyboard Enter activated Preview with visible focus. Income planner/Imports navigation worked. Root observed no document overflow at a mobile viewport.

Reviewer independently inspected root-captured full-page screenshots `C:/Users/joshs/.codex/visualizations/2026/10/01/01a0f4e1-6db8-7243-bb61-5631aab44480/tradehq-import-preview.png` and `tradehq-import-mobile.png`. Desktop preserves the account/underlying-record hierarchy and synthetic source disclosure; mobile uses a clear single-column flow and deliberate horizontally scrollable tables. The visible $278.25 summary and $186.00/$92.25 account results agree with independent arithmetic. Preview focus is visible. Source review and parser checks are reviewer-executed; browser interactions are root-executed and independently assessed. This is not a complete accessibility audit or target-user validation.

The asynchronous race was source-reviewed: changing input, example, clear or file selection invalidates the revision; only the current completion may set content/errors/loading. No forced pending-read race was executed in a browser. This limited browser evidence does not claim a runtime concurrency test.

Approve the scoped implementation. All three review findings are resolved, with no remaining financial, parser, security or design blocker found. Reviewer observed repository verification and whitespace checks passing. Root separately owns full application/build/status gates and CI. Real vendor schemas, actual records/statement reconciliation, persistent imports and target-user sessions remain pending. No real integration validation or board validation state is assigned by this report.
