# 2026-10-01: orchestrator to Josh · M1-13

## Done

Swept public documentation for implementation drift and workstation-specific references. Current product/contribution guidance follows merged main `1d10f83` (PR #8). Reconciled M1-12 and its changelog entry using the actual merge commit. Updated ownership profiles for existing packages and Docker packaging. M1-13 is in review; M1 still requires real exports and participant sessions.

## Look at this first

[Public documentation review](../reviews/2026-10-01-public-docs-hygiene.md), [contribution instructions](../../CONTRIBUTING.md) and [current board](../../STATUS.md). Historical handoffs preserve their original states/results; current status comes from the board. Local-only artifacts are described without workstation paths and are not supplied as reproducible public evidence.

## Deliberately unfinished

No production code, journal persistence, native adapters, new external policy verification, historical Git rewrite, versioned release or merge. Workstation references in historical commits remain; the forward cleanup does not purge history.

## Reproduce green

Run from the repository root. Root observed `python -m unittest discover -s tools/tests` (10 passed) and `npm test` (50 passed). The dated review records the final documentation, status and whitespace gates and independently executed checks. GitHub required verify checks must pass on the pushed head before this PR is ready.

## Decisions made without an ADR

None requiring an ADR: this changes documentation and recorded task state, with no interface, dependency or vocabulary change.

## Questions for the receiver

None.
