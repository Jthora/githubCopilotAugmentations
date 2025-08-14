# ADR-003: Branching & Git Workflow for Iterations
Date: 2025-08-14
Status: Proposed

## Context
Autonomous iterations need isolation, auditability, and easy rollback. Direct commits to `main` are risky. We need a deterministic branch naming scheme and lightweight retention policy.

Forces:
- Traceability: Each iteration must map to a commit with metadata (plan digest, iteration number).
- Cleanup: Avoid cluttering repo with hundreds of stale branches.
- Simplicity: Must work without additional server-side tooling.
- Parallel Safety: Future extension may allow concurrent experiment branches.

## Decision
Use a rolling feature branch series under prefix `autopilot/SESSIONID/iter-N` where SESSIONID = first 8 chars of initial plan digest + UTC date (YYYYMMDD). Iterations proceed:
1. Create base feature branch `autopilot/SESSIONID/base` off current `main` when session starts.
2. For each iteration k: branch from previous iteration branch (or base for k=1) into `autopilot/SESSIONID/iter-k`.
3. Apply changes, commit with message template:
   `autopilot(iter-k): <summary>
    PlanDigest: <hash>
    ParentDigest: <hash>
    Metrics: files=<n> +<added> -<removed> risk=<score>`
4. Optionally fast-forward a tracking branch `autopilot/SESSIONID/latest` to the newest iteration.
5. Merge strategy: only manually merge into `main` after human review (not automated in early phases).
6. Retention: keep last 20 iteration branches; prune older ones after successful creation of iter-(k+1) unless flagged by anomaly or manual pin.

## Consequences
Positive:
- Clean isolation per iteration; easy diff comparisons.
- Deterministic naming aids reproducibility logs.
- Pruning mitigates branch sprawl.

Negative / Trade-offs:
- Many lightweight branches (acceptable overhead in git).
- Rebases of `main` not automatic; drift possible if long-running session.

## Options Considered
- Single branch with sequential commits (harder rollback mid-sequence).
- Squash-and-recreate branch per iteration (loses granular history).
- Using tags instead of branches (less convenient for working diffs).

## Rationale
Branch-per-iteration maximizes forensic detail and rollback simplicity with minimal complexity.

## Guardrails / Follow-ups
- Implement pruning utility with safety dry-run.
- Add config for retention count.
- Provide command to promote specific iteration branch into PR base (future automation).

## References
- Git strategy doc.
- Risk matrix (repository clutter; rollback reliability).
