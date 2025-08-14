# Reproducibility & Determinism (Draft)
Status: Draft (Phase 2)

## Goals
- Given (rootspec.yaml, patterns set, seed, config) expansion & iteration ordering reproducible.

## Canonical Hashing
Process for spec hashing:
1. Strip comments (#, // style) and blank lines.
2. Collapse multiple spaces -> single space.
3. Normalize line endings to \n.
4. SHA256 of result => specHash.

patternsHash = SHA256(concat(sorted(patternId + ':' + version)))
planSignature = SHA256(specHash + '|' + patternsHash + '|' + seed)

## Recording
- `signatures.json`:
```
{
  "specHash": "...",
  "patternsHash": "...",
  "planSignature": "...",
  "generatedAt": "2025-08-13T00:00:00Z"
}
```

## Divergence Detection
On iteration start recompute planSignature. If mismatch:
- Pause with reason: `SIGNATURE_MISMATCH`.
- Require command: `Autopilot: Acknowledge Spec Change` to refresh plan.

## Replay Procedure
1. Checkout commit.
2. Restore `.autopilot/` state & config.
3. Run `autopilot expand` with same seed.
4. Compare new expanded.json node IDs & count.
5. Iterate in dry-run mode; compare diff metrics sequence to archived `metrics.json` (allowing for env-dependent differences in tests only).

## Non-Determinism Sources (Mitigations)
Source | Mitigation
------ | ----------
Timestamps | Excluded from hashing; stored separately.
Random IDs | Use seed-based ULID derivation.
Formatter Hooks | Run formatting pre-expansion so output stable.

## Open Questions
- Need environment capture (node version) for full reproducibility? (Future) 
