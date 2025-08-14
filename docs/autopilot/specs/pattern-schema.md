# Pattern Schema (Draft)
Status: Draft (Phase 1)

## Purpose
Standardize deterministic expansion of high-level spec concepts into concrete tasks & scaffolds.

## File Format
YAML recommended. Example:
```yaml
version: 1
pattern: crud-entity
match:
  kind: entity
  whenFields: [name, fields]
outputs:
  tasks:
    - id: "model-${entityName}"
      title: "Model: ${entityName}"
      description: "Create model for ${entityName} with fields: ${fieldList}"
      acceptance:
        - id: has-model-file
          rule: file_exists
          params: { glob: "src/models/${entityName}.ts" }
        - id: has-test
          rule: file_exists
          params: { glob: "tests/${entityName}.model.test.ts" }
      spawn: []
    - id: "crud-endpoints-${entityName}"
      title: "CRUD Endpoints: ${entityName}"
      description: "Implement REST endpoints for ${entityName}"
      acceptance:
        - id: has-router
          rule: file_exists
          params: { glob: "src/routes/${entityName}.ts" }
      spawn:
        - pattern: rest-endpoint
          params: { entity: ${entityName}, action: list }
constraints:
  uniquenessKey: "entityName"
  maxDepth: 1
```

## Fields
Field | Description
----- | -----------
version | Schema version for migration
pattern | Unique pattern identifier
match | Criteria mapping spec fragment -> pattern application
outputs.tasks | Array of task blueprints with template placeholders
acceptance | Per-task rule list
spawn | Additional pattern invocations to enqueue
constraints.uniquenessKey | Field used to prevent duplicates
constraints.maxDepth | Prevent recursive explosion

## Determinism
- Placeholder substitution uses stable ordering of spec fields.
- Sorting of outputs by template id prior to insertion.

## Validation
- All placeholder variables must resolve; unresolved triggers expansion abort.
- uniquenessKey collisions logged; duplicate tasks skipped.

## Open Questions
- Support conditional acceptance based on spec flags? (future)
