# Configuration (Draft)
Status: Draft (Phase 3)

## File: `.autopilot/config.json`
Key | Type | Default | Description | Interplay
--- | ---- | ------- | ----------- | ---------
maxIterations | number | 50 | Upper bound iterations per batch run | Lowering may reduce progress
maxMinutes | number | 20 | Time budget | If reached, soft stop
maxDiffLinesPerIter | number | 400 | Guardrail threshold | Affects risk normalization
maxFilesPerIter | number | 8 | Guardrail threshold | "
maxDeletionPercent | number | 40 | Guardrail threshold | High values risk large purges
commitEvery | number | 1 | Commit cadence | >1 batches diffs (risk cluster)
unattended | boolean | false | Enable continuous loop | Requires strong guardrails
seed | number | 12345 | Deterministic ordering | Change invalidates replication
protectedPaths | string[] | see guardrails | Merge-only list | Cannot remove base list
logRetentionMB | number | 25 | Rolling logs budget | Drives rotation frequency
flakeRetryCount | number | 2 | Test retry attempts | Affects failure streak metric
riskScoreThreshold | number | 0.65 | Pause threshold | Align with guardrails.md
maxConsecutiveFailures | number | 3 | Pause threshold | Coordinates with risk score

## Canonical Hashing Inputs
- rootspec.yaml (normalized whitespace, strip comments)
- pattern registry (concatenate pattern IDs + versions)
- seed

Result: `planSignature` stored in `signatures.json`.

## Change Control
- Modifying protected keys (seed, protectedPaths) triggers a mandatory pause & signature regeneration.

## Example
```
{
  "maxIterations": 20,
  "maxMinutes": 10,
  "maxDiffLinesPerIter": 300,
  "maxFilesPerIter": 6,
  "unattended": true,
  "seed": 777,
  "protectedPaths": ["config/**"],
  "logRetentionMB": 15
}
```
