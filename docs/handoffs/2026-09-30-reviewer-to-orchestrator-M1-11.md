# 2026-09-30: reviewer → orchestrator · M1-11

## Done

Approve scoped per-account planning costs under accepted ADR 0009. [Independent review](../reviews/2026-09-30-per-account-costs.md) records all three domain/UI diffs, eight new tests, 1,895 independent checks and parent-executed browser evidence independently assessed. Updated COST-01/02, current accounting examples and usability U2/U4/U5 for the new field. Historical reviews/handoffs are preserved.

## Look at this first

$100 per account across three accounts produces $300 total, each scaling count recomputes its costs, and per-account cash subtracts the entered account cost directly. Exact fractional costs remain intact. Firm inverse targets/capacity include all account costs; gross requests, retained profit and lifecycle remain unchanged. Lucid's residual portfolio-cost copy was corrected. No remaining blocker.

## Deliberately unfinished

Actual invoices, heterogeneous/shared expenses, real statements/eligibility/receipt, participant sessions and full accessibility validation. Entered costs apply to the selected period; purchases do not recur or prorate automatically. No board validation, production edits or commits by reviewer.

## Reproduce green

Reviewer executed `node --import tsx C:/Users/joshs/AppData/Local/Temp/tradehq-cost-independent.mjs` (1,895 checks passed), `python tools/verify.py`, `python tools/status/render.py --check` and `git diff --check`. The temporary independent oracle uses BigInt firm arithmetic and exhaustive daily-cent enumeration; committed tests preserve representative regressions. Root reports clean install, 50 domain/import tests, workspace typechecks and build passing. Browser interactions belong to root; source and screenshot assessment belong to reviewer. Root owns final board/generated-file/CI checks.

## Decisions made without an ADR

None. Cost convention follows accepted ADR 0009 and its historical amendments.

## Questions for the receiver

None blocking this scoped PR. Keep actual-record and user-validation gates pending.
