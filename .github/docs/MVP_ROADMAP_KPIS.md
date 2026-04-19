# MVP Roadmap and KPIs

## Phased Roadmap

## Phase 1: Core Renderer API

### Deliverables

- Renderer service with `POST /render`.
- Headless browser navigation and DOM serialization.
- `html` output mode and basic `markdown` output mode.
- Standardized status/error model.
- Tenant-aware request contract (`projectId`, API key auth).

### Acceptance Criteria

- Valid URL request returns rendered payload and metadata.
- Timeout and invalid-input errors return the documented error shape.
- Render success rate meets baseline in staging (>= 95% on curated test URLs).
- Unauthorized and plan-restricted requests return explicit status codes.

## Phase 2: Plug-and-Play Middleware

### Deliverables

- Middleware integration snippets for Express.js, Nginx, and Apache.
- Deterministic bot detection module.
- Redis cache read/write and TTL behavior.
- Plan-aware entitlement checks for output mode and invalidation capabilities.

### Acceptance Criteria

- Human traffic is unchanged versus origin baseline.
- Bot traffic receives rendered static output on cache hit/miss path.
- Cache hit path is measurably faster than render path for identical URL/format.
- Freemium and Premium paths enforce intended feature boundaries.

## Phase 3: Monitoring Dashboard and Manual Cache Controls

### Deliverables

- Dashboard views for crawl/render success signals.
- Manual cache purge controls (URL and prefix scope).
- Basic audit trail for purge actions.
- Usage and quota panels by plan tier (freemium vs premium).

### Acceptance Criteria

- Operators can identify render failures by host/path.
- Operators can purge stale pages without restarting services.
- Dashboard reflects cache-hit and render-failure metrics in near real time.
- Teams can verify per-project quota status and upgrade readiness.

## Phase 4: Edge Deployment Optimization

### Deliverables

- Edge middleware deployment (Cloudflare Workers or Vercel-compatible edge routing).
- Renderer service hardening for production load.
- Latency and availability tuning for bot request path.
- Plan policy enforcement at edge with predictable fallback behavior.

### Acceptance Criteria

- Edge decision + cache lookup path is stable under load.
- Bot request TTFB meets target on cache-hit routes.
- Graceful degradation exists for renderer outage scenarios.
- Quota-exceeded handling is observable and does not break origin availability.

## KPI Definitions and Targets

## 1) Bot TTFB (Time to First Byte)

- Definition: Time from bot request ingress to first response byte for bot-classified requests.
- Primary target: `< 500 ms` on cache-hit bot traffic.
- Secondary target: P95 bot TTFB trend improves release-over-release.

## 2) Index Latency

- Definition: Time from content publish/update to search engine discoverability for tracked pages.
- Primary target: Reduce from multi-day baseline to `< 24 hours` for priority pages.
- Measurement cohort: Fixed set of representative URLs across customer segments.

## 3) AI Citation Rate

- Definition: Share of tracked prompts where customer pages are cited or referenced by target AI answer engines.
- Primary target: Positive growth from baseline after rollout; initial target `+30%` within first 90 days on tracked prompt set.
- Note: Baseline must be captured before production rollout for valid comparison.

## 4) Free-to-Premium Conversion Rate

- Definition: Percentage of active freemium projects upgraded to premium in a given month.
- Primary target: `>= 8%` monthly conversion from qualified freemium projects.
- Qualification baseline: Freemium projects with sustained quota pressure or repeated premium-only feature attempts.

## 5) Freemium Activation Rate

- Definition: Percentage of newly created freemium projects that successfully serve at least one bot-rendered response in first 7 days.
- Primary target: `>= 60%` 7-day activation.

## KPI Measurement Method

- Bot TTFB:
  - Measure at ingress/middleware layer.
  - Record `decision`, `cache_state`, `ttfb_ms`, `host`, `path`.
  - Report P50/P95 daily and weekly.
- Index Latency:
  - For each tracked URL, log `published_at` and first observed index timestamp.
  - Report median and P90 latency by site segment.
- AI Citation Rate:
  - Maintain a stable prompt set and cadence (for example weekly).
  - Record citation presence per prompt/source.
  - Report citation rate and delta from pre-rollout baseline.
- Free-to-Premium Conversion Rate:
  - Track `plan_changed` events from `freemium` to `premium`.
  - Report monthly conversion by segment (site type, traffic tier).
- Freemium Activation Rate:
  - Track first successful bot-render event timestamp per new freemium project.
  - Report weekly and monthly activation percentages.

## Release Gating for MVP Progression

- Phase 1 -> Phase 2: Renderer API contract stable, staging success criteria met.
- Phase 2 -> Phase 3: Middleware integration verified with bot/human path correctness.
- Phase 3 -> Phase 4: Operational visibility and manual purge capabilities available.
- MVP completion: At least one production deployment path with technical and commercial KPI collection enabled.
