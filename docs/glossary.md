# TradeHQ glossary

Status: proposed product vocabulary, 2026-09-30. Interface definitions require accepted ADRs before implementation. Use these terms consistently in plans, task text and product copy.

| Term | Meaning |
| --- | --- |
| Firm | Prop-firm organization; distinct from the trading platform |
| Platform | System providing execution/trade history or exports |
| Program | Named firm offering or rule cohort, including effective version |
| Account | One distinct account history, with firm, program, platform and currency |
| Phase | Evaluation, simulated funded, live funded, or closed state; historical transitions are preserved |
| Execution | One fill; not automatically one complete trade |
| Account trade | Group of executions representing a position or completed round trip under an accepted matching policy |
| Trading decision | A journaled decision that can link one or more account trades, including copies |
| Copied decision | A trading decision linked explicitly to trades across accounts; links do not erase executions |
| Gross trading P&L | Realized trade result before separately recorded trading costs |
| Trading costs | Commissions, exchange charges and applicable financing/swap costs or explicit rebates |
| Net trading P&L | Gross trading P&L minus trading costs; net-only source results are labeled |
| Open P&L | Unrealized result, displayed separately from realized results |
| Firm fees | Paid evaluation, subscription, reset, activation or other recorded firm operating charges |
| Payout | Cash lifecycle from requested through approved to received, with gross-to-net bridge |
| Received net payout | Actual cash received after amounts withheld from that payout |
| Cash outcome | Received net payouts plus received firm-fee refunds minus paid firm fees and separately paid operating costs |
| Capital transfer | Deposit/withdrawal of personal capital; not trading return |
| Import batch | A traceable ingestion event containing source rows, mapping version and diagnostics |
| Reconciliation | Comparison of normalized results with an independent source total, including documented differences |
| Trading day | Named session/day boundary, distinct from device timezone and calendar date |
| Reference limit | User-entered, dated rule reference; not an automatically verified live breach detector |
| Scenario target | Required modeled result under explicit inputs; not a prediction or guaranteed payout |
| Active trading days | User-specified days intended for trading in the selected period, distinct from calendar weekdays |
| Program size | Firm's nominal account-size label, such as `$50k`; not user cash equity |

Avoid the unqualified labels “total profit,” “balance,” “net profit” and “ROI.” Qualify scope, basis and currency. Do not call simulated buying power deposited cash or investment capital. Final strategy-statistics definitions, including win/loss classification for copied decisions, remain a financial-model ADR decision.
