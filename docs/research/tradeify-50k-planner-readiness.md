# Tradeify $50k planner readiness

Task M1-14. Official sources accessed **2026-10-01, America/Chicago**. Research preparation only; no new planner, policy-engine approval or actual account/export validation. Scope: evaluation-based Growth and Select Daily, with comparison to existing Select Flex. Lightning skips evaluation and is excluded; Apex is deferred. Actual purchase/reset dates, funded choice, household accounts and payout history remain unknown.

## Programs, phases and cohorts

Current official [Growth evaluation guide](https://help.tradeify.co/en/articles/10495915-growth-evaluation-accounts) offers $50k: $3,000 target, $2,000 EOD drawdown, $1,250 soft DLL, four minis/40 micros; no evaluation consistency requirement and a possible one-day pass. Legacy position size before September 12, 2025, 8:00 AM EST is five minis/50 micros. Reset credits preserve the original purchase timeline. Funded accounts cannot reset; acquisition is one-time, not a subscription.

The [Select evaluation guide](https://help.tradeify.co/en/articles/12853921-select-evaluation-accounts) offers $50k: $3,000 target, $2,000 EOD drawdown, no evaluation DLL, four minis/40 micros and 40% consistency. An optional 50% consistency add-on permits a two-day pass instead of the usual three. Purchases before the new dashboard launch retain the original $2,500 target, including resets; that page does not supply a precise launch timestamp. Funded Flex/Daily choice occurs after evaluation and is permanent. Evaluation options must not be presented as separate funded payout policies.

These are currently documented offerings, not proof of checkout availability in a particular region. Old cohorts are supported policy branches, not different currently purchasable products. No other remaining evaluation-based $50k Tradeify variant was identified in the checked guides. The [pricing reference](https://help.tradeify.co/en/articles/14369021-tradeify-pricing-reference) also lists Growth, Select and instant-funded Lightning, the Select add-on and zero activation fees. It contains general summaries that conflict with dedicated rules; it is not the source of a frozen income-policy preset. Acquisition/reset prices stay user-entered under [ADR 0009](../adr/0009-per-account-planning-costs.md); no promotional price is assumed.

## Growth funded: request qualification versus protected balance

The [Growth payout policy](https://help.tradeify.co/en/articles/11083796-growth-funded-account-payout-policy) supplies:

| $50k parameter | General/current branch | Purchased before September 12, 2025, 8:00 AM EST |
| --- | --- | --- |
| Qualification balance | $53,000 | $52,100 |
| Gross request minimum / trader share | $500 / 90% | Same published minimum/share |
| Gross caps by request number | $1,500; $2,000; $2,500; $3,000 from fourth onward | $1,500; $1,750; $2,000; $2,250; $2,500; $3,000; thereafter up to $25,000 |
| Profitable days | Five or more, each **greater than $150**, reset after successful payout | Same global five-day rule; no legacy exception stated |

The qualification balance must survive until approval; one pending request is allowed. It is **not** a balance that must remain after withdrawing: the published current example permits $53,000 minus $1,500, leaving $51,500. Payment follows approved deduction; processing/denials remain separate from received cash. The page reserves discretionary live movement after a successful payout. Equality at the purchase cutoff and the intended EST-versus-seasonal-Eastern interpretation require explicit cohort confirmation; preserve source wording, not an invented UTC timestamp.

The dedicated [consistency rule](https://help.tradeify.co/en/articles/10468320-rules-consistency-rule) confirms funded Growth's 35%, equality allowed, reset after approval, and **commissions excluded from its profit basis**. Highest profitable day / cycle total must be at most 0.35; loss days reduce the denominator. That commission basis does not establish the basis for Growth's winning-day threshold. A daily net-P&L average alone cannot certify real consistency or eligibility.

The [DLL rule](https://help.tradeify.co/en/articles/10468321-rules-daily-loss-limit) starts Growth $50k at $1,250; at $53,000 the current DLL becomes $2,000 next session. Legacy accounts before the stated cutoff remove DLL at that threshold. Select Daily starts at $1,000, but the increase table does not specify its later tier; do not copy Growth's increase into Daily. A soft DLL pauses trading; it does not prevent slippage or a hard floor breach. [Drawdown rules](https://help.tradeify.co/en/articles/10495897-rules-trailing-max-drawdowns) describe continuous enforcement of the EOD floor and a $50,100 lock at the $52,100 EOD trigger or payout request first. Closed daily gains do not establish intraday compliance.

## Select Daily funded and existing Flex comparison

The dated [Select payout policy](https://help.tradeify.co/en/articles/12853966-select-flex-and-select-daily-payout-policies) gives Daily $50k a $2,100 retained-profit buffer, $250 minimum gross request, 90% share, daily eligibility, no funded consistency, $1,000 DLL and $2,000 EOD drawdown. Gross requests are limited by available profit above buffer and twice new cycle profit. Cap: $1,000 before September 1, 2026; $1,250 after. Subsequent cycles must be net positive; only one pending request. Date equality is unresolved.

Ambiguities: the general continuity section covers any day, while the workflow specifically mentions second-and-later requests. Core buffer wording prohibits going below the buffer, but its FAQ says remaining balance must stay above it; exact equality is unresolved. Its $700 example mentions both caps but leaves a post-request balance consistent only with the older cap. The comparison promises 24-hour processing while prose says 24–48 hours. Do not turn daily eligibility into a daily payment guarantee.

Existing [Select Flex profile](../adr/0008-tradeify-select-flex-planner.md) remains unchanged: hypothetical strictly-after cohort, five $150+ winning days, half retained profit, $2,500 cap, $250 minimum and 90% share; earlier cap $3,000. This recheck found no change requiring silent profile replacement. Preserve its dated version and net-profit modeling assumption; winning-day commission basis remains unknown. No current or legacy source facts authorize changing its declared model pause.

## Conflicts and collection prerequisites

- Select evaluation FAQ says Growth has no consistency at any stage; dedicated funded/consistency rules require 35%. Pricing overview misleadingly attaches 35% to Growth evaluation. Retain phase-specific sources and flag the contradiction before any eligibility engine.
- Select's overview still universally describes a minimum of three days despite its 50% add-on. Do not apply the default minimum to an opted-in account. The [3.0 update](https://help.tradeify.co/en/articles/14135902-tradeify-3-0-program-updates-improvements) corroborates the evaluation target change but does not settle an exact account-purchase launch timestamp.
- Dedicated [account limits](https://help.tradeify.co/en/articles/10468251-how-many-simulated-funded-accounts-can-i-have-at-once) permits five active funded accounts per person **and household**, combined across plans; failed/expired accounts do not count. It distinguishes Select's 15-evaluation/30-day limit from unlimited Growth evaluations. Pricing FAQ's unrestricted-evaluation summary is not universal.
- [Elite rules](https://help.tradeify.co/en/articles/12969284-tradeify-elite-program) begin discretionary consideration at three payouts on one account or ten across plans since last live transition/first purchase. No simulated profit cap or automatic transition follows. Once selected, accounts/evaluations close and simulated retained profit does not carry to live. Growth's earlier discretionary-reservation wording prevents assuming three guaranteed payouts. Live and legacy-live projections remain separate work.

Before modeling a user's account, collect exact program/phase, original purchase and reset evidence, add-on, permanent funded choice, other household slots, prior request/approval/denial/live history, trading-cost basis and current retained/cycle profit. Actual sources/records remain private and unavailable; no native CSV schema was inferred.

## Manually reconciled synthetic references

**Model assumptions only:** constant loss-free daily profit, zero assumed commissions for Growth's consistency reference (gross and net therefore coincide), immediate approval/deduction with no overlapping pending requests, gross-cent flooring and exact share until display. Daily examples permit post-request retained profit exactly $2,100 as an explicit equality convention from the core buffer section; conflicting FAQ wording remains unresolved for real accounts. No price, trading path, payout timing or actual eligibility is asserted. Expenses are $100/account in the selected period, never automatically recurring.

| Conditional calculation | Manually reconciled result |
| --- | --- |
| Growth current, fresh zero profit, $500/day, one account | Day 6: $3,000 retained, request $1,500, retain $1,500. Day 11: retain $4,000 before $2,000 request, retain $2,000. Day 16: retain $4,500 before $2,500 request, retain $2,000. Gross $6,000; trader cash $5,400; after one $100 cost $5,300. Equal cycle days yield 1/6 or 1/5 consistency, below 35%. Three requests here are an arithmetic reference, not guaranteed availability before discretionary transition. |
| Growth legacy, same performance, three reference requests | Days 5/10/15: $1,500/$1,750/$2,000 gross; retained $1,000/$1,750/$2,250; cash $4,725; after $100 cost $4,625. Trading profit $7,500 = $5,250 withdrawn + $2,250 retained. |
| Growth literal threshold boundary | Constant $150 days do not satisfy the dedicated page's strict comparator; reaching a balance alone cannot supply qualifying days. This is a source-wording test, not resolution of dashboard behavior or commission basis. |
| Daily current, fresh zero profit, $500/day | No request through day 4 ($2,000). Day 5: $2,500 retained; $400 available above buffer, so $400 gross/$360 share, retain $2,100. Days 6/7: $500 gross/$450 share each; retain $2,100. Total gross $1,400, cash $1,260, trading profit $3,500. Three identical accounts: cash $3,780 − $300 costs = $3,480; retain $6,300. |
| Daily later-cycle continuity binding | Hypothetical prior retained profit $3,500 plus $125 new-cycle profit: available above buffer $1,525, but twice new profit limits request to $250. Cash $225; post-request retained profit $3,375. $100 new cycle instead gives only $200, below request minimum. |
| Daily cohort cap distinction | Hypothetical pre-request retained profit $3,500 with $700 new-cycle profit: current gross $1,250/share $1,125/retained $2,250; older gross $1,000/share $900/retained $2,500. Never use the stale example's older residual for the current cap. |

## Recommended next safe scenario

**Recommendation, not accepted implementation:** fresh funded Select Daily $50k, evaluation purchase strictly after September 1, 2026, zero prior profit/request/live history and no other household accounts. It has enough explicit arithmetic to scope a prototype without resolving an existing account's first-cycle history. At the first request, all retained profit equals first-cycle profit `C`; available `max(C−2100,0) ≤ C ≤ 2C`. Thus the first-cycle continuity ambiguity cannot bind in this fresh zero-profit scenario. It must remain visible for any later support of existing history.

A new accepted ADR must define a retained-profit/cycle-profit ledger and request candidate `min(max(R−2100,0), 2C, 1250)`, explicitly choose the post-request buffer equality convention, minimum check after declared cent flooring, resets at modeled approval, cost/account semantics and zero/invalid handling. This candidate allows exact buffer equality as a model choice, not a resolved official rule. After requests reset `C`, not retained `R`. Net-positive cycle wording supports a declared net input; the precise first-cycle/rounding/real dashboard bases still do not become adjudicated eligibility.

The architect may reuse the existing **model choice** of stopping after complete synchronized cycles at `min(3, ceil(10/N))`, with one-to-five available household slots and no other history. It is neither a firm cap nor guaranteed three requests. Each count must rerun the ledger and pause; no annual/live extrapolation. Actual 24–48-hour processing cannot coexist with assumed receipt every active day; requests must be clearly hypothetical and approved before the next modeled day.

Test buffer/minimum boundaries, cycle losses/recovery or explicitly excluded losses, retained leftovers, pending-request exclusions, caps/cohorts, eight-decimal costs and count-specific pauses. Derive an independent exhaustive cent oracle before designing the inverse solver: request timing changes at buffer/minimum thresholds, so existing Flex monotonicity is not evidence for reusing its search. Growth should follow under a separate ADR resolving/declaring strict comparator, gross consistency basis, qualification-versus-post-payment balance and discretionary scope. This document accepts no ADR, completes no real integration and modifies no frozen profile.
