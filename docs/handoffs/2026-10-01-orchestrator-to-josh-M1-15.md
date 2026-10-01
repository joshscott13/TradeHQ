# 2026-10-01: orchestrator to Josh · M1-15

## Done

Implemented a separate hypothetical Tradeify Select Daily funded $50k income planner under accepted [ADR 0011](../adr/0011-tradeify-select-daily-planner.md). The new domain module tracks retained and cycle profit, models requests, solves the global minimum daily cent target across request-timing partitions, and recalculates costs and review pauses at each account count. The fourth planner exposes its assumptions, request schedule, inverse target and scaling. Reconciled M1-14 to the actual PR #10 merge at `0d4ce75`.

## Look at this first

[Independent review](../reviews/2026-10-01-tradeify-select-daily.md), [ADR 0011](../adr/0011-tradeify-select-daily-planner.md) and [test matrix](../testing/test-matrix.md). Weekly example: seven active days, three accounts, $500/day/account and $100 cost/account produce $3,780 modeled trader request cash less $300 costs = $3,480 after costs. The target for that goal is $500/day/account; requests fall on days five, six and seven. This is hypothetical request cash, not recorded cash received.

## Deliberately unfinished

The profile excludes September 1 itself and earlier purchase cohorts, existing account histories, losses, actual approvals/processing and continued funded/live trading. Exact $2,100 buffer retention, immediate hypothetical approval and the synchronized discretionary review pause are declared conventions. No native import adapter, persistent journal, auth, dependency, release or merge is added. Actual account cohorts/exports and participant sessions still block M1-04/M1-05.

## Reproduce green

Root ran `python tools/verify.py` before assignment. Root clean `npm ci`, all workspace typechecks and production build passed; a subsequent complete `npm test` passed all 63 application tests (55 domain, eight imports). Ten tooling tests passed. The reviewer separately executed the application tests/typechecks/tooling tests and independent integer/BigInt references described in the review. Final documentation/status/whitespace checks and required final-head CI are release-to-review gates.

Root browser checks exercised default forward/inverse/apply, one-cent minimality, weekly manual example, annual capacity/pause, zero profit, blank/out-of-range clearing, reset, keyboard slider focus, all prior planner selectors and synthetic Rithmic preview ($278.25 net). At 375px, cards stack with no outer horizontal overflow. Desktop and mobile screenshots are local-only artifacts outside Git (`tradehq-select-daily.png`, `tradehq-select-daily-mobile.png`, `tradehq-select-daily-detail.png`); the reviewer inspected their pixels. The initial detail capture had a viewport artifact and was replaced with a normal-width screenshot, with DOM widths checked. Temporary viewport overrides were reset and the preview retained on the weekly example. This is neither participant validation nor a full accessibility audit.

## Decisions made without an ADR

None affecting interfaces. ADR 0011 records the accepted scope, model conventions, solver contract and prior user authorization. No official eligibility claim resolves source ambiguity.

## Questions for the receiver

None blocking this scoped implementation. Real account/export/user evidence remains a separate requirement. Merge through the protected PR after required CI; do not infer completion of the M1 integration gates from synthetic checks.
