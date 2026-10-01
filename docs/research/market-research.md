# TradeHQ app and market research

Research date: 2026-09-30. Stage: desk research for the broader planned journal. Generic/scoped firm calculators, a synthetic CSV preview and Docker packaging are now implemented; the [plan](../PLAN.md) and [ADR index](../adr/README.md) track that scope. This documentation update does not refresh the research date or firm policies. No interviews, authenticated competitor walkthroughs, market-size study, willingness-to-pay test, or production connector tests have been completed.

## Decision this research supports

Start with a trustworthy trade journal, separate cash ledger and dynamic goal/scaling calculator across Lucid, Apex and Tradeify, the user's primary firms. Prove reconciliation and ease of review before building automatic connections or a firm-rule engine. Multi-account journaling and prop-firm costs are already competitive features; they are not evidence of an empty market.

The user supplied the audience (financially and technically savvy day traders, roughly ages 25–50), the multi-firm use case, and the premium fintech direction. Those are product inputs, not independently validated demographic findings.

## Evidence labels

- **Fact**: a dated observation from a primary source; a vendor feature statement is a vendor claim, not an independently tested capability.
- **Inference**: a design or product conclusion drawn from facts.
- **Hypothesis**: a claim about demand or preference that requires user evidence.
- **Proposed decision**: a recommendation awaiting the maintainer's decision and, where needed, an accepted ADR.

## Competitive observations

