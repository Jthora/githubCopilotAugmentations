# Risk Matrix (Initial)
Status: Draft

Risk | Likelihood | Impact | Mitigation | Doc Anchor | Metric
---- | ---------- | ------ | ---------- | ---------- | ------
Plan Explosion | Medium | High | Depth/width caps, uniquenessKey | plan-schema.md, guardrails.md | nodes/iter
Destructive Diff | Low | High | Diff thresholds, protected paths | guardrails.md | deletionPct
Task Duplication | Medium | Medium | uniquenessKey de-dup | pattern-schema.md | duplicateRate
Orphan Code | Medium | Medium | Reconciliation scanner | architecture (future) | orphansDetected
False Completion | Medium | Medium | Acceptance rule enforcement | plan-schema.md | criteriaFailRate
Log Bloat | Medium | Low | Rotation & summaries | memory-and-logging.md | logSizeMB
Stale Patterns | Medium | Medium | Pattern version tests | pattern-schema.md | patternFailRate
Flaky Tests Loop | Low | Medium | Retry + quarantine | guardrails.md | flakeRate
Rename Misclassified | Medium | Low | Similarity heuristic pre-diff | guardrails.md | renameFalsePos
Spec Hash Drift | Low | High | Signature pause gating | reproducibility.md | hashMismatchCount
Duplicate Pattern IDs | Medium | Low | Validation drop duplicates | pattern-schema.md | dupPatternIds
Oversized Hash Input | Low | Low | Size warning threshold | reproducibility.md | largeHashWarnings
Unicode Normalization Drift | Low | Medium | NFC normalization in hashing | reproducibility.md | unicodeDriftCount

Metrics to record per iteration into `metrics.json`.
