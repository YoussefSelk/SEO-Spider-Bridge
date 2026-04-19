# Self-Hosted SaaS Stack and Execution Roadmap

## Product Direction

Build **SEO-Spider-Bridge** as a **self-hosted licensed engine + lightweight cloud control panel**.

You own:

- Dashboard and admin panel
- Authentication
- License issuing and activation APIs
- Revocation and audit tooling

Customer owns:

- Runtime hosting and operational compute cost for the engine

Commercial model:

- Revenue from **license access** (Freemium -> Premium), not heavy managed execution.

## MVP Definition

MVP is done when:

> A customer can create an account, receive a license, deploy the engine on their own host, activate it, and use it while you can monitor/revoke from the dashboard.

## Recommended Stack

- Monorepo: `pnpm workspaces` + `Turborepo`
- Frontend dashboard: `Next.js` + `TypeScript` + `Tailwind`
- Backend API: `Fastify` + `TypeScript`
- Database: `PostgreSQL` + `Prisma`
- Engine packaging: `Docker` (multi-stage)
- Crypto/signing: Node built-in `node:crypto` / Web Crypto
- Auth sessions: secure cookie sessions (`HttpOnly`, `Secure`, short-lived)
- Cache backend (per project decision): MongoDB or Supabase/Postgres adapter

## What Each Part Does

### Monorepo (`pnpm` + `Turbo`)

- Single dependency/workspace management
- Unified scripts: `dev`, `build`, `lint`, `test`, `typecheck`
- Faster incremental builds/checks across packages

### Next.js Dashboard

- Customer portal and admin UI
- Login/session flows
- Project/license/activation views

### Fastify API

- Explicit service endpoints:
  - `/auth/*`
  - `/licenses/*`
  - `/activations/*`
  - `/admin/*`
  - `/projects/*`
  - `/health`

### Prisma + Postgres

- Schema, migrations, typed data access
- Source of truth for users, orgs, plans, licenses, activations, sessions, audit logs

### Node Crypto

- Token generation
- Payload signing and verification
- HMAC and integrity checks where needed

### Docker Engine Packaging

- Portable customer runtime
- Environment-based config
- Health checks
- Activation + entitlement revalidation

## Repository Layout

```text
repo/
|- apps/
|  |- web/                    # Next.js dashboard
|  |- api/                    # Fastify API
|- packages/
|  |- db/                     # Prisma schema, migrations, client
|  |- shared/                 # schemas, DTOs, constants
|  |- auth-core/              # auth business logic
|  |- licensing-core/         # license + activation logic
|  |- crypto-core/            # sign/verify/token helpers
|  |- engine-sdk/             # client for engine <-> API
|- engine/
|  |- core/                   # protected runtime
|  |- activation/             # activation + entitlement cache
|  |- machine/                # machine fingerprint logic
|  |- config/                 # env parsing + validation
|  |- health/                 # health route and diagnostics
|  |- Dockerfile
|- infra/
|  |- docker-compose/
|  |- scripts/
|- pnpm-workspace.yaml
|- turbo.json
|- package.json
```

## MVP Features

### Customer-side MVP

1. Register account
2. Create one project
3. Receive one license
4. Deploy one engine instance
5. Activate engine
6. See active status in dashboard

### Admin-side MVP

1. Create plans
2. Issue/revoke licenses
3. View activations
4. Suspend bad license
5. Inspect audit logs

### Engine-side MVP

1. Read config
2. Activate against API
3. Verify signed entitlement
4. Cache entitlement locally
5. Revalidate periodically
6. Disable premium behavior if invalid/expired

## Starter Data Model

Tables:

- `users`
- `sessions`
- `organizations`
- `organization_members`
- `plans`
- `licenses`
- `machines`
- `license_activations`
- `projects`
- `audit_logs`

Minimum purpose:

- Auth and session control
- Tenant/project ownership
- License issuance and lifecycle
- Activation tracking and anti-abuse friction
- Admin auditability

## Auth Design (Owned In-House)

Session flow:

1. User logs in
2. API verifies password hash
3. API issues random session token
4. DB stores only token hash
5. Raw token returned in secure cookie
6. Protected routes resolve session from DB

Security defaults:

- `HttpOnly`
- `Secure`
- `SameSite` protection
- Session expiration and rotation on sensitive actions

