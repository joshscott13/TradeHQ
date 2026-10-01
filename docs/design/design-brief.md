# TradeHQ design brief

Status: broader design direction proposed. Updated: 2026-10-01 against `main` at `650b980`. Generic, LucidFlex and hypothetical Tradeify Select Flex funded $50k planners, per-account costs and the synthetic local import preview are implemented with scoped lab reviews. Actual target-user validation, full accessibility conformance and persistent journal/import flows remain planned.

M1-15 merged the fourth hypothetical Tradeify Select Daily $50k planner in PR #11 under [ADR 0011](../adr/0011-tradeify-select-daily-planner.md). M1-16 presentation follows accepted [ADR 0012](../adr/0012-plain-language-planner.md), merged in PR #12 at `650b980` after independent review. The cohort and exact-buffer model convention are prominent. Its ledger table separates cycle profit before approval, gross deduction, trader request cash and retained profit after deduction. Daily eligibility never implies daily receipt; responsive controls, reset, invalid clearing and keyboard focus follow the existing experience.

## Experience contract

TradeHQ should feel like a carefully made financial workspace: calm, exact and fast. Users should see what happened, trust how it was calculated and reach the underlying records in one action. The target audience is financially and technically savvy, roughly ages 25–50, as specified by the maintainer. Do not infer visual preference from age alone.

The distinguishing interaction is the bridge between trading results and cash received, paired with one journal review for linked copied decisions. The [research](../research/market-research.md) supports these as hypotheses to test; it does not prove a competitive gap.

## Palette direction

| Supplied color | Proposed role | Constraint |
| --- | --- | --- |
| `#0f172a` | Deep ink, navigation or dark foundation | Pair with sufficiently light text and clear separators |
| `#1e40af` | Primary action and selected state in light surfaces | Reserve saturation for useful actions; verify all text combinations |
| `#0ea5e9` | Focus, chart secondary series and restrained accent | Do not assume white small text on this shade is accessible |
| `#22c55e` | Positive result accent, paired with sign and label | Use darker/lightened contextual variants for text; never use color alone |
| `#64748b` | Muted labels and neutral comparisons | Test against actual surfaces, especially dark mode and disabled states |

Add a separate loss/warning/error semantic family rather than turning blue into a loss signal. Derive accessible variants; supplied colors are inspiration, not immutable foreground tokens. The implemented prototype uses a dark navigation shell with light content surfaces and has scoped desktop/mobile reviews. Additional themes remain deferred; do not implement two themes before the broader core flows work.

## Layout and hierarchy

Current prototype navigation exposes planners and Imports. The following overview/journal/cash layouts describe the proposed broader MVP, not current screens. Desktop: stable narrow navigation, compact workspace header, account/date/currency scope above metrics. Proposed main navigation: Overview, Journal, Accounts, Cash ledger, Calculator, Imports. Settings belongs in the utility area. A predictable layout is more useful than movable dashboard tiles in MVP.

Overview leads with two clearly distinct figures: Net trading P&L and Cash outcome. Show currency, period and data completeness beside them. A restrained trend chart follows, then accounts with status and net results, then recent decisions requiring review. Avoid a wall of equal-sized KPI cards. Cash outcome opens its gross-to-net and fee ledger; trading results open included account trades.

Journal uses a compact, readable table with date, instrument, direction, account/linked-copy count, net result, setup and review state. A detail panel keeps the table context while showing executions, costs, notes and screenshots. Separate a decision-level view from an account-trade view with explicit labels and counts.

Cash ledger puts received, pending and paid amounts in distinct columns/views. Never style an approved payout as received. Accounts show firm + platform + phase; avatars/logos are secondary to exact names. Imports preview accepted rows, invalid rows and candidate duplicates, with actionable corrections before commit.

Mobile: single-column overview, visible filter scope, cards preserving numeric hierarchy, readable trade detail. Tables can use horizontal scroll or deliberate row summaries; do not shrink text to fit. Core actions remain reachable without hover.

## Dynamic calculator experience

