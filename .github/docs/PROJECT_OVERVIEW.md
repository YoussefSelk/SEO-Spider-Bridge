# Project Overview

## Product Statement

SEO-Spider-Bridge is a JavaScript SEO engine for SPA websites (React, Angular, Vue) delivered with a dual model:

- A **self-hosted engine** customers run on their own infrastructure.
- A **cloud control plane** you operate for auth, licensing, activations, and admin management.

This keeps runtime cost on customer infrastructure while preserving monetization through Freemium/Premium licensing.

## Problem Context (2026)

### JS Rendering Gap

Search indexing for JS-heavy pages can still lag due to delayed rendering/indexing behavior.

### AI Crawler Constraints

AI crawlers frequently avoid full JavaScript execution, causing weak visibility for client-rendered content.

### Legacy App Constraints

Many teams cannot migrate quickly to SSR-first architecture and need an operational bridge now.

## Strategy Direction

### Deployment Model

- Customer deploys engine with Docker on their host.
- Engine handles rendering/runtime locally.
- Engine activates and revalidates entitlement against your control-plane API.

### Business Model

- `Freemium`: low-friction onboarding with limited quota/features.
- `Premium`: higher limits, advanced controls, priority support.

## Tier Model (v1 Defaults)

| Capability | Freemium | Premium |
| --- | --- | --- |
| Monthly render events | Up to 10,000 | Up to 500,000 (expandable) |
| Connected projects/domains | 1 | Up to 10 |
| Output modes | HTML | HTML + Markdown |
| Activation refresh policy | Standard | Standard + configurable grace |
| Invalidation controls | TTL only | TTL + webhook purge |
| Support | Best effort | Priority |

## Infrastructure Principles

- No mandatory Redis dependency.
- Engine cache backend can use MongoDB or Supabase/Postgres adapter.
- Control plane source-of-truth remains PostgreSQL + Prisma.
- For strict "free forever" control, self-host open-source components.

## Ideal Customer Profile

- E-commerce teams with SPA storefronts.
- B2B SaaS teams shipping marketing/docs on client-rendered stacks.
- Legacy enterprise frontend teams blocked from full platform migration.

## MVP Scope

MVP outcome:

> User signs up, receives license, deploys engine, activates successfully, and appears as active in dashboard with revocation/monitoring controls for admins.

Included in MVP:

- Account auth and session management
- Project + license lifecycle
- Activation protocol with signed entitlements
- Engine runtime with local entitlement cache and `/health`
- Admin visibility for licenses, activations, machines, and audit logs

## Non-Goals (Pre-MVP)

- SSO, social auth, enterprise identity integrations
- Multi-region control-plane architecture
- Fully automated billing and invoicing stack
- Advanced anti-tamper systems
- Marketplace/plugin ecosystem
- Pixel-perfect dashboard polish before functional completion
