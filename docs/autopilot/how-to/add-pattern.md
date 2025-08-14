# How-To: Add Pattern

1. Create YAML under `patterns/` (e.g., `patterns/crud-entity.yaml`).
2. Define: version, pattern id, match criteria, task outputs, acceptance rules, spawn rules, constraints.
3. Add unit test (future harness) verifying expansion for sample spec fragment.
4. Update pattern registry index (future implementation) & recompute patternsHash.
5. Run `Autopilot: Expand Plan` to confirm tasks appear.
6. Document pattern usage in `patterns/README.md` (to create).

## Validation Checklist
- All placeholders resolved
- uniquenessKey prevents duplicates
- maxDepth respected
- Acceptance rules minimal yet sufficient
- No protected paths generated
