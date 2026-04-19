# SEO-Spider-Bridge Project Docs

## Purpose

This `.github` folder contains the execution-facing documentation for building and operating SEO-Spider-Bridge using the new strategy:

> self-hosted licensed engine + lightweight cloud control plane

The goal is to give engineers one place to answer:

- What are we building?
- How does the system work?
- What do we build first?
- How do we know it is successful?
- How should contributors keep docs and code aligned?

## Document Map

- [`docs/SELF_HOSTED_SAAS_ROADMAP.md`](docs/SELF_HOSTED_SAAS_ROADMAP.md): Canonical implementation strategy (stack, phases A-J, exact build order).
- [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md): Product framing, 2026 problem context, ICP, value proposition, SaaS tier model, non-goals.
- [`docs/SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md): Control plane + engine architecture, activation/entitlement protocol, runtime request flow, and API contracts.
- [`docs/MVP_ROADMAP_KPIS.md`](docs/MVP_ROADMAP_KPIS.md): Execution phases, acceptance gates, and technical/commercial KPI model aligned to self-hosted delivery.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): Branching, PR quality bar, and documentation update policy.
- [`PULL_REQUEST_TEMPLATE.md`](PULL_REQUEST_TEMPLATE.md): PR structure and quality checklist.
- [`ISSUE_TEMPLATE/`](ISSUE_TEMPLATE): Bug and feature issue forms.
- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md): Collaboration behavior standards.
- [`SECURITY.md`](SECURITY.md): Vulnerability reporting policy.
- [`SUPPORT.md`](SUPPORT.md): Support and onboarding guidance.
- [`CODEOWNERS`](CODEOWNERS): Review ownership rules.
- [`dependabot.yml`](dependabot.yml): Automated dependency update policy.
- [`workflows/ci.yml`](workflows/ci.yml): Baseline CI for markdown and Node projects.

## Update Ownership

- Product + architecture source intent owner: Tech Lead / Project Owner.
- Control-plane API and engine contract owner: Backend Lead.
- KPI definition and measurement owner: Product + Data/Analytics owner.
- Contribution and process policy owner: Repo Maintainers.

When ownership is unclear, default to the maintainer who merges the related PR.

## How To Use This Folder

1. Start with `docs/SELF_HOSTED_SAAS_ROADMAP.md` for the canonical strategy and build sequence.
2. Read `docs/PROJECT_OVERVIEW.md` for scope boundaries and product positioning.
3. Read `docs/SYSTEM_ARCHITECTURE.md` before implementing API, engine, or activation logic.
4. Use `docs/MVP_ROADMAP_KPIS.md` for sprint planning and phase gates.
5. Follow `CONTRIBUTING.md` and templates to keep changes reviewable and docs-synced.

## Traceability Map

- `Topic.md` original concept and problem framing -> `docs/PROJECT_OVERVIEW.md`
- New self-hosted strategy and exact implementation order -> `docs/SELF_HOSTED_SAAS_ROADMAP.md`
- Runtime and control-plane technical contracts -> `docs/SYSTEM_ARCHITECTURE.md`
- Execution gates and KPI model -> `docs/MVP_ROADMAP_KPIS.md`
