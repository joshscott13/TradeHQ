# M1-02 domain implementation handoff

Date: 2026-09-30. From: domain-dev. To: orchestrator, domain-reviewer, typescript-reviewer.

Implemented the accepted [calculator prototype contract](../adr/0005-calculator-prototype.md) in `packages/domain`, plus the private MIT root npm workspace manifest. No firm-specific policy, ledger, cash receipt records, imports or persistence were introduced.

## Contract

`calculateTargets` accepts decimal-string inputs and returns a discriminated success/error result. Success includes decimal-string trading target, portfolio daily target, per-account daily target and 1–N equal-allocation comparisons. Trading mode ignores hidden cash controls. Cash mode adds selected-period external costs before dividing by the explicitly entered trader share; zero share with a positive required result is an explicit field error. Zero goal/cost can produce zero.

`projectAnnualIncome` uses a signed average daily net result, explicitly entered annual active days and account count. It returns annual trading P&L and a 1–N comparison, separately from targets and received cash. Assumptions include correlated exposure and accounts surviving the entire modeled period.

All arithmetic uses a private decimal.js constructor with 100 significant digits. Repeating divisions are finite high-precision approximations, never cent-rounded intermediate values. `formatUsd` rounds half-up to two decimal places for display without converting money to binary floats. Results are JSON serializable strings.

Validation rejects incomplete/nonfinite/exponent/comma/overprecision inputs. Amounts accept up to eight fractional digits and absolute values up to $1 trillion. Goals and costs are nonnegative; annual daily averages may be negative. Accounts are 1–100; active days are 1–7 per week, 1–31 per month, or 1–366 per year. Parsing length is bounded. The orchestrator accepted these prototype bounds for ADR documentation.

## Verification observed

- `npm run test --workspace=@tradehq/domain`: eight tests passed, zero failed. Explicit filename prevents silently skipping a missing test file.
- `npm run typecheck --workspace=@tradehq/domain`: passed.
- Before implementation, `python tools/verify.py`: repository documentation and board checks passed.

Tests independently encode CALC-01 weekly/monthly/yearly ratios, CALC-02 costs/share and reduced-account scenarios, CALC-04 positive/negative annual scaling, zero goals, infeasible share, decimal precision, half-up rounding and invalid/boundary inputs. This does not establish firm eligibility, user validation or actual income.

## Integration and remaining review

Frontend received the API before integration. The root orchestrator installed dependencies and owns the lockfile. Exact dependencies are decimal.js 10.6.0, tsx 4.23.15 and TypeScript 7.0.2. Root verification, browser checks and independent reviewer approval remain the orchestrator's release evidence. No board state was changed by this worker.
