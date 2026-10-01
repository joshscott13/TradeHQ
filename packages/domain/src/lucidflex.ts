import Decimal from 'decimal.js';
import type { CalculationResult, FieldErrors, Period } from './index';

const Money = Decimal.clone({ precision: 100, rounding: Decimal.ROUND_HALF_UP });

export interface LucidFlexProfile {
  readonly id: string;
  readonly name: string;
  readonly firm: string;
  readonly program: string;
  readonly nominalAccountSize: string;
  readonly verifiedOn: string;
  readonly version: string;
  readonly sources: ReadonlyArray<{ readonly label: string; readonly url: string }>;
  readonly rules: {
    readonly qualifyingDays: number;
    readonly minimumDailyProfit: string;
    readonly minimumGrossRequest: string;
    readonly maximumGrossRequest: string;
    readonly requestFractionPercent: string;
    readonly traderSharePercent: string;
    readonly maxPayouts: number;
    readonly lockedMaximumLossBalance: string;
  };
}

export const LUCID_FLEX_50K_PROFILE: LucidFlexProfile = Object.freeze({
  id: 'lucidflex-funded-50k',
  name: 'LucidFlex funded $50k',
  firm: 'Lucid Trading',
  program: 'LucidFlex funded',
  nominalAccountSize: '50000',
  verifiedOn: '2026-09-30',
  version: '2026-09-30-v1',
  sources: Object.freeze([
    Object.freeze({ label: 'LucidFlex payouts', url: 'https://support.lucidtrading.com/en/articles/12945796-lucidflex-payouts' }),
    Object.freeze({ label: 'LucidFlex drawdown', url: 'https://support.lucidtrading.com/en/articles/12945815-lucidflex-drawdown' }),
  ]),
  rules: Object.freeze({
    qualifyingDays: 5,
    minimumDailyProfit: '150',
    minimumGrossRequest: '500',
    maximumGrossRequest: '2000',
    requestFractionPercent: '50',
    traderSharePercent: '90',
    maxPayouts: 5,
    lockedMaximumLossBalance: '50100',
  }),
});

export interface LucidFlexInput {
  dailyNetProfit: string;
  period: Period;
  activeDays: string;
  accountCount: string;
  accountCost: string;
}
export interface LucidFlexGoalInput {
  goalAmount: string;
  period: Period;
  activeDays: string;
  accountCount: string;
  accountCost: string;
}
export interface LucidFlexPayout {
  payoutNumber: number;
  day: number;
  perAccountGrossRequest: string;
  perAccountTraderCash: string;
  portfolioGrossRequest: string;
  portfolioTraderCash: string;
  retainedProfitPerAccount: string;
  postRequestLossHeadroomPerAccount: string;
}
export interface LucidFlexResult {
  fundedTradingPnl: string;
  retainedProfit: string;
  grossRequests: string;
  traderPayoutCash: string;
  cashAfterCosts: string;
  portfolioCosts: string;
  perAccount: {
    fundedTradingPnl: string;
    retainedProfit: string;
    grossRequests: string;
    traderPayoutCash: string;
    cashAfterCosts: string;
  };
  completedPayouts: number;
  modeledDays: number;
  transitionDay: number | null;
  schedule: LucidFlexPayout[];
  scaling: Array<{ accountCount: number; traderPayoutCash: string; cashAfterCosts: string; portfolioCosts: string }>;
  constraints: string[];
  assumptions: string[];
}
export type LucidFlexGoalResult = {
  feasible: true;
  minimumDailyProfit: string;
  maximumTraderCash: string;
  maximumCashAfterCosts: string;
  portfolioCosts: string;
  schedule: LucidFlexResult;
} | {
  feasible: false;
  maximumTraderCash: string;
  maximumCashAfterCosts: string;
  portfolioCosts: string;
  reason: string;
};

function moneyInput(value: string): Decimal | string {
  if (typeof value !== 'string' || !/^-?\d+(?:\.\d{1,8})?$/.test(value)) return 'Enter a complete decimal amount with at most 8 decimal places.';
  if (value.length > 32) return 'Amount must be at most $1 trillion.';
  const parsed = new Money(value);
  if (parsed.isNegative() && !parsed.isZero()) return 'Amount cannot be negative.';
  if (parsed.gt('1000000000000')) return 'Amount must be at most $1 trillion.';
  return parsed;
}
function wholeInput(value: string, max: number): number | string {
  if (typeof value !== 'string' || !/^\d{1,3}$/.test(value)) return `Enter a whole number from 1 to ${max}.`;
  const parsed = Number(value);
  return parsed >= 1 && parsed <= max ? parsed : `Enter a whole number from 1 to ${max}.`;
}
function validateCommon<T extends LucidFlexInput | LucidFlexGoalInput>(input: T, errors: FieldErrors<T>) {
  if (!['week', 'month', 'year'].includes(input.period)) errors.period = 'Select week, month or year.';
  const days = wholeInput(input.activeDays, input.period === 'week' ? 7 : input.period === 'month' ? 31 : 366);
  const accounts = wholeInput(input.accountCount, 100);
  const costs = moneyInput(input.accountCost);
  if (typeof days === 'string') errors.activeDays = days;
  if (typeof accounts === 'string') errors.accountCount = accounts;
  if (typeof costs === 'string') errors.accountCost = costs;
  return { days, accounts, costs };
}

