import assert from 'node:assert/strict';
import test from 'node:test';
import Decimal from 'decimal.js';
import {
  TRADEIFY_SELECT_DAILY_50K_PROFILE, simulateTradeifySelectDaily, solveTradeifySelectDailyGoal,
  type TradeifySelectDailyInput, type TradeifySelectDailyGoalInput,
} from '../src/tradeify-select-daily.ts';

const base: TradeifySelectDailyInput = { dailyNetProfit: '500', period: 'month', activeDays: '20', accountCount: '1', accountCost: '100' };
const goalBase: TradeifySelectDailyGoalInput = { goalAmount: '1000', period: 'month', activeDays: '20', accountCount: '1', accountCost: '100' };
function forward(values: Partial<TradeifySelectDailyInput> = {}) {
  const actual = simulateTradeifySelectDaily({ ...base, ...values });
  assert.equal(actual.ok, true);
  if (!actual.ok) throw new Error(JSON.stringify(actual.errors));
  return actual.value;
}
function solve(values: Partial<TradeifySelectDailyGoalInput> = {}) {
  const actual = solveTradeifySelectDailyGoal({ ...goalBase, ...values });
  assert.equal(actual.ok, true);
  if (!actual.ok) throw new Error(JSON.stringify(actual.errors));
  return actual.value;
}

test('immutable profile identifies Daily buffer, cap, cycle multiplier and strict dated cohort', () => {
  const profile = TRADEIFY_SELECT_DAILY_50K_PROFILE;
  assert.equal(profile.verifiedOn, '2026-10-01');
  assert.match(profile.cohort, /strictly after September 1, 2026/);
  assert.equal(profile.rules.retainedProfitBuffer, '2100');
  assert.equal(profile.rules.minimumGrossRequest, '250');
  assert.equal(profile.rules.maximumGrossRequest, '1250');
  assert.equal(profile.rules.cycleProfitMultiplier, '2');
  assert.ok(Object.isFrozen(profile) && Object.isFrozen(profile.rules) && Object.isFrozen(profile.sources));
  assert.ok(profile.sources.every(source => Object.isFrozen(source) && source.url.startsWith('https://help.tradeify.co/en/articles/')));
  assert.equal('qualifyingDays' in profile.rules, false);
});

test('fresh buffer and cent-floored minimum permit equality only under the declared model convention', () => {
  assert.equal(forward({ dailyNetProfit: '2100', activeDays: '1' }).completedPayouts, 0);
  assert.equal(forward({ dailyNetProfit: '2349.99999999', activeDays: '1' }).completedPayouts, 0);
  const exact = forward({ dailyNetProfit: '2350', activeDays: '1' });
  assert.equal(exact.grossRequests, '250');
  assert.equal(exact.traderPayoutCash, '225');
  assert.equal(exact.retainedProfit, '2100');
  assert.equal(exact.schedule[0].cycleProfitBeforeRequestPerAccount, '2350');
  assert.match(exact.assumptions.join(' '), /equality convention/);
});

test('manually reconciled $500/day ledger retains buffer while resetting cycle profit after requests', () => {
  const actual = forward({ accountCount: '3' });
  assert.deepEqual(actual.schedule.map(row => row.day), [5, 6, 7]);
  assert.deepEqual(actual.schedule.map(row => row.perAccountGrossRequest), ['400', '500', '500']);
  assert.deepEqual(actual.schedule.map(row => row.cycleProfitBeforeRequestPerAccount), ['2500', '500', '500']);
  assert.ok(actual.schedule.every(row => row.retainedProfitPerAccount === '2100'));
  assert.equal(actual.grossRequests, '4200');
  assert.equal(actual.traderPayoutCash, '3780');
  assert.equal(actual.portfolioCosts, '300');
  assert.equal(actual.cashAfterCosts, '3480');
  assert.equal(actual.fundedTradingPnl, '10500');
  assert.equal(actual.retainedProfit, '6300');
  assert.equal(actual.reviewBoundaryDay, 7);
  assert.equal(actual.totalPortfolioRequests, 9);
});

test('sub-$250 daily performance accumulates positive cycle profit until each request minimum', () => {
  const actual = forward({ dailyNetProfit: '125', activeDays: '31', accountCost: '0' });
  assert.deepEqual(actual.schedule.map(row => row.day), [19, 21, 23]);
  assert.deepEqual(actual.schedule.map(row => row.perAccountGrossRequest), ['275', '250', '250']);
  assert.deepEqual(actual.schedule.map(row => row.cycleProfitBeforeRequestPerAccount), ['2375', '250', '250']);
  assert.equal(actual.traderPayoutCash, '697.5');
  assert.equal(actual.retainedProfit, '2100');
});

