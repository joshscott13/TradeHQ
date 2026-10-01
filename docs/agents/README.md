# TradeHQ role roster

Profiles are reference documents for Codex collaboration assignments. Use available agent types; do not assume these names are registered tools.

| Role | Owned paths | Receives review from |
| --- | --- | --- |
| [orchestrator](orchestrator.md) | ROADMAP.md, CHANGELOG.md, docs/milestones/, docs/agents/ | docs-writer |
| [frontend-dev](frontend-dev.md) | apps/web/, docs/design/ | design-guardian and typescript-reviewer |
| [domain-dev](domain-dev.md) | packages/domain/ | domain-reviewer and typescript-reviewer |
| [import-dev](import-dev.md) | packages/imports/ | security-reviewer and test-engineer |
| [typescript-reviewer](typescript-reviewer.md) | TypeScript diffs | orchestrator |
| [domain-reviewer](domain-reviewer.md) | docs/PRD.md, docs/glossary.md, domain diffs | orchestrator |
| [security-reviewer](security-reviewer.md) | auth, imports, persistence and private attachments | orchestrator |
| [test-engineer](test-engineer.md) | tools/, docs/testing/, .github/workflows/ | tooling-reviewer |
| [tooling-reviewer](tooling-reviewer.md) | tools/ and CI diffs | orchestrator |
| [docs-writer](docs-writer.md) | docs/ product specifications and handoffs | domain-reviewer |
| [release-engineer](release-engineer.md) | Docker packaging, self-hosting docs and future release artifacts | test-engineer |
| [design-guardian](design-guardian.md) | docs/design/, apps/web/ | orchestrator |
| [scout](scout.md) | docs/research/ | domain-reviewer |