/** Pure single-account schedule; identical accounts use the same request days. */
function simulate(daily: Decimal, days: number, accounts: number, costs: Decimal): LucidFlexResult {
  const rules = LUCID_FLEX_50K_PROFILE.rules;
  const dailyThreshold = new Money(rules.minimumDailyProfit);
  let retained = new Money(0);
  let traded = new Money(0);
  let cycleProfit = new Money(0);
  let grossTotal = new Money(0);
  let cashTotal = new Money(0);
  let qualifyingDays = 0;
  let modeledDays = 0;
  let transitionDay: number | null = null;
  const schedule: LucidFlexPayout[] = [];
  for (let day = 1; day <= days; day++) {
    modeledDays = day;
    retained = retained.plus(daily);
    traded = traded.plus(daily);
    cycleProfit = cycleProfit.plus(daily);
    if (daily.gte(dailyThreshold)) qualifyingDays++;
    // Gross requests floor to cents, then split arithmetic stays exact.
    const request = Money.min(retained.times(rules.requestFractionPercent).div(100).toDecimalPlaces(2, Decimal.ROUND_DOWN), rules.maximumGrossRequest);
    if (qualifyingDays >= rules.qualifyingDays && cycleProfit.gt(0) && request.gte(rules.minimumGrossRequest)) {
      retained = retained.minus(request);
      grossTotal = grossTotal.plus(request);
      const traderCash = request.times(rules.traderSharePercent).div(100);
      cashTotal = cashTotal.plus(traderCash);
      schedule.push({
        payoutNumber: schedule.length + 1, day,
        perAccountGrossRequest: request.toFixed(), perAccountTraderCash: traderCash.toFixed(),
        portfolioGrossRequest: request.times(accounts).toFixed(), portfolioTraderCash: traderCash.times(accounts).toFixed(),
        retainedProfitPerAccount: retained.toFixed(),
        postRequestLossHeadroomPerAccount: retained.minus(new Money(rules.lockedMaximumLossBalance).minus(LUCID_FLEX_50K_PROFILE.nominalAccountSize)).toFixed(),
      });
      qualifyingDays = 0;
      cycleProfit = new Money(0);
      if (schedule.length === rules.maxPayouts) { transitionDay = day; break; }
    }
  }
  const constraints: string[] = [];
  if (daily.lt(dailyThreshold)) constraints.push('Daily profit is below $150, so no days qualify for a payout request.');
  if (days < rules.qualifyingDays) constraints.push('At least five qualifying active days are required for the first payout request.');
  if (!schedule.length && daily.gte(dailyThreshold) && days >= rules.qualifyingDays) constraints.push('Retained profit has not reached the $500 minimum gross request.');
  if (transitionDay !== null) constraints.push('The funded phase stops at payout five. Live-stage income is not modeled.');
  return {
    fundedTradingPnl: traded.times(accounts).toFixed(), retainedProfit: retained.times(accounts).toFixed(),
    grossRequests: grossTotal.times(accounts).toFixed(), traderPayoutCash: cashTotal.times(accounts).toFixed(),
    cashAfterCosts: cashTotal.minus(costs).times(accounts).toFixed(),
    portfolioCosts: costs.times(accounts).toFixed(),
    perAccount: {
      fundedTradingPnl: traded.toFixed(), retainedProfit: retained.toFixed(), grossRequests: grossTotal.toFixed(),
      traderPayoutCash: cashTotal.toFixed(), cashAfterCosts: cashTotal.minus(costs).toFixed(),
    },
    completedPayouts: schedule.length, modeledDays, transitionDay, schedule,
    scaling: Array.from({ length: accounts }, (_, index) => ({
      accountCount: index + 1,
      traderPayoutCash: cashTotal.times(index + 1).toFixed(),
      cashAfterCosts: cashTotal.minus(costs).times(index + 1).toFixed(),
      portfolioCosts: costs.times(index + 1).toFixed(),
    })),
    constraints,
    assumptions: [
      'Fresh funded accounts start with zero profit, zero qualifying days and no prior payouts; evaluation and existing account history are excluded.',
      'Constant loss-free net daily trading P&L applies equally to each modeled account. Losses, breaches and drawdown paths are not modeled.',
      'Requests are approved and gross requests deducted immediately; qualifying days reset after each approval.',
      'Trader payout cash is projected from requests, not actual received cash by a calendar deadline. Two-business-day disbursement after approval is not modeled.',
      'Gross request amounts round down to cents. The 90% share is calculated exactly; display rounding is not an asserted payment-rounding policy.',
      'The entered account cost is for the selected period and applies to each modeled account. Portfolio costs scale with account count; costs are not automatically converted between periods or treated as recurring subscriptions.',
      'Modeled account counts are scenario inputs; firm account-count limits are not checked. Copied accounts have correlated exposure.',
      'Only the funded phase is modeled, stopping at the fifth payout; annual selection never extrapolates live-stage or replacement-account income.',
    ],
  };
}

