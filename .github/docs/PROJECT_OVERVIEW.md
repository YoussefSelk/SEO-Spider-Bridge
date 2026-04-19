# Project Overview

## Executive Summary

SEO-Spider-Bridge is a middleware service that solves JavaScript SEO gaps for SPA websites (React, Angular, Vue).  
It detects search bots and AI crawlers, serves them pre-rendered static HTML, and leaves human traffic on the normal client-side app path.

Core business value:

- Faster indexability for JS-heavy pages.
- Better crawl visibility for AI agents that do not execute JavaScript.
- Lower migration pressure for legacy client-side-only applications.

## Infrastructure Direction (No Redis)

The project does not require Redis for MVP.  
Caching and usage metering are backed by a datastore adapter using:

- MongoDB (recommended MVP default).
- Supabase Postgres (supported alternative).

For strict cost control, prioritize self-hosted open-source deployments to keep infrastructure free of mandatory paid dependencies.

## Business Model (SaaS)

SEO-Spider-Bridge is positioned as a SaaS product with two tiers:

- `Freemium`: Low-friction onboarding for smaller sites and evaluation.
- `Premium`: Production-grade capacity, controls, and support for revenue-critical traffic.

### Initial Tier Boundaries (v1 defaults)

| Capability | Freemium | Premium |
| --- | --- | --- |
| Monthly rendered requests | Up to 10,000 | Up to 500,000 (expandable) |
| Connected domains | 1 | Up to 10 |
| Output formats | HTML only | HTML + Markdown |
| Cache invalidation | TTL only | TTL + webhook purge |
| Analytics retention | 7 days | 90 days |
| Support model | Best effort | Priority support |

These defaults provide a clear upgrade path while keeping entry barriers low.

## 2026 Problem Context

### Rendering Gap

Googlebot still exhibits two-wave indexing behavior for JavaScript-heavy pages, creating indexing delays that can range from days to weeks.

### AI Accessibility (GEO)

Modern AI crawlers often avoid full JS execution for cost and speed reasons. Pages that require client-side rendering are at risk of being ignored or partially understood.

### Legacy Architecture Debt

Large enterprise SPAs cannot always be migrated quickly to SSR/ISR frameworks. Teams need a bridge solution that works without full platform rewrites.

## Ideal Customer Profile (ICP)

### E-commerce

Headless commerce deployments where product/category pages are client-rendered.

### B2B SaaS

Marketing and documentation surfaces shipped as SPA frontends with limited server rendering.

### Legacy Enterprises

Large Angular/Vue estates where replatforming is costly or blocked by long release cycles.

## Value Proposition

- SEO continuity without replacing frontend architecture.
- Bot-first static output while preserving human SPA experience.
- Better probability of AI answer inclusion through crawlable content.
- Performance-aware caching that reduces repeated rendering cost.
- Freemium to Premium growth path aligned with crawl volume and reliability needs.

## Non-Goals (MVP)

- Replacing customer origin hosting or CDN.
- Full website analytics platform.
- Full observability suite with custom dashboards beyond MVP signals.
- Enterprise custom contracts, annual invoicing, and advanced finance workflows.
- Complete content optimization tooling (keyword tooling, editorial automation).
