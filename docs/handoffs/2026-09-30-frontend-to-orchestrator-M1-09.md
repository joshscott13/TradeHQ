# 2026-09-30: frontend-dev → orchestrator · M1-09

## Done

Implemented `/imports` under accepted [ADR 0007](../adr/0007-example-import-preview.md). Added real Imports navigation from the income planner and a return link, synthetic example selection, local UTF-8 CSV file selection, editable CSV text and explicit Preview. Successful previews show exact-decimal-derived gross/net trading P&L and costs, per-account results, underlying record close timestamps and physical CSV rows, unique-record count and exact-duplicate count. All rendered source content uses React text escaping.

Input changes clear prior totals/errors. An action revision token prevents an earlier asynchronous file read from replacing a later sample, edit, clear or file selection. File size is checked before reading; UTF-8 decoding is fatal on malformed bytes. Invalid previews show row errors without financial totals. Added responsive layout, clear sample/current-source labels, textarea focus and horizontally scrollable financial tables.

Added web workspace dependency and Next transpilation for `@tradehq/imports`; import-dev owns the regenerated root lockfile. Updated README and the export inventory with selected example platforms and the absence of real statements.

## Look at this first

- [Import page](../../apps/web/app/imports/page.tsx)
- [Styles](../../apps/web/app/globals.css)
- [Example contract](../adr/0007-example-import-preview.md)

## Deliberately unfinished

No native Tradovate/Rithmic adapter, upload, fetch, persistence, final save/import, journal or payout cash. Synthetic totals are not real statement reconciliation. Desktop/mobile browser, file race, invalid UTF-8 and keyboard checks belong to the orchestrator/independent review and are not claimed by this handoff.

## Reproduce green

Observed from repository root:

- `npm run typecheck` — web, domain and imports passed.
- `npm run build` — production build passed; `/` and `/imports` statically generated.
- `git diff --check` — no whitespace errors.

## Decisions made without an ADR

None. Exact examples and schema are delegated to import-dev under ADR 0007; ordinary UI layout and copy implement its accepted scope.

## Questions for the receiver

None. Await independent review and browser checks.
