# 2026-09-30: orchestrator → Josh · M1-09

## Done

Implemented the accepted ADR 0007 local CSV preview with synthetic Tradovate/Lucid $50k and Rithmic/Tradeify $50k examples. Independent review approved after three findings were corrected. M1-09 is in review; M1-07/M1-08 were reconciled to their merged PR #3 commit `9cacfef`. M1 remains open.

## Look at this first

The Imports navigation opens `/imports`. Load an example, then select Preview records. Expected net trading P&L is $339.75 for Tradovate and $278.25 for Rithmic. Account and record totals expose commissions and other trading fees separately. Exact duplicates are counted and skipped; conflicting identities and invalid rows suppress all totals. Files stay in the browser.

See [independent review](../reviews/2026-09-30-example-import.md) and [ADR 0007](../adr/0007-example-import-preview.md). These are TradeHQ canonical example rows, not verified native platform schemas.

## Deliberately unfinished

Native export adapters, actual statement reconciliation, saved journal history, production financial contracts, other firm planners and target-user sessions. Asynchronous file-read cancellation was source-reviewed, not forced through a pending-read browser race. No merge or release performed.

## Reproduce green

Root ran `npm ci`, `npm test` (29 passed), `npm run typecheck`, `npm run build`, `python tools/verify.py`, `python tools/status/render.py --check`, `python -m unittest discover -s tools/tests` (10 passed) and `git diff --check`. Independent review ran 97 reference checks. Browser checks covered samples, duplicates/conflicts, invalid timestamps/quotes, local file selection, invalid UTF-8, oversized/empty files, edit invalidation, keyboard navigation and mobile layout. A Windows native dependency lock required stopping the preview server before the successful clean install; the preview was subsequently restarted on port 3001.

## Decisions made without an ADR

None. Josh's platform example request authorized the scoped synthetic preview recorded in ADR 0007. Existing production and real-evidence gates remain pending.

## Questions for the receiver

None blocking review. Merge when ready; native schema reconciliation can follow when actual export evidence is available.
