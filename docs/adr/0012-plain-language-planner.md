# 0012: Plain-language planner copy

Status: accepted

Date: 2026-10-01

Deciders: Josh (explicit request to simplify calculator language), Codex orchestrator (presentation contract)

## Context

Calculator copy exposes internal accounting and simulation terms in the main workflow. Josh requested simpler UX language. Financial calculations, policy contracts and source assumptions remain unchanged.

## Decision

Use plain-language labels across all four planners. Preserve canonical financial vocabulary in domain contracts and the glossary; add documented presentation aliases rather than redefining accounting terms. Plain profit labels must explain that commissions/trading fees are already deducted. Firm output stays explicitly an estimate of potential requested payouts, never received money or guaranteed income. Generic output stays trading profit, distinct from firm payout estimates.

Presentation mappings: net trading P&L -> trading profit after trading fees; daily net trading P&L/account -> daily profit per account; modeled active accounts -> number of accounts; retained profit -> profit left in accounts; derived portfolio costs -> total account costs; trader request cash -> estimated payout (your share, before account costs); cash after costs -> estimated payout after account costs. Gross request -> payout request before the firm's share, with clear table/helper text distinguishing request deduction from user share. Avoid ambiguous balance, take-home or money-you-will-receive labels.

Keep short, visible essentials near controls/results: estimates only; funded account/no previous payouts; qualifying purchase dates (strictly after September 1, excluding that date); daily profit after trading fees and same profit/no loss days; selected-period costs; modeled pause before future/live income. For Select Daily, keep a short visible exact-buffer assumption and daily eligibility versus payment timing. Detailed rule explanations, source versions, full assumptions and ledger definitions may use accessible disclosure sections. Important notices cannot disappear entirely into disclosures. Existing precision, cohort, approval, cent-flooring and review conventions remain available unchanged in meaning.

No calculation, defaults, source-profile strings, public types, dependencies, persisted state, payout eligibility or input bounds change. Domain errors/constraints shown in UI should be presented plainly without losing validation limits or caveats. Control labels and their accessible names must agree. Tables retain financial distinctions in simple wording. Keep the existing visual design and keyboard behavior.

## Consequences

Users can read the primary workflow without understanding internal ledger terminology. Detailed policy context remains available for informed review. User research and actual statement reconciliation remain open; a copy review does not validate market demand.

## Decisions on open questions

Josh explicitly authorized simpler calculator language. Presentation aliases are accepted here; canonical domain/glossary terms remain authoritative. Copy and disclosure arrangement can be selected by the frontend specialist and independently reviewed.

## References

- [Glossary](../glossary.md)
- [Per-account costs](0009-per-account-planning-costs.md)
- [Select Daily](0011-tradeify-select-daily-planner.md)
