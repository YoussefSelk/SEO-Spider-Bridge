# Contributing Guidelines

## Branching and PR Expectations

- Create feature branches from `main` using clear names:
  - `feat/<short-description>`
  - `fix/<short-description>`
  - `docs/<short-description>`
- Keep PRs focused on one logical change.
- Include in every PR:
  - What changed.
  - Why it changed.
  - How it was validated.
  - Any follow-up work not included.

## Documentation Update Policy

When a PR changes product behavior, public interfaces, or success criteria, update docs in the same PR:

- Interface changes -> update `docs/SYSTEM_ARCHITECTURE.md`.
- Scope/positioning changes -> update `docs/PROJECT_OVERVIEW.md`.
- Milestones, acceptance criteria, or KPI changes -> update `docs/MVP_ROADMAP_KPIS.md`.
- Tier packaging, quota, or entitlement changes -> update all three docs above in the same PR.

Reject or block PR merge when docs are outdated relative to shipped behavior.

## Lightweight Definition of Done (MVP Changes)

A change is done when all are true:

1. Code behavior matches the relevant architecture and roadmap documentation.
2. Public API/middleware contract changes are documented.
3. Error behavior is explicit and testable (no undocumented failure paths).
4. Validation evidence is included in PR notes (tests, manual checks, or logs).
5. KPI instrumentation impact is addressed (added, unchanged, or intentionally deferred with reason).

## Quality Bar for Reviews

- No undocumented contract changes.
- No silent fallback paths for bot traffic without observability signals.
- No scope creep beyond current MVP phase unless explicitly approved.

## Commit Hygiene

- Prefer small, reviewable commits.
- Use imperative commit messages (for example: `Add renderer timeout error model docs`).
- Do not mix unrelated refactors with MVP feature behavior in the same PR.
