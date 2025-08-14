# Autopilot Roadmap (Draft)

Phase | Focus | Key Deliverables | Exit Criteria
----- | ----- | ---------------- | -------------
-1 | Discovery & Feasibility | Sample repo metrics, hashing spike, risk validation | Feasibility report + go/no-go
0 | Docs Scaffold | Spec & plan stubs | Folders + baseline docs merged
1 | Plan & Patterns | Expansion engine (no edits) | expanded.json deterministic
2 | Single Iteration | Iterate Once command + logs | Guardrails basic, manual loop
3 | Batch Loop & Guardrails | unattended mode, risk scoring | Safe pause points proven
4 | Reconciliation | Orphan detection, acceptance refinements | Orphans <2% tasks
5 | Optimization & Metrics | Performance & compaction | Iter runtime median <5s
6 | Advanced Safety | Config signing, pattern version mgmt | No unapproved config drift
7 | Extensibility & Ecosystem | Pattern registry tests, version negotiation | Pattern test pass rate 100%
8 | Observability UI | Webview dashboard, risk heat map | Live dashboard reflects iteration <1s lag
9 | Parallel Micro-Batching | Multi-task safe batching | Throughput +25% no risk score spike
10 | Hardening & Release | Stress tests, security review | Repro audit pass, perf SLA met
11 | Governance & Policy | Role approvals, config audit trail | Policy rules enforced in logs
12 | Evolution & Migration | Schema migration tooling | Zero-data-loss migration dry run

## Phase Gate Artifacts
Each phase exit requires:
- Updated risk matrix delta
- ADR additions/updates (if architecture changed)
- Metrics snapshot (iteration latency, risk pause rate)
- Reproducibility proof (planSignature + replay log)
- Diff safety scorecard (false positives / negatives)
- Checklist completion record
