# Phase 3 – Configurable Macro Definitions

## Objective
Allow users to define, modify, and reload macro templates without changing extension code.

## Scope (In)
- JSON config file detection & loading
- Schema validation & error surfacing
- Reload command
- Token replacement engine with basic conditional support

## Out of Scope
- Webview authoring UI (Phase 4)
- Summarization / truncation (Phase 5)

## Config File
Default path: `.copilot-macros.json`

### Example
```json
{
  "$schema": "https://example.com/copilot-macros.schema.json",
  "version": 1,
  "macros": [
    {
      "id": "selfDialogue",
      "title": "Self Dialogue",
      "template": "Talk to yourself about it...\nContext:\n{{context}}"
    },
    {
      "id": "critique",
      "title": "Critique Pass",
      "template": "Act as a senior reviewer...\nContext:\n{{context}}",
      "options": { "truncate": true }
    }
  ],
  "defaults": {
    "macroForStatusBar": "selfDialogue"
  }
}
```

## Template Tokens
| Token | Description |
|-------|-------------|
| `{{selection}}` | Raw selection text |
| `{{fileName}}` | Base file name |
| `{{language}}` | VS Code language id |
| `{{context}}` | `selection` if present else file name |
| `{{timestamp}}` | ISO timestamp generation |

## Validation Rules
- Unique `id` per macro
- Non-empty `title` & `template`
- Reject file if > 200 macros (prevent abuse)

## Settings
| Setting | Default | Purpose |
|---------|---------|---------|
| `copilotMacros.configPath` | `.copilot-macros.json` | Custom relative path |
| `copilotMacros.autoReloadConfig` | true | Watch file changes and reload |

## Error Surfacing
Problems panel diagnostic & toast if config invalid; fall back to built-ins.

## Tasks
1. Define TypeScript interfaces & schema
2. Implement loader with debounce & watch
3. Merge strategy: user macros override built-ins on id conflict
4. Implement reload command `copilotMacros.reloadConfig`
5. Add tests for loader edge cases
6. README & docs updates

## Edge Cases
| Case | Handling |
|------|----------|
| Invalid JSON | Warn & keep prior config |
| Duplicate ids | Later entry overrides earlier (log warning) |
| Missing template | Skip macro, warn |

## Future Hooks
- Conditional sections: `{{#if selection}} ... {{/if}}` (Phase 4 maybe)
