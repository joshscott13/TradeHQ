# TradeHQ

A planned trading journal and financial overview for traders operating across multiple prop firms.

Know how you traded, what each account earned, and what actually reached your pocket. The design direction is a polished, modern fintech workspace for savvy traders aged 25–50.

**Stage:** M1 income/scaling calculator prototype with generic planning and a sourced LucidFlex funded $50k scenario. Journal, imports, broader firm profiles and hosted service remain planned.

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

Open http://localhost:3000. Choose **LucidFlex** for the funded $50k rule model or **Generic planning** for unconstrained targets and annual net-P&L scenarios. Both use USD, editable active trading days, precise decimal calculations and explicit equal-account assumptions. No account credentials or private statements are required.

The LucidFlex planner models fresh funded accounts with constant, loss-free daily net trading P&L. It shows the five-payout funded lifecycle, modeled trader request cash, retained trading profit, portfolio costs, an inverse daily-profit target and account scaling. Rules and official source links are visible in the app, verified on 2026-09-30 under [ADR 0006](docs/adr/0006-lucidflex-planner.md). Requests assume immediate approval and deduction; processing delays, losses, drawdown paths, permitted account-count limits, existing accounts and live-stage income are excluded. Annual selection stops at the fifth funded payout rather than repeating accounts. Modeled request cash is not actual cash received or confirmed eligibility.

Generic cash mode remains a simplified full-distribution scenario; it does not apply firm-specific eligibility or payout timing. Reset restores the editable example assumptions, which are scenario inputs rather than trading records.

Run `npm test`, `npm run typecheck` and `npm run build` for application checks. Repository checks and actual user/integration validation remain distinct.

## License

TradeHQ is licensed under the [MIT License](LICENSE), copyright 2026 Josh Scott.
