# 2026-10-01: Lucid scout → orchestrator · M1-14

## Done

Created [Lucid $50k readiness review](../research/lucid-50k-planner-readiness.md) with dated official links, Pro/Daily/Black request conditions, account/risk/cohort/live constraints, source conflicts, and five independent manual synthetic examples. Rechecked existing Flex rule freshness without changing its contract or code. Identified restricted Maxx as an additional evaluation-to-live route, rather than incorrectly treating it as ordinary Direct funding.

## Look at this first

Pro request caps remain inconsistent with funded overview wording. Daily's $8,000 daily-profit live statement is automatic in payout documentation but discretionary in its live article. Black is explicitly legacy with coherent standard/optional bonus rules but no confirmed purchase cutoff. Recommended next narrow scenario is fresh Daily first-request arithmetic below $8,000 daily profit; this is not an official one-payout cap and does not solve full annual income modeling.

## Deliberately unfinished

No ADR acceptance, code, policy profile change, real data, source clarification from the firm, user interview or actual eligibility approval. Source commission/rounding/pending timing and discretionary transition semantics remain unknown. Existing Flex frozen contract retains its modeled fifth-payout boundary; a separate task should qualify policy copy and account-limit behavior if approved.

## Reproduce green

Official source pages linked in the review were opened on 2026-10-01 through web research. Ran `git diff --check`: passed (line-ending warnings only). Initial `python tools/verify.py` reported concurrent missing matrix/document files; reran after the combined edits and final reviewer correction: all local links/anchors, board references and STATUS passed. Added the reviewer's requested current simulated-account closure and household live restriction. No application checks are claimed for research-only edits.

## Decisions made without an ADR

Research recommendations and conditional worked examples only. First-request pause, immediate approval, constant daily net result and full-gross deduction are proposed scenario conventions, not newly accepted rules or observed upstream behavior.

## Questions for the receiver

1. Select a narrow scenario and accept its scope through a new ADR before implementation.
2. Keep Pro cap/cohort and Daily live ambiguities visible; do not resolve them by guessing.
3. Preserve M1-04 and M1-05 blockers on actual statements and users.