Current planners offer generic, LucidFlex and hypothetical Tradeify Select Flex scenarios, editable active-day counts, account counts and week/month/year periods. They do not provide an active-day calendar, losing-day distribution or broader firm selector. Those remain proposed extensions, with Apex deferred. Make the broader calculator feel like an instrument the user can work with: precise inputs, clearly scoped program choices and one `$50k` program account versus scaling with the same assumptions visible. Account labels must not imply personal cash equity.

Update per-account daily target, aggregate daily target and modeled period result as inputs change. Give every slider a precise numeric input and keyboard controls. Keep currency and goal basis visible. Show fees and splits as a compact cash bridge; caps and qualifying-day restrictions have a separate effect, not an invisible haircut. Distinguish a simple trading-result scenario from a rule-constrained cash scenario. Unknown policy inputs show unresolved output, not invented precise cash.

Support explicit conservative/base/optimistic comparisons without assigning fake probabilities. Include fewer active accounts, losing days and skipped days as editable assumptions. A small chart can show the effect of account count or daily result; its title says scenario, and its underlying table remains available. Provide an assumption summary users can save/export. Respect reduced motion, avoid animated money counters and retain focus during recalculation.

## Typography, density and motion

Use a licensed/system sans serif with strong numerals. Prefer tabular figures for currency and aligned decimal columns. Display metrics can be 28–40 px, body text 14–16 px; essential financial data should remain readable at zoom. Use a deliberate spacing rhythm and thin, visible dividers. Flat surfaces with selective elevation create hierarchy; pervasive glass, glow and gradients undermine numerical clarity.

Motion should explain a drawer, selection or committed import. Keep it brief, respect reduced motion and avoid animated counters for financial totals. Charts use truthful scales, labeled axes, series legend and keyboard-accessible data. A cumulative result chart is labeled as realized trading P&L, not account equity if open positions are absent.

## Required states and copy

Design empty, loading, error, partial import, missing cost, stale data, pending payout, closed account and no matching filter states. Show “Costs missing for 4 account trades” beside the affected result. Show “No trades in this period” instead of `$0` when there are no records. Use “Imported through 2026-09-30” rather than a live badge for a file-based workflow. Use “Request recorded” and “Received” as distinct payout states.

Any sample dataset must have a persistent sample label. Do not fabricate success rates, social proof, account protection or profitability claims in onboarding. A user should never need to understand an implementation framework to complete a flow.

## Design review exit criteria

- Users correctly distinguish account trades, trading decisions, trading results and cash outcome in task-based testing.
- Every metric shows scope, date basis and currency, exposes its underlying records and communicates incomplete data.
- Keyboard navigation, focus visibility, zoom, reduced motion and contrast are tested on the actual build; charts provide an accessible alternative.
- Profit/loss uses signs and text as well as color; pending/unknown is visibly different from zero/received.
- Import review is understandable, duplicates require appropriate review and corrections have an undo/trace path.
- A reviewed desktop and mobile core journey shows consistent spacing, typography, hierarchy and all required states.

These are broader planned acceptance criteria. Existing source, desktop/mobile and keyboard reviews are scoped prototype evidence in the [test matrix](../testing/test-matrix.md), not full accessibility certification or completed target-user sessions.

## Plain-language planner presentation

Under accepted [ADR 0012](../adr/0012-plain-language-planner.md), primary labels use daily profit per account, number of accounts, total account costs and profit left in accounts. Profit helpers explicitly include commissions and trading fees. Estimated payouts identify the user share before account costs; the headline separately shows after-cost estimates. Full payout requests still leave the account, and tables distinguish the request from the user share. Generic trading-profit estimates remain separate from firm payout estimates.

Keep estimate-only, new funded/no previous payouts, purchase-date limits, same daily profit/no losing days, selected-period costs and stopping points visible. Select Daily keeps the exact-$2,100 convention and daily eligibility-versus-payment distinction visible. Put detailed rules, dated source versions, assumptions and definitions in keyboard-operable disclosures. Error, limit and unavailable-state language follows the same plain style. This is a copy change, not target-user validation or a calculation change.
