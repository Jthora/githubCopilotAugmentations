# Memory & Logging (Draft)
Status: Draft (Phase 3)

## Objectives
- Bounded disk usage
- Reconstructable timeline
- Summarized historical context

## Directory Structure
```
.autopilot/
  logs/
    timeline.log           # One line per iteration summary
    details/ITER.json      # Rich data (diff metrics, acceptance results)
    summaries/RANGE.md     # Aggregated after compaction window
  patches/
    pending/ITER.diff
    applied/ITER.diff
  state.json
  metrics.json
  signatures.json
```

## Rotation Policy
- Maintain running total size (details + diffs).
- If > logRetentionMB: oldest details/*.json replaced by a summary line inserted into timeline (marker: `[COMPACTED]`).
- Summaries aggregate: tasksCompleted, avgDiffSize, failureRate, riskScoreDistribution.

## Summarization Interval
- Every K=10 iterations OR when size threshold reached.

## Integrity
- Each details file includes `hashPrev` forming a hash chain for tamper detection.

## Example timeline.log Entry
```
#iter timestamp taskId status linesChanged files riskScore decision
42 2025-08-13T12:00:04Z crud-endpoints-user validated 124 5 0.41 proceed
```

## Compaction Example
`[COMPACTED 11-20] tasks=8 avgDiff=90 risk(p50=0.32 p95=0.61)`

## Open Questions
- Compression (gzip) threshold? (Future)
- Separate channel for warnings vs info? (Maybe logs/warnings.log)
