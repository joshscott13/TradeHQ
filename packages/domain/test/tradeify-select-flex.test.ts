import assert from 'node:assert/strict';
import test from 'node:test';
import Decimal from 'decimal.js';
import {
  TRADEIFY_SELECT_FLEX_50K_PROFILE, simulateTradeifySelectFlex, solveTradeifySelectFlexGoal,
  type TradeifySelectFlexInput, type TradeifySelectFlexGoalInput,
} from '../src/tradeify-select-flex.ts';

const base: TradeifySelectFlexInput = { dailyNetProfit: '200', period: 'month', activeDays: '20', accountCount: '1', accountCost: '0' };
const goalBase: TradeifySelectFlexGoalInput = { goalAmount: '1000', period: 'month', activeDays: '20', accountCount: '1', accountCost: '0' };
function forward(values: Partial<TradeifySelectFlexInput> = {}) {
  const actual = simulateTradeifySelectFlex({ ...base, ...values });
  assert.equal(actual.ok, true);
  if (!actual.ok) throw new Error(JSON.stringify(actual.errors));
  return actual.value;
}
function solve(values: Partial<TradeifySelectFlexGoalInput> = {}) {
  const actual = solveTradeifySelectFlexGoal({ ...goalBase, ...values });
  assert.equal(actual.ok, true);
  if (!actual.ok) throw new Error(JSON.stringify(actual.errors));
  return actual.value;
}

test('Tradeify profile preserves frozen dated cohort and official payout/account/Elite provenance', () => {
  const profile = TRADEIFY_SELECT_FLEX_50K_PROFILE;
  assert.equal(profile.nominalAccountSize, '50000');
  assert.equal(profile.verifiedOn, '2026-09-30');
  assert.match(profile.cohort, /strictly after September 1, 2026/);
  assert.match(profile.cohort, /earlier cohorts are excluded/);
  assert.equal(profile.rules.minimumGrossRequest, '250');
  assert.equal(profile.rules.maximumGrossRequest, '2500');
  assert.equal(profile.rules.maximumFundedAccounts, 5);
  assert.equal(profile.sources.length, 3);
  assert.ok(profile.sources.every(source => source.url.startsWith('https://help.tradeify.co/en/articles/')));
  assert.ok(Object.isFrozen(profile) && Object.isFrozen(profile.rules) && Object.isFrozen(profile.sources));
  assert.ok(profile.sources.every(source => Object.isFrozen(source)));
});

test('first $150 qualifying cycle yields $375 gross; short and subthreshold inputs yield no requests', () => {
  const minimum = forward({ dailyNetProfit: '150', activeDays: '5' });
  assert.equal(minimum.grossRequests, '375');
  assert.equal(minimum.traderPayoutCash, '337.5');
  assert.equal(minimum.retainedProfit, '375');
  assert.equal(minimum.schedule[0].day, 5);
  assert.equal(minimum.reviewBoundaryDay, null);
  const short = forward({ dailyNetProfit: '1000', activeDays: '4' });
  assert.equal(short.completedPayouts, 0);
  assert.equal(short.retainedProfit, '4000');
  const below = forward({ dailyNetProfit: '149.99999999', period: 'year', activeDays: '366' });
  assert.equal(below.completedPayouts, 0);
  assert.equal(below.modeledDays, 366);
  assert.match(below.constraints.join(' '), /below \$150/);
});

test('manually reconciled $200 daily retained-profit cycles request $500/$750/$875', () => {
  const actual = forward();
  assert.deepEqual(actual.schedule.map(row => row.day), [5, 10, 15]);
  assert.deepEqual(actual.schedule.map(row => row.perAccountGrossRequest), ['500', '750', '875']);
  assert.equal(actual.fundedTradingPnl, '3000');
  assert.equal(actual.grossRequests, '2125');
  assert.equal(actual.traderPayoutCash, '1912.5');
  assert.equal(actual.retainedProfit, '875');
  assert.equal(actual.reviewBoundaryDay, 15);
  assert.equal(actual.modeledDays, 15);
  assert.equal(actual.completedPayouts, 3);
  assert.equal(actual.totalPortfolioRequests, 3);
  assert.equal('transitionDay' in actual, false);
  assert.match(actual.constraints.join(' '), /not an automatic transition/);
  const partial = forward({ activeDays: '9' });
  assert.equal(partial.grossRequests, '500');
  assert.equal(partial.retainedProfit, '1300');
  assert.equal(partial.completedPayouts, 1);
  assert.equal(partial.reviewBoundaryDay, null);
});

