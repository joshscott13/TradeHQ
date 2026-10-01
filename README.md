# TradeHQ

A planned trading journal and financial overview for traders operating across multiple prop firms.

Know how you traded, what each account earned, and what actually reached your pocket. The design direction is a polished, modern fintech workspace for savvy traders aged 25–50.

**Stage:** M1 generic income/scaling calculator prototype. Journal, imports, firm-specific eligibility and hosted service remain planned.

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

Open http://localhost:3000. The calculator uses USD, editable active trading days and explicit equal-account assumptions. Cash mode is a simplified full-distribution scenario; it does not predict actual prop-firm eligibility or payout timing. No account credentials or private statements are required.

Run `npm test`, `npm run typecheck` and `npm run build` for application checks. Repository checks and actual user/integration validation remain distinct.

## License

TradeHQ is licensed under the [MIT License](LICENSE), copyright 2026 Josh Scott.
