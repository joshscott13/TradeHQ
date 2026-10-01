# TradeHQ plan

Updated: 2026-10-01 against `main` at `0d4ce75` (PR #10). Stage: M1 prototype and discovery. Generic USD planning, LucidFlex funded $50k planning, hypothetical Tradeify Select Flex funded $50k planning, local synthetic CSV preview, per-account planning costs and stateless Docker packaging are merged. [ADR index](adr/README.md) identifies their contracts and merge evidence. Implementation/lab reviews do not complete target-user validation or real statement reconciliation. The remaining application milestones are planned. The [PRD](PRD.md) describes proposed broader scope, and [research](research/market-research.md) separates evidence from hypotheses.

Current M1-15 change: hypothetical Tradeify Select Daily funded $50k planning is implemented under [ADR 0011](adr/0011-tradeify-select-daily-planner.md), with independent review recorded; merge pending. [M1-14 readiness](research/tradeify-50k-planner-readiness.md) distinguishes sourced policy from the exact-buffer model convention. This does not close real export or target-user gates.

## Product direction

Build a premium journal for a multi-prop-firm day trader that explains trading performance and actual cash outcome. Earn trust through reconciled records and visible calculation scope. Do not start by matching competitor feature breadth.

Josh narrowed initial discovery to Lucid and Tradeify $50k programs, all variants except direct funded; Apex is deferred. Josh selected Tradovate and Rithmic as example platforms without statements. Actual native export fields and the maintainer's purchase cohorts remain unconfirmed. The merged baseline supports generic planning, fresh funded LucidFlex $50k and a hypothetical Tradeify Select Flex $50k cohort strictly after September 1, 2026. Current M1-15 adds the separately scoped Select Daily cohort with independent review recorded and merge pending; neither the broader variant set nor actual account eligibility is established.

M1-09 merged a local synthetic CSV preview under accepted [ADR 0007](adr/0007-example-import-preview.md). Both platform examples use an explicitly TradeHQ-owned schema; platform metadata does not imply a native adapter. This prototype has no saved ledger or actual statement reconciliation. Production import contracts remain proposed under ADR 0002, and M1-04 still requires real upstream evidence. [Docker self-hosting](self-hosting.md) serves this stateless prototype without adding persistence or sign-in.

## Milestones

| Milestone | Scope | Exit criteria | Validated against |
| --- | --- | --- | --- |
| M0 — Bootstrap | Git repository, ownership profiles, ADR templates, board/status workflow, docs checks, initial research and proposed product direction | All required files exist, links/anchors and whitespace checks pass, status is reproducible, independent docs review resolved, unresolved decisions explicitly recorded | Actual repository files and real primary-source product/platform documentation; no claim of market or import validation |
| M1 — Define and validate | Confirm selected Lucid/Tradeify $50k variants, cohorts and actual platforms/asset class, obtain consented redacted samples, interview users, accept model/privacy/calculator ADRs, design core flows and polished dynamic calculator prototype | Accepted ADRs; real export fields and independent statement totals understood; discovery evidence recorded with counterexamples; interactive prototype core tasks and week/month/year scaling scenarios reviewed | Maintainer's actual platform export + corresponding statement/dashboard; 5–8 planned interviews and 3 planned task-based prototype sessions; manually reconciled calculator examples |
| M2 — Reconcile records | Implement precise calculations, account lifecycle, manual/CSV capture, cash ledger, source traceability, export | Real datasets reconcile, duplicate reimport/corrections/partial fills/fees/DST pass, copied decisions preserve account exposure; backup/export round-trip checked | Real upstream exports and independently calculated totals from M1; executable unit and integration matrix; synthetic fixtures supplement real cases |
| M3 — Polished private MVP | Overview, accounts, trade review, calendar, dynamic calculator, costs/payouts and import exception flow | Core journeys complete with no critical correctness/privacy/accessibility findings; design guardian and independent reviewers approve; dated report captures limitations | 3 planned target-user sessions on a runnable build and real redacted datasets; real chosen persistence and restore path |
| M4 — Release and operate | Private release, release checks, restoration, telemetry policy, support and change procedure | Versioned release from verified main, restore drill succeeds, retention/deletion documented, all known material limitations communicated | Actual deployment/storage environment and actual restore drill; hosted multi-user scope additionally requires real authentication and tenant-isolation testing |

Counts above are proposed validation targets, not evidence already collected. A mock does not close an integration milestone. M0 completion does not approve the stack or financial model. If real exports/users are unavailable, keep the affected milestone open and label any exploratory work as a spike.

M1-08 merged [the planner usability kit](research/usability-test-kit.md) and [session record template](research/usability-session-template.md) in preparation for M1-05. These provide runnable tasks for the generic/LucidFlex planners and separate interview questions for the planned journal/import workflow. Preparation does not count as completed participant sessions or close M1-05; the kit does not cover the subsequently added Tradeify planner or synthetic CSV preview.

## Dependency sequence

M0 repository bootstrap → M1 maintainer decisions and real evidence → M2 reconciled domain and import behavior → M3 product flows and visual polish → M4 private release. Design exploration can run alongside M1; production interfaces wait for accepted ADRs. The scoped LucidFlex scenario uses ADR 0006; a broader rule engine, automatic connectors, commercial pricing and AI assistance require separate milestones after evidence justifies them.

## Current implementation boundaries

The maintainer authorized selecting a modern stack. ADR 0001 records the implemented TypeScript/React/Next.js App Router/Tailwind stack and planned PostgreSQL direction. ADRs 0005–0010 accept only their scoped calculator/import/cost/packaging changes; broader financial and scenario contracts remain proposed under ADRs 0002/0003. Persistent manual/CSV capture, journal and cash ledger remain planned. The proposed MVP prioritizes closed trades, cash bookkeeping and dynamic income scenarios; live rule enforcement is deferred. The supplied colors are inspiration for an accessible token system, not a mandate to use every color as text.

## Completion principles

A successful build is not proof that the financial total is correct. Reconciliation must name the upstream platform, sample date/export version and independent total used. Screenshots of sample dashboards are not user validation. Record both a feature's implemented status and the limits of the data it can support. Follow the board and review gates in the repository instructions.
