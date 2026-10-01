# 2026-10-01: orchestrator → Josh · M1-12

## Done

Added production Docker self-hosting under accepted ADR 0010: multi-stage Node 24 slim build, Next.js monorepo standalone runtime, non-root UID 1001, HTTP healthcheck, Compose with configurable loopback port/bind and restart policy, build-context exclusions and self-hosting docs. Required verify CI now runs the real container smoke check. M1-12 is in review. Confirmed PR #7 merged at 8c41ca0 and reconciled prior board/changelog state.

## Look at this first

From the TradeHQ repository, `docker compose up --build -d --wait` serves the prototype at http://127.0.0.1:3000. See [self-hosting instructions](../self-hosting.md) for ports, LAN/proxy binding, updates and shutdown. This packages current calculators/browser CSV preview without adding persistence or authentication.

## Deliberately unfinished

Database, saved journal, user accounts, domain/TLS provisioning, public deployment and image registry publishing. No actual native statement reconciliation or participant validation. The smoke project is isolated and removed; the existing development preview is restored separately on port 3001.

## Reproduce green

Root ran `npm ci`, `npm test` (50), `npm run typecheck`, `npm run build`, documentation/status verification and ten tooling tests. Test-engineer ran `python tools/docker/smoke.py`: real image/Compose health, UID 1001, planner and imports HTTP/title/heading, referenced CSS asset and own-project cleanup all passed. Final local smoke used isolated project tradehq-smoke-9624236db0d2 on port 49167. Independent review approved source and observed container evidence; final-head verify CI is required before merging the PR. Staged whitespace checks precede commit.

## Decisions made without an ADR

None. Josh explicitly requested the Docker setup; ADR 0010 records runtime, networking and verification choices. The installed Rancher Desktop runtime was started in the background to enable Docker without changing its engine or Kubernetes settings.

## Questions for the receiver

None blocking review.
