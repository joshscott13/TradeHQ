import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateTargets, projectAnnualIncome, formatUsd, type TargetInput } from '../src/index.ts';

const base: TargetInput = {
  goalAmount: '48000', period: 'year', activeDays: '192', accountCount: '5',
  mode: 'trading', payoutSharePercent: '90', cashCosts: '2400',
};
function result(overrides: Partial<TargetInput> = {}) {
  const calculated = calculateTargets({ ...base, ...overrides });
  assert.equal(calculated.ok, true);
  if (!calculated.ok) throw new Error(JSON.stringify(calculated.errors));
  return calculated.value;
}

test('CALC-01 uses explicitly selected days for each period and equal account allocation', () => {
  for (const values of [
    { period: 'week' as const, goalAmount: '1000', activeDays: '4' },
    { period: 'month' as const, goalAmount: '4000', activeDays: '16' },
    { period: 'year' as const, goalAmount: '48000', activeDays: '192' },
  ]) {
    const actual = result(values);
    assert.equal(actual.dailyPortfolioTarget, '250');
    assert.equal(actual.dailyPerAccountTarget, '50');
    assert.deepEqual(actual.scaling.map(row => formatUsd(row.dailyPerAccountTarget)), ['$250.00', '$125.00', '$83.33', '$62.50', '$50.00']);
  }
});

test('CALC-02 cash-goal bridge retains repeating precision until display', () => {
  const actual = result({ mode: 'cash' });
  assert.equal(actual.tradingTarget, '56000');
  assert.match(actual.dailyPortfolioTarget, /^291\.666666666666666666666666/);
  assert.match(actual.dailyPerAccountTarget, /^58\.333333333333333333333333/);
  assert.equal(formatUsd(actual.dailyPortfolioTarget), '$291.67');
  assert.equal(formatUsd(actual.dailyPerAccountTarget), '$58.33');
  assert.equal(formatUsd(result({ mode: 'cash', accountCount: '3' }).dailyPerAccountTarget), '$97.22');
  assert.ok(actual.assumptions.some(note => note.includes('eligibility restrictions')));
  assert.equal(JSON.parse(JSON.stringify(actual)).tradingTarget, '56000');
});

test('zero goal, cash costs and share return zero; positive cash requirement at zero share is infeasible', () => {
  assert.equal(result({ goalAmount: '0' }).dailyPerAccountTarget, '0');
  assert.equal(result({ mode: 'cash', goalAmount: '0', cashCosts: '0', payoutSharePercent: '0' }).tradingTarget, '0');
  for (const amounts of [{ goalAmount: '1', cashCosts: '0' }, { goalAmount: '0', cashCosts: '1' }]) {
    const actual = calculateTargets({ ...base, ...amounts, mode: 'cash', payoutSharePercent: '0' });
    assert.equal(actual.ok, false);
    if (!actual.ok) assert.match(actual.errors.payoutSharePercent!, /infeasible/);
  }
});

test('exact decimal money avoids binary floating point errors and display uses half-up rounding', () => {
  assert.equal(result({ mode: 'cash', goalAmount: '0.1', cashCosts: '0.2', payoutSharePercent: '100' }).tradingTarget, '0.3');
  assert.equal(result({ goalAmount: '0.00000001', activeDays: '1', accountCount: '1' }).tradingTarget, '0.00000001');
  assert.equal(formatUsd('1.005'), '$1.01');
  assert.equal(formatUsd('-1.005'), '-$1.01');
  assert.equal(formatUsd('-0.001'), '$0.00');
  assert.equal(formatUsd('1234567890123.456'), '$1,234,567,890,123.46');
});

test('reject incomplete, nonfinite, negative, exponent, ambiguous and overprecision inputs with field errors', () => {
  for (const goalAmount of ['', ' ', 'NaN', 'Infinity', '-1', '1e3', '1,000', '1.', '1.000000001', '1000000000000.01']) {
    const actual = calculateTargets({ ...base, goalAmount });
    assert.equal(actual.ok, false, goalAmount);
    if (!actual.ok) assert.ok(actual.errors.goalAmount);
  }
  for (const [field, values] of Object.entries({ activeDays: ['0', '-1', '1.5', '367', ''], accountCount: ['0', '-1', '1.5', '101', 'Infinity'] })) {
    for (const value of values) {
      const actual = calculateTargets({ ...base, [field]: value });
      assert.equal(actual.ok, false);
      if (!actual.ok) assert.ok(actual.errors[field as keyof TargetInput]);
    }
  }
});

test('period bounds, invalid selectors and cash-specific fields validate without returning stale values', () => {
  for (const override of [
    { period: 'week' as const, activeDays: '8' },
    { period: 'month' as const, activeDays: '32' },
    { period: 'invalid' as TargetInput['period'] },
    { mode: 'invalid' as TargetInput['mode'] },
    { mode: 'cash' as const, payoutSharePercent: '101' },
    { mode: 'cash' as const, payoutSharePercent: '-1' },
    { mode: 'cash' as const, cashCosts: '-1' },
  ]) {
    const actual = calculateTargets({ ...base, ...override });
    assert.equal(actual.ok, false);
    assert.equal('value' in actual, false);
  }
  assert.equal(result({ payoutSharePercent: '', cashCosts: '' }).tradingTarget, '48000');
});

test('CALC-04 annual scaling uses signed net average and explicit annual days', () => {
  const actual = projectAnnualIncome({ dailyPerAccountAverage: '100', annualTradingDays: '180', accountCount: '5' });
  assert.equal(actual.ok, true);
  if (!actual.ok) return;
  assert.equal(actual.value.annualPerAccountPnl, '18000');
  assert.equal(actual.value.annualTradingPnl, '90000');
  assert.deepEqual(actual.value.scaling.map(row => row.annualTradingPnl), ['18000', '36000', '54000', '72000', '90000']);
  const loss = projectAnnualIncome({ dailyPerAccountAverage: '-0.1', annualTradingDays: '180', accountCount: '3' });
  assert.equal(loss.ok, true);
  if (loss.ok) assert.equal(loss.value.annualTradingPnl, '-54');
  const flat = projectAnnualIncome({ dailyPerAccountAverage: '0', annualTradingDays: '1', accountCount: '1' });
  assert.equal(flat.ok, true);
  if (flat.ok) assert.equal(flat.value.annualTradingPnl, '0');
});

test('annual projection validates each independent field and boundary values', () => {
  const invalid = projectAnnualIncome({ dailyPerAccountAverage: 'NaN', annualTradingDays: '0', accountCount: '1.5' });
  assert.equal(invalid.ok, false);
  if (!invalid.ok) assert.deepEqual(Object.keys(invalid.errors), ['dailyPerAccountAverage', 'annualTradingDays', 'accountCount']);
  const maximum = projectAnnualIncome({ dailyPerAccountAverage: '1000000000000', annualTradingDays: '366', accountCount: '100' });
  assert.equal(maximum.ok, true);
  if (maximum.ok) assert.equal(maximum.value.annualTradingPnl, '36600000000000000');
});
