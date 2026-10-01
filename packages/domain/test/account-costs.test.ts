import assert from 'node:assert/strict';
import test from 'node:test';
import Decimal from 'decimal.js';
import { calculateTargets, simulateLucidFlex, solveLucidFlexGoal, formatUsd } from '../src/index.ts';
import { simulateTradeifySelectFlex, solveTradeifySelectFlexGoal } from '../src/tradeify-select-flex.ts';

const target = {
  goalAmount: '1000', period: 'month' as const, activeDays: '5', accountCount: '3',
  mode: 'cash' as const, payoutSharePercent: '90', accountCost: '100',
};
const firm = { dailyNetProfit: '800', period: 'month' as const, activeDays: '20', accountCount: '3', accountCost: '100' };

test('generic cash bridge multiplies $100 per account by three and recalculates every scaling row', () => {
  const actual = calculateTargets(target);
  assert.equal(actual.ok, true);
  if (!actual.ok) return;
  assert.equal(actual.value.portfolioCosts, '300');
  assert.equal(formatUsd(actual.value.tradingTarget), '$1,444.44');
  assert.deepEqual(actual.value.scaling.map(row => row.portfolioCosts), ['100', '200', '300']);
  assert.deepEqual(actual.value.scaling.map(row => formatUsd(row.dailyPerAccountTarget)), ['$244.44', '$133.33', '$96.30']);
  assert.equal(actual.value.scaling[2].dailyPerAccountTarget, actual.value.dailyPerAccountTarget);
});

test('fractional per-account costs remain exact at eight decimal places across all models', () => {
  const calculated = calculateTargets({ ...target, goalAmount: '0', accountCost: '0.10000001', payoutSharePercent: '100' });
  assert.equal(calculated.ok, true);
  if (calculated.ok) {
    assert.equal(calculated.value.portfolioCosts, '0.30000003');
    assert.equal(calculated.value.tradingTarget, '0.30000003');
  }
  for (const simulate of [simulateLucidFlex, simulateTradeifySelectFlex]) {
    const actual = simulate({ ...firm, accountCost: '0.10000001' });
    assert.equal(actual.ok, true);
    if (!actual.ok) continue;
    assert.equal(actual.value.portfolioCosts, '0.30000003');
    assert.equal(new Decimal(actual.value.traderPayoutCash).minus(actual.value.cashAfterCosts).toFixed(), '0.30000003');
    assert.equal(new Decimal(actual.value.perAccount.traderPayoutCash).minus(actual.value.perAccount.cashAfterCosts).toFixed(), '0.10000001');
    assert.equal(actual.value.scaling[1].portfolioCosts, '0.20000002');
  }
});

test('costs affect cash only, preserving exact payout schedules, retained profit and lifecycle boundaries', () => {
  for (const simulate of [simulateLucidFlex, simulateTradeifySelectFlex]) {
    const zero = simulate({ ...firm, accountCost: '0' });
    const paid = simulate(firm);
    assert.equal(zero.ok && paid.ok, true);
    if (!zero.ok || !paid.ok) continue;
    assert.equal(paid.value.portfolioCosts, '300');
    assert.equal(new Decimal(zero.value.cashAfterCosts).minus(paid.value.cashAfterCosts).toFixed(), '300');
    assert.deepEqual(paid.value.schedule, zero.value.schedule);
    assert.equal(paid.value.retainedProfit, zero.value.retainedProfit);
    assert.equal(paid.value.grossRequests, zero.value.grossRequests);
    assert.equal(paid.value.fundedTradingPnl, zero.value.fundedTradingPnl);
    assert.equal(paid.value.modeledDays, zero.value.modeledDays);
    assert.equal(paid.value.completedPayouts, zero.value.completedPayouts);
  }
});

