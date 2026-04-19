# SEO-Spider-Bridge Project Docs

## Purpose

This `.github` folder contains the execution-facing documentation for building and operating the SEO-Spider-Bridge MVP.  
The goal is to give engineers one place to answer:

- What are we building?
- How does the system work?
- What do we build first?
- How do we know it is successful?
- How should contributors keep docs and code aligned?

## Document Map

- [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md): Product framing, 2026 problem context, ICP, value proposition, SaaS tier model, non-goals.
- [`docs/SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md): End-to-end flow, bot detection, renderer pipeline, cache model, SaaS plan enforcement, edge deployment model, and public interfaces.
- [`docs/MVP_ROADMAP_KPIS.md`](docs/MVP_ROADMAP_KPIS.md): Phase-by-phase delivery plan, acceptance criteria, technical KPI targets, and SaaS commercial KPI measurement methods.
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
- API and middleware contract owner: Backend Lead.
- KPI definition and measurement owner: Product + Data/Analytics owner.
- Contribution and process policy owner: Repo Maintainers.

When ownership is unclear, default to the maintainer who merges the related PR.

## How To Use This Folder

1. Start with `docs/PROJECT_OVERVIEW.md` to understand the problem and scope boundaries.
2. Move to `docs/SYSTEM_ARCHITECTURE.md` before writing implementation code.
3. Use `docs/MVP_ROADMAP_KPIS.md` to plan sprint deliverables and define release gates.
4. Follow `CONTRIBUTING.md` for branch and PR expectations.
5. Use issue/PR templates so triage and reviews stay consistent from day one.

## Traceability Map (Topic.md -> Docs)

- Executive Summary -> `docs/PROJECT_OVERVIEW.md`
- Problematique (2026 Context) -> `docs/PROJECT_OVERVIEW.md`
- Technical Requirements (Stack + Features) -> `docs/SYSTEM_ARCHITECTURE.md`
- System Logic & User Flow -> `docs/SYSTEM_ARCHITECTURE.md`
- Development Roadmap (MVP) -> `docs/MVP_ROADMAP_KPIS.md`
- Target Audience (ICP) -> `docs/PROJECT_OVERVIEW.md`
- Success Metrics -> `docs/MVP_ROADMAP_KPIS.md`
