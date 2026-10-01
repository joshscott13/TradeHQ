import Decimal from 'decimal.js';
import type { CalculationResult, FieldErrors, Period } from './index';

const Money = Decimal.clone({ precision: 100, rounding: Decimal.ROUND_HALF_UP });

export interface TradeifySelectFlexProfile {
  readonly id: string;
  readonly name: string;
  readonly firm: string;
  readonly program: string;
  readonly nominalAccountSize: string;
  readonly cohort: string;
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
    readonly maximumFundedAccounts: number;
    readonly reviewPayoutsPerAccount: number;
    readonly reviewPortfolioPayouts: number;
  };
}
export const TRADEIFY_SELECT_FLEX_50K_PROFILE: TradeifySelectFlexProfile = Object.freeze({
  id: 'tradeify-select-flex-funded-50k-after-2026-09-01',
  name: 'Tradeify Select Flex funded $50k',
  firm: 'Tradeify', program: 'Select Flex funded', nominalAccountSize: '50000',
  cohort: 'Evaluation accounts purchased strictly after September 1, 2026; that date and earlier cohorts are excluded.',
  verifiedOn: '2026-09-30', version: '2026-09-30-v1',
  sources: Object.freeze([
    Object.freeze({ label: 'Select Flex and Select Daily payout policies', url: 'https://help.tradeify.co/en/articles/12853966-select-flex-and-select-daily-payout-policies' }),
    Object.freeze({ label: 'Simulated funded account limits', url: 'https://help.tradeify.co/en/articles/10468251-how-many-simulated-funded-accounts-can-i-have-at-once' }),
    Object.freeze({ label: 'Tradeify Elite program', url: 'https://help.tradeify.co/en/articles/12969284-tradeify-elite-program' }),
  ]),
  rules: Object.freeze({
    qualifyingDays: 5, minimumDailyProfit: '150', minimumGrossRequest: '250',
    maximumGrossRequest: '2500', requestFractionPercent: '50', traderSharePercent: '90',
    maximumFundedAccounts: 5, reviewPayoutsPerAccount: 3, reviewPortfolioPayouts: 10,
  }),
});

export interface TradeifySelectFlexInput {
  dailyNetProfit: string;
  period: Period;
  activeDays: string;
  accountCount: string;
  accountCost: string;
}
export interface TradeifySelectFlexGoalInput {
  goalAmount: string;
  period: Period;
  activeDays: string;
  accountCount: string;
  accountCost: string;
}
export interface TradeifySelectFlexPayout {
  payoutNumber: number;
  day: number;
  perAccountGrossRequest: string;
  perAccountTraderCash: string;
  portfolioGrossRequest: string;
  portfolioTraderCash: string;
  retainedProfitPerAccount: string;
}
export interface TradeifySelectFlexScaling {
  accountCount: number;
  traderPayoutCash: string;
  cashAfterCosts: string;
  portfolioCosts: string;
  completedPayouts: number;
  totalPortfolioRequests: number;
  reviewBoundaryDay: number | null;
  modeledDays: number;
}
export interface TradeifySelectFlexResult {
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
  totalPortfolioRequests: number;
  modeledDays: number;
  reviewBoundaryDay: number | null;
  reviewBoundaryCycles: number;
  schedule: TradeifySelectFlexPayout[];
  scaling: TradeifySelectFlexScaling[];
  constraints: string[];
  assumptions: string[];
}
export type TradeifySelectFlexGoalResult = {
  feasible: true;
  minimumDailyProfit: string;
  maximumTraderCash: string;
  maximumCashAfterCosts: string;
  portfolioCosts: string;
  schedule: TradeifySelectFlexResult;
} | {
  feasible: false;
  maximumTraderCash: string;
  maximumCashAfterCosts: string;
  portfolioCosts: string;
  reason: string;
};

function amount(value: string): Decimal | string {
  if (typeof value !== 'string' || !/^-?\d+(?:\.\d{1,8})?$/.test(value)) return 'Enter a complete decimal amount with at most 8 decimal places.';
  if (value.length > 32) return 'Amount must be at most $1 trillion.';
  const parsed = new Money(value);
  if (parsed.isNegative() && !parsed.isZero()) return 'Amount cannot be negative.';
  if (parsed.gt('1000000000000')) return 'Amount must be at most $1 trillion.';
  return parsed;
}
function whole(value: string, max: number): number | string {
  if (typeof value !== 'string' || !/^\d{1,3}$/.test(value)) return `Enter a whole number from 1 to ${max}.`;
  const parsed = Number(value);
  return parsed >= 1 && parsed <= max ? parsed : `Enter a whole number from 1 to ${max}.`;
}
function validateCommon<T extends TradeifySelectFlexInput | TradeifySelectFlexGoalInput>(input: T, errors: FieldErrors<T>) {
  if (!['week', 'month', 'year'].includes(input.period)) errors.period = 'Select week, month or year.';
  const days = whole(input.activeDays, input.period === 'week' ? 7 : input.period === 'month' ? 31 : 366);
  const accounts = whole(input.accountCount, TRADEIFY_SELECT_FLEX_50K_PROFILE.rules.maximumFundedAccounts);
  const costs = amount(input.accountCost);
  if (typeof days === 'string') errors.activeDays = days;
  if (typeof accounts === 'string') errors.accountCount = accounts;
  if (typeof costs === 'string') errors.accountCost = costs;
  return { days, accounts, costs };
}