| Product | Primary-source observations | Implication for TradeHQ | Limits |
| --- | --- | --- | --- |
| TradeZella | Markets a prop-firm dashboard for multiple accounts, challenge metrics, trade journaling, costs vs payouts, and bank-connected PropFirm Sync. [Prop-firm product page](https://www.tradezella.com/solutions/prop-firm-traders) | A broad “all prop firms in one place” pitch is insufficient. Benchmark its cost reconciliation and copied-trade workflow directly. | Marketing claims; feature quality, availability by plan, and actual supported firms were not tested. |
| TraderSync | Markets detailed analytics, calendar, tagging, journal notes, strategy comparison, replay and AI features. [Trading journal](https://tradersync.com/trading-journal/) | Calendar, useful filters and trade review are category expectations. A smaller, reliable workflow may be preferable to matching its breadth; that preference is untested. | No account walkthrough or output reconciliation. |
| Tradervue | Lists broad platform imports and a generic format with commissions and fees. Its documentation explicitly notes missing commissions and execution times for some sources. [Supported brokers](https://app.tradervue.com/help/brokers) | Import provenance and missing-data warnings should be core product behavior. Never silently replace missing costs with zero. | Published support matrix, not tested imports. |
| Spreadsheet workflow | Flexible manual tracking is a plausible baseline, but no user spreadsheet was provided. | Ask users to show their actual workflow before choosing the information architecture. | Hypothesis; no observation of user behavior yet. |

**Inference:** TradeHQ's plausible wedge is a clear reconciliation trail from account trading results to cash received, with one review per copied trading decision and honest data-quality indicators. This is a differentiation hypothesis, not a claim competitors lack those capabilities.

## Prop-firm realities that affect the model

Topstep describes its Express Funded Account as simulated, with real payouts, account phases, separate activation costs and support for multiple accounts with a copier. **Fact.** [Express Funded Account parameters](https://help.topstep.com/en/articles/8284215-express-funded-account-parameters)

Topstep's payout policy distinguishes payout paths, account sizes, profit split, eligibility cycles and transfer charges. It also identifies a legacy cohort. **Fact.** [Payout policy](https://help.topstep.com/en/articles/8284233-topstep-payout-policy)

FTMO's objectives distinguish programs and define daily limits using equity that includes open P&L, swaps and commissions, with a CE(S)T day boundary. **Fact.** [Trading objectives](https://ftmo.com/en/trading-objectives/)

Apex publishes a consistency requirement that depends on results since account inception or a payout cycle. Its site also distinguishes legacy policies. **Fact.** [Consistency requirement](https://apextraderfunding.com/help-center/additional-helpful-items/50-consistency-requirement/)

**Inference:** A firm name alone cannot determine a rule. A future rule model needs program, phase, effective date, purchase cohort, timezone, balance/equity basis and payout-cycle state. Closed-trade files cannot establish every intraday breach. CSV-based rule estimates must disclose their coverage and must not claim live protection.

**Proposed decision:** MVP records account phase and user-entered reference limits, with a source link and date. Defer automated eligibility and breach decisions until a real-data integration can supply the necessary history and a rule ADR is accepted. Avoid embedding the numerical policies above as timeless defaults.

## Primary firms and calculator implications

Current discovery scope: Josh subsequently selected Lucid and Tradeify `$50k` evaluation-to-funded variants, excluding direct-funded products, and deferred Apex. The [program and export inventory](program-export-inventory.md) records candidate variants, legacy/cohort distinctions, source ambiguities and the private sample checklist. Only LucidFlex funded `$50k` currently has an implemented named-program planner; this research does not establish other preset or import support.

The following are dated policy observations, not implemented presets. Exact programs, purchase cohorts, platform and account phases still need confirmation from the user. These examples demonstrate why a firm-level universal split or linear account multiplier would be misleading.

| Firm/program observed | Primary-source fact as of 2026-09-30 | Product implication (inference) |
| --- | --- | --- |
| Lucid / LucidFlex | Official page states a 90% trader split, five qualifying profit days per payout cycle, a `$500` minimum request, and a `$50k` program request limit of 50% of profit up to `$2,000`. The page lists up to five requests before live transition. [LucidFlex payouts](https://support.lucidtrading.com/en/articles/12945796-lucidflex-payouts) | Target trading profit and target received cash differ; a modeled daily average does not establish qualifying days. Confirm current/legacy program before modeling transition. |
| Apex / Intraday PA | Official page states 100% approved payout split, qualifying days, safety-net balance, request caps by payout number and six-payout lifecycle. Its `$50k` table requires five days at `$200` minimum daily profit, a `$52,600` minimum request balance and `$1,500` first-request cap. [Intraday payouts](https://apextraderfunding.com/help-center/uncategorized/intraday-trailing-drawdown-payouts/) | Do not apply another firm's 90% split to Apex or annualize the first payout indefinitely. Model retained balance and lifecycle only when exact policy is reviewed. |
| Apex / EOD PA | Apex labels it simulated funded, specifies 100% approved payout split and a combined maximum of 20 active PAs. [EOD PA](https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-performance-accounts-pa/) | Account-count input needs exact program limits; nominal size is not personal invested capital. |
| Tradeify / Select Flex and Daily | Official policy separates Flex and Daily, gives a 90/10 split and has purchase-date-specific payout caps. [Select policies](https://help.tradeify.co/en/articles/12853966-select-flex-and-select-daily-payout-policies) | Store policy choice and effective cohort; don't use one Tradeify setting across all accounts. |
| Tradeify / consistency rules | Official rule page distinguishes Growth, Select Evaluation and Lightning requirements; Lightning percentage depends on purchase date and payout sequence. [Consistency rule](https://help.tradeify.co/en/articles/10468320-rules-consistency-rule) | Calculator cash eligibility cannot be inferred from a daily average alone. |

**Evidence caveat:** Apex's payout-page wording excludes a day that is 50% or more of cycle profit, while the separate consistency article includes a numerical example at 50%. Do not resolve a boundary discrepancy by guessing; verify exact policy with the firm before implementing an equality comparator. Lucid has separate legacy/current pages; a source labeled legacy must not override current rules silently.

**Hypothesis added by user request:** a polished calculator translating weekly/monthly/yearly goals into daily targets, with one `$50k` account vs many accounts, may be valuable alongside the journal. [Manual scenario examples](accounting-examples.md) define target arithmetic and limits. Validate usefulness in M1 prototype sessions. Explicit days, losing-day averages, external fees, split, payout cap, account survival and correlation matter; `$50k` is a nominal program size, not a cash bankroll.

## Import feasibility

Topstep documents exporting from Orders or Trades by date range. This establishes an export workflow, not a TradeHQ-tested CSV schema. **Fact.** [TopstepX export instructions](https://help.topstep.com/en/articles/14434175-topstepx)

TradeZella separates Auto Sync from File Upload and lists relevant platforms such as Project X, TopstepX, Rithmic and Tradovate. **Fact.** [Broker support](https://www.tradezella.com/brokersupport)

TraderSync's support page says direct connection depends on the Autosync column; otherwise users should expect file import. The search result was available, but the direct page fetch timed out on 2026-09-30. **Limited observation.** [Support page](https://tradersync.com/supported-broker/)

**Inference:** “Supported broker” must specify platform, export version, asset class, account type, import method, cost fields and reconciliation coverage. Do not promise hundreds of connectors because competitors do.

**Proposed first route:** obtain a redacted export from the user's most-used platform, plus a corresponding statement or dashboard total. Implement generic CSV/manual entry first only if approved. Select the first native mapping after examining that real file. Keep original rows, import batch, mapping version, timezone and normalization decisions. Reimport must be idempotent per account; near-matches need review rather than silent deletion. Independent identical executions may be legitimate.

## Market hypotheses and validation plan

| Hypothesis | Test | Evidence required to continue |
| --- | --- | --- |
| Cash reconciliation is painful enough to justify a separate tool | Interview 5–8 active multi-firm traders and inspect their existing records with consent | At least 3 show recent repeated reconciliation work and can name a material consequence; record counterexamples |
| CSV/manual entry is acceptable for the first release | Run a prototype import and week-end review with 3 target users | All complete core tasks; at least 2 choose to repeat the process with their next real export |
| Linked copies reduce review work without hiding exposure | Give users one decision copied to several accounts with different fills | Users distinguish the decision count from account trade count and correctly explain aggregate P&L |
| A premium interface matters after trust and effort | Compare two faithful prototypes with the same reconciled dataset | Record task success, trust explanation and preference; do not treat visual preference as purchase intent |
| Users will pay | Conduct direct pricing/value interviews after successful use; later test an explicit paid offer | Actual commitments or paid conversion; positive interview comments alone do not prove demand |

Do not invent TAM, growth figures, conversion rates or pricing. No subscription price is recommended from this initial review. A separate competitor pricing study should capture current plans, billing periods, taxes, connector access and account caps if a commercial launch is chosen.

## Interview guide

Ask for the last month they reconciled, not an ideal future workflow. Which firms and programs? Which platforms? How many accounts and copied trades? What does “profit” mean in their spreadsheet? Where do subscriptions, resets, activation charges, refunds and transfer fees live? How do they know a payout arrived? What happens when a funded account closes? Which currencies and day boundaries do they use? What made them abandon a previous journal? What would make the total untrustworthy?

Walk through one actual import, one partial fill, one copied decision, one fee and one payout. Record volunteered needs separately from prompted agreement. Never collect credentials or account-identifying files into Git; use redacted samples and consented storage.

## Source register

All links above were researched on 2026-09-30. TradeZella prop-firm page, TradeZella broker support, TraderSync journal, Tradervue broker support, Topstep payout policy, Topstep account parameters, TopstepX export instructions, FTMO objectives, Apex consistency/Intraday/EOD pages, LucidFlex payouts and Tradeify Select/consistency pages were opened successfully. TraderSync broker support was observed in search but its direct fetch failed. Firm policies and feature claims can change; recheck against the exact account/program before implementation. No source establishes TradeHQ market demand.
