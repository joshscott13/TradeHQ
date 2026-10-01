# Calculator prototype independent review

Date: 2026-09-30. Scope: accepted ADR 0005 generic USD prototype and MIT licensing. Reviewer: independent Codex domain, security and design reviewer. This report does not validate firm eligibility, demand, real statements or production readiness.

## Disposition

Approve the scoped generic calculator prototype after correction and verification of the focus-indicator contrast finding below. No financial correctness or prototype security blocker found in the reviewed source and exercised flows. The remaining M1 discovery and production contract work stays open.

## Evidence

- Read repository instructions, architecture, plan, PRD, roadmap, reviewer roles, ADR 0005 and design brief.
- Inspected `packages/domain/src/index.ts`: isolated decimal.js constructor, 100 significant digits, display-only half-up rounding, validation bounds, independent annual scenario and equal allocation agree with the accepted contract. Nominal program account labels do not enter the formulas.
- Ran `npm test`: all 8 domain cases passed. Independent direct domain calls additionally confirmed a $5,000 monthly goal over 20 days and 5 accounts gives $50.00 per account/day; 90% share with $250 period costs gives $58.33; zero goal/cost/share gives zero; a positive cash requirement with zero share fails; incomplete, infinite, negative, invalid account-count and invalid days inputs fail; -$50 average over 240 days and 5 accounts gives -$60,000 annual trading P&L.
- Headless Edge preview checks at `http://127.0.0.1:3001` exercised default results, cash mode, zero-share infeasibility, zero-goal/cost result, weekly selection resetting days to 5, invalid week with 8 active days clearing the target, negative annual result, expanded five-row scenario table and reset. No page errors were emitted. Desktop 1440×1000 and mobile 390×844 screenshots were captured and inspected. No horizontal page overflow at 390px, including a $1 trillion goal.
- Codex in-app browser keyboard verification: ArrowRight on the active-accounts slider changed 5 to 6, target $50.00 to $41.67 and annual result $60,000 to $72,000. Focus remained on the slider. Reset restored defaults. The accessibility tree exposes labels, headings, button states, sliders and the expandable data table.
- `python -m unittest discover -s tools/tests -v`: all 10 tooling tests passed after the verifier output was made truthful and generated `.next` Markdown excluded.
- MIT notice contains the standard permission, attribution and warranty clauses with copyright 2026 Josh Scott; root package manifest declares MIT.
- Source inspection found no external requests, scenario persistence, authentication, raw HTML insertion or credential strings in the application/domain files. Inputs remain in component memory. There is no tenant/storage security boundary to certify yet.

Screenshots and the temporary browser script reside outside the repository at `C:/Users/joshs/AppData/Local/Temp/tradehq-review-runtime/`. They are session review artifacts, not committed user-validation evidence. Root independently performs production build/type checks; those are not claimed as reviewer-run commands here.

## Finding

Resolved P2: The original `:focus-visible` outline used `#0ea5e9` against white/light surfaces. Its approximately 2.77:1 contrast against white falls below the 3:1 non-text indicator target. The implementation now uses `#0284c7` (approximately 4.10:1 against white). After reload, keyboard ArrowRight again recalculated values and the focused slider's computed style confirmed `rgb(2, 132, 199) solid 3px` with a 4px offset. No unresolved finding remains in the reviewed scope.

## Limits and deferred scope

Saved scenarios are deferred; no local-device storage is implemented or implied. Annual scenarios remain net trading P&L, separate from the cash-goal bridge, and assumptions explicitly exclude payout eligibility and delays. Copied-account risk and nominal program labels are disclosed. Future journal/account/import navigation is presented as roadmap text rather than dead links.

This is a source and functional prototype review, not a complete WCAG audit: no screen-reader session, automated accessibility audit, target-user usability session, browser compatibility matrix or real statement reconciliation was performed. Small secondary typography is intentionally dense and should be tested with intended users. No merge, release or full M1 validation is approved by this report.
