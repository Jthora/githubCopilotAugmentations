# Architecture Decision Records (ADRs)

This folder contains Architecture Decision Records for the Auto-Pilot subsystem.

Each ADR is immutable once accepted (status becomes `Accepted`). Future changes require a superseding ADR that references prior decisions.

## Template

```
# ADR-N: Title
Date: YYYY-MM-DD
Status: Proposed | Accepted | Superseded by ADR-M | Rejected
Context:
  * Problem statement / forces
Decision:
  * What is decided (short imperative)
Consequences:
  * Positive
  * Negative / trade-offs
Options Considered:
  * Option A
  * Option B
  * ...
Rationale:
  * Why this option
Guardrails / Follow-ups:
  * Checklist items spawned by this ADR
References:
  * Links to related docs, PRs, issues
```

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| ADR-001 | Deterministic Hashing & Canonical Serialization | Proposed | (pending) |
| ADR-002 | Guardrail Philosophy & Enforcement Model | Proposed | (pending) |
| ADR-003 | Branching & Git Workflow for Iterations | Proposed | (pending) |
| ADR-004 | Memory Tiering & Log Compaction Strategy | Proposed | (pending) |
| ADR-005 | Pattern Registry Loading & Validation | Proposed | (pending) |
