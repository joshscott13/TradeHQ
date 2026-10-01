# Test matrix

TradeHQ is a pre-code repository. These rows distinguish bootstrap checks and proposed validation from application tests. Passing repository tooling does not establish product readiness or financial correctness.

| Case | Tier | Status | Validated against | Evidence required |
| --- | --- | --- | --- | --- |
| BOOT-01 | unit | Passed local gates and independent approval 2026-09-30 | Local Markdown files, milestone board and Git working tree | `python tools/verify.py` and whitespace checks; see the [test-engineer handoff](../handoffs/2026-09-30-test-engineer-to-orchestrator-M0-01.md) and [independent review](../reviews/2026-09-30-bootstrap.md). |
| BOOT-02 | unit | Passed local gates and independent approval 2026-09-30 | Actual current milestone board and ten temporary invalid/drift fixtures | `python tools/status/render.py --check` and ten tooling regression checks; see the [test-engineer handoff](../handoffs/2026-09-30-test-engineer-to-orchestrator-M0-01.md) and [independent review](../reviews/2026-09-30-bootstrap.md). |
| RES-01 | integration against the real system | Pending source review | Primary competitor and prop firm documentation accessed during research | Record source URL, access date, supported claim and relevant limitations in research and dated review. No live platform import has been tested. |
| FIN-01 | unit | Proposed accounting review; no implementation | [Worked accounting examples](../research/accounting-examples.md#fin-01--trading-results-and-cash-outcome) | Independently reconcile trade results, fees, evaluation costs and payout economics; identify pending policy choices. |
| CALC-01 | unit | Planned manual specification review; no implementation | [Scenario calculator examples](../research/accounting-examples.md#calc-01--weeklymonthlyyearly-targets) | Independently review goal periods, active account-days, simplified cash assumptions, caps and correlated account scaling after contract decisions. No calculator code or automated financial tests exist. |
| DES-01 | unit | Proposed design review; no UI | User palette, audience and documented design brief | Review hierarchy, visual direction, accessibility intentions and mobile adaptation in the design brief. Rendered UI testing waits for implementation. |
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
