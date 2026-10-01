import assert from 'node:assert/strict';
import test from 'node:test';
import Decimal from 'decimal.js';
import {
  LUCID_FLEX_50K_PROFILE, simulateLucidFlex, solveLucidFlexGoal,
  type LucidFlexInput, type LucidFlexGoalInput,
} from '../src/index.ts';

const base: LucidFlexInput = { dailyNetProfit: '200', period: 'month', activeDays: '25', accountCount: '1', cashCosts: '0' };
const goalBase: LucidFlexGoalInput = { goalAmount: '500', period: 'month', activeDays: '25', accountCount: '1', cashCosts: '0' };
function forward(values: Partial<LucidFlexInput> = {}) {
  const result = simulateLucidFlex({ ...base, ...values });
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error(JSON.stringify(result.errors));
  return result.value;
}
function solve(values: Partial<LucidFlexGoalInput> = {}) {
  const result = solveLucidFlexGoal({ ...goalBase, ...values });
  assert.equal(result.ok, true);
  if (!result.ok) throw new Error(JSON.stringify(result.errors));
  return result.value;
}

test('profile identifies the funded $50k program, immutable dated rules and official provenance', () => {
  assert.equal(LUCID_FLEX_50K_PROFILE.nominalAccountSize, '50000');
  assert.equal(LUCID_FLEX_50K_PROFILE.rules.lockedMaximumLossBalance, '50100');
  assert.equal(LUCID_FLEX_50K_PROFILE.verifiedOn, '2026-09-30');
  assert.equal(LUCID_FLEX_50K_PROFILE.sources.length, 2);
  assert.ok(LUCID_FLEX_50K_PROFILE.sources.every(source => source.url.startsWith('https://support.lucidtrading.com/')));
  assert.ok(Object.isFrozen(LUCID_FLEX_50K_PROFILE.rules));
});

test('five qualifying days and $500 minimum both bind; below $150 never qualifies', () => {
  assert.equal(forward({ dailyNetProfit: '149.99999999', activeDays: '31' }).completedPayouts, 0);
  assert.match(forward({ dailyNetProfit: '100' }).constraints.join(' '), /below \$150/);
  assert.equal(forward({ dailyNetProfit: '150', activeDays: '5' }).completedPayouts, 0);
  assert.equal(forward({ dailyNetProfit: '150', activeDays: '6' }).completedPayouts, 0);
  const daySeven = forward({ dailyNetProfit: '150', activeDays: '7' });
  assert.equal(daySeven.schedule[0].day, 7);
  assert.equal(daySeven.grossRequests, '525');
  assert.equal(daySeven.traderPayoutCash, '472.5');
  assert.equal(daySeven.retainedProfit, '525');
  assert.equal(daySeven.schedule[0].postRequestLossHeadroomPerAccount, '425');
  assert.equal(forward({ activeDays: '4', dailyNetProfit: '800' }).completedPayouts, 0);
  assert.equal(forward({ activeDays: '5' }).grossRequests, '500');
});

test('retained profit is accumulated after gross deductions; qualifying days reset each approval', () => {
  const actual = forward();
  assert.deepEqual(actual.schedule.map(row => row.day), [5, 10, 15, 20, 25]);
  assert.deepEqual(actual.schedule.map(row => row.perAccountGrossRequest), ['500', '750', '875', '937.5', '968.75']);
  assert.equal(actual.fundedTradingPnl, '5000');
  assert.equal(actual.grossRequests, '4031.25');
  assert.equal(actual.retainedProfit, '968.75');
  assert.equal(actual.traderPayoutCash, '3628.125');
  assert.equal(actual.completedPayouts, 5);
  assert.equal(actual.transitionDay, 25);
  assert.equal(forward({ activeDays: '9' }).completedPayouts, 1);
});

test('gross floor-to-cents and exact 90% share have no invented cash payment rounding', () => {
  const actual = forward({ dailyNetProfit: '200.006', activeDays: '5' });
  assert.equal(actual.grossRequests, '500.01');
  assert.equal(actual.traderPayoutCash, '450.009');
  assert.equal(actual.retainedProfit, '500.02');
  assert.ok(actual.assumptions.some(note => note.includes('payment-rounding policy')));
  const below = forward({ dailyNetProfit: '199.99999999', activeDays: '5' });
  assert.equal(below.completedPayouts, 0);
});

