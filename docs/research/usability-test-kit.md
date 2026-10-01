# Income planner usability test kit

Prepared: 2026-09-30. M1-08 prepares M1-05; no participant sessions or findings are recorded here. This protocol tests the implemented generic and LucidFlex funded $50k planners under [ADR 0005](../adr/0005-calculator-prototype.md) and [ADR 0006](../adr/0006-lucidflex-planner.md). Journal, imports and cash records remain planned.

## Purpose and participants

Find out whether active multi-prop-firm traders can set a goal, adjust days/accounts and explain trading P&L, modeled payout cash and retained profit without moderator instruction. Also investigate the [market hypotheses](market-research.md#market-hypotheses-and-validation-plan), including counterexamples where a separate journal or manual/CSV workflow is unnecessary.

Plan three task-based planner sessions and five to eight discovery interviews; a participant may do both. Prioritize Josh's selected scope: Lucid and Tradeify $50k programs across variants except direct funded; Apex is deferred. Seek variation in account count, copied versus independent trading, program/cohort and existing tracking tools. Record actual experience rather than screening on age alone. The tasks below exercise only implemented generic and LucidFlex funded $50k controls, not other variants. These small samples support design decisions, not population percentages or proof of demand. External recruitment or invitations require separate authorization; this kit sends none.

## Prepare each session

1. Use the merged runnable build. Record commit, URL, browser, viewport/device and date in a fresh [session template](usability-session-template.md). Start the app using `npm run dev --workspace=@tradehq/web -- --hostname 127.0.0.1` if needed and use the port it reports.
2. Check the tasks and moderator-only expected results below against that build before the participant joins. Record any mismatch as a build/protocol problem; do not score the participant against stale behavior. Reset assumptions before each task, choose the stated planner and explicitly set every listed input. Period changes reset active-day defaults; set days after selecting the period.
3. Ask permission to take anonymous notes. Recording or viewing real records is optional and needs separate, explicit consent with purpose, access and deletion date. Keep consent records and raw participant material in agreed private storage, outside this public repository. Use synthetic task inputs; never request credentials, account numbers or an unredacted statement.
4. Allow about 45–55 minutes: introduction 3, recent-workflow interview 10, tasks 25–30 and debrief 7–10. Let participants use their normal input method; note keyboard, zoom or assistive technology needs. Do not require think-aloud if it disrupts their use.

Opening script: “We are testing the app. You can stop or skip anything. Please use these made-up scenarios and tell me what you are looking for. I may wait before helping so we can see where the interface is unclear. We will not ask you to trade or connect an account.”

## Recent-workflow interview, before showing the planner

Ask neutrally and follow the participant's examples:

- “Tell me about the last time you worked out your trading results and the cash you actually received. What triggered it? Walk me through what you did.”
- “Which firms, exact programs and platforms were involved? How many accounts? Were any trades copied? What happened when an account closed or reset?”
- “Where did you find fees, trading costs and payouts? What did you compare to check the total? Which part took time or caused a mistake?”
- “How did you decide a daily target, if you used one? What happened when a day was skipped or lost money?”
- “What tool did you use most recently? What worked well enough that you would keep it? Have you tried and stopped using a journal? What happened?”

Ask for a recent concrete example before hypothetical preferences. Note a volunteered need separately from agreement after a prompt. Inspect records only with consent; a reported workflow is not an observed workflow. Do not suggest that reconciliation must be painful.

## Tasks on the implemented planner

Read only the participant prompt column, one row at a time. The expected results are moderator reference values from the accepted contracts and existing domain fixtures; they are not participant observations, forecasts or a new policy verification. Give setup values on a card if needed, without output numbers.

| ID | Participant prompt | Moderator reference and success criterion |
| --- | --- | --- |
| U1 — Goal and active days | “Use Generic planning. You want $5,000 net trading P&L this month from five accounts, trading on 20 days. Find the daily target per account. You now expect only 10 trading days. What changes? What would the target be for one account?” | Initially $50/account/day and $250 portfolio/day; 10 days gives $100/account/day and $500 portfolio/day; one account at 10 days gives $500/account/day. Success: correct inputs and explanation that fewer days/accounts increase the per-account target for the same goal. |
| U2 — Simplified cash | “Use Generic planning to model $1,800 cash this week, two accounts and five trading days, with an 80% trader payout share and $200 total portfolio cash costs. Explain what result you would need and what this model assumes about payouts.” | Required trading P&L $2,500; daily portfolio $500, per account $250. Success: selects Simplified cash goal, reads the result and identifies that this unconstrained model assumes all profit paid in the period; it does not establish firm eligibility or receipt. |
| U3 — Annual side income | “In Generic planning, compare an annual trading scenario with three accounts, $50 average daily net P&L per account and 240 active days. Find the annual total and the one-account comparison. What does this number tell you?” | $36,000 aggregate, $12,000 one account. Success: locates annual controls/table and explains trading P&L rather than received cash, with average performance and explicit days as assumptions. |
| U4 — Firm cash and retained profit | “Use LucidFlex funded $50k. Model one account, $200 daily net trading P&L, five active days this week, a $400 cash goal and $50 portfolio costs. Explain the result and the first payout row. Compare three accounts with the same performance and the same total costs.” | One account: gross request $500, trader cash $450, cash after costs $400, retained profit $500, first request day 5; nominal $50k excluded. Three accounts: trader cash $1,350, after costs $1,300, retained $1,500. Success: distinguishes all figures, notes fixed portfolio costs, and does not claim actual received cash or guaranteed approved account count. |
| U5 — Required daily target | “Use LucidFlex for a $500 cash goal this week, seven active days, one account and zero portfolio costs. Find the required daily target, apply it, then explain when and how much the model requests.” | Smallest daily target $158.74. Use this daily target updates the forward input; first request day 7, gross $555.59, displayed trader cash $500.03, retained $555.59. Success: finds/applies target and explains active-day schedule and why cash may slightly exceed the goal; current daily assumption and required target are different until applied. |
| U6 — Cap and funded lifecycle | “Use LucidFlex with one account, $800 daily net trading P&L, 240 active days this year, zero costs and a $10,000 cash goal. What can this planner tell you about the goal and the rest of the year?” | Goal infeasible; maximum trader request cash $9,000. Five $2,000 gross requests on days 5/10/15/20/25, $1,800 trader cash each. Trading stops at active day 25; retained profit $10,000. Success: finds capacity/transition explanation and rejects repeated annualization, automatic new accounts or modeled live-stage income. |
| U7 — Recover an input | “In your current scenario, change active trading days to zero. Explain what you see, then restore a valid scenario.” | Both modes reject zero active days; affected results unavailable rather than stale. Success: finds field error, corrects days to a valid positive integer and obtains updated results without losing the model context. |

For U4–U6, ask “What would you need to check before using this for your own account?” after the initial explanation. Look for fresh funded/zero previous payouts, constant loss-free days, approval and processing delays, account-count limits, costs and absent live/loss-path modeling. Do not supply the list first. If below-threshold qualification is unclear, optionally change LucidFlex daily profit to $149 for 20 days and ask what changed; expected no qualifying days/requests. Record this as a prompted probe, not spontaneous understanding.

## Observation and scoring

Start timing after reading the prompt; stop at completion, abandonment or eight minutes. At two minutes of stalled progress, ask “What are you looking for?” At four minutes offer help if wanted, then record exactly what help was given. Stop sooner at discomfort. Do not silently lead participants to the right controls.

Score each task: **independent success** (inputs, result and required explanation correct), **assisted success** (correct after help), **partial** (some criteria met), **unsuccessful**, or **skipped**. Record elapsed time, assistance, misinterpretation and a quote or action supporting the score. Timings are descriptive; eight minutes is a session limit, not a performance benchmark. Separately record task completion and financial comprehension so a lucky click cannot count as understanding.

Issue severity: critical = persistent misunderstanding that treats modeled/retained profit as spendable received cash; major = wrong model/result interpretation or inability to complete/recover a core task; minor = hesitation or discoverability friction with correct completion; suggestion = preference without demonstrated failure. These are research triage labels, not production incident ratings. Record reproducibility and counterexamples; one participant's issue is actionable evidence, not proof all users experience it.

Proposed continuation criterion for this first pass: all three participants independently explain trading P&L versus request cash versus retained profit and the five-payout boundary, and complete core goal/scaling/recovery tasks with no unresolved critical/major misunderstanding. If missed, revise the flow/copy and retest; do not convert assisted success to independent success. The owner may revise these criteria before sessions, with rationale. This planner pass does not validate future journal/import journeys or close all of M1-05.

## Debrief and future-work questions

First ask “What was hardest to interpret?” and “Which parts would or would not help the workflow you described earlier?” Then ask what they would check to trust a number and which information was missing. Capture appearance/trust explanations separately from enthusiasm or willingness to pay.

Discuss planned journal/import work afterward, explicitly saying it is not implemented: “For your last review, would entering trades manually or uploading a file have fit? Show or describe the steps that would make it impractical.” “How would you review one decision copied across accounts with different results?” “What records would you need to reconcile trading P&L with received payouts and fees?” Ask about actual export access, review frequency and abandonment reasons. Record this as interview evidence, not completed import/journal tasks or commitments to buy.

## Synthesize without overstating evidence

Aggregate anonymous task outcomes with denominators, observed errors, assistance and counterexamples. Separate observations, participant reports, prompted opinions, engine reference values and researcher inference. Link each proposed change to its evidence. Keep real exports/statement reconciliation (M1-04), market demand, pricing, full accessibility conformance and unimplemented journal/import task validation explicitly unresolved. Do not publish raw notes or identifying quotes without the agreed consent. [Session template](usability-session-template.md) provides the record structure.
