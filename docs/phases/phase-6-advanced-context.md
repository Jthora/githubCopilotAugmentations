# Phase 6 – Advanced Context Assembly

## Objective
Boost macro intelligence by optionally incorporating related files and generating auxiliary artifacts (test stubs, TODO lists).

## Features
| Feature | Description |
|---------|-------------|
| Related File Inference | Pull in sibling test/spec file or interface/implementation pair |
| Multi-File Packaging | Delimit multiple sources with clear headers |
| Heuristic Weighting | Optionally summarize secondary files instead of full include |
| Test Skeleton Macro | Generate candidate tests based on selection context |
| TODO Extraction Macro | Pull FIXME/TODO lines and ask Copilot for consolidation plan |

## Related File Heuristics
- If current file ends with `.ts` and there is `<name>.test.ts` or `<name>.spec.ts` include it.
- For Python: `<name>_test.py` or `test_<name>.py`.
- Limit secondary file size; if > 300 lines, summarize instead.

## Delimiting Format
```
### PRIMARY FILE: <fileName>
<content or truncated>

### RELATED FILE: <fileName>
<content or summary>
```

## Settings
| Setting | Default | Description |
|---------|---------|-------------|
| `copilotMacros.includeRelated` | false | Enable related file logic |
| `copilotMacros.related.maxLines` | 300 | Max lines before summarization |
| `copilotMacros.related.searchDepth` | 3 | Directory depth for related scan |

## Tasks
1. Implement related file resolver
2. Implement multi-file packager
3. Add optional summarization fallback reuse from Phase 5
4. Add specialized macros (test skeleton, TODO consolidation)
5. Update docs

## Edge Cases
| Case | Handling |
|------|----------|
| No related file found | Proceed with primary only |
| Many similarly named files | Pick closest by heuristic scoring |
| Binary or huge related file | Skip and note omission |

## Future Ideas
- VCS diff mode: include last commit diff as context
- Issue link detection: auto-fetch issue body (if authenticated & allowed)