/** Each count has a different discretionary-review pause, so never multiply a one-account horizon. */
function simulateAccountCount(daily: Decimal, days: number, accounts: number, costs: Decimal): Omit<TradeifySelectFlexResult, 'scaling'> {
  const rules = TRADEIFY_SELECT_FLEX_50K_PROFILE.rules;
  const reviewBoundaryCycles = Math.min(rules.reviewPayoutsPerAccount, Math.ceil(rules.reviewPortfolioPayouts / accounts));
  let retained = new Money(0);
  let traded = new Money(0);
  let cycleProfit = new Money(0);
  let gross = new Money(0);
  let cash = new Money(0);
  let qualifying = 0;
  let modeledDays = 0;
  let reviewBoundaryDay: number | null = null;
  const schedule: TradeifySelectFlexPayout[] = [];
  for (let day = 1; day <= days; day++) {
    modeledDays = day;
    retained = retained.plus(daily);
    traded = traded.plus(daily);
    cycleProfit = cycleProfit.plus(daily);
    if (daily.gte(rules.minimumDailyProfit)) qualifying++;
    if (qualifying < rules.qualifyingDays || cycleProfit.lte(0)) continue;
    const request = Money.min(retained.times(rules.requestFractionPercent).div(100).toDecimalPlaces(2, Decimal.ROUND_DOWN), rules.maximumGrossRequest);
    if (request.lt(rules.minimumGrossRequest)) continue;
    retained = retained.minus(request);
    gross = gross.plus(request);
    const traderCash = request.times(rules.traderSharePercent).div(100);
    cash = cash.plus(traderCash);
    schedule.push({
      payoutNumber: schedule.length + 1, day,
      perAccountGrossRequest: request.toFixed(), perAccountTraderCash: traderCash.toFixed(),
      portfolioGrossRequest: request.times(accounts).toFixed(), portfolioTraderCash: traderCash.times(accounts).toFixed(),
      retainedProfitPerAccount: retained.toFixed(),
    });
    qualifying = 0;
    cycleProfit = new Money(0);
    if (schedule.length === reviewBoundaryCycles) { reviewBoundaryDay = day; break; }
  }
  const constraints: string[] = [];
  if (daily.lt(rules.minimumDailyProfit)) constraints.push('Daily profit is below $150, so no days qualify for a payout request.');
  if (days < rules.qualifyingDays) constraints.push('At least five qualifying active days are required for the first payout request.');
  if (reviewBoundaryDay !== null) constraints.push('The model pauses for discretionary Elite Live review; this is not an automatic transition or an official funded payout cap.');
  return {
    fundedTradingPnl: traded.times(accounts).toFixed(), retainedProfit: retained.times(accounts).toFixed(),
    grossRequests: gross.times(accounts).toFixed(), traderPayoutCash: cash.times(accounts).toFixed(), cashAfterCosts: cash.minus(costs).times(accounts).toFixed(),
    portfolioCosts: costs.times(accounts).toFixed(),
    perAccount: {
      fundedTradingPnl: traded.toFixed(), retainedProfit: retained.toFixed(), grossRequests: gross.toFixed(),
      traderPayoutCash: cash.toFixed(), cashAfterCosts: cash.minus(costs).toFixed(),
    },
    completedPayouts: schedule.length, totalPortfolioRequests: schedule.length * accounts,
    modeledDays, reviewBoundaryDay, reviewBoundaryCycles, schedule, constraints,
    assumptions: [
      'Hypothetical Select Flex funded $50k cohort: evaluations purchased strictly after September 1, 2026. September 1 itself and earlier cohorts are excluded.',
      'Fresh identical funded accounts start with zero profit and no prior payout/live history. All five individual and household funded-account slots are assumed available, with no other household Tradeify funded accounts across any plan type.',
      'Constant nonnegative loss-free net daily trading P&L applies equally to all accounts. Losses, drawdown paths and actual eligibility approval are not modeled.',
      'The official winning-day commission basis is unverified. Daily net trading P&L is a conservative scenario input, not an official eligibility definition.',
      'Gross requests are approved and deducted immediately, with processing before the next modeled trading day; one pending request per account and typical 24–48 hour processing are not calendar-simulated.',
      'Trader payout cash is modeled request cash, not actual cash received. Gross requests round down to cents; the exact 90% share is display-rounded only, with no asserted payment-rounding policy.',
      'The model pauses at the first synchronized cycle reaching three payouts per account or ten portfolio payouts for discretionary Elite Live consideration. This is not an official payout maximum or automatic live transition.',
      'A synchronized cycle can cross ten total requests. Actual approval ordering, continued funded treatment and Elite Live income remain unresolved.',
      'Each scaling count recomputes its review pause and account cost times that count. Entered account costs apply only to the selected period, with no automatic period conversion or assumed recurring subscription. Trading costs already included in net daily P&L must not be subtracted again.',
      'Copied exposure is correlated. Annual views stop at the modeled review pause and never extrapolate live income or account replacements.',
    ],
  };
}
function withScaling(daily: Decimal, days: number, accounts: number, costs: Decimal): TradeifySelectFlexResult {
  return {
    ...simulateAccountCount(daily, days, accounts, costs),
    scaling: Array.from({ length: TRADEIFY_SELECT_FLEX_50K_PROFILE.rules.maximumFundedAccounts }, (_, index) => {
      const count = index + 1;
      const scenario = simulateAccountCount(daily, days, count, costs);
      return {
        accountCount: count, traderPayoutCash: scenario.traderPayoutCash, cashAfterCosts: scenario.cashAfterCosts,
        portfolioCosts: scenario.portfolioCosts,
        completedPayouts: scenario.completedPayouts, totalPortfolioRequests: scenario.totalPortfolioRequests,
        reviewBoundaryDay: scenario.reviewBoundaryDay, modeledDays: scenario.modeledDays,
      };
    }),
  };
}

