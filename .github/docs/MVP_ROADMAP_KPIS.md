# MVP Roadmap and KPIs

## Execution Roadmap (Strategy-Aligned)

This roadmap follows the self-hosted licensed-engine strategy in `SELF_HOSTED_SAAS_ROADMAP.md`.

## Phase A: Foundation

Deliverables:

- `pnpm` workspace + Turborepo baseline
- `apps/web`, `apps/api`, `packages/db`, `packages/shared` scaffolds
- Local PostgreSQL + Prisma connectivity

Acceptance gate:

- Web and API boot locally
- Prisma migrations run from clean state

## Phase B: Core Data Model

Deliverables:

- Prisma models and migrations for users/sessions/orgs/plans/licenses/machines/activations/projects/audit logs
- Seed data for minimum plan set (freemium, premium)

Acceptance gate:

- Fresh database bootstraps with migrations and seeds
- Create user/org/license path works from script

## Phase C: Auth v1

Deliverables:

- Register/login/logout/me endpoints
- Server-side session storage and secure cookie behavior
- Protected route middleware for dashboard/API

Acceptance gate:

- Register/login/logout/me flow works end-to-end
- Session revocation and expiration behavior validated

## Phase D: Dashboard v1

Deliverables:

- Functional pages: login, dashboard, projects, licenses, settings
- Basic status cards for activations and license state

Acceptance gate:

- Logged-in user can navigate and view real project/license data

## Phase E: License Management

Deliverables:

- Admin license issuance and revocation endpoints
- License listing and details view
- Audit log entries for admin actions

Acceptance gate:

- Team can issue and revoke a license and observe state changes

## Phase F: Activation Protocol

Deliverables:

- Activation endpoint
- Signed entitlement payload generation
- Engine-side signature verification

Acceptance gate:

- Engine only unlocks premium behavior with valid entitlement

## Phase G: Engine Runtime + Docker

Deliverables:

- Engine config loader
- Local entitlement cache
- Health endpoint
- Docker multi-stage build and runtime image

Acceptance gate:

- `docker build` and `docker run` pass
- Activation succeeds in containerized run

## Phase H: Grace and Revocation Behavior

Deliverables:

- Entitlement refresh scheduler
- Grace-mode logic for transient API outages
- Revoked/expired entitlement handling

Acceptance gate:

- Short control-plane outage does not instantly break valid customers
- Revocation reliably disables premium path after refresh/grace window

## Phase I: Admin Observability

Deliverables:

- Admin views for activations, machines, revocations, audit logs
- Basic filtering by organization/license/project

Acceptance gate:

- Team can answer who activated what, when, and where

## Phase J: Customer Onboarding

Deliverables:

- Installation guide
- `.env` template
- Docker run/compose examples
- Troubleshooting and activation-status playbook

Acceptance gate:

- Technical user can deploy and activate without live onboarding call

## KPI Model

## Technical KPIs

1. Activation Success Rate
- Definition: successful activations / attempted activations.
- Target: `>= 98%` in staging/production healthy windows.

2. Entitlement Refresh Reliability
- Definition: successful refresh attempts / total scheduled refresh attempts.
- Target: `>= 99%` excluding declared incident windows.

3. Engine Availability (`/health`)
- Definition: percentage of health checks passing over time.
- Target: `>= 99.5%` for production customer deployments (where monitored).

4. Bot TTFB on Cache Hit
- Definition: TTFB for bot-path responses served from cache.
- Target: `< 500 ms` median on representative workloads.

## Commercial KPIs

1. Freemium Activation Rate
- Definition: percentage of newly created freemium projects with first successful engine activation in 7 days.
- Target: `>= 60%`.

2. Free-to-Premium Conversion Rate
- Definition: monthly percentage of qualified freemium projects upgraded to premium.
- Target: `>= 8%` monthly.

3. Churn on Premium Licenses
- Definition: premium licenses not renewed / renewable premium licenses per period.
- Target: trend down month-over-month after onboarding improvements.

## KPI Measurement Notes

- Emit activation, refresh, revocation, and quota events from control-plane API.
- Emit runtime cache/health/render diagnostics from engine.
- Maintain baseline before major rollout changes for valid KPI deltas.

## Out-of-Scope Before MVP

- SSO/social login
- Multi-region control plane
- Offline activation
- Advanced anti-tamper
- Full billing automation
- Non-essential UI polish
