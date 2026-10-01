# 2026-09-30: frontend-dev → orchestrator · M1-03

## Done

Implemented the Next.js calculator under apps/web with pinned React, Tailwind and TypeScript dependencies. The responsive ink/sidebar and light workspace use the supplied palette, deliberate metric hierarchy and tabular numbers. Roadmap navigation is text; only the income planner is implemented.

Target controls cover USD amount, week/month/year, trading or simplified cash basis, active days, accounts, cash costs and trader share. Exact calculations come from @tradehq/domain. Inputs have precise numeric entry and keyboard-operable sliders; invalid calculations hide affected output and show field errors. Reset restores the editable example assumptions.

One-account versus selected-account targets retain the same portfolio goal. Annual side-income modeling has independent daily-average and annual-active-day inputs, account-count chart and expandable exact-value table. Daily average includes losing days and permits negative scenarios. Scope, rounding, cash eligibility assumptions and program-size meaning are explicit.

Updated the existing required CI verify job to retain Python checks and run npm ci, test, typecheck and build on Node 24.

## Look at this first

apps/web/app/page.tsx, apps/web/app/globals.css, .github/workflows/verify.yml and accepted ADR 0005.

## Deliberately unfinished

No journal, accounts, broker integrations, firm-specific rules, authentication or local persistence. The forthcoming areas are clearly roadmap text. The app models target/projection assumptions, not ledger records or received payouts. Full user validation and firm-rule discovery remain open.

## Reproduce green

`npm run typecheck --workspace @tradehq/web` passed. The orchestrator observed a passing root build and is reviewing the browser at localhost port 3001. Next.js generated agent instructions were inspected and removed; agentRules:false disables that generation while preserving the repository root instructions. Independent desktop/mobile, keyboard and invalid-input review is required before validation.

## Decisions made without an ADR

None. The palette, layout and omission of optional persistence are implementation choices within accepted ADR 0005.

## Questions for the receiver

None.
