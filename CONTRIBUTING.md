# Contributing

Read [AGENTS.md](AGENTS.md) first. TradeHQ contains a runnable calculator and local CSV preview with Docker packaging. For documentation-only changes, run `python tools/verify.py`, `python tools/status/render.py --check`, and `git diff --check`; stage new files and run `git diff --cached --check` before committing. The verifier skips remote URL availability; research claims must be checked against their named sources separately. A wording-only edit does not refresh a source's verification date.

For application changes, use Node.js 24, run `npm ci`, then `npm test`, `npm run typecheck` and `npm run build`. Docker packaging changes also require `python tools/docker/smoke.py` against a running Linux Docker engine. The required CI `verify` job runs application, repository and real isolated-container checks; local success does not imply remote CI success.

Update the board before rendering STATUS.md. Keep code and affected documentation in the same PR, and cite validation that actually ran. Use Conventional Commits with the scopes in AGENTS.md and `git commit -s` with a real configured identity. Do not configure an invented identity to get past a commit failure.

Public schema, dependency and vocabulary changes need accepted ADRs. A reviewer must independently approve the final diff. A proposed ADR does not authorize implementation. Use the PR template and write a repository handoff before stopping. Without a remote, preserve local changes and state the limitation; do not manufacture a PR link.