test('five accounts pause at two synchronized cycles; 1–4 pause after three and may cross ten requests', () => {
  for (let count = 1; count <= 5; count++) {
    const actual = forward({ accountCount: String(count) });
    assert.equal(actual.reviewBoundaryCycles, count === 5 ? 2 : 3);
    assert.equal(actual.reviewBoundaryDay, count === 5 ? 10 : 15);
    assert.equal(actual.completedPayouts, count === 5 ? 2 : 3);
    assert.equal(actual.totalPortfolioRequests, count === 5 ? 10 : count * 3);
  }
  const five = forward({ accountCount: '5' });
  assert.equal(five.traderPayoutCash, '5625');
  assert.equal(five.retainedProfit, '3750');
  assert.equal(five.fundedTradingPnl, '10000');
  assert.equal(five.grossRequests, '6250');
});

test('scaling reruns each review horizon and scales account costs, including lower five-account cash', () => {
  const actual = forward({ accountCost: '300', accountCount: '1' });
  assert.deepEqual(actual.scaling.map(row => row.traderPayoutCash), ['1912.5', '3825', '5737.5', '7650', '5625']);
  assert.deepEqual(actual.scaling.map(row => row.cashAfterCosts), ['1612.5', '3225', '4837.5', '6450', '4125']);
  assert.deepEqual(actual.scaling.map(row => row.portfolioCosts), ['300', '600', '900', '1200', '1500']);
  assert.deepEqual(actual.scaling.map(row => row.reviewBoundaryDay), [15, 15, 15, 15, 10]);
  assert.deepEqual(actual.scaling.map(row => row.totalPortfolioRequests), [3, 6, 9, 12, 10]);
  const five = forward({ accountCount: '5', accountCost: '300' });
  assert.equal(five.perAccount.cashAfterCosts, '825');
  assert.equal(five.cashAfterCosts, '4125');
  assert.equal(five.portfolioCosts, '1500');
  assert.equal(five.scaling[4].cashAfterCosts, five.cashAfterCosts);
});

test('request cap and annual review pause do not extrapolate future funding or Elite income', () => {
  const one = forward({ dailyNetProfit: '1000', period: 'year', activeDays: '366' });
  assert.equal(one.traderPayoutCash, '6750');
  assert.equal(one.grossRequests, '7500');
  assert.equal(one.retainedProfit, '7500');
  assert.equal(one.fundedTradingPnl, '15000');
  assert.equal(one.modeledDays, 15);
  const five = forward({ dailyNetProfit: '1000', period: 'year', activeDays: '366', accountCount: '5' });
  assert.equal(five.traderPayoutCash, '22500');
  assert.equal(five.modeledDays, 10);
  assert.ok(five.schedule.every(row => row.perAccountGrossRequest === '2500'));
  assert.equal(forward({ dailyNetProfit: '1000000000000', activeDays: '31' }).traderPayoutCash, '6750');
});

test('gross requests floor to cents and trader cash preserves exact fractional cents', () => {
  const actual = forward({ dailyNetProfit: '200.006', activeDays: '5' });
  assert.equal(actual.grossRequests, '500.01');
  assert.equal(actual.traderPayoutCash, '450.009');
  assert.equal(actual.retainedProfit, '500.02');
  assert.equal(forward({ dailyNetProfit: '999.99999999', activeDays: '5' }).grossRequests, '2499.99');
  assert.equal(JSON.parse(JSON.stringify(actual)).traderPayoutCash, '450.009');
});

test('zero net performance, zero targets and fee-only targets stay separate', () => {
  const zero = forward({ dailyNetProfit: '0', accountCost: '50' });
  assert.equal(zero.traderPayoutCash, '0');
  assert.equal(zero.cashAfterCosts, '-50');
  assert.equal(zero.reviewBoundaryDay, null);
  const solved = solve({ goalAmount: '0', accountCost: '0', activeDays: '1' });
  assert.equal(solved.feasible, true);
  if (solved.feasible) assert.equal(solved.minimumDailyProfit, '0');
  const fee = solve({ goalAmount: '0', accountCost: '337.5', activeDays: '5' });
  assert.equal(fee.feasible, true);
  if (fee.feasible) {
    assert.equal(fee.minimumDailyProfit, '150');
    assert.equal(fee.schedule.cashAfterCosts, '0');
  }
});

test('capacity checks use count-specific modeled review pause and fees, not a firm-wide cap', () => {
  const short = solve({ goalAmount: '0.01', activeDays: '4' });
  assert.equal(short.feasible, false);
  assert.equal(short.maximumTraderCash, '0');
  const cap = solve({ goalAmount: '22000', accountCost: '100', accountCount: '5', period: 'year', activeDays: '366' });
  assert.equal(cap.feasible, true);
  assert.equal(cap.maximumCashAfterCosts, '22000');
  if (cap.feasible) assert.equal(cap.minimumDailyProfit, '1000');
  const over = solve({ goalAmount: '22000.00000001', accountCost: '100', accountCount: '5', period: 'year', activeDays: '366' });
  assert.equal(over.feasible, false);
  if (!over.feasible) assert.match(over.reason, /not establish firm-wide/);
});

