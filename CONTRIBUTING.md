# Contributing

Read AGENTS.md first. This is a pre-code repository: documentation checks are the current gate. Run `python tools/verify.py`, `python tools/status/render.py --check`, and `git diff --check`. The verifier skips remote URL availability; research claims must be checked against their named sources separately.

Update the board before rendering STATUS.md. Keep code and affected documentation in the same future PR, and cite validation that actually ran. Use Conventional Commits with the scopes in AGENTS.md and `git commit -s` with a real configured identity. Do not configure an invented identity to get past a commit failure.

Public schema, dependency and vocabulary changes need accepted ADRs. A reviewer must independently approve the final diff. A proposed ADR does not authorize implementation. Use the PR template and write a repository handoff before stopping. Without a remote, preserve local changes and state the limitation; do not manufacture a PR link.
