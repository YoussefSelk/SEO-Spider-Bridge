# System Architecture

## End-to-End Request Flow

1. Client request arrives at customer edge/origin entrypoint.
2. Middleware authenticates tenant context using project key and host mapping.
3. Middleware inspects request metadata (user-agent, method, path, content type).
4. If requester is human, request is passed through to origin SPA unchanged.
5. If requester is bot/AI crawler, middleware attempts cache lookup in Redis.
6. On cache hit, middleware returns cached rendered payload (HTML or Markdown).
7. On cache miss, middleware checks plan quota and calls Renderer API.
8. Renderer returns serialized output and metadata.
9. Middleware stores output in Redis with TTL, records usage counters, then returns rendered output to crawler.

## Bot Detection Strategy

Detection is deterministic and order-based:

1. Explicit allow/deny override lists (highest priority).
2. User-Agent pattern match for known engines and AI crawlers:
   - Search engines: Googlebot, Bingbot.
   - AI/assistant crawlers: Applebot, GPTBot, ClaudeBot, PerplexityBot.
3. Heuristic fallback (optional in MVP): suspicious crawler signatures if no known UA match.

MVP requirements:

- Unknown user-agents default to human path.
- Detection decision is logged (`bot`, `human`, `unknown`) with matched rule ID.
- Detection rules are configuration-driven to support updates without code changes.

## Rendering Pipeline

1. Validate URL and policy constraints (allowed domain, method `GET` only).
2. Launch headless browser session (Playwright or Puppeteer).
3. Navigate to target URL.
4. Wait for render completion using `networkidle` plus max timeout guard.
5. Extract DOM snapshot and normalize output.
6. Output mode:
   - `html`: cleaned static HTML.
   - `markdown`: crawler-friendly markdown representation.
7. Return payload with metadata (render time, source URL, output format, cacheability hint).

MVP safeguards:

- Hard timeout per render job (for example 15s).
- Max concurrent render jobs to protect service latency.
- Standardized error surface for timeout, blocked URL, and renderer failure.

## Redis Caching and Invalidation Model

### Cache Key

`spiderbridge:v1:{host}:{normalized_path}:{query_hash}:{format}`

### Cached Value

- Rendered payload (`html` or `markdown`).
- Metadata: `rendered_at`, `render_ms`, `status`, `content_type`, `source_url`.

### TTL Policy

- Default TTL: 6 hours.
- Override per route class (for example product pages shorter, static docs longer).

### Invalidation

- Passive invalidation via TTL expiry.
- Active invalidation via webhook endpoint:
  - Purge by exact URL.
  - Purge by host + path prefix (limited scope).

Freemium/Premium behavior:

- Freemium: TTL-based invalidation only.
- Premium: TTL + webhook-triggered invalidation enabled.

## Edge Deployment Notes

- Middleware should run at edge/runtime layer nearest ingress (Cloudflare Workers or Vercel Edge-compatible routing layer).
- Headless rendering typically runs in a Node.js service tier (not in strict edge isolates).
- Edge component responsibilities:
  - Fast bot/human decisioning.
  - Tenant identification and plan policy checks.
  - Cache retrieval.
  - Delegation to renderer service on cache miss.

## SaaS Tenancy and Plan Enforcement

### Tenant Identity

- Each customer project is assigned:
  - `projectId` (internal tenant identifier).
  - `apiKey` (used by middleware-to-service calls).
  - `planTier` (`freemium` or `premium`).

### Usage Metering

- Metering unit: one successful bot render response served (`cache_hit` or `rendered`).
- Counters tracked per project and billing cycle:
  - `requests_total`
  - `cache_hits`
  - `cache_misses`
  - `render_failures`

### Quota Behavior

- Freemium quota exceeded:
  - Return origin fallback for bot path when possible.
  - Emit `quota_exceeded` event and response header.
- Premium quota exceeded:
  - Allow configurable soft overage or hard cap, based on account policy.

## Public Interface: Renderer API v1

### Endpoint

`POST /render`

### Authentication

- Required header: `x-api-key: <project_api_key>`

### Request Schema (JSON)

```json
{
  "projectId": "proj_abc123",
  "url": "https://example.com/products/widget-1",
  "format": "html",
  "waitUntil": "networkidle",
  "timeoutMs": 15000,
  "cacheTtlSeconds": 21600,
  "requestId": "req_12345"
}
```

Field requirements:

- `projectId` (required, valid tenant/project identifier).
- `url` (required, absolute URL).
- `format` (required, `html` or `markdown`).
- `waitUntil` (optional, default `networkidle`).
- `timeoutMs` (optional, default 15000, max 30000).
- `cacheTtlSeconds` (optional, default 21600).
- `requestId` (optional, correlation ID for logs/traces).

### Success Response (200)

```json
{
  "url": "https://example.com/products/widget-1",
  "format": "html",
  "contentType": "text/html; charset=utf-8",
  "renderedAt": "2026-04-19T10:00:00Z",
  "renderMs": 842,
  "cacheable": true,
  "payload": "<!doctype html>..."
}
```

### Error Response (non-2xx)

```json
{
  "error": {
    "code": "RENDER_TIMEOUT",
    "message": "Renderer exceeded timeout",
    "requestId": "req_12345"
  }
}
```

### Status/Error Model

- `400 BAD_REQUEST`: Invalid URL, unsupported format, malformed request.
- `401 UNAUTHORIZED`: Missing or invalid API key.
- `402 PAYMENT_REQUIRED`: Plan restriction blocks requested capability.
- `403 FORBIDDEN`: URL outside allowed domain policy.
- `408 REQUEST_TIMEOUT`: Rendering timeout.
- `429 TOO_MANY_REQUESTS`: Renderer concurrency/rate limit exceeded.
- `500 INTERNAL_SERVER_ERROR`: Unhandled renderer failure.
- `503 SERVICE_UNAVAILABLE`: Browser pool unavailable or degraded.

## Public Interface: Middleware Integration Contract

### Middleware Inputs

- Original HTTP request context:
  - `method`, `host`, `path`, `query`, `headers.user-agent`.
- Config:
  - bot detection rules,
  - project identity and API key,
  - plan tier and quota policy,
  - Redis endpoint,
  - renderer service URL,
  - cache policy,
  - allow/deny host policy.

### Middleware Behavior

- If request is human:
  - Forward to origin SPA unchanged.
- If request is bot/AI:
  - Attempt Redis lookup.
  - On hit: return cached rendered payload with `200`.
  - On miss: validate plan entitlement and call `POST /render`, store response in Redis, return rendered payload with `200`.
  - On renderer error:
    - If stale cache exists: return stale payload with warning header.
    - Else: pass through to origin and annotate response with failure header for observability.
  - On quota restriction:
    - Return origin fallback and set quota headers.

### Middleware Outputs

- Human path:
  - Origin response passthrough.
- Bot path success:
  - `200` with static payload and crawler-safe `content-type`.
- Bot path degraded:
  - `200` stale payload when available, or origin fallback when render unavailable.
- Response headers (recommended):
  - `x-spiderbridge-decision: human|bot`
  - `x-spiderbridge-plan: freemium|premium`
  - `x-spiderbridge-cache: hit|miss|stale|bypass`
  - `x-spiderbridge-render-ms: <int>`
  - `x-spiderbridge-quota: ok|exceeded`