## Licensing and Activation Design

### License Key

- Human-readable key (for operator UX)
- Never treated as final proof of entitlement

### Server as Source of Truth

- Engine submits key + machine fingerprint + project + version
- API returns signed activation entitlement payload
- Engine verifies signature locally

### Signed Entitlement Payload

Contains at least:

- `license_id`
- `machine_fingerprint`
- `project_id`
- `plan_code`
- `feature_flags`
- `issued_at`
- `expires_at`
- `engine_version_range`

### Revalidation

- Revalidate every few hours or daily
- Grace period on temporary API outages
- Eventual disable/degrade on revoked/expired entitlement

## Machine Fingerprint Strategy

- Keep simple and stable
- Treat as enforcement friction, not perfect anti-piracy
- Pair with server validation, short-lived entitlements, and audit logs

## Phase-by-Phase Roadmap

## Phase A: Foundation

Build:

- Workspace/monorepo skeleton
- Web + API shells
- DB package and Prisma connection

Done when:

- Web starts
- API starts
- Prisma connects and migrates

## Phase B: Domain Model

Build:

- Core tables and relationships
- Initial seed data (plans)

Done when:

- Fresh migrate works
- User/org/license can be created from seed/script

## Phase C: Auth v1

Build:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

Done when:

- Register/login/logout/me works with secure cookie sessions

## Phase D: Dashboard v1

Build pages:

- `/login`
- `/dashboard`
- `/projects`
- `/licenses`
- `/settings`

Done when:

- Functional portal exists (design polish not required)

## Phase E: License Issuance

Build:

- `POST /admin/licenses`
- `POST /admin/licenses/:id/revoke`
- `GET /admin/licenses`
- `GET /admin/licenses/:id`

Done when:

- License can be issued, listed, revoked

## Phase F: Activation Protocol

Build:

- `POST /activations/activate`
- Signed entitlement generation and engine verification

Done when:

- Engine only runs premium path with valid entitlement

## Phase G: Engine Runtime

Build:

- Config loader
- Activation cache
- Health endpoint
- Core runtime behavior
- Docker image

Done when:

- `docker build` and `docker run` succeed
- Activation succeeds
- `/health` is healthy

## Phase H: Grace Mode and Revocation

Build:

- Refresh scheduler
- Grace behavior
- Revoked/expired handling

Done when:

- Short API outages do not immediately break legit customers
- Revocations propagate predictably

## Phase I: Admin Observability

Build:

- Admin views for licenses, activations, machines, revocations, audit logs

Done when:

- Team can answer who/what/when/where for activation lifecycle

## Phase J: Customer Onboarding MVP

Build:

- Install guide
- `.env` template
- Docker run/compose examples
- Troubleshooting
- Activation status guide

Done when:

- Technical customer can deploy without live support call

## Strict Implementation Order

1. Monorepo setup
2. Postgres + Prisma
3. Shared types
4. Fastify API shell
5. Next.js dashboard shell
6. Auth tables + auth endpoints
7. Dashboard login flow
8. Org/project/license schema
9. Admin license issuance
10. Engine skeleton
11. Activation endpoint
12. Signed entitlement verification
13. Docker packaging
14. Grace mode
15. Admin activation views
16. Docs and install guide

## Out of Scope Before MVP

- Social login / SSO
- Multi-region architecture
- Offline activation
- Advanced anti-tamper
- Billing automation
- Highly polished UI
- Plugin marketplace
- Fine-grained enterprise permission matrix

## First 4-Week Execution Plan

### Week 1

- Monorepo, web, API, DB, Prisma baseline

### Week 2

- Auth, sessions, protected dashboard, org/project models

### Week 3

- License issuance, activation endpoint, engine skeleton, entitlement verification

### Week 4

- Docker packaging, grace mode, admin tools, docs, full end-to-end onboarding test

## Final Stack Summary

- `pnpm workspaces`
- `Turborepo`
- `Next.js + TypeScript + Tailwind`
- `Fastify + TypeScript`
- `PostgreSQL`
- `Prisma`
- `node:crypto` / Web Crypto
- Secure cookie sessions
- `Docker`

This stack is self-hostable, cost-controlled, and aligned with a Freemium/Premium licensed product path.
