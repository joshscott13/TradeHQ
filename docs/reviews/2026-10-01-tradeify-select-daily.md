# Tradeify Select Daily independent review

Date: 2026-10-01 (America/Chicago).

Owner: independent Codex domain/security/TypeScript/design/test reviewer, separate from implementation authors and the orchestrator.

State: approve M1-15 scoped prototype implementation and source/local integration review. No unresolved change request remains; remote final-head CI is a separate required PR gate.

Branch / PR: `feat/tradeify-select-daily`, shared working tree against main `0d4ce75` (PR #10). Orchestrator records final branch/PR/head and remote CI evidence.

## Scope and sources

Reviewed accepted [ADR 0011](../adr/0011-tradeify-select-daily-planner.md), [readiness](../research/tradeify-50k-planner-readiness.md), the isolated domain module/package export/tests, fourth planner component, selector/style diff and current product documentation. Existing generic/LucidFlex/Select Flex/import contracts remain unchanged.

Independently reopened official [Select policies](https://help.tradeify.co/en/articles/12853966-select-flex-and-select-daily-payout-policies), [household account limits](https://help.tradeify.co/en/articles/10468251-how-many-simulated-funded-accounts-can-i-have-at-once) and [Elite consideration](https://help.tradeify.co/en/articles/12969284-tradeify-elite-program) on 2026-10-01. The profile intentionally excludes exact September 1 equality and earlier purchases. Core buffer wording and FAQ disagree at equality; exact-buffer retention remains a disclosed convention. Daily eligibility does not establish daily receipt, and live consideration does not require automatic transition. No actual account or export was checked.

## Findings

| Severity | Finding | Disposition |
| --- | --- | --- |
| Low, resolved | The new warning/progress copy implied reaching a live-review point when the selected horizon had no review boundary. | Corrected to horizon ending before review and progress not reached in selected horizon. Source correction verified. |
| Informational | Earlier first requests can reduce near-term request cash, invalidating a global binary search. | Partitioned solver and independent exhaustive oracle find the global cent minimum. No unresolved solver finding. |
| Informational | Buffer equality, gross-cent flooring, immediate approval and synchronized discretionary pause are model conventions. | Dated cohort, rule summary, prominent notice and scoped assumptions distinguish these from official eligibility/received cash. |

## Independent domain evidence

An independent temporary direct integer ledger enumerated every candidate from 0 through 335,000 daily cents across horizons 1, 2, 3, 7, 13, 31 and 366: **2,345,007 candidate/horizon combinations**. It used no production simulation, request-timing partition or inverse solver to generate expected cash. Exact prefix maxima from the full enumeration locate the earliest globally feasible cent, including nonmonotone cliffs.

Compared production outputs in **665 forward schedule cases** and **1,435 inverse cases**, covering counts 1–5, two/three-cycle pauses, capacity, zero/cost-only goals, all-$1-trillion costs, eight-decimal costs, capacity plus/minus `$0.00000001`, infeasibility and global minimality. Another **144 BigInt forward cases** independently reconciled eight-decimal daily amounts, fractional costs, minimum/cap edges, `$1 trillion` daily inputs, retained/cycle profit, exact share and modeled-day stopping. All **2,244 production/reference comparisons passed**. Temporary oracle scripts are local-only, uncommitted evidence; expected ledgers were not copied from production code.

The partition proof also holds independently. At fixed request dates `t_j`, cycle lengths `k_j`, and cumulative gross `S_j`, integer-cent arithmetic gives `S_j = min(t_j*q - 210000, S_(j-1) + 2*k_j*q, S_(j-1) + 125000)`. Each term is nondecreasing in daily cents `q` by induction. Below `$250/day`, each request empties available profit, fixing subsequent intervals until a threshold changes. At/above `$250/day`, every later active day qualifies. Threshold partitions therefore support local binary searches; ascending intervals yield the global minimum. `$3,350/day` saturates every permitted request on day one onward, so the upper bound represents capacity.

Decimal arithmetic retains money precision 100; integer day/candidate/count arithmetic stays safely bounded. Complete string validation precedes simulation. Costs change request cash after costs, never retained profit or request timing. Each scaling count reruns its pause. Results serialize monetary strings. No new dependency, credential, network request, persistence, authentication or raw-HTML input surface is introduced by the reviewed module/component. This is a scoped source assessment, not a penetration test or repository-wide secret audit.

## UI evidence

Source review confirms independent control/error states, goal/apply, reset remount, per-count costs, request-cycle/retained columns, annual pause disclosure, semantic labels/tables and reuse of existing focus styles. Four selectors use two columns at smaller breakpoints. The reviewer assessed root-executed desktop/mobile/keyboard results and inspected supplied screenshots; the reviewer did not independently operate the browser.

Root observed default cash after costs `$3,800`; goal apply uses `$466.67/day` and displays `$5,000.11`, while one cent less yields `$4,999.79`. Weekly seven days, three accounts, `$500/day`, `$100/account` costs reconciled to `$3,780` request cash less `$300` costs = `$3,480`, request days 5/6/7 and retained `$6,300`. Annual one-account `$3,350/day` with `$100` costs pauses day 3, capacity `$3,275`; `$4,000` goal is infeasible. Zero daily performance shows costs without requests. Blank costs and six accounts clear affected outputs; reset restores defaults. Keyboard ArrowLeft changes account count 5 to 4 while retaining slider focus.

At the root's 375×844 mobile viewport, content scroll width was 360 with no outer overflow; cards stack and tables scroll within their containers. Generic/LucidFlex/Select Flex rendered prior outputs; the synthetic Rithmic preview retained `$186 + $92.25 = $278.25`. These are scoped lab observations, not participant or full accessibility validation.

Reviewer inspected `tradehq-select-daily.png`, `tradehq-select-daily-mobile.png` and the corrected `tradehq-select-daily-detail.png`. They show the established fintech layout, selected fourth preset, prominent cohort/buffer notices, aligned results and readable focus. An initial clipped detail capture distorted layout; root recaptured after explicit viewport restoration, reported inner width 1280/main width 1041, and the replacement pixels show normal desktop geometry. This was capture evidence corrected before approval, without a product change. Screenshots are local-only, uncommitted and unavailable from the public repository.

## Checks

Reviewer executed:

- Independent reference checks described above: passed.
- `npm test`: 55 domain tests (13 new Daily) plus eight import tests, all 63 passed.
- `npm run typecheck`: web, domain and imports passed.
- `python -m unittest discover -s tools/tests`: ten passed.

New committed Daily tests independently cover manual references, cent-floor minimum, cap leftovers, cycle resets, precise share/costs, count-specific pauses, nonmonotone timing, capacity and cent minimality, exhaustive ledger scenarios and invalid input.

Root separately reports clean `npm ci`, production build, all workspace typechecks, 63 application tests and ten tooling tests passing, and the browser observations above. Reviewer ran final `python tools/verify.py`, `python tools/status/render.py --check` and `git diff --check`: passed. Final-head CI remains a required orchestrator gate. Actual statements, participant validation, full accessibility and post-review/live income remain outside this approval.
