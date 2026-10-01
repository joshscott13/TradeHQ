import Decimal from 'decimal.js';

// A private constructor prevents global Decimal settings from changing money math.
// Repeating quotients retain 100 significant digits; rounding is display-only.
const Money = Decimal.clone({ precision: 100, rounding: Decimal.ROUND_HALF_UP });
export type Period = 'week' | 'month' | 'year';
export type GoalMode = 'trading' | 'cash';
export interface TargetInput {
  goalAmount: string;
  period: Period;
  activeDays: string;
  accountCount: string;
  mode: GoalMode;
  payoutSharePercent: string;
  cashCosts: string;
}
export interface AnnualInput {
  dailyPerAccountAverage: string;
  annualTradingDays: string;
  accountCount: string;
}
export type FieldErrors<T> = Partial<Record<keyof T, string>>;
export type CalculationResult<T, V> =
  | { ok: true; value: V }
  | { ok: false; errors: FieldErrors<T> };
export interface TargetResult {
  currency: 'USD';
  period: Period;
  mode: GoalMode;
  tradingTarget: string;
  dailyPortfolioTarget: string;
  dailyPerAccountTarget: string;
  scaling: Array<{ accountCount: number; dailyPerAccountTarget: string }>;
  assumptions: string[];
}
export interface AnnualResult {
  currency: 'USD';
  annualTradingPnl: string;
  annualPerAccountPnl: string;
  scaling: Array<{ accountCount: number; annualTradingPnl: string }>;
  assumptions: string[];
}

function amount(value: string, allowNegative = false): Decimal | string {
  if (typeof value !== 'string' || !/^-?\d+(?:\.\d{1,8})?$/.test(value)) {
    return 'Enter a complete decimal amount with at most 8 decimal places.';
  }
  // Bound parsing work before constructing a decimal from arbitrary UI/storage input.
  if (value.length > 32) return 'Amount must be at most $1 trillion.';
  const parsed = new Money(value);
  if (!allowNegative && parsed.isNegative() && !parsed.isZero()) return 'Amount cannot be negative.';
  if (parsed.abs().gt('1000000000000')) return 'Amount must be at most $1 trillion.';
  return parsed;
}

function integer(value: string, max: number): number | string {
  if (typeof value !== 'string' || !/^\d{1,3}$/.test(value)) return `Enter a whole number from 1 to ${max}.`;
  const parsed = Number(value);
  return parsed >= 1 && parsed <= max ? parsed : `Enter a whole number from 1 to ${max}.`;
}

export function calculateTargets(input: TargetInput): CalculationResult<TargetInput, TargetResult> {
  const errors: FieldErrors<TargetInput> = {};
  const periodValid = ['week', 'month', 'year'].includes(input.period);
  if (!periodValid) errors.period = 'Select week, month or year.';
  if (!['trading', 'cash'].includes(input.mode)) errors.mode = 'Select a trading or cash goal.';
  const maxDays = input.period === 'week' ? 7 : input.period === 'month' ? 31 : 366;
  const goal = amount(input.goalAmount);
  const days = integer(input.activeDays, maxDays);
  const accounts = integer(input.accountCount, 100);
  if (typeof goal === 'string') errors.goalAmount = goal;
  if (typeof days === 'string') errors.activeDays = days;
  if (typeof accounts === 'string') errors.accountCount = accounts;
  // Trading mode has no dependency on cash controls, including unfinished fields.
  const costs = input.mode === 'cash' ? amount(input.cashCosts) : new Money(0);
  const share = input.mode === 'cash' ? amount(input.payoutSharePercent) : new Money(100);
  if (typeof costs === 'string') errors.cashCosts = costs;
  if (typeof share === 'string') errors.payoutSharePercent = share;
  else if (share.gt(100)) errors.payoutSharePercent = 'Trader share must be from 0 to 100%.';
  if (Object.keys(errors).length) return { ok: false, errors };
  // Above validation establishes these types without non-null values or stale results.
  if (typeof goal === 'string' || typeof days === 'string' || typeof accounts === 'string' || typeof costs === 'string' || typeof share === 'string') return { ok: false, errors };
  const cashRequired = goal.plus(costs);
  if (input.mode === 'cash' && share.isZero() && !cashRequired.isZero()) {
    return { ok: false, errors: { payoutSharePercent: 'A positive cash goal or costs are infeasible with 0% trader share.' } };
  }
  const tradingTarget = input.mode === 'cash'
    ? cashRequired.isZero() ? new Money(0) : cashRequired.times(100).div(share)
    : goal;
  const daily = tradingTarget.div(days);
  return {
    ok: true,
    value: {
      currency: 'USD', period: input.period, mode: input.mode,
      tradingTarget: tradingTarget.toFixed(),
      dailyPortfolioTarget: daily.toFixed(),
      dailyPerAccountTarget: tradingTarget.div(new Money(days).times(accounts)).toFixed(),
      scaling: Array.from({ length: accounts }, (_, index) => ({
        accountCount: index + 1,
        dailyPerAccountTarget: tradingTarget.div(new Money(days).times(index + 1)).toFixed(),
      })),
      assumptions: [
        'Equal allocation across active accounts; account size does not enter the formula.',
        'Active trading days are explicitly selected. Rounding is for display only.',
        ...(input.mode === 'cash' ? ['All modeled profit is paid in the selected period; no caps, buffers, eligibility restrictions or payment delays are modeled. Costs are for the selected period and are held constant across account comparisons.'] : []),
      ],
    },
  };
}

export function projectAnnualIncome(input: AnnualInput): CalculationResult<AnnualInput, AnnualResult> {
  const errors: FieldErrors<AnnualInput> = {};
  const daily = amount(input.dailyPerAccountAverage, true);
  const days = integer(input.annualTradingDays, 366);
  const accounts = integer(input.accountCount, 100);
  if (typeof daily === 'string') errors.dailyPerAccountAverage = daily;
  if (typeof days === 'string') errors.annualTradingDays = days;
  if (typeof accounts === 'string') errors.accountCount = accounts;
  if (typeof daily === 'string' || typeof days === 'string' || typeof accounts === 'string') return { ok: false, errors };
  const perAccount = daily.times(days);
  return {
    ok: true,
    value: {
      currency: 'USD',
      annualTradingPnl: perAccount.times(accounts).toFixed(),
      annualPerAccountPnl: perAccount.toFixed(),
      scaling: Array.from({ length: accounts }, (_, index) => ({ accountCount: index + 1, annualTradingPnl: perAccount.times(index + 1).toFixed() })),
      assumptions: [
        'Daily performance is assumed average net trading P&L per account across active days, including losing days.',
        'Annual active days are explicitly selected. This is a trading scenario, not received cash or a payout forecast.',
        'Accounts are assumed active for the entire period. Copied accounts share correlated trading exposure.',
      ],
    },
  };
}

export function formatUsd(value: string): string {
  const rounded = new Money(value).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  if (!rounded.isFinite()) throw new RangeError('Cannot format a nonfinite USD value.');
  const [whole, fraction] = rounded.abs().toFixed(2).split('.');
  return `${rounded.isNegative() && !rounded.isZero() ? '-' : ''}$${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${fraction}`;
}
