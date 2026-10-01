# Public documentation hygiene independent review

Date: 2026-10-01 (America/Chicago).

Owner: independent Codex security/domain documentation reviewer, separate from the documentation author and orchestrator.

State: approve M1-13 documentation cleanup. No unresolved change request remains in this scope. This is a bounded hygiene and consistency audit, not certification that the repository or its history contains no secrets.

Branch / PR: `docs/public-hygiene`; reviewed the shared working-tree diff against merged main `1d10f83` (PR #8). The orchestrator records the final remote PR/head and required CI result separately.

## Scope and sources

Reviewed current public Markdown and configuration, changed documentation, license/package metadata, quickstart/script paths, synthetic-import labeling, privacy guidance, board/status and accepted-versus-proposed contracts. Initial pattern audit covered 140 tracked files and 223 reachable historical text blobs selected by documentation/configuration/source extensions. Final forward-content scan covered 143 text files, including pending documentation additions before this report/handoff were created.

Internal sources: [README](../../README.md), [contribution guide](../../CONTRIBUTING.md), [architecture](../../ARCHITECTURE.md), [plan](../PLAN.md), [PRD](../PRD.md), [ADR index](../adr/README.md), [historical-review guidance](README.md), [handoff guidance](../handoffs/README.md), [test matrix](../testing/test-matrix.md), tracked code/configuration and local reachable Git objects. No new external research or policy re-verification was performed; existing source-access dates remain historical.

The credential heuristic checked recognizable provider token signatures, private-key headers, quoted credential assignments and credential-bearing HTTP URLs. Results were reported as file/line/category metadata, never possible secret values. Separate patterns searched for workstation paths and private session/artifact locations. Filename inventory was checked for credentials, private-data directories and statement formats; account-identifier heuristic matches were inspected in context.

## Findings

| Severity | Finding | Applied correction / assessment |
| --- | --- | --- |
| Medium, resolved | Current contribution guidance still called the repository pre-code; PLAN/PRD lagged the merged import, Tradeify, cost and Docker scope. | Current docs now distinguish the implemented stateless prototypes from planned journal, saved records, native adapters, authentication and hosted persistence. Ownership paths and release procedure were reconciled. |
| Medium, resolved | Nine historical documentation files exposed workstation/session artifact paths and implied locally available evidence locations. | Forward documents use artifact basenames or descriptions, explicitly mark temporary artifacts uncommitted and unavailable publicly, and preserve original dates, counts, actors and dispositions. Prior Git objects still contain the old references. |
| Low, resolved | A newly edited contribution command pointed at a nonexistent Docker verification script. | Corrected to the actual `python tools/docker/smoke.py` command before approval. |
| Informational | Historical handoffs describe earlier no-app/no-remote/in-review states. | Index guidance identifies these as historical snapshots and points readers to current board/roadmap/ADR records; historical results were not rewritten as new validations. |
| Informational | Public maintainer identity, GitHub references, synthetic aliases and loopback examples appeared in the reviewed content. | Legitimate public attribution and documented examples were retained. Account-ID heuristic matches were type declarations, not account records. MIT LICENSE and package license fields agree; npm `private` flags prevent publishing packages and do not claim the repository is private. |

No credential-signature/key/assignment/credential-URL matches were found by the initial tracked/reachable-history pattern checks. The final forward-content scan found no matches for those patterns or workstation/session locations. No committed private statement or actual account identifier was identified in the inspected file inventory/content. These statements describe observed checks; an arbitrary secret format, encoded/binary data, inaccessible/dangling history, remote issues/artifacts or private originals could fall outside this audit. No history rewrite, credential rotation or exhaustive absence claim is made.

## Sanity assessment

README development commands match npm workspace scripts and the documented port; Docker commands name existing files and the Linux engine requirement. License attribution is consistent. Synthetic previews remain clearly distinct from native broker adapters and real statement reconciliation. Participant templates remain blank and direct consented raw records to private storage rather than public Git. The documentation does not claim saved trades, confirmed payout eligibility, user validation, full accessibility conformance or a deployed authenticated service.

Historical source timestamps were not refreshed by wording edits. Generic/scoped planner ADRs remain distinct from proposed broader financial/scenario contracts. Current M1-12 merge status is reconciled against PR #8; historical reviews remain evidence of their original scope. The diff contains documentation and recorded task-state changes, without application/runtime/dependency changes.

## Checks

Reviewer executed the metadata-only tracked/reachable-history scan and final forward-content scan described above, inspected the final documentation diff, and ran:

- `python tools/verify.py`: passed after the review and DOC-01 references existed.
- `python tools/status/render.py --check`: passed.
- `git diff --check`: passed; ordinary line-ending normalization warnings are not whitespace failures.

The orchestrator separately reports 10 tooling regression tests and 50 existing application tests passing during this task. They are not reviewer-executed application checks or new privacy validation. No application build, container run, participant session or upstream policy check was rerun by this reviewer for the wording-only cleanup. Root must stage new documents, check staged whitespace and require actual final-head CI before reporting the PR ready.