export function simulateTradeifySelectFlex(input: TradeifySelectFlexInput): CalculationResult<TradeifySelectFlexInput, TradeifySelectFlexResult> {
  const errors: FieldErrors<TradeifySelectFlexInput> = {};
  const { days, accounts, costs } = validateCommon(input, errors);
  const daily = amount(input.dailyNetProfit);
  if (typeof daily === 'string') errors.dailyNetProfit = daily;
  if (Object.keys(errors).length || typeof days === 'string' || typeof accounts === 'string' || typeof costs === 'string' || typeof daily === 'string') return { ok: false, errors };
  return { ok: true, value: withScaling(daily, days, accounts, costs) };
}
export function solveTradeifySelectFlexGoal(input: TradeifySelectFlexGoalInput): CalculationResult<TradeifySelectFlexGoalInput, TradeifySelectFlexGoalResult> {
  const errors: FieldErrors<TradeifySelectFlexGoalInput> = {};
  const { days, accounts, costs } = validateCommon(input, errors);
  const goal = amount(input.goalAmount);
  if (typeof goal === 'string') errors.goalAmount = goal;
  if (Object.keys(errors).length || typeof days === 'string' || typeof accounts === 'string' || typeof costs === 'string' || typeof goal === 'string') return { ok: false, errors };
  // $1,000 × five days supplies $5,000 retained profit and a $2,500
  // initial request. Every subsequent modeled cycle also reaches that cap.
  const maximum = simulateAccountCount(new Money(1000), days, accounts, costs);
  const capacity = { maximumTraderCash: maximum.traderPayoutCash, maximumCashAfterCosts: maximum.cashAfterCosts, portfolioCosts: maximum.portfolioCosts };
  if (goal.gt(maximum.cashAfterCosts)) {
    return { ok: true, value: {
      feasible: false, ...capacity,
      reason: days < 5 ? 'Fewer than five active days cannot support a payout request within this modeled horizon.' : `The goal exceeds request cash available within the selected horizon and the model's ${maximum.reviewBoundaryCycles}-cycle discretionary review pause. This does not establish firm-wide income impossibility or an official funded payout cap.`,
    } };
  }
  if (goal.isZero() && costs.isZero()) return { ok: true, value: { feasible: true, minimumDailyProfit: '0', ...capacity, schedule: withScaling(new Money(0), days, accounts, costs) } };
  // >=$150/day gives at least $375 gross at day five, clearing $250.
  // Subsequent request days remain fixed at five-day intervals, so total
  // cash is monotone within this bounded cent-valued search.
  let low = 15000;
  let high = 100000;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const cash = simulateAccountCount(new Money(mid).div(100), days, accounts, costs).cashAfterCosts;
    if (new Money(cash).gte(goal)) high = mid;
    else low = mid + 1;
  }
  const minimum = new Money(low).div(100);
  return { ok: true, value: { feasible: true, minimumDailyProfit: minimum.toFixed(), ...capacity, schedule: withScaling(minimum, days, accounts, costs) } };
}
