# Iteration State Machine (Draft)
Status: Draft (Phase 2)

State | Description | Entry Preconditions | Exit Conditions
----- | ----------- | ------------------- | ---------------
select_task | Choose next eligible task | non-empty pending set | task chosen or none -> stop
assemble_context | Gather task, relevant files, summaries | task chosen | context bundle ready
scaffold | Generate or modify files per pattern rules | context bundle | patch draft produced
validate | Run linters/tests/acceptance checks | patch applied in sandbox | validation results captured
reflect | Compute metrics & summaries | validation complete | reflection persisted
guardrail_check | Risk scoring & threshold checks | reflection persisted | approve -> persist, reject -> rollback
persist | Commit state & logs | approved | success, then loop
pause | Manual or guardrail triggered | any | waiting for user
terminate | Stop conditions met | maxIterations | end

## Risk Scoring Inputs
Metric | Source | Weight (initial)
------ | ------ | ----------------
linesChanged | diff | 0.3
filesTouched | diff | 0.2
deletionsPercent | diff | 0.2
protectedPathTouches | diff | 0.2
consecutiveFailures | history | 0.1

Score normalized 0..1; > threshold (e.g., 0.65) => pause.

## Rollback Path
- If validation fails hard AND risk score high: revert patch; mark task blocked.
- Else: keep patch, mark task in_progress for next iteration refinement.

## Deterministic Selection
`taskOrder = sort(pending, key=(priority, hash(id+seed)))` pick first.

## Open Questions
- Multi-task batching? Defer until after baseline stability.
