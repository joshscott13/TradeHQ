# 0010: Docker self-hosting for the prototype

Status: accepted

Date: 2026-10-01

Deciders: Josh explicitly requested a production Dockerfile, Compose setup and self-hosting instructions.

## Context

The current Next.js app has calculators and a browser-only CSV preview, without persistence or authentication. Docker packaging must run the production app from the monorepo without including local files or a development server.

## Decision

Add a multi-stage Dockerfile rooted at the repository, using official Node.js 24 Debian slim images. Install with the committed npm lockfile, build the existing web workspace, and use Next.js standalone output with monorepo tracing rooted at the repository. Copy standalone server, static assets and public assets if present into a minimal runtime stage. Run as a dedicated unprivileged user, bind the internal server to 0.0.0.0 on port 3000, disable Next.js telemetry, and provide an HTTP healthcheck without installing curl. No new npm dependency. Never copy .env files, private exports, Git, host node_modules or generated output from the build context; add .dockerignore.

Compose exposes a configurable host port (TRADEHQ_PORT, default 3000) and bind address (TRADEHQ_BIND_ADDRESS, default 127.0.0.1), with health checking and restart unless stopped. Document deliberate LAN binding or use behind an existing reverse proxy. Do not provision a domain, TLS provider, public deployment, external image registry or database. Preserve current localhost development on port 3001.

Provide copy-paste build/start/stop/update commands and Windows/Linux environment examples in README/self-hosting docs. State that the container serves the current prototype and does not add saved journal history. No volumes or account credentials required for current app.

Add a container smoke check to the existing required verify CI job (same check name). It must build the real image, start an isolated Compose project with an unused localhost host port, wait for health, verify planner and /imports production HTTP responses and confirm non-root runtime identity, then clean up only that isolated project even on failure. Local verification should use the installed Docker engine if available; if unavailable, run the real container check on GitHub Actions and disclose the local limitation rather than claim local success.

## Consequences

Self-hosting becomes repeatable for the stateless prototype. Persistence and user accounts remain planned; no production financial or hosted-service contract is accepted by this packaging task. The Node image tag tracks the selected major version; upgrade/security patching requires rebuilding.

## Decisions on open questions

Josh authorized Docker self-hosting. Architect chooses standalone Next.js, Node 24 Debian slim, a non-root runtime and loopback default binding for a portable setup without unnecessary service dependencies.

## References

- [Next.js standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Docker Node image](https://hub.docker.com/_/node)
- [Docker Compose service reference](https://docs.docker.com/reference/compose-file/services/)