test('firm scaling subtracts each row count times $100 rather than a fixed portfolio charge', () => {
  for (const simulate of [simulateLucidFlex, simulateTradeifySelectFlex]) {
    const actual = simulate(firm);
    assert.equal(actual.ok, true);
    if (!actual.ok) continue;
    for (const row of actual.value.scaling) {
      const expected = new Decimal(100).times(row.accountCount);
      assert.equal(row.portfolioCosts, expected.toFixed());
      assert.equal(new Decimal(row.traderPayoutCash).minus(row.cashAfterCosts).toFixed(), expected.toFixed());
    }
  }
});

test('firm minimum daily targets include all three account costs and one cent less misses the goal', () => {
  for (const [solve, simulate] of [[solveLucidFlexGoal, simulateLucidFlex], [solveTradeifySelectFlexGoal, simulateTradeifySelectFlex]] as const) {
    const input = { ...target, goalAmount: '4500' };
    const actual = solve(input);
    assert.equal(actual.ok, true);
    if (!actual.ok) continue;
    assert.equal(actual.value.portfolioCosts, '300');
    assert.equal(actual.value.feasible, true);
    if (!actual.value.feasible) continue;
    assert.equal(actual.value.minimumDailyProfit, '711.12');
    assert.equal(actual.value.schedule.cashAfterCosts, '4500.06');
    assert.equal(actual.value.schedule.portfolioCosts, '300');
    const less = simulate({ ...input, dailyNetProfit: '711.11' });
    assert.equal(less.ok, true);
    if (less.ok) assert.equal(less.value.cashAfterCosts, '4499.979');
  }
});

test('firm inverse capacity subtracts account costs at both feasible and infeasible boundaries', () => {
  for (const [solve, goal, ceiling] of [[solveLucidFlexGoal, '5100', '5400'], [solveTradeifySelectFlexGoal, '6450', '6750']] as const) {
    const max = solve({ ...target, goalAmount: goal });
    assert.equal(max.ok, true);
    if (!max.ok) continue;
    assert.equal(max.value.feasible, true);
    assert.equal(max.value.maximumTraderCash, ceiling);
    assert.equal(max.value.maximumCashAfterCosts, goal);
    assert.equal(max.value.portfolioCosts, '300');
    const over = solve({ ...target, goalAmount: new Decimal(goal).plus('0.00000001').toFixed() });
    assert.equal(over.ok, true);
    if (over.ok) {
      assert.equal(over.value.feasible, false);
      assert.equal(over.value.portfolioCosts, '300');
    }
  }
});

test('costs use the selected period as entered, with zero costs allowed and no period conversion', () => {
  for (const period of ['week', 'month', 'year'] as const) {
    const actual = calculateTargets({ ...target, period });
    assert.equal(actual.ok, true);
    if (actual.ok) assert.equal(actual.value.portfolioCosts, '300');
  }
  const zero = calculateTargets({ ...target, accountCost: '0' });
  assert.equal(zero.ok, true);
  if (zero.ok) assert.equal(zero.value.portfolioCosts, '0');
  const trading = calculateTargets({ ...target, mode: 'trading', accountCost: '' });
  assert.equal(trading.ok, true);
  if (trading.ok) {
    assert.equal(trading.value.tradingTarget, '1000');
    assert.equal(trading.value.portfolioCosts, '0');
  }
});

test('all cost controls reject invalid input under accountCost without stale results', () => {
  for (const accountCost of ['', '-1', 'NaN', 'Infinity', '1.000000001', '1000000000000.01']) {
    for (const actual of [
      calculateTargets({ ...target, accountCost }),
      simulateLucidFlex({ ...firm, accountCost }),
      simulateTradeifySelectFlex({ ...firm, accountCost }),
      solveLucidFlexGoal({ ...target, accountCost }),
      solveTradeifySelectFlexGoal({ ...target, accountCost }),
    ]) {
      assert.equal(actual.ok, false);
      assert.equal('value' in actual, false);
      if (!actual.ok) assert.ok(actual.errors.accountCost);
    }
  }
});