test('cap and five-payout transition stop funded trading and annual extrapolation', () => {
  const capped = forward({ dailyNetProfit: '800', period: 'year', activeDays: '366' });
  assert.equal(capped.completedPayouts, 5);
  assert.equal(capped.modeledDays, 25);
  assert.equal(capped.transitionDay, 25);
  assert.equal(capped.fundedTradingPnl, '20000');
  assert.equal(capped.grossRequests, '10000');
  assert.equal(capped.traderPayoutCash, '9000');
  assert.equal(capped.retainedProfit, '10000');
  assert.ok(capped.schedule.every(row => row.perAccountGrossRequest === '2000'));
  assert.equal(forward({ dailyNetProfit: '800', activeDays: '26' }).traderPayoutCash, capped.traderPayoutCash);
  assert.equal(forward({ dailyNetProfit: '1000000000000', period: 'year', activeDays: '366' }).grossRequests, '10000');
});

test('portfolio scaling counts each request once, holds fees fixed and keeps retained profit distinct', () => {
  const actual = forward({ dailyNetProfit: '800', activeDays: '5', accountCount: '3', cashCosts: '300' });
  assert.equal(actual.grossRequests, '6000');
  assert.equal(actual.traderPayoutCash, '5400');
  assert.equal(actual.cashAfterCosts, '5100');
  assert.equal(actual.retainedProfit, '6000');
  assert.equal(actual.perAccount.cashAfterCosts, '1700');
  assert.deepEqual(actual.scaling.map(row => row.cashAfterCosts), ['1500', '3300', '5100']);
  assert.equal(actual.schedule[0].portfolioGrossRequest, '6000');
  assert.equal(actual.completedPayouts, 1);
  assert.equal(JSON.parse(JSON.stringify(actual)).cashAfterCosts, '5100');
});

test('zero-profit scenario has zero requests and negative costs; zero goal with zero costs solves to zero', () => {
  const actual = forward({ dailyNetProfit: '0', cashCosts: '50' });
  assert.equal(actual.cashAfterCosts, '-50');
  assert.equal(actual.modeledDays, 25);
  assert.equal(actual.transitionDay, null);
  const solved = solve({ goalAmount: '0', cashCosts: '0', activeDays: '1' });
  assert.equal(solved.feasible, true);
  if (solved.feasible) assert.equal(solved.minimumDailyProfit, '0');
});

test('theoretical capacity includes days, account count, fees and the fifth-payout ceiling', () => {
  const short = solve({ activeDays: '4', goalAmount: '0.01' });
  assert.equal(short.feasible, false);
  assert.equal(short.maximumTraderCash, '0');
  const maximum = solve({ goalAmount: '26700', period: 'year', activeDays: '366', accountCount: '3', cashCosts: '300' });
  assert.equal(maximum.feasible, true);
  assert.equal(maximum.maximumTraderCash, '27000');
  assert.equal(maximum.maximumCashAfterCosts, '26700');
  if (maximum.feasible) assert.equal(maximum.minimumDailyProfit, '800');
  const exceeded = solve({ goalAmount: '26700.00000001', period: 'year', activeDays: '366', accountCount: '3', cashCosts: '300' });
  assert.equal(exceeded.feasible, false);
  if (!exceeded.feasible) assert.match(exceeded.reason, /five payouts/);
  assert.equal(solve({ goalAmount: '0', activeDays: '5', cashCosts: '1800.01' }).feasible, false);
});

test('minimum requests can overshoot small goals; solver keeps costs before trader share', () => {
  const small = solve({ goalAmount: '1', activeDays: '5' });
  assert.equal(small.feasible, true);
  if (small.feasible) {
    assert.equal(small.minimumDailyProfit, '200');
    assert.equal(small.schedule.cashAfterCosts, '450');
  }
  const fee = solve({ goalAmount: '100', cashCosts: '500', activeDays: '5' });
  assert.equal(fee.feasible, true);
  if (fee.feasible) {
    assert.equal(fee.minimumDailyProfit, '266.67');
    assert.equal(fee.schedule.cashAfterCosts, '100.003');
  }
});

test('inverse search handles nonmonotone first-request timing jumps and finds global minimum', () => {
  assert.equal(forward({ dailyNetProfit: '166.66', activeDays: '7' }).traderPayoutCash, '524.979');
  assert.equal(forward({ dailyNetProfit: '166.67', activeDays: '7' }).traderPayoutCash, '450.009');
  assert.equal(forward({ dailyNetProfit: '199.99', activeDays: '7' }).traderPayoutCash, '539.973');
  assert.equal(forward({ dailyNetProfit: '200', activeDays: '7' }).traderPayoutCash, '450');
  const actual = solve({ activeDays: '7', goalAmount: '500' });
  assert.equal(actual.feasible, true);
  if (actual.feasible) {
    assert.equal(actual.minimumDailyProfit, '158.74');
    assert.equal(actual.schedule.schedule[0].day, 7);
    assert.equal(actual.schedule.traderPayoutCash, '500.031');
  }
});

