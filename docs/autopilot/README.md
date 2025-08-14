# Auto-Pilot (Deterministic Local Automation)

Purpose: Extend Copilot Macros with a deterministic, pattern-driven automation loop that can iteratively scaffold and refine a project locally without external LLM or cloud API calls.

Non-Goals (for now): External model invocation, semantic understanding beyond rule-based patterns, automatic pushing to remote branches.

Core Concepts:
- Immutable Spec: Root plan input (e.g., `plan/rootspec.yaml`) hashed & signature-checked.
- Pattern Expansion: Deterministic templates produce task nodes from spec segments.
- Task Queue: Structured nodes with status machine (pending → in_progress → validated → done / blocked).
- Iteration Loop: Single step that selects a task, generates scaffolds, validates, reflects, persists.
- Guardrails: Diff, deletion, risk scoring, protected path enforcement.
- Memory Tiers: Timeline log (light), per-iteration details (JSON), periodic summaries.
- Reproducibility: Seed + canonical hashing + deterministic ordering.

High-Level Flow:
1. Expand plan from spec + patterns (seeded).
2. Iterate: select next task (priority -> seed tie-breaker).
3. Assemble context (task + relevant files + summary excerpts).
4. Generate/edit code via templates & rule sets.
5. Validate (lint/tests/structural checks) → reflect.
6. Apply guardrails; commit if safe.
7. Summarize and compact memory; loop or pause on stop conditions.

See `specs/` for normative definitions.
