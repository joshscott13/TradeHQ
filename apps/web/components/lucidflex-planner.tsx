"use client";

import { useState } from "react";
import { plainPlannerText, plainPlannerErrors } from "./planner-copy";
import { LUCID_FLEX_50K_PROFILE, simulateLucidFlex, solveLucidFlexGoal, formatUsd } from "@tradehq/domain";
import { NumberControl } from "./number-control";

type Period = "week" | "month" | "year";
const defaults = { goalAmount: "5000", period: "month" as Period, activeDays: "20", accountCount: "5", accountCost: "50", dailyNetProfit: "150" };
const defaultDays = { week: "5", month: "20", year: "240" };

export function LucidFlexPlanner() {
  const [inputs, setInputs] = useState(defaults);
  const profile = LUCID_FLEX_50K_PROFILE;
  const result = simulateLucidFlex(inputs);
  const goal = solveLucidFlexGoal(inputs);
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
    <div className="planner-layout">
      <section className="assumptions-panel" aria-labelledby="firm-assumptions-title">
        <div className="section-heading"><span className="section-number">01</span><h2 id="firm-assumptions-title">Plan your payouts</h2><span className="currency-tag">USD</span></div>
        <div className="firm-profile">
          <span className="firm-profile-label">FIRM &amp; PROGRAM</span>
          <h3>Lucid Trading · LucidFlex</h3>
          <p>New funded accounts · no previous payouts</p>
          <div className="firm-program-selector"><label htmlFor="firm-account-size">Account program size</label><select id="firm-account-size" defaultValue="50k"><option value="50k">$50k funded — LucidFlex</option></select></div>
        </div>
        <div className="segmented period-selector firm-period" role="group" aria-label="LucidFlex planning period">
          {(["week", "month", "year"] as Period[]).map(period => <button key={period} aria-pressed={inputs.period === period} onClick={() => choosePeriod(period)}>Per {period}</button>)}
        </div>
        <div className="firm-controls">
          <NumberControl id="firm-goal" label={`Payout goal / ${inputs.period}`} value={inputs.goalAmount} onChange={v => set("goalAmount", v)} max={100000} step={0.01} prefix="$" error={goalErrors.goalAmount} hint="What you want to aim for after account costs." />
          <NumberControl id="firm-daily" label="Daily profit per account" value={inputs.dailyNetProfit} onChange={v => set("dailyNetProfit", v)} max={3000} step={0.01} prefix="$" error={errors.dailyNetProfit} hint="Profit after commissions and trading fees. Assumes the same profit every trading day, with no losing days." />
          <NumberControl id="firm-days" label="Days you plan to trade" value={inputs.activeDays} onChange={v => set("activeDays", v)} min={1} max={maximumDays} error={errors.activeDays || goalErrors.activeDays} hint={`Days available within the selected ${inputs.period}.`} />
          <NumberControl id="firm-accounts" label="Number of accounts" value={inputs.accountCount} onChange={v => set("accountCount", v)} min={1} max={100} error={errors.accountCount || goalErrors.accountCount} hint="Number to compare, not a check of how many accounts Lucid allows." />
          <div><NumberControl id="firm-costs" label={`Account cost / ${inputs.period}`} value={inputs.accountCost} onChange={v => set("accountCost", v)} max={10000} step={0.01} prefix="$" error={errors.accountCost || goalErrors.accountCost} hint="Cost for each account in this period: purchases, resets, activation or platform fees. Leave out trading fees already deducted from daily profit." />{portfolioCosts !== null && <p className="cost-equation">${inputs.accountCost}/account × {inputs.accountCount} accounts = <strong>{formatUsd(portfolioCosts)}</strong> this {inputs.period}</p>}<p className="cost-period-note">Enter this period’s cost. Switching week/month/year does not convert it or repeat a purchase.</p></div>
        </div>
        <p className="account-note">$50k names the account size. It is not your own money or an amount you can withdraw.</p>
      </section>
      <div className="results-column">
        <section className={`target-panel ${!result.ok ? "target-invalid" : ""}`} aria-labelledby="firm-result-title">
          <div className="target-heading"><p className="eyebrow">ESTIMATED PAYOUT</p><span className="result-tag">BEFORE LIVE TRADING</span></div>
          {value ? <>
            <h2 id="firm-result-title" className={`firm-cash-heading ${Number(value.cashAfterCosts) < 0 ? "firm-negative" : ""}`}>{formatUsd(value.cashAfterCosts)}</h2>
            <span className="request-result-label">estimated payout after account costs / {inputs.period}</span>
            <p className="firm-small-caption">Estimate only. Assumes immediate approval; these are possible payout requests, not money received or payment dates.</p>
            <div className="target-divider" />
            <div className="target-support firm-target-support">
              <div><span>Estimated payout · your 90% share before costs</span><strong>{formatUsd(value.traderPayoutCash)}</strong></div>
              <div><span>Total account costs</span><strong>{formatUsd(value.portfolioCosts)}</strong><p className="result-cost-equation">${inputs.accountCost}/account × {inputs.accountCount} accounts</p></div>
              <div><span>Profit left in accounts</span><strong>{formatUsd(value.retainedProfit)}</strong></div>
            </div>
            <div className="firm-status"><span>{value.completedPayouts} / 5 funded payouts per account</span><strong>{value.modeledDays} trading days included</strong></div>
            {value.transitionDay !== null && <div className="firm-warning"><strong>This estimate stops on trading day {value.transitionDay}.</strong>Payout 5 is reached. Later live-trading income is not included, even when you choose a year.</div>}
            {visibleConstraints.length > 0 && <div className="firm-warning">{visibleConstraints.map((constraint, index) => <p key={index}>{plainPlannerText(constraint)}</p>)}</div>}
          </> : <div className="invalid-result" role="status"><h2 id="firm-result-title">Let’s check the inputs.</h2><p>Fix the highlighted inputs to see your payout estimate.</p><ul>{Object.values(errors).map((error, index) => <li key={index}>{error}</li>)}</ul></div>}
        </section>
        <section className="required-target-panel" aria-labelledby="firm-required-title">
          <div className="section-heading"><span className="section-number">02</span><h2 id="firm-required-title">Daily profit to reach your goal</h2></div>
          {goal.ok ? goal.value.feasible ? <>
            <div className="required-target-amount">{formatUsd(goal.value.minimumDailyProfit)}<span>/ account / active day</span></div>
            <p className="required-target-copy">The lowest daily profit, to the cent, that meets your goal in these {inputs.activeDays} trading days under this estimate.</p>
            <p className="required-target-copy">At this daily profit, the estimate is {formatUsd(goal.value.schedule.cashAfterCosts)} after costs, with {goal.value.schedule.completedPayouts} payouts per account. Minimum payout requests can put the estimate above your goal.</p>
            <button className="required-target-action" onClick={() => { if (goal.ok && goal.value.feasible) set("dailyNetProfit", goal.value.minimumDailyProfit); }}>Use this daily profit</button>
          </> : <div className="firm-warning" role="status"><strong>This goal is above this estimate’s payout limit.</strong>{plainPlannerText(goal.value.reason)}<p>Highest estimated payout before costs: {formatUsd(goal.value.maximumTraderCash)}. After selected costs: {formatUsd(goal.value.maximumCashAfterCosts)}.</p></div> : <div className="annual-error" role="status"><p>Fix the goal inputs to find the daily profit you need.</p><ul>{Object.values(goalErrors).map((error, index) => <li key={index}>{error}</li>)}</ul></div>}
        </section>
        <details className="rule-summary-panel" aria-labelledby="firm-rules-title"><summary>Payout rules and sources</summary><div className="details-content">
          <div className="firm-rule-title"><h2 id="firm-rules-title">LucidFlex $50k rules</h2><span className="currency-tag">OFFICIAL SOURCES</span></div>
          <dl className="rule-summary">
            <div><dt>Days needed between payout requests</dt><dd>{profile.rules.qualifyingDays} days at {formatUsd(profile.rules.minimumDailyProfit)}+</dd></div>
            <div><dt>Request before firm share</dt><dd>{formatUsd(profile.rules.minimumGrossRequest)} – {formatUsd(profile.rules.maximumGrossRequest)}</dd></div>
            <div><dt>Request limit</dt><dd>{profile.rules.requestFractionPercent}% of profit left</dd></div>
            <div><dt>Trader share / funded payouts</dt><dd>{profile.rules.traderSharePercent}% / first {profile.rules.maxPayouts}</dd></div>
          </dl>
          <div className="rules-source"><span>Rules checked {profile.verifiedOn} · {profile.version}</span><p>{profile.sources.map((source, index) => <span key={source.url}>{index > 0 ? " · " : ""}<a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></span>)}</p><p>Qualifying days reset after approval. Positive cycle net profit required. No buffer. Requests lock maximum loss at {formatUsd(profile.rules.lockedMaximumLossBalance)}; headroom is profit left in accounts less $100. Drawdown paths and approval eligibility are not simulated.</p></div>
        </div></details>
      </div>
    </div>
    <section className="firm-schedule-panel" aria-labelledby="firm-schedule-title">
      <div className="firm-schedule-title"><div className="section-heading"><span className="section-number">03</span><h2 id="firm-schedule-title">When could you request a payout?</h2></div><span className="firm-schedule-scope">TRADING DAYS · NOT PAYMENT DATES</span></div>
      <p className="section-description">The full request leaves the account. You keep 90% before account costs; the rest is the firm’s share. Profit left in the account has not been paid to you.</p>
      {value ? <>
        <ol className="payout-progress" aria-label="Funded payout milestones">
          {[1, 2, 3, 4, 5].map(number => { const payout = value.schedule.find(row => row.payoutNumber === number); return <li key={number} className={payout ? "complete" : ""}><strong>Payout {number}</strong><span>{payout ? `Active day ${payout.day}` : "Not reached"}</span></li>; })}
          <li className="live-phase"><strong>Live trading</strong><span>{value.transitionDay === null ? "After payout 5" : `Transition day ${value.transitionDay}`}<br />Not included</span></li>
        </ol>
        {value.schedule.length ? <div className="firm-table-scroll"><table><caption>Possible requests across {inputs.accountCount} accounts; your share is calculated before display rounding.</caption><thead><tr><th scope="col">Request / trading day</th><th scope="col">Request before firm share / account</th><th scope="col">Your share / account</th><th scope="col">Your share · all accounts</th><th scope="col" className="retained-column">Profit left / account</th><th scope="col">Loss room after request / account</th></tr></thead><tbody>{value.schedule.map(row => <tr key={row.payoutNumber}><th scope="row">#{row.payoutNumber} · Day {row.day}</th><td>{formatUsd(row.perAccountGrossRequest)}</td><td>{formatUsd(row.perAccountTraderCash)}</td><td>{formatUsd(row.portfolioTraderCash)}</td><td className="retained-column">{formatUsd(row.retainedProfitPerAccount)}</td><td>{formatUsd(row.postRequestLossHeadroomPerAccount)}</td></tr>)}</tbody></table></div> : <p className="firm-no-requests">No payout requests fit these inputs. At least five qualifying days, positive profit since the last payout and a $500 minimum request before the firm’s share are required.</p>}
        <p className="firm-schedule-footnote">Trading profit after fees: {formatUsd(value.fundedTradingPnl)} · Full requests taken from accounts: {formatUsd(value.grossRequests)} · Profit left in accounts: {formatUsd(value.retainedProfit)}. All three are totals across all accounts. Account costs reduce your estimated payout, not the trading profit left in accounts.</p>
      </> : <p className="unavailable">Fix the daily profit inputs to see possible payout requests.</p>}
    </section>
    <section className="firm-scaling-panel" aria-labelledby="firm-scaling-title">
      <div className="section-heading"><span className="section-number">04</span><h2 id="firm-scaling-title">What if you add accounts?</h2></div>
      <p className="section-description">Same daily profit and trading days. More accounts add their own account costs.</p>
      {value && oneAccount && selectedScale ? <>
        <div className="firm-scaling-grid"><div><span>ONE ACCOUNT</span><strong>{formatUsd(oneAccount.cashAfterCosts)}</strong><p>{formatUsd(oneAccount.traderPayoutCash)} estimated payout before costs<br />less {formatUsd(oneAccount.portfolioCosts)} in account costs</p></div><div><span>{inputs.accountCount} ACCOUNTS</span><strong>{formatUsd(selectedScale.cashAfterCosts)}</strong><p>{formatUsd(selectedScale.traderPayoutCash)} estimated payout before costs<br />less {formatUsd(selectedScale.portfolioCosts)} in account costs</p></div><div><span>PROFIT LEFT IN {inputs.accountCount} ACCOUNTS</span><strong>{formatUsd(value.retainedProfit)}</strong><p>Profit still in the accounts.<br />Not paid out to you.</p></div></div>
        <details><summary>Compare each account count</summary><div className="table-scroll"><table><caption>Same performance with {formatUsd(inputs.accountCost)} per account in the selected {inputs.period}</caption><thead><tr><th scope="col">Accounts</th><th scope="col">Estimated payout · your share</th><th scope="col">Account costs</th><th scope="col">After account costs</th></tr></thead><tbody>{value.scaling.map(row => <tr key={row.accountCount}><th scope="row">{row.accountCount}</th><td>{formatUsd(row.traderPayoutCash)}</td><td>{formatUsd(row.portfolioCosts)}</td><td>{formatUsd(row.cashAfterCosts)}</td></tr>)}</tbody></table></div></details>
      </> : <p className="unavailable">Fix the highlighted inputs to compare account counts.</p>}
      <p className="firm-scaling-note">Copied exposure is correlated. The scenario does not check Lucid’s account-count limits. Each count includes the same expected cost per account for the selected period; purchases are not automatically repeated.</p>
    </section>
    <details className="firm-assumptions"><summary>Details behind this estimate</summary><div className="details-content"><h3 id="firm-scope-title">How this estimate works</h3><ul><li>New funded LucidFlex $50k accounts start at zero profit, with no previous payouts. Existing accounts and the evaluation stage are excluded.</li><li>Every trading day earns the same profit after commissions and trading fees, with no losing days. Rule breaches, account-loss limits during trading and account survival are not checked.</li><li>A request happens as soon as the example rules allow it. Approval is assumed immediately and the full request is deducted before the next trading day.</li><li>Lucid lists payment within two business days after approval. Processing delays and calendar payment dates are excluded; these are estimates of possible requests, not money received.</li><li>The estimate stops after the fifth payout. Even with a year selected, later live-trading income and replacement accounts are not included.</li><li>All accounts use the same timing. Lucid account-count limits are not checked. Costs apply to each account for the week, month or year you selected. Changing periods does not convert costs or repeat purchases. Leave out commissions and trading fees already deducted from daily profit.</li></ul></div></details>
  </>;
}
