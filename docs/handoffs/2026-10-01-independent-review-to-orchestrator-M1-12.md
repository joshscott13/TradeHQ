# 2026-10-01: independent-review → orchestrator · M1-12

## Done

Approved Docker packaging and smoke implementation after independent source review and assessment of the test author's real local container result. Recorded resolved npm port forwarding and route-content check findings in the [dated review](../reviews/2026-10-01-docker-self-hosting.md). Updated HOST-01 to distinguish local integration success from the required remote CI gate.

## Look at this first

Review evidence, then [self-hosting instructions](../self-hosting.md). Docker and CI production files remain owned by their authors; reviewer made no production or board edits.

## Deliberately unfinished

The final-head GitHub Actions `verify` result is a required PR gate; link the actual run in the orchestrator handoff before reporting ready. No public deployment, persistent ledger, auth, restored data or container browser-interaction validation is claimed.

## Reproduce green

Reviewer ran `docker compose config`, smoke `--help`, rejected zero timeout, docs verify/status, 10 Python regression tests and whitespace checks. Test author ran final actual smoke successfully on project `tradehq-smoke-9624236db0d2` and confirmed scoped container/network/image cleanup; exact evidence is in the dated review.

## Decisions made without an ADR

None. Packaging scope follows accepted ADR 0010.

## Questions for the receiver

None. Stage these review/matrix/handoff documents, push the branch and require the actual remote CI repeat.
