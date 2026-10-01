# 0001: Modern web platform and product boundary

Status: accepted (core stack only)

Date: 2026-09-30

Deciders: Josh delegated stack selection; Codex architect selected the core stack

## Context

Josh requested a polished modern fintech app and asked Codex to choose a modern stack. Initial firms are Lucid, Apex and Tradeify. Bootstrap remains documentation only; no application dependencies are installed.

## Decision drivers

Responsive dynamic calculators, a polished journal, typed domain boundaries, exact monetary calculations, durable relational records and private user data.

## Considered options

1. TypeScript, React and Next.js App Router web app.
2. Local-first desktop application.
3. Spreadsheet-only validation tool.

## Decision

Select TypeScript, React, Next.js App Router and Tailwind CSS for the planned web app. PostgreSQL is the selected hosted persistence direction. Keep financial and scenario logic in a framework-independent domain package and parsing in import adapters. Use client components for interactive scenario controls and server boundaries for authorized persistence. Pin compatible stable versions at implementation time after checking official documentation; no version or service is claimed newest.

Authentication vendor, ORM, chart library, decimal library, hosting and billing require follow-up decisions before introduction. Their absence does not prevent docs bootstrap. The paid/open-source boundary remains open. A dynamic income/scaling calculator is first-class product scope alongside journaling.

## Consequences

The app can support polished browser interactions and clear server/client boundaries. Hosted multi-user features require explicit object authorization, tested isolation and restoration. This decision does not approve the financial contract or firm-rule implementation. No actual app exists yet.

## Open questions

- Personal-first or paid multi-user product; license and pricing?
- Authentication, database access layer and deployment vendors?
- Exact first account products and export formats for the selected firms?

## Decisions on the open questions

Josh: use whichever stack is most modern; firms Lucid, Apex, Tradeify; prioritize weekly/monthly/yearly target, annual side-income and account-scaling scenarios. Codex selects the core stack above within that delegation. Other vendor/business choices remain deferred.

## Amendments

2026-09-30: Replaced initial proposed TypeScript recommendation with delegated core stack selection after Josh's answer.

## References

- [Next.js App Router](https://nextjs.org/docs/app), checked 2026-09-30; official documentation describes React Server Components, Suspense and server functions.
- [Architecture](../../ARCHITECTURE.md)
