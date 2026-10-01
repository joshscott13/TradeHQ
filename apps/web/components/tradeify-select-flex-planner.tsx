"use client";

import { useState } from "react";
import { plainPlannerText, plainPlannerErrors } from "./planner-copy";
import { formatUsd } from "@tradehq/domain";
import { TRADEIFY_SELECT_FLEX_50K_PROFILE, simulateTradeifySelectFlex, solveTradeifySelectFlexGoal } from "@tradehq/domain/tradeify-select-flex";
import { NumberControl } from "./number-control";

type Period = "week" | "month" | "year";
const defaults = { goalAmount: "5000", period: "month" as Period, activeDays: "20", accountCount: "5", accountCost: "50", dailyNetProfit: "150" };
const defaultDays = { week: "5", month: "20", year: "240" };

export function TradeifySelectFlexPlanner() {
  const [inputs, setInputs] = useState(defaults);
  const profile = TRADEIFY_SELECT_FLEX_50K_PROFILE;
  const result = simulateTradeifySelectFlex(inputs);
  const goal = solveTradeifySelectFlexGoal(inputs);
  const errors = result.ok ? {} : plainPlannerErrors(result.errors);
  const goalErrors = goal.ok ? {} : plainPlannerErrors(goal.errors);
  const set = (key: keyof typeof defaults, value: string) => setInputs(old => ({ ...old, [key]: value }));
  const choosePeriod = (period: Period) => setInputs(old => ({ ...old, period, activeDays: defaultDays[period] }));
  const maximumDays = inputs.period === "week" ? 7 : inputs.period === "month" ? 31 : 366;
  const value = result.ok ? result.value : null;
  const visibleConstraints = value?.constraints.filter(text => !text.startsWith("The model pauses") && !text.startsWith("The funded phase stops")) ?? [];
  const portfolioCosts = result.ok ? result.value.portfolioCosts : goal.ok ? goal.value.portfolioCosts : null;
  const oneAccount = value?.scaling[0];
  const selectedScale = value?.scaling.find(row => row.accountCount === Number(inputs.accountCount));

  return <>
    <aside className="cohort-notice" aria-labelledby="tradeify-cohort-title">
      <strong id="tradeify-cohort-title">Example rules · evaluation bought after September 1, 2026</strong>
      <p>September 1 itself and earlier purchases are excluded. These are example funded accounts with no previous payouts, not a check of your actual account.</p>
    </aside>
    <div className="planner-layout">
      <section className="assumptions-panel" aria-labelledby="tradeify-assumptions-title">
        <div className="section-heading"><span className="section-number">01</span><h2 id="tradeify-assumptions-title">Plan with Select Flex</h2><span className="currency-tag">USD</span></div>
        <div className="firm-profile">
          <span className="firm-profile-label">EXAMPLE ACCOUNT RULES</span>
          <h3>Tradeify · Select Flex</h3>
          <p>New funded accounts · no previous payouts</p>
          <div className="profile-program-readonly"><span>Example account</span><strong>$50k funded · Select Flex</strong><p>Evaluation bought after September 1, 2026; that date itself is excluded.</p></div>
        </div>
        <div className="segmented period-selector firm-period" role="group" aria-label="Tradeify Select Flex planning period">
          {(["week", "month", "year"] as Period[]).map(period => <button key={period} aria-pressed={inputs.period === period} onClick={() => choosePeriod(period)}>Per {period}</button>)}
        </div>
        <div className="firm-controls">
          <NumberControl id="tradeify-goal" label={`Payout goal / ${inputs.period}`} value={inputs.goalAmount} onChange={v => set("goalAmount", v)} max={100000} step={0.01} prefix="$" error={goalErrors.goalAmount} hint="What you want to aim for after account costs." />
          <NumberControl id="tradeify-daily" label="Daily profit per account" value={inputs.dailyNetProfit} onChange={v => set("dailyNetProfit", v)} max={3000} step={0.01} prefix="$" error={errors.dailyNetProfit} hint="Profit after commissions and trading fees. Assumes the same profit every trading day, with no losing days." />
          <NumberControl id="tradeify-days" label="Days you plan to trade" value={inputs.activeDays} onChange={v => set("activeDays", v)} min={1} max={maximumDays} error={errors.activeDays || goalErrors.activeDays} hint={`Available days in this ${inputs.period}; the estimate can stop earlier at possible live review.`} />
          <NumberControl id="tradeify-accounts" label="Number of accounts" value={inputs.accountCount} onChange={v => set("accountCount", v)} min={1} max={5} error={errors.accountCount || goalErrors.accountCount} hint="Assumes 1–5 available funded accounts and no other household Tradeify accounts or previous payouts/live history." />
          <div><NumberControl id="tradeify-costs" label={`Account cost / ${inputs.period}`} value={inputs.accountCost} onChange={v => set("accountCost", v)} max={10000} step={0.01} prefix="$" error={errors.accountCost || goalErrors.accountCost} hint="Cost for each account in this period: purchases, resets, activation or platform fees. Leave out trading fees already deducted from daily profit." />{portfolioCosts !== null && <p className="cost-equation">${inputs.accountCost}/account × {inputs.accountCount} accounts = <strong>{formatUsd(portfolioCosts)}</strong> this {inputs.period}</p>}<p className="cost-period-note">Enter this period’s cost. Switching week/month/year does not convert it or repeat a purchase.</p></div>
        </div>
        <p className="account-note">$50k names the account size. It is not your own money or an amount you can withdraw.</p>
      </section>
      <div className="results-column">
        <section className={`target-panel ${!result.ok ? "target-invalid" : ""}`} aria-labelledby="tradeify-result-title">
          <div className="target-heading"><p className="eyebrow">ESTIMATED PAYOUT</p><span className="result-tag tradeify-tag">ESTIMATE STOPS AT LIVE REVIEW</span></div>
          {value ? <>
            <h2 id="tradeify-result-title" className={`firm-cash-heading ${Number(value.cashAfterCosts) < 0 ? "firm-negative" : ""}`}>{formatUsd(value.cashAfterCosts)}</h2>
            <span className="request-result-label">estimated payout after account costs / {inputs.period}</span>
            <p className="firm-small-caption">Estimate only. Assumes immediate approval and processing; not actual money received or confirmed payout eligibility.</p>
            <div className="target-divider" />
            <div className="target-support firm-target-support">
              <div><span>Estimated payout · your 90% share before costs</span><strong>{formatUsd(value.traderPayoutCash)}</strong></div>
              <div><span>Total account costs</span><strong>{formatUsd(value.portfolioCosts)}</strong><p className="result-cost-equation">${inputs.accountCost}/account × {inputs.accountCount} accounts</p></div>
              <div><span>Profit left in accounts</span><strong>{formatUsd(value.retainedProfit)}</strong></div>
            </div>
            <div className="firm-status"><span>{value.completedPayouts} requests / account · {value.totalPortfolioRequests} total</span><strong>{value.modeledDays} trading days included</strong></div>
            <div className="firm-warning">
              <strong>{value.reviewBoundaryDay !== null ? `This estimate stops on trading day ${value.reviewBoundaryDay}.` : "Your chosen days end before possible live review."}</strong>
              We stop after {value.reviewBoundaryCycles} payout rounds across these accounts, or your chosen days if sooner. The firm may consider live trading; later payouts are not estimated. This is not an automatic move or an official payout limit.</div>
            {visibleConstraints.length > 0 && <div className="firm-warning">{visibleConstraints.map((constraint, index) => <p key={index}>{plainPlannerText(constraint)}</p>)}</div>}
          </> : <div className="invalid-result" role="status"><h2 id="tradeify-result-title">Let’s check the inputs.</h2><p>Fix the highlighted inputs to see your payout estimate.</p><ul>{Object.values(errors).map((error, index) => <li key={index}>{error}</li>)}</ul></div>}
        </section>
        <section className="required-target-panel" aria-labelledby="tradeify-required-title">
          <div className="section-heading"><span className="section-number">02</span><h2 id="tradeify-required-title">Daily profit to reach your goal</h2></div>
          {goal.ok ? goal.value.feasible ? <>
            <div className="required-target-amount">{formatUsd(goal.value.minimumDailyProfit)}<span>/ account / active day</span></div>
            <p className="required-target-copy">The lowest daily profit, to the cent, that meets your goal in these {inputs.activeDays} trading days, before this estimate stops for possible live review.</p>
            <p className="required-target-copy">At this daily profit, estimated payout is {formatUsd(goal.value.schedule.cashAfterCosts)} after costs, with {goal.value.schedule.completedPayouts} requests per account. Minimum profit requirements can put the estimate above your goal.</p>
            <button className="required-target-action" onClick={() => { if (goal.ok && goal.value.feasible) set("dailyNetProfit", goal.value.minimumDailyProfit); }}>Use this daily profit</button>
          </> : <div className="firm-warning" role="status"><strong>This goal is too high for this estimate.</strong>{plainPlannerText(goal.value.reason)}<p>Highest estimated payout before this estimate stops: {formatUsd(goal.value.maximumTraderCash)}. After costs: {formatUsd(goal.value.maximumCashAfterCosts)}. This does not limit everything the firm could pay.</p></div> : <div className="annual-error" role="status"><p>Fix the goal inputs to find the daily profit you need.</p><ul>{Object.values(goalErrors).map((error, index) => <li key={index}>{error}</li>)}</ul></div>}
        </section>
        <details className="rule-summary-panel" aria-labelledby="tradeify-rules-title"><summary>Payout rules and sources</summary><div className="details-content">
          <div className="firm-rule-title"><h2 id="tradeify-rules-title">Select Flex $50k rules</h2><span className="currency-tag">EXAMPLE PURCHASE DATE</span></div>
          <dl className="rule-summary">
            <div><dt>Days needed between payout requests</dt><dd>{profile.rules.qualifyingDays} days at {formatUsd(profile.rules.minimumDailyProfit)}+</dd></div>
            <div><dt>Request before firm share</dt><dd>{formatUsd(profile.rules.minimumGrossRequest)} – {formatUsd(profile.rules.maximumGrossRequest)}</dd></div>
            <div><dt>Request limit / your share</dt><dd>{profile.rules.requestFractionPercent}% of profit left / {profile.rules.traderSharePercent}% share</dd></div>
            <div><dt>Possible live review after</dt><dd>{profile.rules.reviewPayoutsPerAccount} on one / {profile.rules.reviewPortfolioPayouts} in total</dd></div>
          </dl>
          <div className="rules-source"><span>Rules checked {profile.verifiedOn} · {profile.version}</span><p>{profile.sources.map((source, index) => <span key={source.url}>{index > 0 ? " · " : ""}<a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></span>)}</p><p>Five winning days reset per cycle; positive cycle net profit required. No buffer, funded consistency rule or daily loss limit. One pending request per account; typical processing is 24–48 hours. Approval and processing are simplified by this model; drawdown compliance is not inferred.</p></div>
        </div></details>
      </div>
    </div>
    <section className="firm-schedule-panel" aria-labelledby="tradeify-schedule-title">
      <div className="firm-schedule-title"><div className="section-heading"><span className="section-number">03</span><h2 id="tradeify-schedule-title">When could you request a payout?</h2></div><span className="firm-schedule-scope">TRADING DAYS · NOT PAYMENT DATES</span></div>
      <p className="section-description">The full request leaves the account. You keep 90% before account costs; the rest is the firm’s share. These requests are not payments received.</p>
      {value ? <>
        <ol className="payout-progress" aria-label="Modeled requests before live review">
          {Array.from({ length: value.reviewBoundaryCycles }, (_, index) => index + 1).map(number => { const payout = value.schedule.find(row => row.payoutNumber === number); return <li key={number} className={payout ? "complete" : ""}><strong>Request {number}</strong><span>{payout ? `Active day ${payout.day}` : "Not reached"}</span></li>; })}
          <li className="live-phase"><strong>Estimate stops</strong><span>{value.reviewBoundaryDay === null ? "Not reached in these days" : `Active day ${value.reviewBoundaryDay}`}<br />Later income not included</span></li>
        </ol>
        {value.schedule.length ? <div className="firm-table-scroll"><table><caption>Possible requests across {inputs.accountCount} accounts; your share is calculated before display rounding.</caption><thead><tr><th scope="col">Request / trading day</th><th scope="col">Request before firm share / account</th><th scope="col">Your share / account</th><th scope="col">Your share · all accounts</th><th scope="col" className="retained-column">Profit left / account</th></tr></thead><tbody>{value.schedule.map(row => <tr key={row.payoutNumber}><th scope="row">#{row.payoutNumber} · Day {row.day}</th><td>{formatUsd(row.perAccountGrossRequest)}</td><td>{formatUsd(row.perAccountTraderCash)}</td><td>{formatUsd(row.portfolioTraderCash)}</td><td className="retained-column">{formatUsd(row.retainedProfitPerAccount)}</td></tr>)}</tbody></table></div> : <p className="firm-no-requests">No payout requests fit these inputs. Five qualifying days, positive profit since the last payout and a $250 minimum request before the firm’s share are required.</p>}
        <p className="firm-schedule-footnote">Trading profit after fees: {formatUsd(value.fundedTradingPnl)} · Full requests taken from accounts: {formatUsd(value.grossRequests)} · Profit left in accounts: {formatUsd(value.retainedProfit)}. Totals across accounts. Account costs reduce your estimated payout, not the profit left in accounts.</p>
      </> : <p className="unavailable">Fix the daily profit inputs to see possible payout requests.</p>}
    </section>
    <section className="firm-scaling-panel" aria-labelledby="tradeify-scaling-title">
      <div className="section-heading"><span className="section-number">04</span><h2 id="tradeify-scaling-title">What if you add accounts?</h2></div>
      <p className="section-description">Compare the same daily profit and account cost. Each account count has its own stopping point for possible live review.</p>
      {value && oneAccount && selectedScale ? <>
        <div className="firm-scaling-grid"><div><span>ONE ACCOUNT</span><strong>{formatUsd(oneAccount.cashAfterCosts)}</strong><p>{oneAccount.completedPayouts} requests / {oneAccount.modeledDays} days included<br />{formatUsd(oneAccount.traderPayoutCash)} less {formatUsd(oneAccount.portfolioCosts)} in account costs</p></div><div><span>{inputs.accountCount} ACCOUNTS</span><strong>{formatUsd(selectedScale.cashAfterCosts)}</strong><p>{selectedScale.completedPayouts} requests per account / {selectedScale.modeledDays} days<br />{formatUsd(selectedScale.traderPayoutCash)} less {formatUsd(selectedScale.portfolioCosts)} in account costs</p></div><div><span>PROFIT LEFT IN {inputs.accountCount} ACCOUNTS</span><strong>{formatUsd(value.retainedProfit)}</strong><p>Profit still in the accounts.<br />Not paid out to you.</p></div></div>
        <div className="firm-table-scroll"><table><caption>Account scaling: {formatUsd(inputs.accountCost)} per account / {inputs.period}; costs and review pause recalculated for each count</caption><thead><tr><th scope="col">Accounts</th><th scope="col">Requests per account</th><th scope="col">Requests across accounts</th><th scope="col">Estimate stops on day</th><th scope="col">Estimated payout · your share</th><th scope="col">Account costs</th><th scope="col">After account costs</th></tr></thead><tbody>{value.scaling.map(row => <tr key={row.accountCount}><th scope="row">{row.accountCount}</th><td>{row.completedPayouts}</td><td>{row.totalPortfolioRequests}</td><td>{row.reviewBoundaryDay === null ? "Not reached" : row.reviewBoundaryDay}</td><td>{formatUsd(row.traderPayoutCash)}</td><td>{formatUsd(row.portfolioCosts)}</td><td>{formatUsd(row.cashAfterCosts)}</td></tr>)}</tbody></table></div>
      </> : <p className="unavailable">Fix the highlighted inputs to compare account counts.</p>}
      <p className="firm-scaling-note">With five accounts, this estimate stops after two payout rounds; with one to four, after three. All accounts request at the same time. The actual order of approvals and later payouts are not included.</p>
    </section>
    <details className="firm-assumptions"><summary>Details behind this estimate</summary><div className="details-content"><h3 id="tradeify-scope-title">How this estimate works</h3><ul><li>Example evaluation purchases strictly after September 1, 2026; September 1 itself and earlier dates are excluded. New funded accounts have no previous payouts or live history. This does not identify your actual account.</li><li>Every trading day earns the same profit after commissions and trading fees, with no losing days. Net profit is used conservatively to count the five $150+ days; the official commission basis for winning days is unresolved. Losses, rule breaches and account-loss limits during trading are not checked.</li><li>All 1–5 household-funded slots are assumed available, with no other Tradeify accounts. Copied trades can lose across several accounts at once.</li><li>One payout round completes before the next trading day, with immediate approval and processing assumed. Actual 24–48-hour processing and payment dates are excluded.</li><li>The firm may consider live trading after three payouts on one account or ten across all plans. We stop there using complete payout rounds across accounts. This is not an automatic move or an official payout limit. Yearly estimates do not include later income.</li><li>Costs apply to each account for the week, month or year you selected. Changing periods does not convert costs or repeat purchases. Leave out commissions and trading fees already deducted from daily profit.</li></ul></div></details>
  </>;
}
