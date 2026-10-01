# Plain-language planner independent review

Date: 2026-10-01 (America/Chicago).

Owner: independent Codex UX/domain/TypeScript/test reviewer, separate from the frontend author and orchestrator.

State: approve scoped presentation implementation and local integration evidence; final-head remote CI remains the PR gate.

Branch / PR: `feat/simpler-planner-language`, against merged main `1673799` (PR #11). Orchestrator records eventual PR/head and required remote CI.

## Scope and sources

Accepted [ADR 0012](../adr/0012-plain-language-planner.md), [glossary](../glossary.md), four planner components, their user-facing messages/disclosures, shared controls/styles and current product documentation. Existing accepted numerical contracts are authoritative. This is a copy/presentation review; no new firm-policy research or source freshness claim is made.

Assessment preserves generic trading profit after fees versus estimated firm payouts, payout-request deduction before firm share versus the user's share, selected-period per-account costs versus fees already included in daily profit, profit left in accounts versus received cash, and all dated/cohort/buffer/approval/lifecycle qualifications.

## Findings

| Finding | Resolution / evidence |
| --- | --- |
| Copy replacement briefly renamed seven `modeledDays` property accesses. | Corrected before approval. Root typechecks pass; independent AST comparison reports no differences in inspected financial calls, result reads, defaults or numerical/event control attributes. |
| Awkward replacement grammar and ambiguous Daily cycle label. | Grammar corrected. Daily now labels profit since the last approved request, preserving the cycle reset on assumed approval rather than receipt. |
| Select Flex warning implied a live-review point had been reached when the selected period ended earlier. | Warning and progress now explicitly say review was not reached in the selected days; root verified the short-period case. |
| Duplicate lifecycle constraints were removed from the primary constraint list. | Independently reviewed the presentation filter: explicit visible lifecycle notices still explain the same model boundary, possible consideration, later-income exclusion and nonautomatic transition. |

No unresolved blocking finding remains. Exact share before display rounding remains explained in schedule captions; Daily explicitly discloses request cent-flooring and unknown official payment rounding. Existing numerical conventions remain authoritative in accepted ADRs and unchanged domain profiles.

The primary workflow is substantially shorter: simple daily-profit/account-count/cost labels and headline estimates, with rule sources and full assumptions in native disclosures. Visible text preserves profit after commissions/fees, equal profitable days/no losses, new funded accounts/no payout history, strictly-after purchase dates, costs for the selected period, estimate versus receipt and possible live review. Daily retains the exact-buffer convention and daily eligibility versus payment timing. Request tables still distinguish full account deductions, user share and profit left in accounts. Generic trading-profit mode remains separate from its hypothetical payout mode and excluded firm rules/delays. Glossary aliases follow ADR 0012 without redefining canonical financial terms.

## Checks

Independent reviewer execution:

- Temporary source-review script compared four components against merged baseline `1673799`: defaults/default day limits, financial calculation/format calls, financial result reads, and numerical/control/event attributes. Result: four files, zero differing categories. Constraint-container selection was excluded from that mechanical inventory and reviewed manually as described above; this is not a claim that every source expression is identical.
- Eight temporary presentation-message assertions passed: precision and numeric validation limits, unknown-message fallback, field-key preservation/nonmutation, and interpolated Lucid/Tradeify reason meanings including gross request, share, account count, costs, days and model-only review limits.
- Diff inspection found no domain/import module, source-profile, package-lock or shared number-control changes. Reviewed accepted ADR 0012, glossary aliases, source helper, all four components, disclosure focus styles and current documentation reconciliation to PR #11.
- Independently inspected the supplied desktop, mobile and Lucid preview pixels. Normal aligned desktop cards, stacked mobile flow, contained tables and visible estimate/account-cost distinctions support the scoped visual approval.
- Final documentation, status-render drift and working-tree whitespace checks passed after this report/handoff were written.

Orchestrator execution assessed, not reviewer-executed: clean installation, 63 application tests, ten tooling tests, all workspace typechecks and production build passed. Browser checks covered Lucid default $8,103.13/target $150; Daily default $3,800 and applying $466.67 to $5,000.11; invalid account clearing/reset; the seven-day, three-account example ($3,780 share less $300 costs = $3,480); generic profit versus payout modes; Select Flex default and zero-request/short-period cases. Native summaries responded to Enter/Space and retained focus. Mobile viewport had no outer horizontal overflow. These results were supplied by the orchestrator and compared with source semantics and screenshots.

Local-only, uncommitted evidence: `tradehq-copy-source-review.cjs`, `tradehq-copy-messages.mts`, `tradehq-plain-language-desktop.png`, `tradehq-plain-language-mobile.png` and `tradehq-plain-language-preview.png`. Public readers cannot reproduce the pixel review from these basenames alone.

This approval does not establish participant comprehension, full accessibility conformance, real statement reconciliation, payout approval or received cash. No fresh policy research was performed. The orchestrator must record actual final-head CI before ready/merge claims; only the test engineer assigns validated states.
