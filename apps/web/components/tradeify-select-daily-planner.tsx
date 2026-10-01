"use client";

import { useState } from "react";
import { formatUsd } from "@tradehq/domain";
import { TRADEIFY_SELECT_DAILY_50K_PROFILE, simulateTradeifySelectDaily, solveTradeifySelectDailyGoal } from "@tradehq/domain/tradeify-select-daily";
import { NumberControl } from "./number-control";

type Period = "week" | "month" | "year";
const defaults = { goalAmount: "5000", period: "month" as Period, activeDays: "20", accountCount: "5", accountCost: "50", dailyNetProfit: "500" };
const defaultDays = { week: "5", month: "20", year: "240" };

export function TradeifySelectDailyPlanner() {
  const [inputs, setInputs] = useState(defaults);
  const profile = TRADEIFY_SELECT_DAILY_50K_PROFILE;
  const result = simulateTradeifySelectDaily(inputs);
  const goal = solveTradeifySelectDailyGoal(inputs);
  const errors = result.ok ? {} : result.errors;
  const goalErrors = goal.ok ? {} : goal.errors;
  const set = (key: keyof typeof defaults, value: string) => setInputs(old => ({ ...old, [key]: value }));
  const choosePeriod = (period: Period) => setInputs(old => ({ ...old, period, activeDays: defaultDays[period] }));
  const maximumDays = inputs.period === "week" ? 7 : inputs.period === "month" ? 31 : 366;
  const value = result.ok ? result.value : null;
  const portfolioCosts = result.ok ? result.value.portfolioCosts : goal.ok ? goal.value.portfolioCosts : null;
  const oneAccount = value?.scaling[0];
  const selectedScale = value?.scaling.find(row => row.accountCount === Number(inputs.accountCount));

  return <>
    <aside className="cohort-notice" aria-labelledby="daily-cohort-title">
      <strong id="daily-cohort-title">Hypothetical cohort · evaluation purchased strictly after September 1, 2026</strong>
      <p>This profile does not identify your actual account. September 1 itself and earlier purchases are excluded. Daily request eligibility does not mean daily cash receipt. The model pauses at discretionary live consideration; this is not an automatic transition or official funded payout cap.</p>
    </aside>
    <aside className="buffer-convention-notice" aria-labelledby="daily-buffer-title"><strong id="daily-buffer-title">Exact-buffer convention · model assumption</strong><p>Requests may leave exactly $2,100 retained profit in this model. The core policy describes the buffer while its FAQ says “above”; equality is not adjudicated actual eligibility. One pending request is allowed; hypothetical immediate approval/deduction is assumed, not actual payment timing.</p></aside>
    <div className="planner-layout">
      <section className="assumptions-panel" aria-labelledby="daily-assumptions-title">
        <div className="section-heading"><span className="section-number">01</span><h2 id="daily-assumptions-title">Model Select Daily</h2><span className="currency-tag">USD</span></div>
        <div className="firm-profile">
          <span className="firm-profile-label">HYPOTHETICAL FIRM &amp; PROGRAM PROFILE</span>
          <h3>Tradeify · Select Daily</h3>
          <p>Fresh funded accounts · zero previous payouts</p>
          <div className="profile-program-readonly"><span>Model profile</span><strong>$50k funded · Select Daily</strong><p>{profile.cohort}</p></div>
        </div>
        <div className="segmented period-selector firm-period" role="group" aria-label="Tradeify Select Daily planning period">
          {(["week", "month", "year"] as Period[]).map(period => <button key={period} aria-pressed={inputs.period === period} onClick={() => choosePeriod(period)}>Per {period}</button>)}
        </div>
        <div className="firm-controls">
          <NumberControl id="daily-goal" label={`Cash goal / ${inputs.period}`} value={inputs.goalAmount} onChange={v => set("goalAmount", v)} max={100000} step={0.01} prefix="$" error={goalErrors.goalAmount} hint="Modeled trader payout cash less the portfolio cash costs below." />
          <NumberControl id="daily-daily" label="Daily net trading P&L / account" value={inputs.dailyNetProfit} onChange={v => set("dailyNetProfit", v)} max={3500} step={0.01} prefix="$" error={errors.dailyNetProfit} hint="Constant nonnegative, loss-free daily net performance. No five-day counter; requests depend on retained profit, new cycle profit and the buffer." />
          <NumberControl id="daily-days" label="Active trading days" value={inputs.activeDays} onChange={v => set("activeDays", v)} min={1} max={maximumDays} error={errors.activeDays || goalErrors.activeDays} hint={`Available days in this ${inputs.period}; simulation may pause earlier for live review.`} />
          <NumberControl id="daily-accounts" label="Modeled active accounts" value={inputs.accountCount} onChange={v => set("accountCount", v)} min={1} max={5} error={errors.accountCount || goalErrors.accountCount} hint="1–5 total funded slots assumed available. No other household Tradeify accounts or prior live/payout history." />
          <div><NumberControl id="daily-costs" label={`Account cost / ${inputs.period}`} value={inputs.accountCost} onChange={v => set("accountCost", v)} max={10000} step={0.01} prefix="$" error={errors.accountCost || goalErrors.accountCost} hint="Expected evaluation, reset, activation or platform costs per account in this period. Exclude commissions/trading fees already deducted in daily net P&L." />{portfolioCosts !== null && <p className="cost-equation">${inputs.accountCost}/account × {inputs.accountCount} accounts = <strong>{formatUsd(portfolioCosts)}</strong> this {inputs.period}</p>}<p className="cost-period-note">Enter the cost for this period; changing periods does not convert it or make purchases recurring.</p></div>
        </div>
        <p className="account-note">$50k is the nominal program label, not invested equity or withdrawable cash. Requests use retained trading profit above that starting balance.</p>
      </section>
      <div className="results-column">
        <section className={`target-panel ${!result.ok ? "target-invalid" : ""}`} aria-labelledby="daily-result-title">
          <div className="target-heading"><p className="eyebrow">MODELED REQUEST CASH</p><span className="result-tag tradeify-tag">CONSERVATIVE REVIEW HORIZON</span></div>
          {value ? <>
            <h2 id="daily-result-title" className={`firm-cash-heading ${Number(value.cashAfterCosts) < 0 ? "firm-negative" : ""}`}>{formatUsd(value.cashAfterCosts)}</h2>
            <span className="request-result-label">modeled trader payout cash after costs / selected {inputs.period}</span>
            <p className="firm-small-caption">Hypothetical requests with immediate approval/processing. Not actual cash received, confirmed eligibility or a calendar payment forecast.</p>
            <div className="target-divider" />
            <div className="target-support firm-target-support">
              <div><span>Trader payout cash · 90% share</span><strong>{formatUsd(value.traderPayoutCash)}</strong></div>
              <div><span>Derived portfolio costs</span><strong>{formatUsd(value.portfolioCosts)}</strong><p className="result-cost-equation">${inputs.accountCost}/account × {inputs.accountCount} accounts</p></div>
              <div><span>Retained trading profit · stays in accounts</span><strong>{formatUsd(value.retainedProfit)}</strong></div>
            </div>
            <div className="firm-status"><span>{value.completedPayouts} requests / account · {value.totalPortfolioRequests} total</span><strong>{value.modeledDays} modeled active days</strong></div>
            <div className="firm-warning">
              <strong>{value.reviewBoundaryDay !== null ? `Model pauses for live review on active day ${value.reviewBoundaryDay}.` : "Selected horizon ends before modeled live review."}</strong>
              Three payouts on one account or ten across all plan types begin discretionary live consideration. This model stops at {value.reviewBoundaryCycles} synchronized cycles for {inputs.accountCount} accounts, or the selected horizon if earlier. Continued funded trading and live income are not forecast{inputs.period === "year" ? "; this annual view does not extrapolate beyond that pause" : ""}.
            </div>
            {value.constraints.length > 0 && <div className="firm-warning">{value.constraints.map((constraint, index) => <p key={index}>{constraint}</p>)}</div>}
          </> : <div className="invalid-result" role="status"><h2 id="daily-result-title">Let’s check the inputs.</h2><p>Correct the highlighted assumptions to model payout requests.</p><ul>{Object.values(errors).map((error, index) => <li key={index}>{error}</li>)}</ul></div>}
        </section>
        <section className="required-target-panel" aria-labelledby="daily-required-title">
          <div className="section-heading"><span className="section-number">02</span><h2 id="daily-required-title">What does your goal require?</h2></div>
          {goal.ok ? goal.value.feasible ? <>
            <div className="required-target-amount">{formatUsd(goal.value.minimumDailyProfit)}<span>/ account / active day</span></div>
            <p className="required-target-copy">Smallest cent-valued constant daily net profit that meets your cash goal within {inputs.activeDays} available active days and the model’s conservative review pause.</p>
            <p className="required-target-copy">At this target the model requests {formatUsd(goal.value.schedule.cashAfterCosts)} after costs, with {goal.value.schedule.completedPayouts} requests per account. Request minimums and timing can overshoot the goal. This is the minimum target under the stated model.</p>
            <button className="required-target-action" onClick={() => { if (goal.ok && goal.value.feasible) set("dailyNetProfit", goal.value.minimumDailyProfit); }}>Use this daily target</button>
          </> : <div className="firm-warning" role="status"><strong>Goal exceeds this model’s horizon.</strong>{goal.value.reason}<p>Maximum modeled trader cash within the selected days/review pause: {formatUsd(goal.value.maximumTraderCash)}. After costs: {formatUsd(goal.value.maximumCashAfterCosts)}. This is not a firm-wide income limit.</p></div> : <div className="annual-error" role="status"><p>Correct the goal assumptions to calculate a required target.</p><ul>{Object.values(goalErrors).map((error, index) => <li key={index}>{error}</li>)}</ul></div>}
        </section>
        <section className="rule-summary-panel" aria-labelledby="daily-rules-title">
          <div className="firm-rule-title"><h2 id="daily-rules-title">Select Daily $50k rules</h2><span className="currency-tag">DATED COHORT</span></div>
          <dl className="rule-summary">
            <div><dt>Retained-profit buffer</dt><dd>{formatUsd(profile.rules.retainedProfitBuffer)}</dd></div>
            <div><dt>Gross request minimum / cap</dt><dd>{formatUsd(profile.rules.minimumGrossRequest)} / {formatUsd(profile.rules.maximumGrossRequest)}</dd></div>
            <div><dt>New cycle profit limit / share</dt><dd>{profile.rules.cycleProfitMultiplier}× cycle / {profile.rules.traderSharePercent}% share</dd></div>
            <div><dt>Live consideration begins</dt><dd>{profile.rules.reviewPayoutsPerAccount} on one / {profile.rules.reviewPortfolioPayouts} in total</dd></div>
          </dl>
          <div className="rules-source"><span>Rules verified {profile.verifiedOn} · {profile.version}</span><p>{profile.sources.map((source, index) => <span key={source.url}>{index > 0 ? " · " : ""}<a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></span>)}</p><p>Positive cycle profit required. No five-day winning counter or funded consistency. Gross request is limited by profit above the $2,100 buffer, twice new cycle profit and the $1,250 cap. Cycle profit resets on modeled approval. Actual 24–48-hour processing and drawdown/news compliance are excluded.</p></div>
        </section>
      </div>
    </div>
    <section className="firm-schedule-panel" aria-labelledby="daily-schedule-title">
      <div className="firm-schedule-title"><div className="section-heading"><span className="section-number">03</span><h2 id="daily-schedule-title">Your modeled request path</h2></div><span className="firm-schedule-scope">ACTIVE DAYS · NOT PAYMENT DATES</span></div>
      <p className="section-description">New daily net profit increases retained and cycle profit. Requests deduct gross from retained profit and reset the cycle on modeled approval; the 90% share is request cash, not actual receipt.</p>
      {value ? <>
        <ol className="payout-progress" aria-label="Modeled requests before live review">
          {Array.from({ length: value.reviewBoundaryCycles }, (_, index) => index + 1).map(number => { const payout = value.schedule.find(row => row.payoutNumber === number); return <li key={number} className={payout ? "complete" : ""}><strong>Request {number}</strong><span>{payout ? `Active day ${payout.day}` : "Not reached"}</span></li>; })}
          <li className="live-phase"><strong>Model pause</strong><span>{value.reviewBoundaryDay === null ? "Not reached in selected horizon" : `Active day ${value.reviewBoundaryDay}`}<br />Further income not modeled</span></li>
        </ol>
        {value.schedule.length ? <div className="firm-table-scroll"><table><caption>Modeled requests across {inputs.accountCount} accounts; trader share applied before display rounding.</caption><thead><tr><th scope="col">Request / active day</th><th scope="col">Cycle profit before approval / account</th><th scope="col">Gross request / account</th><th scope="col">Trader cash / account</th><th scope="col">Portfolio trader cash</th><th scope="col" className="retained-column">Retained after request / account</th></tr></thead><tbody>{value.schedule.map(row => <tr key={row.payoutNumber}><th scope="row">#{row.payoutNumber} · Day {row.day}</th><td>{formatUsd(row.cycleProfitBeforeRequestPerAccount)}</td><td>{formatUsd(row.perAccountGrossRequest)}</td><td>{formatUsd(row.perAccountTraderCash)}</td><td>{formatUsd(row.portfolioTraderCash)}</td><td className="retained-column">{formatUsd(row.retainedProfitPerAccount)}</td></tr>)}</tbody></table></div> : <p className="firm-no-requests">No requests within this scenario. Profit above the $2,100 buffer, positive cycle profit and at least $250 gross request are required.</p>}
        <p className="firm-schedule-footnote">Modeled trading P&amp;L: {formatUsd(value.fundedTradingPnl)} · Gross requests deducted: {formatUsd(value.grossRequests)} · Retained profit: {formatUsd(value.retainedProfit)}. Portfolio totals; cash costs affect payout cash, not retained trading profit.</p>
      </> : <p className="unavailable">Request schedule available after correcting daily-performance assumptions.</p>}
    </section>
    <section className="firm-scaling-panel" aria-labelledby="daily-scaling-title">
      <div className="section-heading"><span className="section-number">04</span><h2 id="daily-scaling-title">Scale with the review pause in view</h2></div>
      <p className="section-description">Each account count recomputes the review pause. Daily net P&amp;L, available days and expected cost per account stay the same. Total costs scale with each count.</p>
      {value && oneAccount && selectedScale ? <>
        <div className="firm-scaling-grid"><div><span>ONE ACCOUNT</span><strong>{formatUsd(oneAccount.cashAfterCosts)}</strong><p>{oneAccount.completedPayouts} requests / {oneAccount.modeledDays} modeled days<br />{formatUsd(oneAccount.traderPayoutCash)} less {formatUsd(oneAccount.portfolioCosts)} in account costs</p></div><div><span>{inputs.accountCount} MODELED ACCOUNTS</span><strong>{formatUsd(selectedScale.cashAfterCosts)}</strong><p>{selectedScale.completedPayouts} requests per account / {selectedScale.modeledDays} days<br />{formatUsd(selectedScale.traderPayoutCash)} less {formatUsd(selectedScale.portfolioCosts)} in account costs</p></div><div><span>RETAINED ACROSS {inputs.accountCount} ACCOUNTS</span><strong>{formatUsd(value.retainedProfit)}</strong><p>Retained trading profit.<br />Not payout cash or personal equity.</p></div></div>
        <div className="firm-table-scroll"><table><caption>Account scaling: {formatUsd(inputs.accountCost)} per account / {inputs.period}; costs and review pause recalculated for each count</caption><thead><tr><th scope="col">Accounts</th><th scope="col">Requests / account</th><th scope="col">Total requests</th><th scope="col">Review pause day</th><th scope="col">Trader payout cash</th><th scope="col">Account costs</th><th scope="col">Cash after costs</th></tr></thead><tbody>{value.scaling.map(row => <tr key={row.accountCount}><th scope="row">{row.accountCount}</th><td>{row.completedPayouts}</td><td>{row.totalPortfolioRequests}</td><td>{row.reviewBoundaryDay === null ? "Not reached" : row.reviewBoundaryDay}</td><td>{formatUsd(row.traderPayoutCash)}</td><td>{formatUsd(row.portfolioCosts)}</td><td>{formatUsd(row.cashAfterCosts)}</td></tr>)}</tbody></table></div>
      </> : <p className="unavailable">Scaling comparison available after correcting performance assumptions.</p>}
      <p className="firm-scaling-note">Five identical accounts pause after two synchronized request cycles; one through four pause after three. Request days depend on the buffer, new cycle profit and your daily performance. A synchronized cycle can cross ten total requests; real approval ordering is not modeled. This is a conservative scenario boundary, not an official payout cap.</p>
    </section>
    <aside className="firm-assumptions" aria-labelledby="daily-scope-title"><h3 id="daily-scope-title">What this hypothetical profile assumes</h3><ul><li>Evaluation purchased strictly after September 1, 2026. Fresh funded Select Daily $50k accounts with no previous payouts or live history; no actual account cohort is identified.</li><li>Constant nonnegative, loss-free daily net trading P&amp;L from zero retained and cycle profit. Evaluation profit, losses, breaches, news and drawdown paths are excluded.</li><li>All 1–5 household-funded slots available, with no other Tradeify accounts across plan types. Copied exposure remains correlated.</li><li>One pending request is officially allowed. This model assumes immediate hypothetical approval/deduction before the next active day, resetting cycle profit. Actual 24–48-hour transfer timing and denials are excluded.</li><li>The model pauses at live consideration: three requests on one account or ten total, using complete synchronized cycles. Discretionary review is not a mandatory transition or funded payout cap.</li><li>Requests may leave exactly $2,100 retained under a disclosed model convention; the FAQ’s “above” wording leaves equality unresolved. Official payment rounding is unknown; cent-flooring gross requests is a model choice.</li><li>Annual views do not continue beyond the model pause. Expected cost per account is entered for the selected period and multiplied by each modeled count. Periods are not automatically converted and purchases do not recur automatically; exclude commissions/trading fees already in daily net P&amp;L.</li></ul></aside>
  </>;
}
