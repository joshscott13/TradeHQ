# 2026-09-30: scout → orchestrator · M1-08

## Done

Prepared [planner usability protocol](../research/usability-test-kit.md) and [blank session record](../research/usability-session-template.md). Seven tasks cover generic goal/days/account scaling, simplified cash assumptions, independent annual P&L, LucidFlex request cash versus retained profit, goal/apply, funded caps/lifecycle and invalid-day recovery. Neutral recent-workflow interview and separate planned journal/import questions preserve implemented scope. Moderator references are synthetic accepted-contract expectations, not user observations.

Updated PLAN/PRD status links and selected discovery scope: Lucid/Tradeify $50k variants except direct funded; Apex deferred. Updated only the stale design-brief header to distinguish implemented lab-reviewed planners from pending user validation/broader flows.

## Look at this first

Default UI is LucidFlex; tasks explicitly select the required planner, reset and set all inputs after selecting period. Three planner sessions and five to eight interviews are planned targets. Comprehension, assistance, timings, counterexamples and consent/private evidence are recorded separately. M1-05 remains open.

## Deliberately unfinished

No sessions, invitations, observations, recordings, private records or production changes. No journal/import usability results, market demand, pricing, full accessibility or actual payout approval claimed. Exact platforms and cohorts are still unresolved.

## Reproduce green

Actually run from the repository root:

```text
python tools/verify.py
git diff --check
npm test
```

Docs/board/local-link checks passed. Whitespace check passed (Git emitted existing CRLF-normalization notices). All 21 domain tests passed. Reference task arithmetic was compared with current UI labels/source and ADR 0005/0006; task preparation did not run participant sessions or a new browser audit. No build/typecheck rerun necessary for these documentation-only edits.

## Decisions made without an ADR

Research-session timing, task ordering, scoring and proposed continuation criteria are protocol choices only; no domain/UI interfaces or dependencies changed.

## Questions for the receiver

None required to review the prepared kit. Actual consented participant availability remains necessary to conduct M1-05.
