# 2026-09-30: orchestrator → Josh · M1-07 / M1-08

## Done

Reconciled merged PR #2 at origin/main `0ad6c8d`, including M1-06, changelog and ADR index. Recorded Josh's initial scope: Lucid and Tradeify $50k variants excluding direct funded; Apex deferred.

Prepared the [program/export inventory](../research/program-export-inventory.md), private sample checklist and actual-record acceptance gates for M1-04. Prepared the [usability kit](../research/usability-test-kit.md) and [session template](../research/usability-session-template.md) for M1-05. Both are preparation artifacts, not import support or completed user validation.

## Look at this first

- [Current board](../milestones/M1.yaml)
- [Discovery review](../reviews/2026-09-30-discovery-readiness.md)
- [Research handoff](2026-09-30-scout-to-orchestrator-M1-07.md)
- [Usability handoff](2026-09-30-scout-to-orchestrator-M1-08.md)

## Deliberately unfinished

M1-04 needs actual platform/report identity, purchase/reset cohorts, consented real redacted exports and corresponding independent totals. Public policy research cannot supply those records. Source conflicts are recorded rather than resolved by guessing. M1-05 needs actual target-user sessions; no external invitations or interviews occurred. Production journal/import contracts remain proposed; no adapter, new policy calculator, auth or storage implementation was added.

## Reproduce green

Observed documentation checks: `python tools/verify.py`, `python tools/status/render.py --check`, `python -m unittest discover -s tools/tests` (10 passed), and `git diff --check`. The usability worker also observed all 21 domain tests passing while checking moderator examples. Application source was unchanged in this PR.

## Decisions made without an ADR

No interface or dependency change. Josh explicitly reprioritized firms/program sizes; this is recorded in the board, roadmap and proposed ADR 0003 amendment. Preparation tasks were split from actual evidence collection so they can be reviewed without claiming validation completed.

## Questions for the receiver

No decision is required to review these artifacts. Exact platform, cohort and sample metadata remain the next inputs for M1-04; sessions can use the prepared kit when participants are available.