test('current cap preserves leftovers; request records prove available/cycle/cap limits', () => {
  const actual = forward({ dailyNetProfit: '3350', activeDays: '3', accountCost: '0' });
  assert.deepEqual(actual.schedule.map(row => row.perAccountGrossRequest), ['1250', '1250', '1250']);
  assert.deepEqual(actual.schedule.map(row => row.retainedProfitPerAccount), ['2100', '4200', '6300']);
  assert.equal(actual.traderPayoutCash, '3375');
  assert.equal(actual.fundedTradingPnl, '10050');
  assert.equal(actual.reviewBoundaryDay, 3);
  for (const row of actual.schedule) {
    assert.ok(new Decimal(row.perAccountGrossRequest).lte(new Decimal(row.cycleProfitBeforeRequestPerAccount).times(2)));
    assert.ok(new Decimal(row.retainedProfitPerAccount).gte(2100));
  }
});

test('one-to-five scaling recomputes discretionary pauses and costs; annual cash never extrapolates', () => {
  const actual = forward({ period: 'year', activeDays: '366' });
  assert.deepEqual(actual.scaling.map(row => row.completedPayouts), [3, 3, 3, 3, 2]);
  assert.deepEqual(actual.scaling.map(row => row.reviewBoundaryDay), [7, 7, 7, 7, 6]);
  assert.deepEqual(actual.scaling.map(row => row.traderPayoutCash), ['1260', '2520', '3780', '5040', '4050']);
  assert.deepEqual(actual.scaling.map(row => row.cashAfterCosts), ['1160', '2320', '3480', '4640', '3550']);
  assert.deepEqual(actual.scaling.map(row => row.portfolioCosts), ['100', '200', '300', '400', '500']);
  assert.equal(actual.modeledDays, 7);
  assert.equal('transitionDay' in actual, false);
  assert.match(actual.constraints.join(' '), /not an automatic transition/);
});

test('eight-decimal daily profits/costs and fractional-cent trader share preserve exact arithmetic', () => {
  const actual = forward({ dailyNetProfit: '500.00000001', activeDays: '5', accountCount: '3', accountCost: '0.10000001' });
  assert.equal(actual.schedule[0].perAccountGrossRequest, '400');
  assert.equal(actual.schedule[0].retainedProfitPerAccount, '2100.00000005');
  assert.equal(actual.portfolioCosts, '0.30000003');
  assert.equal(actual.cashAfterCosts, '1079.69999997');
  const fractional = forward({ dailyNetProfit: '2350.01999999', activeDays: '1', accountCost: '0' });
  assert.equal(fractional.grossRequests, '250.01');
  assert.equal(fractional.traderPayoutCash, '225.009');
  assert.equal(JSON.parse(JSON.stringify(fractional)).traderPayoutCash, '225.009');
});

test('zero/short scenarios retain profit without requests; zero goal and zero cost solves to zero', () => {
  const zero = forward({ dailyNetProfit: '0' });
  assert.equal(zero.cashAfterCosts, '-100');
  assert.equal(zero.reviewBoundaryDay, null);
  const short = forward({ activeDays: '4' });
  assert.equal(short.retainedProfit, '2000');
  assert.equal(short.completedPayouts, 0);
  const solved = solve({ goalAmount: '0', accountCost: '0', activeDays: '1' });
  assert.equal(solved.feasible, true);
  if (solved.feasible) assert.equal(solved.minimumDailyProfit, '0');
});

test('first-request timing cliff is nonmonotone; partition solver returns the global cent minimum', () => {
  assert.equal(forward({ dailyNetProfit: '213.63', activeDays: '14', accountCost: '0' }).traderPayoutCash, '801.738');
  assert.equal(forward({ dailyNetProfit: '213.64', activeDays: '14', accountCost: '0' }).traderPayoutCash, '609.588');
  const actual = solve({ activeDays: '14', accountCost: '0', goalAmount: '700' });
  assert.equal(actual.feasible, true);
  if (actual.feasible) {
    assert.equal(actual.minimumDailyProfit, '205.56');
    assert.equal(actual.schedule.traderPayoutCash, '700.056');
    assert.deepEqual(actual.schedule.schedule.map(row => row.day), [12, 14]);
  }
});

