# How-To: Tune Guardrails

Goal: Balance safety with throughput.

Adjustment Strategy:
1. Observe `timeline.log` for frequent PAUSE decisions due to single metric.
2. Increase only the limiting threshold by small increments (e.g., maxDiffLinesPerIter +50).
3. Keep riskScoreThreshold conservative until stability proven.
4. If harmless bulk formatting triggers pauses, run formatting manually outside autopilot branch.

Symptoms & Fixes:
Symptom | Likely Cause | Adjustment
------- | ------------ | ----------
Frequent risk pauses at low diff size | filesTouched high | Raise maxFilesPerIter or split tasks
Stalled progress, tiny diffs | thresholds too low | Increase maxDiffLinesPerIter modestly
High deletion warnings | Pattern generating churn | Fix pattern or raise maxDeletionPercent carefully

Always re-run a single iteration after config changes before enabling unattended mode.
