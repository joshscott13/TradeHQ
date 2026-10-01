# 0007: Synthetic platform examples and local CSV import preview

Status: accepted

Date: 2026-09-30

Deciders: Josh authorized Tradovate and Rithmic examples without statements; Codex architect scopes a local preview prototype.

## Context

Josh has no statements and asks to use Tradovate and Rithmic as examples. This authorizes sample-driven development. Actual upstream schema and statement reconciliation cannot be claimed from fabricated examples. ADR 0002 remains proposed for production journal/import contracts.

## Decision

Implement M1-09 as a local-only import preview at `/imports`. Add `packages/imports` in existing npm workspaces, with existing exact decimal.js, TypeScript and tsx versions. Add the workspace dependency to web and regenerate the lockfile; no new external dependency. Keep calculator modes available.

Use a clearly labeled TradeHQ example CSV schema, not a purported native broker export. Two synthetic datasets represent Lucid $50k / Tradovate and Tradeify $50k / Rithmic closed-trade summaries, with `FAKE` source/account identities and manually reconciled expected totals. Both use the SAME TradeHQ schema; platform is record metadata, not an adapter capability. Neither establishes vendor-native CSV compatibility, API access, actual fills, payout eligibility or real statement reconciliation.

Exact required ordered headers: `record_id,account_id,platform,firm,program,instrument,closed_at,currency,gross_pnl,commissions,fees`. One row is a supplied closed-trade summary. Do not derive P&L from fills or infer matching, price multipliers or missing costs. Supported platforms are `Tradovate` and `Rithmic`; currency is USD only. Gross P&L can be signed; commissions and fees are nonnegative trading costs. Net trading P&L = supplied gross P&L minus commissions minus fees, exactly once. Firm fees and payout cash are outside these totals.

Each row retains original string fields and CSV row/record provenance. Timestamp must be valid ISO date/time with explicit UTC `Z` or numeric offset; reject impossible dates and incomplete/ambiguous local times. Do not infer trading-day/session boundaries. IDs/metadata are nonempty bounded text, at most 100 characters; preserve identifiers without numeric coercion. Monetary syntax and bounds follow ADR 0005: decimal strings, up to eight decimals, magnitude <= $1 trillion, no exponent/nonfinite or incomplete values. Reject formula-leading identifiers (`=`, `+`, `-`, `@`) and control characters in metadata; signed gross money is handled separately. React text rendering must escape uploaded content.

CSV reader supports comma, CRLF/LF, UTF-8 BOM at start, quoted fields, escaped quotes and embedded quoted newlines where field type allows. Reject malformed quotes, unexpected headers, missing/extra fields and row errors with row-specific messages. Limit input to 250 KiB UTF-8 and 2,000 data records; check file size before reading and parser size before allocation. Never execute fields. Return errors without a successful total if any row fails, so preview cannot imply partial data is complete.

Within one preview, source identity is platform + account_id + record_id. Exact repeated normalized rows are deduplicated with an explicit skipped count. Conflicting repeated identities are errors; equal-looking trades with distinct IDs remain distinct. No ledger persistence exists, so this is within-file duplicate handling, not durable idempotent reimport. Financial aggregate grouping is platform + account identity with consistent firm/program/currency metadata; reject conflicting account metadata. Show gross P&L, commissions, other trading fees and net trading P&L by account and portfolio, plus unique row count and duplicate count.

UI: Imports becomes real navigation; other planned destinations remain clearly planned. Offer two example-load buttons, local CSV file selection and editable CSV text with an explicit Preview action. Inputs changing clears old preview/errors; async file loading must not restore stale content after a later action. No upload, fetch, database, browser storage or final import/save action. Show data-source label, result row/account table and clear errors. Explain accepted schema with visible headers/example download or copy if useful. Preserve modern fintech style, keyboard focus, responsive behavior and accessible labels/status/error summaries.

## Consequences

We can demonstrate and test import review now using synthetic data. M1-04 remains pending actual records and cohorts, while selected example platforms are known. No production import or account ledger is implied. Synthetic reconciliation closes only synthetic test rows, never real integration gates. Native adapters wait for verified native export fields and their own accepted contracts.

## Decisions on the open questions

Josh selected Tradovate and Rithmic for examples and says statements are unavailable. Scope remains Lucid/Tradeify $50k excluding direct funded, Apex deferred. The architect selects a canonical demo schema rather than invent vendor headers.

## References

- [Production financial proposal](0002-financial-contract.md)
- [Program/export inventory](../research/program-export-inventory.md)
- [Tradovate official CSV report workflow](https://tradovate.zendesk.com/hc/en-us/articles/16653178768275-How-Can-I-Run-a-Report-Within-Tradovate-s-Platform), opened 2026-09-30: CSV export workflow confirmed, exact fields not specified.
- [Rithmic R Trader Pro releases](https://www.rithmic.com/products/r-trader-pro/releases), opened 2026-09-30: no field-level export contract obtained.
