# 2026-09-30: orchestrator → Josh · M1-01 / M1-02 / M1-03

## Done

Added MIT licensing as explicitly requested, accepted the approved generic USD calculator defaults in ADR 0005, reconciled published M0 evidence and activated the M1 board. Built a Next.js/React/Tailwind calculator with independent decimal-arithmetic domain code, dynamic target controls, simplified cash bridge, one-versus-many comparison, annual scenarios, accessible table, validation errors and reset. Added app checks to the existing required verify CI job.

## Look at this first

Run `npm ci` then `npm run dev`, or open the active local preview at http://127.0.0.1:3001 during this session. Port 3000 was already occupied; the preview selected 3001. The [accepted prototype scope](../adr/0005-calculator-prototype.md), [independent review](../reviews/2026-09-30-calculator.md), [domain handoff](2026-09-30-domain-to-orchestrator-M1-02.md) and [frontend handoff](2026-09-30-frontend-to-orchestrator-M1-03.md) explain the evidence and boundaries.

## Deliberately unfinished

No journal, imports, authentication, database, hosted service, named-firm eligibility presets or saved scenarios. Full production contracts remain proposed; this prototype implements only the approved generic subset. M1-04 real exports and M1-05 target-user evidence remain pending. Screenshots/browser checks are developer evidence, not user research or a complete accessibility audit.

This feature branch will be submitted as a PR against protected main. Nothing in M1 is marked merged until its commit is actually on origin/main. MIT publication to main awaits that PR. Historical M0 records accurately name the earlier bootstrap commit.

## Reproduce green

Observed successfully from repository root:

```text
npm test
npm run typecheck
npm run build
python tools/verify.py
python tools/status/render.py --check
python -m unittest discover -s tools/tests
git diff --cached --check
```

Eight financial domain tests and ten repository tooling tests passed. The final production build passed after configuration and licensing updates. Independent desktop/mobile, invalid/zero-share, period-switch, negative-annual and keyboard-flow checks passed. Reviewer requested a darker focus indicator; actual corrected outline was rechecked and approved.

## Decisions made without an ADR

None affecting interfaces or dependencies: scoped calculator/dependencies are accepted in ADR 0005. In-memory inputs, no persistence and generic-only scenarios keep unresolved firm/import/privacy decisions outside this change. Build-generated Next agent files were disabled and removed; repository AGENTS.md remains canonical.

## Questions for the receiver

1. Which specific Lucid/Apex/Tradeify account products and trading platforms should supply the first redacted export samples?
2. Which calculator flow would you like adjusted after trying the prototype?
