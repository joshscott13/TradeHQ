# 0004: Dependency-free repository workflow tooling

Status: accepted

Date: 2026-09-30

Deciders: Codex architect within Josh's authorized repository bootstrap

## Context

The orchestration workflow requires a task board, deterministic status and checks usable on Windows and CI before an app exists.

## Decision drivers

No app dependencies before implementation, reproducible status, meaningful failures, simple local commands and portable CI.

## Considered options

1. YAML library and Node tooling.
2. Python standard library with JSON syntax in YAML 1.2 board files.

## Decision

Select option 2. CURRENT names the milestone. Boards use JSON syntax in `.yaml` files, parsed by Python's standard library. `python tools/status/render.py` renders STATUS.md; `--check` fails on drift. `python tools/verify.py` checks local Markdown targets/anchors, board references and status. `python -m unittest discover -s tools/tests` exercises meaningful invalid/drift fixtures. Make wrappers are optional. CI runs these checks and committed whitespace checks.

## Consequences

Ordinary YAML syntax outside the JSON subset is unsupported. External URL availability and source claims need separate research review. Checks establish repository consistency, not application financial correctness or integration readiness.

## Open questions

None for the bootstrap interface. Any future command/schema extension should amend this decision or add an ADR.

## Decisions on the open questions

Procedural tooling was selected within the explicit bootstrap scope. No runtime application dependency or financial schema was accepted through this decision.

## Amendments

None.

## References

- [Test matrix](../testing/test-matrix.md)
- [Contribution guide](../../CONTRIBUTING.md)
