# ADR-001: Deterministic Hashing & Canonical Serialization
Date: 2025-08-14
Status: Proposed

## Context
Auto-Pilot requires reproducibility. Plans, patterns, and iteration inputs must produce identical digests across machines and runs when logical content is unchanged. We need a canonical serialization method, stable ordering, and hash algorithm free of platform-dependent artifacts (line endings, path separators, locale, object key ordering). Hashes seed pseudo-random decisions (when needed) and deduplicate memory/log entries.

Forces:
- Safety: Must detect drift between persisted plan and in-memory state.
- Auditability: Cryptographic integrity is not required for security, but collision resistance should be high enough to avoid accidental conflation.
- Performance: Hashing should be fast for typical plan sizes (< 100KB JSON) but scalable to a few MB without perceptible slowdown.
- Simplicity: Avoid heavy dependencies / native modules.

## Decision
Adopt a canonical JSON serialization plus SHA-256 hashing (Node crypto). Canonicalization rules:
1. UTF-8 encoding, LF line endings internally.
2. Object keys sorted lexicographically (case-sensitive, stable).
3. Arrays preserved as-is (order is semantic).
4. Exclude volatile fields (timestamps, transient counters) by explicit allowlist projection step before serialization.
5. Numbers serialized using ECMAScript JSON.stringify semantics (no locale formatting).
6. Strings normalized to NFC.

Provide util: `canonicalDigest(value, { allowlist? }) -> { json: string, sha256: string }`.

## Consequences
Positive:
- Stable, easy to implement with minimal code.
- SHA-256 widely available; no extra deps.
- Deterministic seeds enable replayable pseudo-random sequences.

Negative / Trade-offs:
- Sorting keys adds O(n log n) overhead for large objects (acceptable scale).
- Canonical JSON limits potential binary compactness.
- Excluding fields relies on careful maintenance of allowlist.

## Options Considered
- JSON Canonicalization Scheme (JCS) RFC 8785 (essentially what we adopt; declined strict compliance wording to keep flexibility).
- MessagePack or CBOR canonical mode (extra deps, less transparent diffs).
- MurmurHash / xxHash (faster, but non-cryptographic; potential higher collision risk in future extended domains).

## Rationale
SHA-256 + sorted-key JSON balances collision safety, transparency, low complexity, and acceptable performance. Deviating from standard JSON would reduce inspectability in logs and reviews.

## Guardrails / Follow-ups
- Implement unit tests: identical semantic objects produce identical hash; key order differences normalize; excluded fields change outcome only if not excluded.
- Provide fuzz test for random object permutations.
- Document allowlist maintenance in reproducibility guide.
- Add size threshold warning (>2MB) to advise chunking.

## References
- Reproducibility doc.
- Risk matrix: reproducibility drift.
