# 2026-10-01: orchestrator to Josh · M1-16

## Done

Simplified the four income planners under [ADR 0012](../adr/0012-plain-language-planner.md). Main labels now use daily profit, number of accounts, total account costs, estimated payouts and profit left in accounts. Detailed rules/sources and full assumptions use keyboard-accessible disclosures. Short essential estimate, trading-fee, purchase-date, buffer and stopping-point explanations stay visible. Financial formulas, defaults, limits, frozen source profiles and public contracts are unchanged. M1-15 reconciled to actual PR #11 merge `1673799`.

## Look at this first

[Independent review](../reviews/2026-10-01-plain-language-planner.md), [copy contract](../adr/0012-plain-language-planner.md) and [presentation aliases](../glossary.md#calculator-presentation-aliases). Examples: “Daily net trading P&L / account” becomes “Daily profit per account”; “Derived portfolio costs” becomes “Total account costs”; “Retained trading profit” becomes “Profit left in accounts.” Generic trading profit and estimated firm payouts remain separate views.

## Deliberately unfinished

Actual account approval, real export reconciliation, participant testing, full accessibility audit, persistent journal and additional firm variants remain outside this copy task. This PR is not merged or released. The new labels do not turn estimated requests into received money.

## Reproduce green

Root executed `python tools/verify.py` before assignment; clean `npm ci`; `npm test` (63 passed); `python -m unittest discover -s tools/tests` (ten passed); all-workspace `npm run typecheck`; `npm run build`; final docs/status/whitespace gates. An intermediate typecheck caught accidental field replacements from `modeledDays` to `estimatedDays`; the frontend restored canonical properties and final typechecks passed. Required final-head CI, including Docker runtime smoke, must pass before marking ready.

Root browser checks covered all four planners, unchanged Lucid $8,103.13/default $150 target, Select Flex $3,968.75/$186.67 target, Daily $3,800/default $466.67 target, goal apply to $5,000.11, three-account $100 cost derivation ($300) and weekly $3,480 manual example. Generic outputs remain $50/day/account, $60,000 yearly trading profit and $58.33/day/account in simplified payout mode. Invalid account count clears results with plain bounds; reset restores inputs. Short-period/sub-$150 Flex messages explain no requests and that review has not been reached. Source/rule disclosures opened and closed with Enter/Space and retained keyboard focus. At 375px, no outer horizontal overflow was present; tables stay contained. Desktop/mobile pixels were inspected by root and supplied for independent reviewer assessment.

Screenshots remain local-only outside Git: `tradehq-plain-language-desktop.png`, `tradehq-plain-language-mobile.png`, `tradehq-plain-language-preview.png`. Temporary viewport override was reset; the retained preview shows reset Lucid defaults. Browser checks are local lab evidence, not participant validation.

## Decisions made without an ADR

None affecting interfaces/vocabulary. Josh's explicit simpler-language request is recorded in accepted ADR 0012; presentation aliases preserve canonical accounting meanings.

## Questions for the receiver

None blocking the copy pass. Review/merge through the protected PR after required CI.
