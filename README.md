# TradeHQ

A planned trading journal and financial overview for traders operating across multiple prop firms.

Know how you traded, what each account earned, and what actually reached your pocket. The design direction is a polished, modern fintech workspace for savvy traders aged 25–50.

**Stage:** M1 income/scaling calculator prototype with generic planning, sourced LucidFlex and hypothetical Tradeify Select Flex funded $50k scenarios, and local TradeHQ-format CSV preview. Journal, native export adapters, broader firm profiles and hosted service remain planned.

- [Product requirements](docs/PRD.md)
- [Research](docs/research/market-research.md)
- [Design brief](docs/design/design-brief.md)
- [Milestones](docs/PLAN.md)
- [Next actions](ROADMAP.md)
- [Generated task status](STATUS.md)
- [Architecture](ARCHITECTURE.md)
- [Contribution workflow](CONTRIBUTING.md)

Run `python tools/verify.py` to verify repository documentation and board consistency. Run `python tools/status/render.py` after editing the board.

## Run the calculator

Use Node.js 24 and npm. From the repository root:

```text
npm ci
npm run dev
```

Open http://localhost:3000. Choose **LucidFlex** or **Tradeify Select Flex** for their separately scoped funded $50k rule models, or **Generic planning** for unconstrained targets and annual net-P&L scenarios. All use USD, editable active trading days, precise decimal calculations and explicit equal-account assumptions. No account credentials or private statements are required.

The LucidFlex planner models fresh funded accounts with constant, loss-free daily net trading P&L. It shows the five-payout funded lifecycle, modeled trader request cash, retained trading profit, portfolio costs, an inverse daily-profit target and account scaling. Rules and official source links are visible in the app, verified on 2026-09-30 under [ADR 0006](docs/adr/0006-lucidflex-planner.md). Requests assume immediate approval and deduction; processing delays, losses, drawdown paths, permitted account-count limits, existing accounts and live-stage income are excluded. Annual selection stops at the fifth funded payout rather than repeating accounts. Modeled request cash is not actual cash received or confirmed eligibility.

The Tradeify Select Flex profile is a **hypothetical evaluation-purchase cohort strictly after September 1, 2026**, not an identification of your actual account. September 1 itself and earlier cohorts are excluded. Under [ADR 0008](docs/adr/0008-tradeify-select-flex-planner.md), the model assumes fresh funded accounts, no other household Tradeify accounts, all 1–5 funded slots available, and constant loss-free daily net P&L. Using net profit for qualifying days is a conservative modeling assumption; the public policy does not settle commission basis. The visible rule/source profile was verified on 2026-09-30.

Select Flex modeling deliberately pauses at discretionary live consideration: three payouts on one account or ten across all plan types, applied as complete synchronized cycles. This is a **conservative model boundary, not an automatic transition or official funded payout cap**. Each account-count scenario recomputes that boundary, so five accounts can show less modeled cash than four. Annual views do not forecast continued funded or live income. Requests assume immediate approval/processing; actual typical 24–48 hour processing and payment dates are excluded. Account costs can include evaluation, reset, activation or platform fees for the selected period; exclude commissions/trading fees already deducted in daily net P&L.

**Account costs:** Each cash planner uses expected cost per account for the selected week/month/year under [ADR 0009](docs/adr/0009-per-account-planning-costs.md). For example, $100 per account for three accounts in a month gives $300 derived portfolio costs. The input equation and result show that total; each scaling row recomputes costs for its own count. Enter purchases, resets and applicable activation/platform costs expected in that period, excluding trading costs already in daily net P&L. Changing periods does not convert costs or make a one-time purchase recurring. Defaults are $50 per account across five accounts ($250 total). Trading-mode targets and the annual net-P&L projection remain independent of these cash costs.

Generic cash mode remains a simplified full-distribution scenario; it does not apply firm-specific eligibility or payout timing. Reset restores the editable example assumptions, which are scenario inputs rather than trading records.

Run `npm test`, `npm run typecheck` and `npm run build` for application checks. Repository checks and actual user/integration validation remain distinct.

## Review example trades

Choose **Imports** or open `/imports` to preview synthetic Lucid/Tradovate and Tradeify/Rithmic closed-trade summaries. Both examples use the same [TradeHQ CSV contract](docs/adr/0007-example-import-preview.md), not native vendor export headers. You can also choose a UTF-8 CSV file or edit the CSV text, then select **Preview records**. Inputs changing clears the prior result.

Preview shows gross trading P&L, commissions, other trading fees, net trading P&L, per-account totals, unique records and exact repeats skipped. Invalid rows or conflicting duplicate identities prevent totals. Files are limited to 250 KiB and 2,000 records. Data stays in the browser tab; there is no upload, save or persistent ledger. Native Tradovate/Rithmic compatibility and reconciliation against real statements remain pending.

## License

TradeHQ is licensed under the [MIT License](LICENSE), copyright 2026 Josh Scott.
