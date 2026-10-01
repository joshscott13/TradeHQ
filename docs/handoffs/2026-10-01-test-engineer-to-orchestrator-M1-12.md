# M1-12 test-engineer → orchestrator

Date: 2026-10-01 (America/Chicago)

## Scope

Implemented the portable standard-library Python [Docker smoke runner](../../tools/docker/smoke.py) under [accepted ADR 0010](../adr/0010-docker-self-hosting.md). Added its real image/runtime verification to the existing `verify` GitHub Actions job without replacing any existing application/docs checks or changing the required check name. Bootstrap-dev owns the Dockerfile, Compose configuration and instructions.

The runner preflights the Docker CLI, Compose plugin and Linux engine, selects an unused loopback port and a unique Compose project name, and passes port/bind overrides only in its child environment. It builds the real image and waits for container health. It checks non-root UID, production planner `/` and `/imports` HTTP 200 responses with TradeHQ title and distinct page headings, then fetches a referenced Next.js JS/CSS asset to verify static asset copying. HTTP checks bypass proxies and reject redirects.

Cleanup runs in `finally` for every attempted startup and scopes `down --volumes --remove-orphans --rmi local` to the explicit unique project and repository Compose file. Failure diagnostics read only that project's `web` logs. No global prune, registry publication or user project operation exists.

## Observed checks

- `python tools/docker/smoke.py --help`: passed; documented options visible.
- `python tools/docker/smoke.py --wait-timeout 0`: rejected with argparse exit 2 and allowed-range guidance.
- Initial Docker engine preflight failed because the installed runtime was stopped. Orchestrator subsequently started the existing runtime; later preflight confirmed a Linux engine. A subsequent attempt before Compose existed failed actionably without starting containers.
- `python tools/docker/smoke.py`: final version passed, exit 0, using project `tradehq-smoke-9624236db0d2` and host `127.0.0.1:49167`. Real image built and Compose reported healthy. Runtime UID was `1001`. Both distinct production pages passed. Referenced CSS `/_next/static/chunks/03wjmnjzu5s_o.css` returned 37,006 bytes with CSS content type. Cleanup output confirmed removal of its container, network and local image.

The earlier real run also passed; the final run repeated verification after strengthening page checks to distinct headings and adding local smoke-image cleanup. No simulated engine result is presented as container evidence.

## Remaining evidence

Independent review and root full application/docs checks are recorded separately. GitHub Actions must execute the newly added step on the pushed branch; local success does not assert a CI result that has not run. This packaging check validates the stateless prototype runtime, not actual trade records, payout eligibility, persistence or a public deployment.
