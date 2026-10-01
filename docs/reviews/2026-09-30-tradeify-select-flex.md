# 2026-09-30: Tradeify Select Flex independent review

Historical artifact note: named temporary scripts and screenshots were local-only, uncommitted review aids and are not publicly reproducible from this checkout. Original dates, test counts, actor attribution and dispositions are preserved; artifact basenames below are identifiers, not repository links.

Decision: **approve** the scoped M1-10 hypothetical planner under accepted [ADR 0008](../adr/0008-tradeify-select-flex-planner.md). This approves the implementation and its declared model, not actual account eligibility, received income or real-statement validation.

## Scope and primary evidence

Independently reviewed the domain/profile, solver, tests, TypeScript integration, input trust boundary, UI copy, styling and parent-executed browser evidence. Read the [research record](../research/tradeify-select-flex-policy.md) and developer handoffs. Independently opened official sources on 2026-09-30:

- [Select payout policy](https://help.tradeify.co/en/articles/12853966-select-flex-and-select-daily-payout-policies): five $150+ winning days, positive cycle net profit, $250 minimum gross request, half retained profit, $2,500 cap for purchases after September 1, 2026, 90% share and one pending request. The date itself remains excluded because before/after wording does not establish equality.
- [Funded-account limits](https://help.tradeify.co/en/articles/10468251-how-many-simulated-funded-accounts-can-i-have-at-once): five combined funded accounts per individual and household across plan types.
- [Elite program](https://help.tradeify.co/en/articles/12969284-tradeify-elite-program): three payouts on one account or ten across accounts begins discretionary consideration. It is not an automatic transition or simulated-funded profit cap; actual selection changes the treatment.
- [Drawdown rules](https://help.tradeify.co/en/articles/10495897-rules-trailing-max-drawdowns), [commissions](https://help.tradeify.co/en/articles/10468315-trading-commission-fees), [activation fees](https://help.tradeify.co/en/articles/10468246-are-there-activation-fees), [Rise](https://help.tradeify.co/en/articles/12844518-rise-payouts-main-payout-method) and [Plane](https://help.tradeify.co/en/articles/10495945-plane-payouts-an-alternative-payout-option) confirm why drawdown compliance, actual receipt dates and additional cash costs remain separate from this simplified request model.

## Findings and model correctness

Resolved during review: the initial ADR incorrectly called net daily profit the verified winning-day basis. It now distinguishes the official daily-profit threshold from an unverified commission basis and declares net P&L a conservative model choice. Final domain assumptions explicitly preserve that uncertainty and the household limit; profile sources include payout, household and Elite provenance.

No remaining blocking findings. Monetary strings reject incomplete/exponent/nonfinite, negative, over-eight-decimal and over-$1-trillion amounts; account/day bounds prevent unbounded loops. Decimal precision 100 avoids binary monetary accumulation. Gross requests floor to cents, while the exact 90% share is preserved until display. Net trading costs are excluded from cash costs to prevent double subtraction. User values render through React; there is no persistence, account access, remote request or execution of supplied content.

The inverse search is sound within the declared constant nonnegative performance model: at $150/day the first half-profit request is $375, above the $250 minimum. Qualifying schedules therefore remain fixed at five-day intervals across the search. Request cash is monotone for fixed account count/horizon; $1,000/day reaches the request cap immediately. Independent exhaustive enumeration verifies the minimum cent target, including fractional-cent goals and fixed portfolio costs.

Each scaling count reruns its own modeled pause, min(3, ceil(10/N)) complete cycles. Four accounts can cross ten requests in a synchronized batch; five stop after two cycles. This deliberate conservative pause, immediate approval/processing and fresh zero-history cohort are model assumptions, not official maximum income, approval ordering or mandatory transition rules. Annual views stop at the same pause. The UI states these limits prominently.

## Independent arithmetic and checks

The reviewer executed a separate BigInt oracle, outside repository implementation/tests, with eight-decimal input units and exact share arithmetic: **1,525 checks passed** (550 forward/scaling cases, 960 exhaustive inverse cases and 15 invalid-input cases). Inverse reference values enumerate all 85,001 daily-cent candidates from $150 to $1,000 for each fixed cycle count, rather than duplicate the production binary search. Cases cover partial horizons, subthreshold/zero performance, eight-decimal boundaries, huge bounded inputs, all account counts, costs and infeasible capacity.

Manual reconciliation:

| Scenario, zero cash costs | Gross requests per account | Portfolio trader cash | Portfolio retained profit | Model pause |
| --- | --- | --- | --- | --- |
| $150/day, one account, five days | $375 | $337.50 | $375 | Not reached |
| $200/day, one account, twenty available days | $500 / $750 / $875 | $1,912.50 | $875 | Day 15 |
| $200/day, five accounts, twenty available days | $500 / $750 | $5,625 | $3,750 | Day 10 |
| $1,000/day, four accounts, annual | $2,500 / $2,500 / $2,500 | $27,000 | $30,000 | Day 15 |
| $1,000/day, five accounts, annual | $2,500 / $2,500 | $22,500 | $25,000 | Day 10 |

Reviewed all 13 new domain tests. Root reports clean install, 42 total domain/import tests, workspace typechecks, production build and ten tooling tests passing; these full-suite commands were parent-executed. Reviewer independently executed the oracle and documentation/status/whitespace checks recorded in the handoff.

## Browser and visual evidence

Root executed browser interactions; reviewer inspected source and supplied desktop/mobile screenshots independently. Root observed default $3,968.75 after costs, $186.67 solved target and keyboard Enter apply yielding $5,000.06; the manually reconciled $200 scenarios; account-six validation clearing results; four-day no-request/infeasible goal; $23,000 exceeding the selected five-account model's $22,500 ceiling; annual pause; reset; generic and Lucid preservation (Lucid $8,103.13). Mobile viewport 390×844 reported document/scroll widths 375 with no outer overflow. Wide tables scroll within their containers. Labels, keyboard controls and visible established focus styling were source-reviewed; no full assistive-technology or WCAG certification is claimed.

Screenshots inspected: `tradehq-tradeify-planner.png` and `tradehq-tradeify-mobile.png`. Cohort notice, cash-versus-retained distinction, review pause, dated primary links and count-specific scaling are visible. This reviewer did not execute browser interactions.

## Remaining gates

Actual account cohort and prior history, payment rounding/commission eligibility basis, approval ordering, continued funded/live treatment, drawdown/loss paths, native exports/statements and participant validation remain unresolved. This work does not complete M1 or validate the board task against actual trading records. Other requested $50k variants remain separately scoped.
