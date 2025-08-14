# ADR-004: Memory Tiering & Log Compaction Strategy
Date: 2025-08-14
Status: Proposed

## Context
Auto-Pilot generates iterative logs (context snapshots, metrics, guardrail outcomes). Unbounded growth harms performance and overwhelms users. We need a tiered memory model and deterministic compaction.

Forces:
- Retain essential provenance for audit.
- Enable rapid lookup of recent iterations.
- Control on-disk footprint.
- Deterministic pruning to preserve reproducibility references.

## Decision
Implement three tiers:
1. Hot (in-memory ring buffer) last N iterations (config default 10) with full detail objects.
2. Warm (JSONL file) all iterations with summary entries: `{iter, planDigest, parentDigest, startTs, endTs, filesTouched, netAdd, netDel, riskScore, status}`.
3. Cold (optional archive directory) periodic snapshots every M iterations storing compressed (gz) full detail for that iteration only.

Compaction Policy:
- After each iteration finalize, append summary to warm log.
- If hot buffer > N, drop oldest (still preserved in warm log).
- Every K iterations (default 25), create cold snapshot for that iteration's full detail & guardrail stage outputs.
- Provide CLI to reconstruct a full detail view by merging snapshot + warm log segments.

Retention:
- Warm log rotates when exceeding size threshold (default 5MB) into timestamped segments; maintain index file listing segments.
- Old cold snapshots beyond retention limit (default keep last 10) pruned unless referenced by a pinned anomaly marker.

## Consequences
Positive:
- Predictable memory usage.
- Fast access to recent rich data; scalable historical storage.
- Deterministic rotation aids reproducibility (size threshold deterministic given content ordering).

Negative / Trade-offs:
- Reconstruction logic required for older detailed inspection.
- Compression adds CPU (acceptable given infrequency).

## Options Considered
- Single ever-growing JSON file (risk: unwieldy).
- SQLite/embedded DB (more complexity, external dependency).

## Rationale
Plain JSONL + periodic compressed snapshots maximize transparency and simplicity while meeting scaling needs.

## Guardrails / Follow-ups
- Implement integrity check (hash chain across warm log entries) to detect tampering/drift.
- Add tests for rotation triggers and snapshot reconstruction.
- Document reconstruction in memory & logging guide.

## References
- Memory and logging doc.
- Reproducibility doc.
