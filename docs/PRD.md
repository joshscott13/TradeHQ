# TradeHQ product requirements

Status: broader product scope proposed. Current `main` at `1d10f83` includes generic USD planning, fresh funded LucidFlex $50k and hypothetical Tradeify Select Flex $50k planning, synthetic local CSV preview, per-account planning costs and Docker self-hosting under [ADRs 0005–0010](adr/README.md). Production journal/import, saved records and broader program contracts remain proposed. Updated: 2026-10-01. Read with [research](research/market-research.md), [plan](PLAN.md), [glossary](glossary.md) and [design brief](design/design-brief.md).

## Product outcome

Help a day trader review decisions across multiple prop-firm accounts and explain both trading performance and actual cash outcome. A displayed total must be traceable to its records, date basis, included accounts and currencies.

The intended users are financially and technically savvy traders aged roughly 25–50. The age range and visual direction are supplied by the maintainer; user research remains planned. Initial discovery focuses on Lucid and Tradeify $50k programs, all variants except direct funded; Josh deferred Apex. Josh selected Tradovate and Rithmic as example platforms without statements. Actual native schemas and the maintainer's purchase cohorts remain unconfirmed. The implemented CSV preview uses a synthetic TradeHQ schema, without native adapter, persistent import or received-cash claims. The TypeScript/React/Next.js App Router/Tailwind stack is implemented; PostgreSQL remains a direction under ADR 0001. Stateless Docker self-hosting is implemented under ADR 0010; hosted persistence, authentication and commercial boundaries remain open decisions.

## Core jobs

1. At the end of a session, import or enter trades, resolve exceptions and journal a trading decision once even when it was copied across accounts.
2. At the end of a week, compare results by firm/account and see the cost of operating prop accounts.
3. At the end of a month, explain what cash actually arrived after costs, without treating simulated account profit as banked money.
4. Plan a desired weekly, monthly or yearly side-income goal and see the required daily result under explicit active-day and account-count assumptions, comparing one `$50k` program account with multiple accounts.

## Proposed MVP

| Capability | Required behavior | Acceptance evidence |
| --- | --- | --- |
| Accounts | Firm, platform, program, phase, currency, display alias and active/closed history | Switching phases preserves historical records; closed accounts remain in historical totals |
| Trade capture | Manual entry and approved CSV mapping; preview before import; source provenance; correction and undo | A real redacted export reconciles to an independent statement total; repeat import creates no duplicates |
| Trade journal | Notes, setup, mistake tags and optional private screenshots; edit history for calculated record corrections | User reviews a session and can distinguish user notes from imported facts |
| Trading results | Gross trading P&L, trading costs and net trading P&L by account/period; drill-down to records | Totals match a manually verified dataset including partial exits, fees, flat results and corrections |
| Cash ledger | Firm fees, refunds and payout lifecycle; gross request, split, transfer costs and net cash received tracked distinctly | Received payouts affect cash outcome; requested/approved amounts remain excluded |
| Copied decisions | Optional explicit linking of account trades to a trading decision; confirmation before grouping | All account trades count toward account P&L while decision statistics count the linked decision once |
| Overview | Clear scope, date basis, freshness and completeness; separate trading and cash figures | Users explain totals correctly without a tutorial; incomplete data is visible |
| Portable records | Export owned records, metadata and notes; restore/backup path | Export and restore preserve independently checked totals and journal associations |
| Scenario calculator | Dynamic goal/period/day/account inputs; per-account and aggregate targets; trading-result and cash-goal modes; saved assumption summary | [Worked examples](research/accounting-examples.md) reconcile; prototype users can explain why account count does not guarantee proportional payouts |

MVP does not include order placement, automated trade copying, trade recommendations, bank connections, universal broker support, guaranteed payout eligibility, replay or AI coaching. Those are separately scoped future work. Screenshots are optional and must not block the first useful journal entry.

## Proposed accounting invariants

These are product definitions, pending an accepted financial-model ADR. They are not tax or financial advice.

- **Gross trading P&L** is realized trade result before separately recorded trading costs. Open P&L remains separate. Contract multipliers and instrument currency must be known; otherwise mark the result unresolved.
- **Trading costs** include commissions, exchange charges and financing/swap amounts where applicable. Record charges as positive costs and rebates as explicit negative costs. Never subtract a cost twice when an upstream net value already includes it.
- **Net trading P&L** = gross trading P&L − trading costs. Imported net-only results must be labeled net-only; do not invent a gross/cost breakdown.
- **Firm fees** include evaluations, subscriptions, resets, activation and other recorded operating charges. A phase change does not erase the fees of an earlier failed account.
- **Cash outcome** = received net payouts + received firm-fee refunds − paid firm fees − separately paid operating costs. Costs already withheld from a net payout are not subtracted again. Payout fees and profit split explain the gross-to-net bridge; they are not trading losses.
- A requested or approved payout is pending cash, not received cash. Simulated trading gains are not received cash. Never add trading P&L to received payouts as “total profit.”
- Deposits/withdrawals on personal live accounts are capital transfers, not trading returns; handling personal accounts is deferred until separately scoped.
- Currency amounts remain segregated unless an explicit FX policy supplies rate, source, effective date and conversion basis. No unlabeled mixed-currency total.
- Account P&L includes every actual account trade; trading decision statistics count linked copied decisions once. Use an explicit strategy-statistics policy for mixed results, representative return and size; never average incompatible risk units silently.
- A financial correction is recorded and traceable. Unknown is distinct from zero. All calculations use precise monetary/instrument quantities under the accepted ADR.

