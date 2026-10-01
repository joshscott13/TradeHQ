# M1-06 LucidFlex domain handoff

Date: 2026-09-30. From: domain-dev. To: orchestrator, domain-reviewer, typescript-reviewer.

Implemented the accepted [LucidFlex planner contract](../adr/0006-lucidflex-planner.md) under `packages/domain`. Generic calculator APIs remain available. No dependencies or lockfile changes were introduced.

## API and arithmetic

`LUCID_FLEX_50K_PROFILE` carries immutable funded-program rules, nominal size, source URLs, verification date and version. `simulateLucidFlex` validates decimal-string inputs and computes a constant loss-free funded-account schedule. It distinguishes net trading P&L, retained profit, gross requests, exact 90% trader payout cash and portfolio cash after costs. Requests round down to cents, reset qualifying days and deduct gross from retained profit. The fifth payout stops funded-phase trading; year-long inputs do not extend live-stage income.

The result includes per-account metrics, portfolio metrics, one-to-many scaling, request-day rows, post-request modeled loss headroom, transition day, constraints and explicit assumptions. Portfolio costs remain fixed in scaling comparisons; per-account cash after costs allocates them equally. Payout count is per account, with all identical accounts sharing request days.

`solveLucidFlexGoal` first checks theoretical capacity from qualifying-day cycles, the gross cap, trader share and modeled account count, including selected-period costs. Feasible goals return the smallest cent-valued daily profit and its full forward schedule; infeasible goals return the binding capacity without a fabricated target. Zero goal and zero costs return zero daily profit. Small goals can be exceeded because of the minimum request.

Independent review identified that total cash is not globally monotone in daily profit: an earlier first request can reduce cash within a short horizon. The solver searches three fixed-first-request-day intervals separately: 150.00–166.66 (day seven), 166.67–199.99 (day six), and 200.00–800.00 (day five). Later requests occur every five days in each interval. It selects the minimum across candidates. The $800 constructive upper bound attains all available $2,000 caps. This behavior is covered by timing-cliff regressions and an exhaustive independent integer-cent oracle.

Exact share arithmetic can produce fractional cents; only display rounds. No firm payment-rounding policy is asserted. All production money arithmetic uses a private precision-100 decimal.js constructor.

## Verification observed

- `npm run test --workspace=@tradehq/domain`: 21 tests passed, zero failed; eight generic and thirteen LucidFlex tests.
- `npm run typecheck --workspace=@tradehq/domain`: passed.

New tests cover immutable provenance, threshold and minimum requests, day-seven first request at $150/day, qualifying-day reset, retained-profit deductions, cap/fifth-payout transition, exact fractional-cent share, portfolio costs/scaling, zero scenarios, capacity and infeasibility, goal overshoot, one-cent-less failures, invalid fields and global-minimum comparisons against exhaustive integer-cent search.

Repository documentation verification initially encountered a CP1252 dash in the concurrently edited ADR 0006; the owning orchestrator was notified to restore UTF-8. Root owns integrated docs/build/browser verification and independent approval evidence.

## Boundaries

These are theoretical requests under immediate approval, not firm approval or actual cash received. Processing delay, losses, breaches, existing funded-account history, evaluation and live-stage policies remain excluded. Modeled account count does not validate firm account limits. No board state or Git commit was changed by this worker.
