# How-To: Expand Plan

1. Author `plan/rootspec.yaml` with high-level entities/features.
2. Run command: `Autopilot: Expand Plan` (will:
   - Load patterns
   - Canonical-hash spec
   - Apply patterns deterministically using seed
   - Produce `.autopilot/expanded.json` & `signatures.json`)
3. Review generated tasks (open expanded.json).
4. (Optional) Adjust config thresholds before running iterations.
5. Proceed with `Autopilot: Iterate Once`.

## Troubleshooting
Issue | Cause | Resolution
----- | ----- | ----------
Duplicate tasks | uniquenessKey collision not working | Verify pattern uniquenessKey field
Missing tasks | Pattern match criteria too strict | Relax match conditions in pattern YAML
Spec change ignored | Signature mismatch gating | Run expand command again after acknowledging change
