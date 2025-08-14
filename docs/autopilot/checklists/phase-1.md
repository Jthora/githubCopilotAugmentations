# Phase 1 Checklist (Plan & Patterns)

Goal: Deterministic expansion of root plan into stable task graph; pattern validation & hashing.

Item | Done | Notes
---- | ---- | -----
Accept ADR-001 / ADR-005 (update status) | ✅ | Accepted partial
Implement recursive pattern discovery | ✅ | Implemented in `loadPatterns`
Implement pattern schema validation (required fields, version) | ✅ | Basic present; deepen rules TBD
Detect duplicate pattern ids | ✅ | Implemented
Deterministic ordering (priority, hash) | ✅ | Implemented sort
Add pattern list & validate commands | ✅ | `autopilot.patterns.*`
Add unit tests for ordering & duplicates | ✅ | `test/patterns.test.ts`
Add pattern sample fixtures | ✅ | `autopilot/patterns/*`
Document pattern command usage in README |  | 
Enhance validation (constraints, outputs.tasks IDs) | ✅ | Implemented
Hash stability tests (permutation) |  | 
Unicode normalization test |  | 
Size warning test (>2MB synthetic) |  | 
Update risk matrix delta for pattern risks |  | 
Mark ADRs accepted once criteria met |  | 

Exit Criteria:
- Deterministic expansion reproducible across two local runs (hash compare)
- Validation rejects malformed patterns with clear errors
- Tests cover happy path + duplicate + invalid schema
