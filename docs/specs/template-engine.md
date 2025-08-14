# Spec: Template Engine

## Scope
Simple, predictable token replacement (no full logic language) to keep prompts transparent.

## Supported Tokens
| Token | Description |
|-------|-------------|
| `{{selection}}` | Raw selection text |
| `{{fileName}}` | Base name of active file |
| `{{language}}` | VS Code language id |
| `{{context}}` | selection if present else fileName |
| `{{timestamp}}` | ISO timestamp |

## Processing Rules
1. Gather context values.
2. For missing optional values (e.g., no selection) tokens become empty unless `{{context}}`.
3. Replace all occurrences (global regex per token, escape special chars).
4. No nesting or conditionals in Phase 3.

## Escaping
Literal `{{` in template can be written as `{{{{` (engine collapses pairs) – optional convenience.

## Performance
Templates small; O(N * T) where N = template length, T = number of tokens (<=6). Trivial cost.

## Error Handling
- If template > 100k chars, warn and proceed.

## Future Extensions
- Conditional blocks: `{{#if selection}} ... {{/if}}`
- Iteration (not currently needed)
- Token filters (e.g., `{{selection|truncate(200)}}`)