test('actual upper-bound capacity includes horizon, household count pause and all account costs', () => {
  const exact = solve({ activeDays: '3', accountCount: '4', goalAmount: '13100' });
  assert.equal(exact.feasible, true);
  assert.equal(exact.maximumTraderCash, '13500');
  assert.equal(exact.maximumCashAfterCosts, '13100');
  if (exact.feasible) assert.equal(exact.minimumDailyProfit, '3350');
  const over = solve({ activeDays: '3', accountCount: '4', goalAmount: '13100.00000001' });
  assert.equal(over.feasible, false);
  const oneDay = solve({ activeDays: '1', goalAmount: '1025' });
  assert.equal(oneDay.feasible, true);
  const five = solve({ period: 'year', activeDays: '366', accountCount: '5', goalAmount: '10750.01' });
  assert.equal(five.feasible, false);
  if (!five.feasible) assert.match(five.reason, /not establish firm-wide/);
});

test('solved targets meet exact goals and one cent less fails across horizons, costs and counts', () => {
  for (const scenario of [
    { activeDays: '1', goalAmount: '1', accountCost: '0' },
    { activeDays: '2', goalAmount: '1000', accountCost: '50' },
    { activeDays: '7', goalAmount: '500' },
    { activeDays: '14', goalAmount: '700', accountCost: '0' },
    { activeDays: '31', goalAmount: '1000', accountCount: '4' },
    { activeDays: '366', period: 'year' as const, goalAmount: '1', accountCost: '0' },
  ]) {
    const actual = solve(scenario);
    assert.equal(actual.feasible, true);
    if (!actual.feasible) continue;
    assert.ok(new Decimal(actual.schedule.cashAfterCosts).gte(scenario.goalAmount));
    const less = forward({ ...scenario, dailyNetProfit: new Decimal(actual.minimumDailyProfit).minus('0.01').toFixed() });
    assert.ok(new Decimal(less.cashAfterCosts).lt(scenario.goalAmount), JSON.stringify(scenario));
  }
});

test('independent exhaustive integer-cent ledger finds global minima without assuming monotonicity', () => {
  for (const { days, goal, accounts, cost } of [
    { days: 1, goal: 1, accounts: 1, cost: 0 },
    { days: 2, goal: 1000, accounts: 1, cost: 50 },
    { days: 14, goal: 700, accounts: 1, cost: 0 },
    { days: 31, goal: 1000, accounts: 4, cost: 100 },
    { days: 366, goal: 1, accounts: 5, cost: 0 },
  ]) {
    let minimum = 0;
    for (let cents = 1; cents <= 335000; cents++) {
      // Integer cents stay below 123 million, far below MAX_SAFE_INTEGER.
      let retained = 0;
      let cycle = 0;
      let gross = 0;
      let paid = 0;
      for (let day = 1; day <= days && paid < Math.min(3, Math.ceil(10 / accounts)); day++) {
        retained += cents;
        cycle += cents;
        const request = Math.min(Math.max(retained - 210000, 0), 2 * cycle, 125000);
        if (cycle > 0 && request >= 25000) {
          retained -= request;
          gross += request;
          cycle = 0;
          paid++;
        }
      }
      if (gross * 9 * accounts >= (goal + cost * accounts) * 1000) { minimum = cents; break; }
    }
    assert.notEqual(minimum, 0);
    const actual = solve({ period: days > 31 ? 'year' : 'month', activeDays: String(days), goalAmount: String(goal), accountCount: String(accounts), accountCost: String(cost) });
    assert.equal(actual.feasible, true);
    if (actual.feasible) assert.equal(new Decimal(actual.minimumDailyProfit).times(100).toNumber(), minimum);
  }
});

test('invalid amounts/selectors/counts/days hide results and report exact field errors', () => {
  for (const override of [
    { dailyNetProfit: '' }, { dailyNetProfit: '-1' }, { dailyNetProfit: 'NaN' },
    { dailyNetProfit: '1e3' }, { dailyNetProfit: '1.000000001' }, { dailyNetProfit: '1000000000000.01' },
    { accountCost: 'Infinity' }, { accountCost: '-1' }, { accountCount: '6' }, { accountCount: '1.5' },
    { period: 'invalid' as TradeifySelectDailyInput['period'] },
    { activeDays: '0' }, { period: 'week' as const, activeDays: '8' }, { activeDays: '32' },
  ]) {
    const actual = simulateTradeifySelectDaily({ ...base, ...override });
    assert.equal(actual.ok, false);
    assert.equal('value' in actual, false);
  }
  const actual = solveTradeifySelectDailyGoal({ ...goalBase, goalAmount: '-1', accountCount: '6', accountCost: '' });
  assert.equal(actual.ok, false);
  if (!actual.ok) assert.deepEqual(Object.keys(actual.errors).sort(), ['accountCost', 'accountCount', 'goalAmount']);
});
