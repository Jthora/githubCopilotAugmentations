# ADR-005: Pattern Registry Loading & Validation
Date: 2025-08-14
Status: Proposed

## Context
Patterns drive plan expansion. They must be deterministic, validated, and composable. A malformed or non-deterministic pattern jeopardizes reproducibility and safety.

Forces:
- Extensibility: Users can add local pattern files.
- Determinism: Pattern application order & output must be stable.
- Safety: Validation must detect ambiguous triggers or overlapping destructive transforms.
- Performance: Loading should be lightweight on activation.

## Decision
Implement a pattern registry with:
- Discovery order: built-in patterns (shipped) loaded first, then user patterns from `autopilot/patterns/**/*.json` sorted lexicographically by relative path, then optional inline session overrides.
- Validation pipeline: schema validation -> deterministic field normalization -> trigger conflict analysis (e.g., overlapping glob + precedence rules) -> hash assignment (using ADR-001 canonical digest of normalized pattern).
- Registry exposes immutable array of patterns plus index structures (by trigger type, by tag).
- Application order: stable ascending by (priority numeric asc, patternHash asc). Patterns must include explicit `priority` (default 100).
- Reject activation if any fatal conflict; surface aggregated report.

## Consequences
Positive:
- Predictable expansion order.
- Clear extension path for user patterns without patching built-ins.
- Hash-based traceability in logs.

Negative / Trade-offs:
- Slight startup delay for validation (acceptable with caching possibility later).
- Requires user education on priority conflicts.

## Options Considered
- Dynamic on-demand loading (faster startup, harder to validate conflicts globally).
- Single monolithic pattern file (simpler, less modular for users).

## Rationale
Eager full validation ensures early failure and better user trust.

## Guardrails / Follow-ups
- Add CLI command `autopilot.patterns.validate` to re-run validation manually.
- Cache normalized+hashed patterns to `.autopilot/cache/patterns.json` with source mtime metadata; skip re-parse if unchanged.
- Unit tests: conflict detection, ordering stability, hash stability.

## References
- Pattern schema doc.
- Plan expansion how-to guide.
