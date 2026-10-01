# Docker self-hosting independent review

Date: 2026-10-01 (America/Chicago).

Owner: Codex independent reviewer, separate from Docker and CI authors.

State: approve implementation/source and local container integration. Required GitHub Actions `verify` on the final remote head is a PR readiness gate, recorded by the orchestrator in the final handoff. This approval covers packaging the existing stateless prototype, not production financial correctness, authentication or persistence.

Branch / PR: `feat/docker-self-hosting`; PR identity and final-head CI evidence are recorded in the orchestrator handoff. Base `8c41ca0` (per-account costs, PR #7). Reviewed shared working tree; final remote commit/CI result will be recorded by the orchestrator.

## Scope and sources

Reviewed [ADR 0010](../adr/0010-docker-self-hosting.md), root Dockerfile and `.dockerignore`, Compose configuration, Next.js standalone/tracing configuration, [self-hosting guide](../self-hosting.md), README commands, `tools/docker/smoke.py` and the required `verify` CI job.

Official sources opened on 2026-10-01: [Next.js standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), [Docker build context](https://docs.docker.com/build/concepts/context/), and [Compose services](https://docs.docker.com/reference/compose-file/services/). These support tracing the monorepo, copying separate static/public assets, filtering build context, and explicit host binding/restart behavior. They do not establish that this application's container ran; execution evidence follows separately.

## Findings

| Severity | Finding | Applied correction |
| --- | --- | --- |
| Medium, resolved | Initial README nested root npm command could consume the requested dev port at the inner npm layer. | Docker author changed it to `npm run dev --workspace=@tradehq/web -- --port 3001`; the command forwards directly to Next.js. |
| Informational | A generic page-title/nav match would not prove the intended planner/import body. | CI author tightened smoke assertions to the actual route headings and reran the real image successfully. |
| Informational | CI wiring alone is not a container execution result. | Local real Docker evidence is recorded below; remote `verify` execution is a separate required PR gate. |

No unresolved implementation change request. Dependencies install with committed-lockfile `npm ci`, and a separate builder produces the production standalone server. Repository-wide tracing includes workspace imports. Static output and public files when present are copied into the monorepo standalone layout; only that output enters the runtime image. No development server runs in the image.

The runtime declares production mode, disabled telemetry, internal `0.0.0.0:3000`, UID/GID 1001 and a Node HTTP healthcheck. Compose defaults to host `127.0.0.1:3000`, allows explicit port/bind overrides, and restarts unless stopped. No named global container, database, volume or credential configuration is introduced. Context excludes host dependencies/build output, Git, environment/npm credential files, private export directories and common statement/key formats. This filtering is not a general secret detector.

The smoke script explicitly names a UUID project and absolute Compose file, selects a currently unused loopback port, and overrides host-binding variables. HTTP checks disable proxies and remote redirects. Cleanup executes in `finally` and uses that same project, removing its containers/network and project-generated image without global prune or unrelated project operations. A port can become occupied between selection and startup; that causes a visible failed check with scoped cleanup rather than reuse of a user service.

PowerShell/Linux start, stop, update, port and LAN commands were source-reviewed. Docker defaults do not expose the unauthenticated prototype to the LAN. Documentation accurately distinguishes a same-host proxy from a proxy in another container and states no saved journal/import records or provisioned public deployment. Full browser interaction inside the container and a public reverse-proxy/TLS deployment were not tested by this task.

## Checks and execution evidence

Reviewer executed:

- `docker compose config`: passed; resolved host IP `127.0.0.1`, host/container port `3000`, restart `unless-stopped`.
- `python tools/docker/smoke.py --help`: passed. `--wait-timeout 0`: rejected by argument validation before any project start.
- `python tools/verify.py`, `python tools/status/render.py --check`: passed.
- `python -m unittest discover -s tools/tests`: 10 tests passed.
- `git diff --check`: passed (Git reported ordinary CRLF-to-LF normalization warnings).

Docker author reports `npm run build` passed with standalone output. CI/test author executed the final `python tools/docker/smoke.py` on the real local Linux Docker engine: project `tradehq-smoke-9624236db0d2`, host port `49167`, real image build and Compose health wait passed, runtime UID `1001`, planner `/` and `/imports` returned HTTP 200 with their expected headings/TradeHQ title, and copied CSS returned `37,006` bytes. Scoped `down --volumes --remove-orphans --rmi local` removed its container/network/image; command exited 0. This is worker execution evidence independently assessed against the source, not a claim the reviewer personally reran the container.

GitHub Actions executes that same smoke as a required step of the existing `verify` job alongside application tests, typecheck/build and repository checks. The orchestrator must verify the actual final-head CI result and link its immutable run before reporting the PR ready. Local success does not claim remote CI success or close broader M1 data/user-validation milestones.
