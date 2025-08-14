# Guardrails (Draft)
Status: Draft (Phase 3)

## Purpose
Prevent destructive or runaway behavior during autonomous iterations.

## Thresholds (Initial Defaults)
Name | Default | Description | Action on Exceed
---- | ------- | ----------- | ----------------
maxDiffLinesPerIter | 400 | Total changed lines (add+del) | Pause & require approval
maxFilesPerIter | 8 | Files modified | Pause
maxDeletionPercent | 40 | % lines removed in diff | Pause+Review
maxProtectedTouches | 0 | Protected path modifications | Hard stop
maxConsecutiveFailures | 3 | Sequential failed validations | Pause
riskScoreThreshold | 0.65 | Composite risk | Pause

## Protected Paths
Defaults: [".git/**", "plan/rootspec.yaml", "node_modules/**", ".autopilot/**"]
User configurable via `protectedPaths` (extensions additive, not subtractive by default).

## Risk Score Formula (Preliminary)
```
score = w1*norm(linesChanged) + w2*norm(filesTouched) + w3*norm(deletionPct) + w4*protectedFlag + w5*failureStreak
```
- protectedFlag = 1 if any protected path touched else 0.
- Norm functions map to 0..1 using configured maxima.

## Escalation
Level | Condition | Action
----- | --------- | ------
INFO | score < 0.4 | Proceed
WARN | 0.4 <= score < 0.65 | Proceed + log warning
PAUSE | score >= 0.65 | Pause iteration loop
HARD_STOP | protected path touched | Abort & rollback

## Rollback Strategy
1. Stash patch diff to `patches/pending/<iter>.diff`.
2. git reset --hard HEAD (or discard changes file-by-file if only partial).
3. Mark task blocked with reason.

## Override Workflow
- User executes command: `Autopilot: Approve High-Risk Patch` which applies diff if signature of patch file unchanged.

## Logging
- Each guardrail evaluation emits JSON record: { iter, metrics, score, decision, thresholdsSnapshotHash }.

## Future Enhancements
- Semantic diff weighting (AST-level changes).
- Deletion intent classification (refactor vs destructive).
