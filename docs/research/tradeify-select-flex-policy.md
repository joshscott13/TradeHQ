# Tradeify Select Flex funded $50k policy review

Task M1-10. Sources accessed 2026-09-30 (America/Chicago). Scope: a hypothetical fresh simulated funded Select Flex `$50k` account purchased **after** September 1, 2026. This does not identify Josh's account cohort, establish native import compatibility, or approve a production eligibility engine. Implementation needs a scoped accepted ADR.

## Verified payout contract

**Facts:** Five winning days qualify a cycle; the `$50k` threshold is at least `$150` daily profit. Trader share is 90%. The minimum gross request is `$250`; maximum is 50% of current balance minus starting balance, capped at `$2,500` for the scoped cohort. Earlier purchases have a `$3,000` cap. Flex has no payout buffer/minimum balance, funded consistency rule or DLL. New cycle profit must be positive for subsequent requests. Five winning days are rebuilt after payout; prior retained profit participates in the next 50% calculation. Only one request can be pending per account, until processed. The page describes processing as approval/payment or denial. These facts come from [Select payout policies](https://help.tradeify.co/en/articles/12853966-select-flex-and-select-daily-payout-policies).

The same page's before/after date wording leaves purchases exactly on September 1 unresolved; older summary examples retain older caps. Exclude exact-date and older cohorts from this preset. The `$250` minimum is in the side-by-side Flex withdrawal table, not just the Daily section. Day qualification is inclusive because the Flex instructions say at least the threshold. No official cent-rounding rule was established.

**Facts:** The dedicated [drawdown policy](https://help.tradeify.co/en/articles/10495897-rules-trailing-max-drawdowns) describes EOD trailing limits enforced continuously against net liquidation value. Touching the floor fails the account. Funded `$50k` locks at `$50,100` when EOD balance reaches the listed `$52,100` trigger or a payout is requested first. The payout page also uses “exceeds” around the EOD trigger. Request/approval wording varies in neighboring documentation; an immediate-approval scenario makes that timing distinction immaterial, but must not claim full live breach detection.

**Facts:** [Select evaluation](https://help.tradeify.co/en/articles/12853921-select-evaluation-accounts) confirms Flex is chosen after passing and the choice is permanent. There is no funded activation fee or ongoing funded fee. Evaluation purchases, optional services and trading costs are separate; no evaluation-stage profit becomes payout cash. [Activation fees](https://help.tradeify.co/en/articles/10468246-are-there-activation-fees) independently confirms zero activation fee. [Trading commissions](https://help.tradeify.co/en/articles/10468315-trading-commission-fees) lists per-contract round-trip costs incorporating exchange, clearing, NFA and commission charges. An input called daily net trading profit must already include applicable trading costs once.

## Account and lifecycle boundaries

**Facts:** [Account limits](https://help.tradeify.co/en/articles/10468251-how-many-simulated-funded-accounts-can-i-have-at-once) permits at most five active simulated funded accounts per individual and household, combined across Growth, Select Flex/Daily and Lightning. This scenario covers only homogeneous `$50k` Select Flex accounts; it assumes no other active household accounts consume slots.

**Facts:** [Elite program](https://help.tradeify.co/en/articles/12969284-tradeify-elite-program) starts consideration at three payouts on one account or ten payouts across plans since the last live transition (or first purchase if none). Selection is discretionary, not an automatic transition or a hard request-count cap. Once selected, transition is mandatory; simulated accounts/evaluations close, eligible funded accounts move live, and retained simulated profit does not carry over. It cannot justify repeatedly annualizing this simulated-funded stage.

**Model decision supplied by orchestrator, not firm policy:** Stop after the first complete synchronized payout cycle reaching either consideration threshold. For `N` fresh identical accounts with no other plan/history, cycle boundary `K = min(3, ceil(10/N))`. Thus `N=1..4` permits three modeled cycles and `N=5` two. All requests in a cycle are treated as an atomic hypothetical batch; four accounts can therefore reach twelve total requests in the final batch. This batching does not assert Tradeify approves all requests before discretionary review. No income, approval, retained-profit cashout or account replacement is modeled beyond that boundary. It is a conservative scope limit, not an official lifetime payout maximum or an assurance of earlier approval.

## Receipt timing and fees

**Facts:** [Rise payout instructions](https://help.tradeify.co/en/articles/12844518-rise-payouts-main-payout-method) distinguish Tradeify approval, arrival in Rise within 24–48 hours, and a separate bank withdrawal taking 1–3 business days. Rise's Receive Payments account is free; that does not establish every transfer or currency-conversion fee as zero. [Plane instructions](https://help.tradeify.co/en/articles/10495945-plane-payouts-an-alternative-payout-option) describe manual bank transfers taking up to seven days and a one-week setup/verification process.

**Inference for prototype:** Assume requests are approved and paid immediately, with no pending overlap, loss, denial, transfer delay or transfer fee. Clearly label modeled payout cash rather than cash actually received. Optional external costs reduce modeled cash once. Leave acquisition/reset prices editable; do not bake a promotional price into income arithmetic. The exact winning-day commission basis and payout rounding remain unverified; disclose daily net profit as the scenario's conservative input basis. No actual account compliance is inferred from that input.

## Deterministic schedule proposed for the scoped ADR

These are transparent mathematical assumptions, not claims about observed trading or approval:

1. Fresh funded retained profit `R=0`; cycle profit and winning-day count start at zero. All `N` accounts have equal constant nonnegative daily net profit `p`, no losses or skipped active days, and zero prior payouts.
2. If `p < 150`, no qualifying days accrue and no request occurs. For `p >= 150`, a request cycle completes every five active trading days. Minimum available request at the first cycle is `5×150×0.5 = 375`, above the `$250` minimum.
3. On a completed cycle, available retained profit `A = R + 5p`; gross request `W = min(A/2, 2500)`. For a cent-based prototype, floor `W` to cents as a declared conservative modeling convention; official rounding is unknown. Retained profit becomes `R = A − W`, modeled trader cash increases by `0.9W`, and day/cycle counters reset.
4. Stop at the earlier of selected active days and cycle boundary `K`. Do not accrue trading profit after the modeled stop. Before stopping, incomplete-cycle days add retained profit but produce no payout. Each account loses the full gross request from simulated balance; the 10% split is not retained or subtracted twice.
5. Any real floor breach, account closure, existing profit/history, mixed portfolio or pending approval falls outside this model. Daily positive results do not prove an intraday path never breached.

Inverse constraints: positive goals need `D >= 5` and `p >= 150`. Within this model the cash output is monotonic in cent-denominated `p`; request counts depend only on `D`, `N` and the stated boundary. Search cents from `15000` to `100000` for the smallest daily net amount meeting goal plus external costs. At `$1,000/day`, the first five days produce `$5,000` profit and the `$2,500` cap; every later modeled cycle is also capped. Higher daily profit cannot increase payout cash within this finite scope. Zero goal with zero costs can return zero; infeasible targets must show the finite modeled ceiling, not a guaranteed earnings ceiling.

## Synthetic acceptance examples

| Inputs | Manually derived modeled outcome |
| --- | --- |
| `p=$149.99`, any supported horizon | Zero qualifying days, zero payout requests. |
| `p=$150`, `N=1`, `D=5` | Gross request `$375`; trader cash `$337.50`; retained profit `$375`. |
| `p=$200`, `N=1`, `D=15` | Gross requests `$500`, `$750`, `$875`; trader cash `$1,912.50`; retained profit `$875`; stop at third payout. |
| `p=$200`, `N=5`, `D=20` | Two cycles through active day 10; aggregate trader cash `$5,625`; aggregate retained profit `$3,750`; no modeled income on days 11–20. |
| `p=$1,000`, `N=1`, `D>=15` | Three capped requests; trader cash ceiling `$6,750` before external costs. |
| `p=$1,000`, `N=5`, `D>=10` | Two cycles × five accounts; trader cash ceiling `$22,500` before external costs. |

Real statements, eligibility adjudication, target-user validation, other Tradeify/Lucid variants and native platform adapters remain outside this task.
