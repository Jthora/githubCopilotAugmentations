# ADR-002: Guardrail Philosophy & Enforcement Model
Date: 2025-08-14
Status: Proposed

## Context
Auto-Pilot will modify the workspace autonomously (within constraints). We must constrain behavior to minimize destructive changes while enabling productive refactors. Guardrails combine static pre-checks, diff evaluation, risk scoring, and rollback triggers.

Forces:
- Safety vs Velocity: Overly strict guardrails block progress; loose guardrails risk damage.
- Transparency: Users should understand why an iteration was blocked.
- Determinism: Same state + plan must yield same allow/deny decisions.
- Extensibility: New guardrails added without central rewrite.

## Decision
Implement a pluggable guardrail pipeline with ordered stages:
1. Input Validation (plan & pattern structural integrity).
2. Proposed Change Synthesis (dry-run patch generation where deterministic patterns predict modifications).
3. Static Risk Scoring (file count touched, LOC delta, critical path matches, churn heat-map intersections).
4. Policy Evaluation (threshold checks: maxFiles, maxTotalAdded, maxHighRiskFiles, protectedPath denies).
5. Pre-Commit Sanity (lint/compile in memory where feasible; optional quick tests subset).
6. Commit Gate (approve, warn & require manual confirmation, or abort).
7. Post-Commit Monitor (detect unexpected new warnings; schedule rollback if triggered conditions > threshold).

Each stage returns structured result `{ status: ok|warn|fail, metrics, messages, next }`. The pipeline short-circuits on `fail`.

Policies configured via `autopilot.guardrails.json` (documented schema). Defaults conservative.

## Consequences
Positive:
- Clear layering aids debugging and extension.
- Metrics surfaced to user (status bar / log) for trust.
- Deterministic ordering supports reproducibility.

Negative / Trade-offs:
- Additional upfront engineering complexity.
- Predictive dry-run requires deterministic pattern execution without side-effects.
- Slight performance overhead per iteration.

## Options Considered
- Monolithic single function (simpler, harder to extend/test).
- External policy engine (overkill, extra dependency surface).

## Rationale
Pipeline pattern mirrors existing macro execution style, promotes testability and incremental addition of guardrails.

## Guardrails / Follow-ups
- Define risk metric weights in configuration doc.
- Add unit tests per stage with synthetic plans.
- Provide human-readable and machine JSON log outputs.
- Implement rollback criteria ADR if strategy changes.

## References
- Guardrails spec document.
- Risk matrix.
