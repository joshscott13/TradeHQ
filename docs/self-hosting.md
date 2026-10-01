# Self-host TradeHQ

Run the current calculator and browser-only import preview as a production Next.js container. This does not add authentication, saved journal history or persistent records. CSV contents stay in the browser tab; stopping the container does not save them. No database, volumes, account credentials or environment file are required.

Install a Docker engine that runs Linux containers and Docker Compose v2 or newer. Start the engine before running these commands from the repository root. On Windows, enable the Linux backend in your existing Docker runtime. Host Node/npm is unnecessary for this container path.

## Build and start

The same commands work in PowerShell and Linux/macOS shells:

```text
docker compose config
docker compose build --pull web
docker compose up -d --wait web
docker compose ps
```

Open [TradeHQ](http://127.0.0.1:3000) or [Imports](http://127.0.0.1:3000/imports). Compose binds only to `127.0.0.1` by default. Port `3000` is inside the container; `TRADEHQ_PORT` changes the host port. Container health checks fetch the planner HTTP page and fail on network errors or non-success responses; they do not establish financial correctness.

View application logs or stop/remove this Compose project's container and network:

```text
docker compose logs --tail=100 web
docker compose down
```

## Choose a host port

For a loopback-only host port of `8080`, set the variable before the same build/start commands.

PowerShell:

```powershell
$env:TRADEHQ_PORT = '8080'
$env:TRADEHQ_BIND_ADDRESS = '127.0.0.1'
docker compose up -d --wait web
```

Linux/macOS:

```sh
export TRADEHQ_PORT=8080
export TRADEHQ_BIND_ADDRESS=127.0.0.1
docker compose up -d --wait web
```

Open `http://127.0.0.1:8080`. Keep these variables consistent for subsequent update/status commands. `docker compose config` shows the resolved mapping.

## Deliberate LAN access

The current prototype has no sign-in. To serve it on a trusted LAN, set `TRADEHQ_BIND_ADDRESS` to the Docker host's LAN IPv4 address, using your actual address in place of the example below. `0.0.0.0` binds every host interface; use it only when that wider exposure is intended. Configure host firewall access for the selected port yourself.

PowerShell:

```powershell
$env:TRADEHQ_BIND_ADDRESS = '192.168.1.50'
$env:TRADEHQ_PORT = '8080'
docker compose up -d --wait web
```

Linux/macOS:

```sh
export TRADEHQ_BIND_ADDRESS=192.168.1.50
export TRADEHQ_PORT=8080
docker compose up -d --wait web
```

Other LAN devices can then use `http://192.168.1.50:8080`, if that is your actual host address. For an existing reverse proxy on the same host, retain loopback binding and point its upstream at `http://127.0.0.1:3000` (or your selected host port). A proxy inside another container cannot use its own loopback to reach this mapping; configure its existing network/upstream explicitly. This setup does not provision a reverse proxy, domain, TLS or a public deployment.

To restore defaults in the current PowerShell session:

```powershell
Remove-Item Env:TRADEHQ_PORT -ErrorAction SilentlyContinue
Remove-Item Env:TRADEHQ_BIND_ADDRESS -ErrorAction SilentlyContinue
docker compose up -d --wait web
```

Linux/macOS:

```sh
unset TRADEHQ_PORT TRADEHQ_BIND_ADDRESS
docker compose up -d --wait web
```

## Update

Update your checkout using your normal Git workflow, then rebuild the local image and recreate the service. `--pull` obtains current patches for the selected Node 24 image tag; the committed npm lockfile controls application dependencies.

```text
docker compose build --pull web
docker compose up -d --wait --force-recreate web
docker compose ps
```

There is no saved server-side data to migrate in this prototype. A future persistence feature requires a new deployment contract. `restart: unless-stopped` lets Docker restart this service after failures or engine restarts; it does not start the Docker engine itself.

## Packaging and verification

The root Dockerfile installs with `npm ci`, builds the web workspace and copies Next.js standalone server output plus static assets and public assets if present. Monorepo tracing includes repository workspace dependencies. Runtime uses official `node:24-bookworm-slim`, UID/GID `1001`, port `3000` and telemetry disabled. `.dockerignore` excludes host dependencies/build output, environment files, private-data/export folders and common statement/credential file types. Keep private records outside the repository; exclusions are not a general secret detector.

The container smoke procedure builds the real image in an isolated Compose project, checks health and production planner/import responses, verifies non-root identity, and cleans up that project. The required CI verify job runs it. A configured CI check is not evidence it passed; consult the dated review for execution results. If `docker version` reports no server, start your Docker runtime before running container checks.

## Sources

Implementation follows accepted [ADR 0010](adr/0010-docker-self-hosting.md). Official documentation checked on 2026-10-01:

- [Next.js standalone output and monorepo tracing](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).
- [Official Node images](https://hub.docker.com/_/node).
- [Compose services, port binding and restart policy](https://docs.docker.com/reference/compose-file/services/).
