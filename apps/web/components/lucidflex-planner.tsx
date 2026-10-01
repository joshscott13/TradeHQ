"use client";

import { useState } from "react";
import { LUCID_FLEX_50K_PROFILE, simulateLucidFlex, solveLucidFlexGoal, formatUsd } from "@tradehq/domain";
import { NumberControl } from "./number-control";

type Period = "week" | "month" | "year";
const defaults = { goalAmount: "5000", period: "month" as Period, activeDays: "20", accountCount: "5", cashCosts: "250", dailyNetProfit: "150" };
const defaultDays = { week: "5", month: "20", year: "240" };

export function LucidFlexPlanner() {
  const [inputs, setInputs] = useState(defaults);
  const profile = LUCID_FLEX_50K_PROFILE;
  const result = simulateLucidFlex(inputs);
  const goal = solveLucidFlexGoal(inputs);
  const errors = result.ok ? {} : result.errors;
  const goalErrors = goal.ok ? {} : goal.errors;
  const set = (key: keyof typeof defaults, value: string) => setInputs(old => ({ ...old, [key]: value }));
  const choosePeriod = (period: Period) => setInputs(old => ({ ...old, period, activeDays: defaultDays[period] }));
  const maximumDays = inputs.period === "week" ? 7 : inputs.period === "month" ? 31 : 366;
  const value = result.ok ? result.value : null;
  const oneAccount = value?.scaling[0];
  const selectedScale = value?.scaling.find(row => row.accountCount === Number(inputs.accountCount));

  return <>
    <div className="planner-layout">
      <section className="assumptions-panel" aria-labelledby="firm-assumptions-title">
        <div className="section-heading"><span className="section-number">01</span><h2 id="firm-assumptions-title">Model your funded phase</h2><span className="currency-tag">USD</span></div>
        <div className="firm-profile">
          <span className="firm-profile-label">FIRM &amp; PROGRAM</span>
          <h3>Lucid Trading · LucidFlex</h3>
          <p>Fresh funded accounts · zero previous payouts</p>
          <div className="firm-program-selector"><label htmlFor="firm-account-size">Account program size</label><select id="firm-account-size" defaultValue="50k"><option value="50k">$50k funded — LucidFlex</option></select></div>
        </div>
        <div className="segmented period-selector firm-period" role="group" aria-label="LucidFlex planning period">
          {(["week", "month", "year"] as Period[]).map(period => <button key={period} aria-pressed={inputs.period === period} onClick={() => choosePeriod(period)}>Per {period}</button>)}
        </div>
        <div className="firm-controls">
          <NumberControl id="firm-goal" label={`Cash goal / ${inputs.period}`} value={inputs.goalAmount} onChange={v => set("goalAmount", v)} max={100000} step={0.01} prefix="$" error={goalErrors.goalAmount} hint="Trader payout cash less the portfolio cash costs below." />
          <NumberControl id="firm-daily" label="Daily net trading P&L / account" value={inputs.dailyNetProfit} onChange={v => set("dailyNetProfit", v)} max={3000} step={0.01} prefix="$" error={errors.dailyNetProfit} hint="Constant, loss-free performance on every active day." />
          <NumberControl id="firm-days" label="Active trading days" value={inputs.activeDays} onChange={v => set("activeDays", v)} min={1} max={maximumDays} error={errors.activeDays || goalErrors.activeDays} hint={`Days available within the selected ${inputs.period}.`} />
          <NumberControl id="firm-accounts" label="Modeled active accounts" value={inputs.accountCount} onChange={v => set("accountCount", v)} min={1} max={100} error={errors.accountCount || goalErrors.accountCount} hint="Scenario count only; Lucid account-count limits are not checked." />
          <NumberControl id="firm-costs" label={`Portfolio cash costs / ${inputs.period}`} value={inputs.cashCosts} onChange={v => set("cashCosts", v)} max={10000} step={0.01} prefix="$" error={errors.cashCosts || goalErrors.cashCosts} hint="Total cash costs across all accounts; not a per-account fee." />
        </div>
        <p className="account-note">$50k is the nominal program label, not invested equity or withdrawable cash. Profit drives these requests; the $50k starting balance is excluded.</p>
      </section>
      <div className="results-column">
        <section className={`target-panel ${!result.ok ? "target-invalid" : ""}`} aria-labelledby="firm-result-title">
          <div className="target-heading"><p className="eyebrow">MODELED REQUEST CASH</p><span className="result-tag">FUNDED PHASE ONLY</span></div>
          {value ? <>
            <h2 id="firm-result-title" className={`firm-cash-heading ${Number(value.cashAfterCosts) < 0 ? "firm-negative" : ""}`}>{formatUsd(value.cashAfterCosts)}</h2>
            <span className="request-result-label">trader payout cash after portfolio costs / selected {inputs.period}</span>
            <p className="firm-small-caption">Based on modeled requests with immediate approval. This is not actual cash received or a calendar payment forecast.</p>
            <div className="target-divider" />
            <div className="target-support firm-target-support">
              <div><span>Trader payout cash · 90% share</span><strong>{formatUsd(value.traderPayoutCash)}</strong></div>
              <div><span>Portfolio cash costs</span><strong>{formatUsd(inputs.cashCosts)}</strong></div>
              <div><span>Retained trading profit · stays in accounts</span><strong>{formatUsd(value.retainedProfit)}</strong></div>
            </div>
            <div className="firm-status"><span>{value.completedPayouts} / 5 funded payouts per account</span><strong>{value.modeledDays} modeled active days</strong></div>
            {value.transitionDay !== null && <div className="firm-warning"><strong>Funded phase ends on active day {value.transitionDay}.</strong>Fifth payout reached. Trading and cash projections stop here; live-stage income is not modeled{inputs.period === "year" ? ", so this annual view is capped at the remaining funded phase" : ""}.</div>}
            {value.constraints.length > 0 && <div className="firm-warning">{value.constraints.map((constraint, index) => <p key={index}>{constraint}</p>)}</div>}
          </> : <div className="invalid-result" role="status"><h2 id="firm-result-title">Let’s check the inputs.</h2><p>Correct the highlighted assumptions to model payout requests.</p><ul>{Object.values(errors).map((error, index) => <li key={index}>{error}</li>)}</ul></div>}
        </section>
        <section className="required-target-panel" aria-labelledby="firm-required-title">
          <div className="section-heading"><span className="section-number">02</span><h2 id="firm-required-title">What does your goal require?</h2></div>
          {goal.ok ? goal.value.feasible ? <>
            <div className="required-target-amount">{formatUsd(goal.value.minimumDailyProfit)}<span>/ account / active day</span></div>
            <p className="required-target-copy">Smallest cent-valued, constant daily net profit that meets your cash goal within {inputs.activeDays} active days.</p>
            <p className="required-target-copy">This target models {formatUsd(goal.value.schedule.cashAfterCosts)} after costs, with {goal.value.schedule.completedPayouts} payouts per account. Minimum requests can produce more cash than the goal.</p>
            <button className="required-target-action" onClick={() => { if (goal.ok && goal.value.feasible) set("dailyNetProfit", goal.value.minimumDailyProfit); }}>Use this daily target</button>
          </> : <div className="firm-warning" role="status"><strong>Goal exceeds funded payout capacity.</strong>{goal.value.reason}<p>Maximum modeled trader cash: {formatUsd(goal.value.maximumTraderCash)}. After selected costs: {formatUsd(goal.value.maximumCashAfterCosts)}.</p></div> : <div className="annual-error" role="status"><p>Correct the goal assumptions to calculate a required target.</p><ul>{Object.values(goalErrors).map((error, index) => <li key={index}>{error}</li>)}</ul></div>}
        </section>
        <section className="rule-summary-panel" aria-labelledby="firm-rules-title">
          <div className="firm-rule-title"><h2 id="firm-rules-title">LucidFlex $50k rules</h2><span className="currency-tag">SOURCED PROFILE</span></div>
          <dl className="rule-summary">
            <div><dt>Qualifying days per payout cycle</dt><dd>{profile.rules.qualifyingDays} days at {formatUsd(profile.rules.minimumDailyProfit)}+</dd></div>
            <div><dt>Gross request range</dt><dd>{formatUsd(profile.rules.minimumGrossRequest)} – {formatUsd(profile.rules.maximumGrossRequest)}</dd></div>
            <div><dt>Request cap</dt><dd>{profile.rules.requestFractionPercent}% of retained profit</dd></div>
            <div><dt>Trader share / funded payouts</dt><dd>{profile.rules.traderSharePercent}% / first {profile.rules.maxPayouts}</dd></div>
          </dl>
          <div className="rules-source"><span>Rules verified {profile.verifiedOn} · {profile.version}</span><p>{profile.sources.map((source, index) => <span key={source.url}>{index > 0 ? " · " : ""}<a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></span>)}</p><p>Qualifying days reset after approval. Positive cycle net profit required. No buffer. Requests lock maximum loss at {formatUsd(profile.rules.lockedMaximumLossBalance)}; headroom is retained profit less $100. Drawdown paths and approval eligibility are not simulated.</p></div>
        </section>
      </div>
    </div>
    <section className="firm-schedule-panel" aria-labelledby="firm-schedule-title">
      <div className="firm-schedule-title"><div className="section-heading"><span className="section-number">03</span><h2 id="firm-schedule-title">Your modeled payout path</h2></div><span className="firm-schedule-scope">ACTIVE DAYS · NOT CALENDAR DATES</span></div>
      <p className="section-description">Every account follows the same fresh funded lifecycle. Gross requests leave retained profit; only the trader share contributes to payout cash.</p>
      {value ? <>
        <ol className="payout-progress" aria-label="Funded payout milestones">
          {[1, 2, 3, 4, 5].map(number => { const payout = value.schedule.find(row => row.payoutNumber === number); return <li key={number} className={payout ? "complete" : ""}><strong>Payout {number}</strong><span>{payout ? `Active day ${payout.day}` : "Not reached"}</span></li>; })}
          <li className="live-phase"><strong>Live phase</strong><span>{value.transitionDay === null ? "After payout 5" : `Transition day ${value.transitionDay}`}<br />Not modeled</span></li>
        </ol>
        {value.schedule.length ? <div className="firm-table-scroll"><table><caption>Modeled requests across {inputs.accountCount} accounts; trader share is applied before display rounding.</caption><thead><tr><th scope="col">Payout / active day</th><th scope="col">Gross request / account</th><th scope="col">Trader cash / account</th><th scope="col">Portfolio trader cash</th><th scope="col" className="retained-column">Retained / account</th><th scope="col">Loss headroom / account</th></tr></thead><tbody>{value.schedule.map(row => <tr key={row.payoutNumber}><th scope="row">#{row.payoutNumber} · Day {row.day}</th><td>{formatUsd(row.perAccountGrossRequest)}</td><td>{formatUsd(row.perAccountTraderCash)}</td><td>{formatUsd(row.portfolioTraderCash)}</td><td className="retained-column">{formatUsd(row.retainedProfitPerAccount)}</td><td>{formatUsd(row.postRequestLossHeadroomPerAccount)}</td></tr>)}</tbody></table></div> : <p className="firm-no-requests">No requests within this scenario. At least five qualifying days, positive cycle profit and a $500 minimum gross request are required.</p>}
        <p className="firm-schedule-footnote">Funded trading P&amp;L: {formatUsd(value.fundedTradingPnl)} · Gross requests deducted: {formatUsd(value.grossRequests)} · Retained profit: {formatUsd(value.retainedProfit)}. All three are portfolio totals. Cash costs affect the cash result, not retained trading profit.</p>
      </> : <p className="unavailable">Payout schedule available after correcting the daily-performance assumptions.</p>}
    </section>
    <section className="firm-scaling-panel" aria-labelledby="firm-scaling-title">
      <div className="section-heading"><span className="section-number">04</span><h2 id="firm-scaling-title">Scale the same performance</h2></div>
      <p className="section-description">Same daily net P&amp;L and active days. The selected portfolio cash costs remain fixed in every comparison.</p>
      {value && oneAccount && selectedScale ? <>
        <div className="firm-scaling-grid"><div><span>ONE ACCOUNT</span><strong>{formatUsd(oneAccount.cashAfterCosts)}</strong><p>{formatUsd(oneAccount.traderPayoutCash)} trader payout cash<br />after {formatUsd(inputs.cashCosts)} portfolio costs</p></div><div><span>{inputs.accountCount} MODELED ACCOUNTS</span><strong>{formatUsd(selectedScale.cashAfterCosts)}</strong><p>{formatUsd(selectedScale.traderPayoutCash)} trader payout cash<br />after the same portfolio costs</p></div><div><span>RETAINED ACROSS {inputs.accountCount} ACCOUNTS</span><strong>{formatUsd(value.retainedProfit)}</strong><p>Retained trading profit.<br />Not payout cash or personal equity.</p></div></div>
        <details><summary>View every account-count scenario</summary><div className="table-scroll"><table><caption>Fixed performance with {formatUsd(inputs.cashCosts)} total portfolio costs in every scenario</caption><thead><tr><th scope="col">Accounts</th><th scope="col">Trader payout cash</th><th scope="col">Cash after costs</th></tr></thead><tbody>{value.scaling.map(row => <tr key={row.accountCount}><th scope="row">{row.accountCount}</th><td>{formatUsd(row.traderPayoutCash)}</td><td>{formatUsd(row.cashAfterCosts)}</td></tr>)}</tbody></table></div></details>
      </> : <p className="unavailable">Scaling comparison available after correcting performance assumptions.</p>}
      <p className="firm-scaling-note">Copied exposure is correlated. The scenario does not check Lucid’s account-count limits or increase fees automatically with account count. Edit portfolio costs to reflect your setup.</p>
    </section>
    <aside className="firm-assumptions" aria-labelledby="firm-scope-title"><h3 id="firm-scope-title">What this scenario assumes</h3><ul><li>Fresh funded LucidFlex $50k accounts, starting at zero profit with no previous payouts. Evaluation and existing-account state are excluded.</li><li>Constant, loss-free daily net trading P&amp;L. Losses, rule breaches, drawdown paths and account survival are not modeled.</li><li>Requests occur as soon as modeled rules permit, with immediate approval and gross deduction before the next active day.</li><li>Lucid lists disbursement within two business days after approval. Processing delays and calendar payment dates are not modeled; this is not actual received cash.</li><li>Modeling stops after the fifth funded payout. Annual selection reports only this remaining funded phase; it does not repeat accounts or estimate live-stage income.</li><li>All accounts follow the same schedule. Fees are your explicit portfolio cash costs; permitted account-count limits are not checked.</li></ul></aside>
  </>;
}
