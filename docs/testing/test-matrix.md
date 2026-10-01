# Test matrix

TradeHQ has a generic USD calculator prototype merged in PR #1 at `bc04e4b`. These rows distinguish actual prototype/tooling checks from proposed product and integration validation. Passing repository tooling does not establish product readiness or financial correctness.

| Case | Tier | Status | Validated against | Evidence required |
| --- | --- | --- | --- | --- |
| BOOT-01 | unit | Passed local gates and independent approval 2026-09-30 | Local Markdown files, milestone board and Git working tree | `python tools/verify.py` and whitespace checks; see the [test-engineer handoff](../handoffs/2026-09-30-test-engineer-to-orchestrator-M0-01.md) and [independent review](../reviews/2026-09-30-bootstrap.md). |
| BOOT-02 | unit | Passed local gates and independent approval 2026-09-30 | Actual current milestone board and ten temporary invalid/drift fixtures | `python tools/status/render.py --check` and ten tooling regression checks; see the [test-engineer handoff](../handoffs/2026-09-30-test-engineer-to-orchestrator-M0-01.md) and [independent review](../reviews/2026-09-30-bootstrap.md). |
| RES-01 | integration against the real system | Pending source review | Primary competitor and prop firm documentation accessed during research | Record source URL, access date, supported claim and relevant limitations in research and dated review. No live platform import has been tested. |
| RES-02 | documentation preparation | Independent preparation review approved 2026-09-30; no real exports collected | Official program/cohort documentation and the program/export inventory | [Discovery review](../reviews/2026-09-30-discovery-readiness.md) checks source claims, cohort ambiguity, collection instructions and missing evidence. Preparing an inventory does not validate import support or complete M1-04. |
| FIN-01 | unit | Proposed accounting review; no implementation | [Worked accounting examples](../research/accounting-examples.md#fin-01--trading-results-and-cash-outcome) | Independently reconcile trade results, fees, evaluation costs and payout economics; identify pending policy choices. |
| CALC-01 | unit | Generic prototype domain checks passed; broader scenario specification remains proposed | [Scenario calculator examples](../research/accounting-examples.md#calc-01--weeklymonthlyyearly-targets) and accepted ADR 0005 | The [generic review](../reviews/2026-09-30-calculator.md) records explicit day/account targets, simplified cash and annual cases. Firm rules require separately scoped evidence; broader history/loss scenarios remain planned. |
| DES-01 | end-to-end lab | Generic desktop/mobile source and interaction review approved; user validation planned | User palette, documented design brief and running generic prototype | The [generic review](../reviews/2026-09-30-calculator.md) records screenshots, keyboard behavior and a resolved focus-contrast finding. This is not full WCAG or target-user validation. |
| DES-02 | documentation preparation | Independent preparation review approved 2026-09-30; no participant sessions conducted | Implemented calculator controls and a neutral usability/interview kit | [Discovery review](../reviews/2026-09-30-discovery-readiness.md) checks tasks against the current prototype, reconciles facilitator reference values, and distinguishes observations from hypotheses. Preparing a kit does not complete target-user validation or M1-05. |
| FUT-01 | integration against the real system | Planned | User-authorized CSV exports from selected platforms and their account statements | Reconcile imported rows, duplicate handling, fees and account totals against real exports with sensitive data removed. |
| FUT-02 | end-to-end lab | Planned | Implemented journal flow on desktop and mobile browsers | Enter/import trades, associate accounts, edit journal entries and verify portfolio reporting using reconciled data. |

## Current verification commands

Python 3.10 or newer is required. These tools use only the standard library. Boards use JSON syntax inside `.yaml` files, which is valid YAML 1.2. Run from the repository root:

```text
python tools/status/render.py
python tools/verify.py
python tools/status/render.py --check
python -m unittest discover -s tools/tests
git diff --check
```

`make verify` is an optional wrapper when Make is installed. External URLs and primary source claims are reviewed separately. The link checker ignores fenced code, verifies Markdown heading anchors and reference definitions, and checks local board document paths. It does not fetch URLs or render HTML.

## M1 prototype cases

| Case | Tier | Status | Validated against | Evidence required |
| --- | --- | --- | --- | --- |
| CALC-02 | unit | 8 domain cases passed locally | Accepted ADR 0005 and manually reconciled target examples | Domain tests for exact targets, cash split/costs, invalid inputs and rounding |
| CALC-03 | end-to-end lab | Desktop/mobile flow checks passed; focus correction verified and review approved | Running generic prototype in desktop/mobile browser | Edit controls, switch modes/periods, handle invalid input, compare scaling and reset; see [generic review](../reviews/2026-09-30-calculator.md) |
| CALC-04 | unit | 13 LucidFlex cases and 129 independent reference checks passed locally | Amended ADR 0006 and official LucidFlex policy | Payout thresholds, retained profit, caps, split, lifecycle, piecewise inverse target minimality and invalid inputs; [independent review](../reviews/2026-09-30-lucidflex.md) records source and oracle evidence |
| CALC-05 | end-to-end lab | Root desktop/mobile/keyboard flows passed; independent source/screenshot review approved | Running LucidFlex planner | Profile, goal/apply and request schedule, timing discontinuities, infeasibility, validation, reset and generic preservation; [independent review](../reviews/2026-09-30-lucidflex.md) distinguishes root browser execution from reviewer assessment; user validation remains planned |
