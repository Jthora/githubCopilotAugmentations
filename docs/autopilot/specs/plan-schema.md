# Plan Schema (Draft)
Status: Draft (Phase 1)

## Purpose
Define structured representation of decomposed work derived from immutable spec + patterns.

## JSON Structure
```
{
  "version": 1,
  "generatedAt": "2025-08-13T00:00:00Z",
  "seed": 12345,
  "nodes": [ PlanNode ]
}
```

### PlanNode
Field | Type | Required | Description
----- | ---- | -------- | -----------
id | string | yes | Stable unique ID (ulid or hash)
parentId | string|null | no | Parent task ID
origin | object | yes | Provenance details
origin.specHash | string | yes | Hash (canonical) of spec segment
origin.patternId | string | yes | Pattern applied
title | string | yes | Human-readable summary
description | string | yes | Detailed instructions (derived)
status | enum | yes | pending|in_progress|validated|done|blocked
acceptance | array | yes | Acceptance criteria objects
riskTags | array | no | Indicators ("destructive","complex")
createdAt | string | yes | ISO timestamp
updatedAt | string | yes | ISO timestamp

### Acceptance Criterion
```
{
  "id": "has-test-file",
  "rule": "file_exists",
  "params": { "glob": "src/**/<entity>.test.*" },
  "mandatory": true,
  "met": false,
  "lastChecked": null
}
```

## Status Machine
pending -> in_progress -> validated -> done
blocked (terminal or requires human unblocking)

## Determinism Guarantees
- Node ordering deterministic: sort(nodes, key=hash(id+seed)).
- origin.specHash computed after canonical whitespace & comment stripping.

## Integrity
`signatures.json` stores mapping of specHash -> file digest; mismatch triggers pause.

## Open Questions
- Should blocked move back to pending after manual override? (TBD)
- Versioning strategy for node schema evolutions.