export function simulateLucidFlex(input: LucidFlexInput): CalculationResult<LucidFlexInput, LucidFlexResult> {
  const errors: FieldErrors<LucidFlexInput> = {};
  const { days, accounts, costs } = validateCommon(input, errors);
  const daily = moneyInput(input.dailyNetProfit);
  if (typeof daily === 'string') errors.dailyNetProfit = daily;
  if (Object.keys(errors).length || typeof days === 'string' || typeof accounts === 'string' || typeof costs === 'string' || typeof daily === 'string') return { ok: false, errors };
  return { ok: true, value: simulate(daily, days, accounts, costs) };
}

export function solveLucidFlexGoal(input: LucidFlexGoalInput): CalculationResult<LucidFlexGoalInput, LucidFlexGoalResult> {
  const errors: FieldErrors<LucidFlexGoalInput> = {};
  const { days, accounts, costs } = validateCommon(input, errors);
  const goal = moneyInput(input.goalAmount);
  if (typeof goal === 'string') errors.goalAmount = goal;
  if (Object.keys(errors).length || typeof days === 'string' || typeof accounts === 'string' || typeof costs === 'string' || typeof goal === 'string') return { ok: false, errors };
  const rules = LUCID_FLEX_50K_PROFILE.rules;
  const cycles = Math.min(Math.floor(days / rules.qualifyingDays), rules.maxPayouts);
  const maximumTraderCash = new Money(rules.maximumGrossRequest).times(rules.traderSharePercent).div(100).times(cycles).times(accounts);
  const portfolioCosts = costs.times(accounts);
  const maximumCashAfterCosts = maximumTraderCash.minus(portfolioCosts);
  const capacity = { maximumTraderCash: maximumTraderCash.toFixed(), maximumCashAfterCosts: maximumCashAfterCosts.toFixed(), portfolioCosts: portfolioCosts.toFixed() };
  if (goal.plus(portfolioCosts).gt(maximumTraderCash)) {
    return { ok: true, value: {
      feasible: false, ...capacity,
      reason: cycles === 0 ? 'Fewer than five active days cannot support a payout request.' : `The ${cycles} funded payout cycle${cycles === 1 ? '' : 's'} available allow at most $2,000 gross each, with a 90% trader share across ${accounts} account${accounts === 1 ? '' : 's'}, before portfolio costs. The funded phase ends after five payouts.`,
    } };
  }
  if (goal.isZero() && costs.isZero()) return { ok: true, value: { feasible: true, minimumDailyProfit: '0', ...capacity, schedule: simulate(new Money(0), days, accounts, costs) } };
  // $800 × five days supplies $4,000 retained profit: the first 50% request
  // reaches $2,000. Later cycles retain at least $2,000 and also reach the cap.
  // Thus $800 attains capacity and is a constructive upper bound, not a guess.
  // Across all daily profits, cash is NOT monotone: an earlier first request
  // can pay less within a short horizon. Fix that first request day in each
  // interval (7, 6, 5). Subsequent requests occur every five days because
  // retained profit >= $500 plus five days >= $750 always clears the minimum.
  // Fixed request timing makes accumulated requests monotone within an interval.
  const candidates: number[] = [];
  for (const [start, end] of [[15000, 16666], [16667, 19999], [20000, 80000]]) {
    if (new Money(simulate(new Money(end).div(100), days, accounts, costs).cashAfterCosts).lt(goal)) continue;
    let low = start;
    let high = end;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      const cash = simulate(new Money(mid).div(100), days, accounts, costs).cashAfterCosts;
      if (new Money(cash).gte(goal)) high = mid;
      else low = mid + 1;
    }
    candidates.push(low);
  }
  const minimum = new Money(Math.min(...candidates)).div(100);
  return { ok: true, value: { feasible: true, minimumDailyProfit: minimum.toFixed(), ...capacity, schedule: simulate(minimum, days, accounts, costs) } };
}
