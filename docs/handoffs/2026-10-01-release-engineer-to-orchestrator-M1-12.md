# 2026-10-01: release-engineer → orchestrator · M1-12

## Done

Implemented production Docker packaging under accepted [ADR 0010](../adr/0010-docker-self-hosting.md): official Node 24 Debian slim, committed-lockfile installation, Next.js standalone output with repository-root tracing, static/public asset assembly, UID/GID 1001 runtime, telemetry disabled and Node-fetch HTTP health check. Compose service `web` uses configurable host port and bind address, loopback defaults and `restart: unless-stopped`.

Added build/start/stop/update commands and explicit PowerShell/Linux configuration in [self-hosting](../self-hosting.md) and [README](../../README.md). Development stays on port 3001 through an explicit workspace command. No database, volumes, registry, TLS, sign-in or saved journal was added.

## Look at this first

- [Dockerfile](../../Dockerfile), [build-context exclusions](../../.dockerignore) and [Compose](../../compose.yaml).
- [Next.js config](../../apps/web/next.config.ts) sets standalone output and monorepo tracing root.
- [Self-hosting guide](../self-hosting.md) records official Next.js/Node/Compose source links checked on 2026-10-01.

## Deliberately unfinished

Container smoke verification and the required CI job are owned by test-engineer, in a separate isolated Compose project. Initial `docker version` found no daemon; the orchestrator subsequently started the existing runtime. This handoff records only checks observed by release-engineer; obtain the test-engineer's real container results and independent review before validation. No public deployment or remote CI success is claimed here.

## Reproduce green

Executed from the repository root:

```text
docker compose config
docker compose config --quiet
npm run build
python tools/verify.py
git diff --check
```

Compose resolved service `web`, `127.0.0.1:3000:3000`, build context and restart policy successfully. Production Next.js build passed and generated `/` and `/imports`. Verified that `apps/web/.next/standalone/apps/web/server.js` and `.next/static` exist; `apps/web/public` does not exist, so Docker handles its copy conditionally. Documentation/board verification and tracked whitespace checks passed. Container build/health/routes/non-root identity are separate test-engineer evidence.

## Decisions made without an ADR

None. Packaging follows ADR 0010. The Node major tag refreshes patches on rebuild with `--pull`; no npm dependencies changed.

## Questions for the receiver

None. Record actual container smoke and review outcomes, render any board change and stage final whitespace verification.