test('solved goals meet the exact target and one cent less fails across horizons and timing intervals', () => {
  for (const scenario of [
    { activeDays: '5', goalAmount: '450.009' },
    { activeDays: '6', goalAmount: '460' },
    { activeDays: '7', goalAmount: '500' },
    { activeDays: '7', goalAmount: '535' },
    { activeDays: '10', goalAmount: '1000' },
    { activeDays: '12', goalAmount: '1200' },
    { activeDays: '17', goalAmount: '2000', cashCosts: '250', accountCount: '3' },
    { activeDays: '27', goalAmount: '6000' },
    { activeDays: '366', period: 'year' as const, goalAmount: '8500' },
  ]) {
    const actual = solve(scenario);
    assert.equal(actual.feasible, true);
    if (!actual.feasible) continue;
    assert.ok(new Decimal(actual.schedule.cashAfterCosts).gte(scenario.goalAmount));
    const less = forward({ ...scenario, dailyNetProfit: new Decimal(actual.minimumDailyProfit).minus('0.01').toFixed() });
    assert.ok(new Decimal(less.cashAfterCosts).lt(scenario.goalAmount), JSON.stringify(scenario));
  }
});

test('forward and goal validation reject incomplete/invalid values without stale output', () => {
  for (const values of [
    { dailyNetProfit: '-1' }, { dailyNetProfit: 'NaN' }, { dailyNetProfit: '' },
    { dailyNetProfit: '1.000000001' }, { dailyNetProfit: '1000000000000.01' },
    { cashCosts: '-0.01' }, { activeDays: '0' }, { accountCount: '101' },
    { accountCount: '1.5' }, { period: 'week' as const, activeDays: '8' },
    { period: 'invalid' as LucidFlexInput['period'] },
  ]) {
    const result = simulateLucidFlex({ ...base, ...values });
    assert.equal(result.ok, false);
    assert.equal('value' in result, false);
  }
  const invalid = solveLucidFlexGoal({ ...goalBase, goalAmount: 'Infinity', cashCosts: '-1', accountCount: '0' });
  assert.equal(invalid.ok, false);
  if (!invalid.ok) assert.deepEqual(Object.keys(invalid.errors).sort(), ['accountCount', 'cashCosts', 'goalAmount']);
});

test('inverse global minimum matches exhaustive exact integer-cent oracle, including timing cliffs', () => {
  // Independent exhaustive search across all admissible daily cents avoids
  // assuming the same interval/binary-search property as the implementation.
  // All integer values here stay far below Number.MAX_SAFE_INTEGER.
  for (const { days, target, accounts, costs } of [
    { days: 5, target: 1, accounts: 1, costs: 0 },
    { days: 6, target: 460, accounts: 1, costs: 0 },
    { days: 7, target: 500, accounts: 1, costs: 0 },
    { days: 7, target: 535, accounts: 1, costs: 0 },
    { days: 12, target: 1100, accounts: 1, costs: 0 },
    { days: 17, target: 2000, accounts: 3, costs: 250 },
    { days: 366, target: 9000, accounts: 1, costs: 0 },
  ]) {
    let minimum = 0;
    for (let cents = 15000; cents <= 80000; cents++) {
      let retainedCents = 0;
      let grossCents = 0;
      let qualifying = 0;
      let paid = 0;
      for (let day = 1; day <= days && paid < 5; day++) {
        retainedCents += cents;
        qualifying++;
        const available = Math.min(Math.floor(retainedCents / 2), 200000);
        if (qualifying >= 5 && available >= 50000) {
          retainedCents -= available;
          grossCents += available;
          qualifying = 0;
          paid++;
        }
      }
      // gross cents × 90% ÷ 100 = dollars; multiply by 1000
      // to compare integer milli-dollars without float share arithmetic.
      if (grossCents * 9 * accounts >= (target + costs) * 1000) { minimum = cents; break; }
    }
    assert.notEqual(minimum, 0);
    const actual = solve({ period: days > 31 ? 'year' : 'month', activeDays: String(days), goalAmount: String(target), accountCount: String(accounts), cashCosts: String(costs) });
    assert.equal(actual.feasible, true);
    if (actual.feasible) assert.equal(new Decimal(actual.minimumDailyProfit).times(100).toNumber(), minimum);
  }
});
