# 2026-10-01: docs-writer → orchestrator · M1-13

## Done

Audited public Markdown against merged main `1d10f83` (PR #8). Updated README, contribution gates, PLAN/PRD, architecture boundaries, design direction, ADR index, research scope and release procedure to distinguish implemented planners/import preview/costs/Docker packaging from planned ledger, journal, native adapters and hosted persistence. Source access dates remain unchanged; no fresh external verification was performed.

Replaced historical workstation paths and private artifact-directory identifiers with recorded basenames or descriptions. Named temporary scripts/screenshots remain explicitly local-only, uncommitted and not publicly reproducible. Original dates, counts, actor attribution and dispositions were preserved. Added handoff/review index guidance distinguishing historical reports from current board status and DOC-01 in the [test matrix](../testing/test-matrix.md).

## Look at this first

- [Contribution checks](../../CONTRIBUTING.md) describe docs, app and Docker gates; Docker uses the actual `tools/docker/smoke.py` path.
- [Plan](../PLAN.md), [requirements](../PRD.md) and [ADR index](../adr/README.md) reflect the merged scope.
- [Independent hygiene review](../reviews/2026-10-01-public-docs-hygiene.md) owns review findings and disposition.

## Deliberately unfinished

No production files, dependencies, source policy dates, historical test results or user-validation evidence changed. Root owns AGENTS, role profiles, board, roadmap/changelog and root handoff updates. Removing paths from current Markdown does not erase prior Git history; this docs task does not rewrite history. Independent review and final staged whitespace checks remain required before merge.

## Reproduce green

Audit commands run from the repository root:

```text
git log -1 --oneline
rg --files -g '*.md' -g '!node_modules/**' -g '!apps/web/.next/**'
```

The revision inspection identified `1d10f83`. Separate local-path/private-artifact and stale-current-scope searches found no remaining matches after corrections. `git diff --check` and `python tools/status/render.py --check` passed. `python tools/verify.py` initially reported only the pending linked independent review report; final verification is coordinated after that report exists. Application/build/container tests are not rerun for this Markdown-only change; their historical counts remain in their original reports.

## Decisions made without an ADR

None. Scope and evidence wording were reconciled to accepted decisions and actual implementation, with no interface changes.

## Questions for the receiver

None. Complete independent review, final local links/status and staged whitespace gates; keep merge and validation states evidence-based.
