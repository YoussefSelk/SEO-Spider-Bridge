# System Architecture

## Architecture Model

SEO-Spider-Bridge is split into two planes:

1. **Cloud Control Plane (you host)**
   - Dashboard (`Next.js`)
   - API (`Fastify`)
   - Database (`PostgreSQL + Prisma`)
   - License and activation authority
2. **Customer Runtime Plane (customer hosts)**
   - Engine container (`Docker`)
   - Local render/runtime logic
   - Local entitlement cache
   - Runtime health and diagnostics

## Core Components

## Control Plane

- `apps/web`: customer/admin UI
- `apps/api`: auth, project, license, activation endpoints
- `packages/db`: Prisma schema + migrations
- `packages/licensing-core`: licensing and entitlement policy logic
- `packages/crypto-core`: sign/verify helpers

## Engine Plane

- `engine/core`: runtime behavior and request handling
- `engine/activation`: activation client + entitlement cache
- `engine/machine`: machine fingerprint generation
- `engine/config`: env parsing and validation
- `engine/health`: `/health` endpoint

## High-Level Flows

## 1) Onboarding and License Provisioning

1. User registers and creates organization/project.
2. Admin or automated policy issues license for plan tier.
3. License status and limits are persisted in control-plane database.

## 2) Activation Handshake

1. Engine starts with `LICENSE_KEY`, `PROJECT_ID`, and API endpoint config.
2. Engine computes machine fingerprint.
3. Engine calls activation API.
4. API validates license status, plan limits, and activation policy.
5. API returns signed entitlement payload with expiry.
6. Engine verifies signature locally and caches entitlement.
7. Engine enables features according to entitlement flags.

## 3) Runtime Request Path (Inside Engine)

1. Request enters customer-hosted engine.
2. Engine detects crawler/human and applies plan-feature policy.
3. Engine serves from local cache on hit.
4. On miss, engine runs render pipeline and stores output in cache backend.
5. Engine returns static payload to crawler path and passthrough/human path as configured.

## 4) Revalidation and Revocation

1. Engine periodically revalidates entitlement with control plane.
2. If API is unavailable, engine enters bounded grace mode.
3. If entitlement expires or license is revoked, premium behavior is disabled.
4. Engine emits status/diagnostic events for dashboard observability.

## Data Stores

## Control Plane Database

- Backend: PostgreSQL
- Access layer: Prisma
- Source of truth for:
  - users, sessions, organizations, memberships
  - plans, licenses, machines, license activations
  - projects and audit logs

## Engine Cache Datastore

Redis is not required.

Supported backends:

- MongoDB (recommended MVP default)
- Supabase/Postgres adapter

For strict "free forever" operation, self-host MongoDB Community or Postgres.

### Cache Key

`spiderbridge:v1:{host}:{normalized_path}:{query_hash}:{format}`

### Cache Metadata

- payload
- format
- rendered_at
- render_ms
- source_url
- expires_at

## Public API Contracts

## Auth API (Control Plane)

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

Session model:

- Server-side sessions in PostgreSQL
- Session token hash in DB
- Raw token in `HttpOnly` + `Secure` cookie

## License and Admin API

- `GET /licenses`
- `GET /licenses/:id`
- `POST /admin/licenses`
- `POST /admin/licenses/:id/revoke`
- `GET /admin/licenses`

## Activation API

### Endpoint

`POST /activations/activate`

### Request (JSON)

```json
{
  "licenseKey": "SSB-PRO-XXXX-XXXX-XXXX",
  "projectId": "proj_123",
  "machineFingerprint": "mfp_abc123",
  "engineVersion": "1.0.0"
}
```

### Success Response (200)

```json
{
  "activationId": "act_123",
  "entitlement": {
    "licenseId": "lic_123",
    "projectId": "proj_123",
    "planCode": "premium",
    "featureFlags": {
      "markdown_output": true,
      "webhook_invalidation": true
    },
    "issuedAt": "2026-04-19T10:00:00Z",
    "expiresAt": "2026-04-20T10:00:00Z",
    "engineVersionRange": ">=1.0.0 <2.0.0",
    "signature": "base64-signature"
  }
}
```

### Error Model

- `400 BAD_REQUEST`: invalid payload
- `401 UNAUTHORIZED`: invalid API credentials/context
- `402 PAYMENT_REQUIRED`: plan/tier restriction
- `403 FORBIDDEN`: revoked/suspended license
- `409 CONFLICT`: activation policy conflict (limit reached, machine blocked)
- `410 GONE`: expired license
- `429 TOO_MANY_REQUESTS`: rate limit exceeded
- `500 INTERNAL_SERVER_ERROR`: unexpected failure
- `503 SERVICE_UNAVAILABLE`: temporary service degradation

## Security and Trust Boundaries

- License key alone does not grant entitlement.
- Signed entitlement from control plane is required.
- Engine verifies entitlement signature locally before enabling features.
- Revocation authority remains server-side in control plane.

## Plan Enforcement Model

- Freemium and Premium limits are encoded into entitlements (`planCode`, `featureFlags`, quotas).
- Engine enforces local behavior based on valid entitlement.
- Control plane enforces issuance/revocation and activation limit policy.

## Observability Signals

Minimum emitted metrics/events:

- activation success/failure
- entitlement refresh success/failure
- grace mode entry/exit
- render success/failure
- cache hit/miss/stale
- quota exceeded
- license revoked enforcement events