test('small goals overshoot at minimum performance; minimum cent target includes portfolio costs', () => {
  const small = solve({ goalAmount: '1', activeDays: '5' });
  assert.equal(small.feasible, true);
  if (small.feasible) {
    assert.equal(small.minimumDailyProfit, '150');
    assert.equal(small.schedule.traderPayoutCash, '337.5');
  }
  const larger = solve({ goalAmount: '1000', activeDays: '5' });
  assert.equal(larger.feasible, true);
  if (larger.feasible) {
    assert.equal(larger.minimumDailyProfit, '444.45');
    assert.equal(larger.schedule.cashAfterCosts, '1000.008');
  }
});

test('every solved nonzero scenario meets its target and one cent less fails', () => {
  for (const values of [
    { goalAmount: '1', activeDays: '5' },
    { goalAmount: '450.009', activeDays: '5' },
    { goalAmount: '1500', activeDays: '10' },
    { goalAmount: '2000', accountCost: '250', activeDays: '15' },
    { goalAmount: '15000', accountCost: '1000', activeDays: '20', accountCount: '4' },
    { goalAmount: '20000', period: 'year' as const, activeDays: '366', accountCount: '5' },
  ]) {
    const actual = solve(values);
    assert.equal(actual.feasible, true);
    if (!actual.feasible) continue;
    assert.ok(new Decimal(actual.schedule.cashAfterCosts).gte(values.goalAmount));
    const less = forward({ ...values, dailyNetProfit: new Decimal(actual.minimumDailyProfit).minus('0.01').toFixed() });
    assert.ok(new Decimal(less.cashAfterCosts).lt(values.goalAmount), JSON.stringify(values));
  }
});

test('smallest daily cents agrees with independent exhaustive integer-cent oracle', () => {
  for (const { days, target, accounts, costs } of [
    { days: 5, target: 1, accounts: 1, costs: 0 },
    { days: 5, target: 1000, accounts: 1, costs: 0 },
    { days: 10, target: 2000, accounts: 1, costs: 0 },
    { days: 20, target: 15000, accounts: 4, costs: 1000 },
    { days: 366, target: 22500, accounts: 5, costs: 0 },
  ]) {
    let minimum = 0;
    for (let cents = 15000; cents <= 100000; cents++) {
      let retained = 0;
      let gross = 0;
      const cycles = Math.min(Math.floor(days / 5), 3, Math.ceil(10 / accounts));
      for (let cycle = 0; cycle < cycles; cycle++) {
        retained += cents * 5;
        const request = Math.min(Math.floor(retained / 2), 250000);
        retained -= request;
        gross += request;
      }
      // Integer milli-dollars avoid binary share arithmetic in the independent oracle.
      if (gross * 9 * accounts >= (target + costs * accounts) * 1000) { minimum = cents; break; }
    }
    assert.notEqual(minimum, 0);
    const actual = solve({ period: days > 31 ? 'year' : 'month', activeDays: String(days), goalAmount: String(target), accountCount: String(accounts), accountCost: String(costs) });
    assert.equal(actual.feasible, true);
    if (actual.feasible) assert.equal(new Decimal(actual.minimumDailyProfit).times(100).toNumber(), minimum);
  }
});

test('validation rejects invalid financial strings, unavailable account counts and day bounds without output', () => {
  for (const values of [
    { dailyNetProfit: '' }, { dailyNetProfit: '-1' }, { dailyNetProfit: 'NaN' },
    { dailyNetProfit: '1e3' }, { dailyNetProfit: '1000000000000.01' }, { dailyNetProfit: '1.000000001' },
    { accountCount: '6' }, { accountCount: '0' }, { accountCount: '1.5' },
    { activeDays: '0' }, { period: 'week' as const, activeDays: '8' },
    { period: 'month' as const, activeDays: '32' }, { accountCost: '-1' },
  ]) {
    const actual = simulateTradeifySelectFlex({ ...base, ...values });
    assert.equal(actual.ok, false);
    assert.equal('value' in actual, false);
  }
  const actual = solveTradeifySelectFlexGoal({ ...goalBase, goalAmount: 'Infinity', accountCount: '6', accountCost: '-1' });
  assert.equal(actual.ok, false);
  if (!actual.ok) assert.deepEqual(Object.keys(actual.errors).sort(), ['accountCost', 'accountCount', 'goalAmount']);
});