### Worked acceptance example

An explicitly linked decision produces three account trades. Each has gross P&L `$100` and trading costs `$5`; account trade count is `3`, trading decision count is `1`, aggregate net trading P&L is `$285`. Firm fees paid are `$150`. A payout request of `$200` becomes a received net payout of `$180`; the `$20` withheld split is already reflected in received net cash. Cash outcome is `$30`, not `$315`, `$135`, or `$10`. A request not yet received yields cash outcome `−$150`. These are synthetic acceptance values, not firm-policy examples.

## Date and import behavior

Every record carries source timezone and normalized timestamp. Trading-day rules and user display timezone are separate. MVP period filters use a named date basis: realized results by close timestamp and cash by received/paid date. Date-only cash records retain date-only precision. Overnight sessions, DST and overlapping imports require explicit tests. Never infer a timezone from the user's device without review.

Retain source batch and rows with private access, mapping version, diagnostics and stable upstream IDs when present. Dedupe within account and source, not across accounts. If IDs are absent, show candidate duplicate matches with a confirmation step. Reject ambiguous numeric/date parsing rather than guessing. Preview invalid/duplicate/accepted rows separately and reconcile before committing the import.

## Quality and privacy requirements

Monetary formulas and grouping semantics must be documented beside metric definitions. No hidden filters. A metric has drill-down, range, currency and last import timestamp. Incomplete costs show a warning in the total, not only in settings. Sample data is clearly marked. Empty state means no data, not a zero-performance claim.

Private by default. No production trade data, screenshots, access tokens or credentials in Git. Before a hosted multi-user release, enforce access control across all records, attachments and exports; test tenant isolation, restoration and deletion. An uploaded file is untrusted input. Product retention, backup and deletion policies await hosting decisions.

The interface should support keyboard use, zoom, meaningful chart descriptions and contrast-tested text. Red/green color alone must not communicate P&L. [Design brief](design/design-brief.md) defines review criteria; scoped desktop/mobile and keyboard lab evidence does not establish full WCAG conformance or target-user usability.

## Product validation targets

Planned discovery: 5–8 target-user interviews, including traders who copy across firms. Planned usability: 3 users completing account setup, import review, journaling and a monthly reconciliation. These are targets, not completed validation. Revisit scope if users consistently need direct sync to use the product at all. The user's real platform exports and statement totals are required before asserting import support.

The implemented planner can be tested now using [the usability kit](research/usability-test-kit.md) and [session template](research/usability-session-template.md), prepared under M1-08. Three planned planner sessions assess goals, active days, scaling, cash interpretation and funded-phase limits. They do not establish completed journal/import journeys, actual cash receipt, market demand or full accessibility conformance; M1-05 remains open until real evidence is collected.

## Decisions before broader implementation

Confirm exact Lucid/Tradeify $50k variants, cohorts and actual platforms within the selected scope; approve gross/net and cash definitions; confirm persistence/hosting details; determine personal-only vs multi-user product; approve matching, cost allocation, currency and calculator policies; decide what data can be retained for testing. Apex and direct-funded discovery are deferred. Record accepted decisions in ADRs before creating production interfaces.

## Scenario calculator requirements

The calculator is a first-class MVP feature, with prototype work in M1. Its output is a scenario target, not an income prediction or trading instruction. User selects goal basis (net trading P&L or cash outcome), amount, week/month/year, explicit active trading days and account count. Do not assume every weekday is traded, every month has four weeks or every year has 260 active days. Show the selected period calendar and days used. Zero active days or zero accounts is invalid; fractional account counts are invalid. Zero goal is allowed and a negative goal requires explicit interpretation rather than accidental parsing.

For an equal-account net-trading target `G` over `D` active days and `N` accounts, aggregate daily target is `G / D`, per-account daily target is `G / (D × N)`. An inverse scenario with per-account daily result `p` yields modeled trading P&L `p × N × D`. Include losing and skipped days; `p` is the net average across active days, not winning-day profit. Scenario currencies must match.

Cash-goal mode requires explicit fees/costs and payout assumptions; never substitute trading P&L for received cash. A simplified unconstrained model may use trader split `s` and period external cash costs `F`: required payout-eligible result `(G + F) / s`. Label the model's assumption that all modeled result is eligible and paid in the period; with caps, buffer/retention, qualifying days or unknown program rules, do not report this as attainable cash. Either apply a reviewed dated program policy or show unresolved/blocked cash modeling. Never apply a single split to every firm or multiply a cap by calendar weeks without validating cycles.

The `$50k` label describes a program size, not `$50k` deposited user equity or an unrestricted withdrawal base. Account count raises correlated copied-trade exposure and often costs; it is not diversification or guaranteed linear income. Separate planned accounts from active funded accounts and show scenarios with fewer surviving accounts. In MVP compare explicit conservative/base/optimistic daily-result and active-account inputs; avoid fake stochastic probabilities. A future Monte Carlo model requires a separate ADR, historical sample basis and distribution assumptions.
